/**
 * Rezervasyon e-posta gönderimleri.
 * lib/contact/client.ts paterni baz alınır:
 *   - RESEND_API_KEY yoksa console.log fallback
 *   - PAYMENT_EMAIL_TO env'inden işletme adresi
 */

import type { GuestInfo, OrderSummary, CardInfo } from './types';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const PAYMENT_EMAIL_TO =
  process.env.PAYMENT_EMAIL_TO ?? 'rezervasyon@hatnaturel.com.tr';
const CONTACT_EMAIL_FROM =
  process.env.CONTACT_EMAIL_FROM ?? 'noreply@hatnaturel.com.tr';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReservationEmailData {
  guest: GuestInfo;
  order: OrderSummary;
  card: CardInfo;
  reservationId: string;
  amountCharged: number;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * İki e-posta gönderir:
 * 1. Misafir onay maili (guest.email → teyit)
 * 2. İşletme bildirim maili (PAYMENT_EMAIL_TO → yeni rezervasyon)
 *
 * RESEND_API_KEY yoksa console.log ile fallback.
 */
export async function sendReservationEmails(
  data: ReservationEmailData,
): Promise<void> {
  if (!RESEND_API_KEY) {
    // eslint-disable-next-line no-console
    console.warn('[payment/emails] RESEND_API_KEY yok — email mock:', {
      reservationId: data.reservationId,
      guestEmail: data.guest.email,
      amountCharged: data.amountCharged,
    });
    return;
  }

  // Paralel gönderim
  await Promise.all([
    sendGuestConfirmation(data),
    sendBusinessNotification(data),
  ]);
}

// ---------------------------------------------------------------------------
// Resend API helper
// ---------------------------------------------------------------------------

async function sendViaResend(payload: {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
}): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend hatası: ${response.status} — ${text}`);
  }
}

// ---------------------------------------------------------------------------
// Misafir onay maili
// ---------------------------------------------------------------------------

async function sendGuestConfirmation(data: ReservationEmailData): Promise<void> {
  const { guest, order, reservationId, amountCharged } = data;
  const subject = `Rezervasyonunuz Onaylandı — ${reservationId}`;
  const html = buildGuestConfirmationHtml({ guest, order, reservationId, amountCharged });

  await sendViaResend({
    from: `Hat Naturel Resort <${CONTACT_EMAIL_FROM}>`,
    to: [guest.email],
    subject,
    html,
  });

  // eslint-disable-next-line no-console
  console.info(`[payment/emails] misafir maili gönderildi → ${guest.email}`);
}

// ---------------------------------------------------------------------------
// İşletme bildirim maili
// ---------------------------------------------------------------------------

async function sendBusinessNotification(data: ReservationEmailData): Promise<void> {
  const { guest, order, card, reservationId, amountCharged } = data;
  const subject = `🏨 Yeni Rezervasyon — ${reservationId}`;
  const html = buildBusinessNotificationHtml({ guest, order, card, reservationId, amountCharged });

  await sendViaResend({
    from: `Hat Naturel Rezervasyon <${CONTACT_EMAIL_FROM}>`,
    to: [PAYMENT_EMAIL_TO],
    reply_to: guest.email,
    subject,
    html,
  });

  // eslint-disable-next-line no-console
  console.info(
    `[payment/emails] işletme bildirimi gönderildi → ${PAYMENT_EMAIL_TO}`,
  );
}

// ---------------------------------------------------------------------------
// HTML template'leri
// ---------------------------------------------------------------------------

const safe = (s: string | number): string =>
  String(s).replace(
    /[&<>"']/g,
    (ch) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] ?? ch),
  );

const formatTRY = (amount: number): string =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);

function buildGuestConfirmationHtml(data: Omit<ReservationEmailData, 'card'>): string {
  const { guest, order, reservationId, amountCharged } = data;
  const depositLabel =
    order.depositMode === 'deposit'
      ? `<strong>Kapora (%30)</strong> — kalan tutar tesiste ödenecektir.`
      : `<strong>Tam ödeme</strong> yapılmıştır.`;

  return `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8" /><title>Rezervasyon Onayı</title></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1a3a2a;padding:28px 32px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#d4c89a;letter-spacing:.5px;">Hat Naturel Resort</p>
            <p style="margin:4px 0 0;font-size:13px;color:#9db89d;">Sapanca • Sakarya</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:24px;color:#1a3a2a;">✅ Rezervasyonunuz Onaylandı</h1>
            <p style="margin:0 0 24px;color:#57534e;font-size:15px;">Merhaba ${safe(guest.firstName)}, rezervasyonunuz başarıyla alınmıştır.</p>

            <!-- Rezervasyon Detayları -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f9f7f2;">
                <td colspan="2" style="padding:12px 16px;font-weight:600;color:#1a3a2a;font-size:13px;text-transform:uppercase;letter-spacing:.5px;">Rezervasyon Bilgileri</td>
              </tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;width:140px;">Referans No</td><td style="padding:10px 16px;font-weight:700;color:#1a3a2a;border-top:1px solid #f0ede8;font-size:14px;">${safe(reservationId)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Bungalov</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(order.roomName || order.roomSlug)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Giriş</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(order.checkIn)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Çıkış</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(order.checkOut)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Gece</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(order.nights)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Misafir</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(order.guests)} kişi</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Toplam</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(formatTRY(order.totalPrice))}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Tahsil Edilen</td><td style="padding:10px 16px;font-weight:700;color:#1a6b3a;border-top:1px solid #f0ede8;font-size:14px;">${safe(formatTRY(amountCharged))}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Ödeme Türü</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${depositLabel}</td></tr>
            </table>

            <!-- Misafir Bilgileri -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f9f7f2;">
                <td colspan="2" style="padding:12px 16px;font-weight:600;color:#1a3a2a;font-size:13px;text-transform:uppercase;letter-spacing:.5px;">Misafir Bilgileri</td>
              </tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;width:140px;">Ad Soyad</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(guest.firstName)} ${safe(guest.lastName)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">E-posta</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(guest.email)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Telefon</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(guest.phone)}</td></tr>
            </table>

            <!-- Not -->
            <div style="background:#f0f7f0;border-left:3px solid #1a6b3a;padding:14px 16px;border-radius:0 6px 6px 0;margin-bottom:24px;">
              <p style="margin:0;font-size:14px;color:#1a3a2a;"><strong>Giriş saatiniz:</strong> 14:00'dan itibaren. Giriş yapmadan önce lütfen kimliğinizi/pasaportunuzu hazırlayın.</p>
            </div>

            <p style="font-size:14px;color:#78716c;">Sorularınız için WhatsApp: <strong>+90 533 917 54 24</strong><br/>veya e-posta: <strong>hatnaturel@gmail.com</strong></p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f7f2;padding:20px 32px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:12px;color:#a8a29e;text-align:center;">Hat Naturel Resort Sapanca • Nailiye Mah. No:6/1 Sapanca / Sakarya<br/>Bu mail otomatik olarak gönderilmiştir.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildBusinessNotificationHtml(data: ReservationEmailData): string {
  const { guest, order, card, reservationId, amountCharged } = data;

  return `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8" /><title>Yeni Rezervasyon</title></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1d3370;padding:28px 32px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#ffffff;">🏨 Yeni Rezervasyon Bildirimi</p>
            <p style="margin:4px 0 0;font-size:13px;color:#9db4d8;">Hat Naturel Resort Sapanca</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 20px;font-size:15px;color:#292524;">Yeni bir online rezervasyon alındı. Lütfen sisteme kaydedin.</p>

            <!-- Rezervasyon -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:8px;overflow:hidden;margin-bottom:20px;">
              <tr style="background:#eef2fb;">
                <td colspan="2" style="padding:12px 16px;font-weight:600;color:#1d3370;font-size:13px;text-transform:uppercase;letter-spacing:.5px;">Rezervasyon</td>
              </tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;width:160px;">Referans No</td><td style="padding:10px 16px;font-weight:700;color:#1d3370;border-top:1px solid #f0ede8;font-size:14px;">${safe(reservationId)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Bungalov</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(order.roomName || order.roomSlug)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Giriş / Çıkış</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(order.checkIn)} → ${safe(order.checkOut)} (${safe(order.nights)} gece)</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Misafir</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(order.guests)} kişi</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Toplam</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(formatTRY(order.totalPrice))}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Tahsil</td><td style="padding:10px 16px;font-weight:700;color:#1a6b3a;border-top:1px solid #f0ede8;font-size:14px;">${safe(formatTRY(amountCharged))} (${order.depositMode === 'deposit' ? 'Kapora %30' : 'Tam Ödeme'})</td></tr>
            </table>

            <!-- Misafir -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:8px;overflow:hidden;margin-bottom:20px;">
              <tr style="background:#eef2fb;">
                <td colspan="2" style="padding:12px 16px;font-weight:600;color:#1d3370;font-size:13px;text-transform:uppercase;letter-spacing:.5px;">Misafir</td>
              </tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;width:160px;">Ad Soyad</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(guest.firstName)} ${safe(guest.lastName)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">E-posta</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;"><a href="mailto:${safe(guest.email)}">${safe(guest.email)}</a></td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Telefon</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;"><a href="tel:${safe(guest.phone)}">${safe(guest.phone)}</a></td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Kimlik Türü</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${guest.idType === 'tc' ? 'T.C. Kimlik' : 'Pasaport'}: ${safe(guest.idNumber)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Şehir / İlçe</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(guest.city)} / ${safe(guest.district)}</td></tr>
            </table>

            <!-- Kart -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:8px;overflow:hidden;margin-bottom:20px;">
              <tr style="background:#eef2fb;">
                <td colspan="2" style="padding:12px 16px;font-weight:600;color:#1d3370;font-size:13px;text-transform:uppercase;letter-spacing:.5px;">Ödeme (Masked)</td>
              </tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;width:160px;">Kart</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;font-family:monospace;">${safe(card.maskedPan)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Son 4</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">****${safe(card.last4)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Marka</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;text-transform:uppercase;">${safe(card.brand)}</td></tr>
              <tr><td style="padding:10px 16px;color:#78716c;font-size:14px;border-top:1px solid #f0ede8;">Kart Sahibi</td><td style="padding:10px 16px;color:#292524;border-top:1px solid #f0ede8;font-size:14px;">${safe(card.holder)}</td></tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f7f2;padding:20px 32px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:12px;color:#a8a29e;text-align:center;">Hat Naturel Resort — Rezervasyon Sistemi (Mock) • ${new Date().toLocaleString('tr-TR')}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
