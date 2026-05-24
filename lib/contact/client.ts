import type { ContactFormData } from './types';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO ?? 'hatnaturel@gmail.com';
const CONTACT_EMAIL_FROM = process.env.CONTACT_EMAIL_FROM ?? 'noreply@hatnaturel.com.tr';

/**
 * İletişim formunu email olarak gönderir.
 * - RESEND_API_KEY tanımlıysa Resend API'ye POST eder.
 * - Tanımlı değilse fallback olarak console.log (geliştirme).
 *
 * Hata fırlatırsa caller 500 dönecek.
 */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  if (!RESEND_API_KEY) {
    // eslint-disable-next-line no-console
    console.warn('[contact] RESEND_API_KEY yok, mock gönderim:', data);
    return;
  }

  const subject = `Yeni İletişim Mesajı — ${data.name}`;
  const html = buildEmailHtml(data);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Hat Naturel Web <${CONTACT_EMAIL_FROM}>`,
      to: [CONTACT_EMAIL_TO],
      reply_to: data.email,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend hatası: ${response.status} — ${text}`);
  }
}

function buildEmailHtml(data: ContactFormData): string {
  const safe = (s: string): string =>
    s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] ?? ch);
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #292524;">
      <h2 style="color: #1d3370; font-family: Georgia, serif;">Yeni İletişim Mesajı</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #57534e; width: 120px;">Ad Soyad</td><td><strong>${safe(data.name)}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #57534e;">E-posta</td><td>${safe(data.email)}</td></tr>
        <tr><td style="padding: 8px 0; color: #57534e;">Telefon</td><td>${safe(data.phone)}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 16px 0;" />
      <h3 style="color: #1d3370;">Mesaj</h3>
      <p style="white-space: pre-wrap; line-height: 1.6;">${safe(data.message)}</p>
      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 16px 0;" />
      <p style="font-size: 12px; color: #a8a29e;">Bu mail hat-naturel-web sitesinin iletişim formundan gönderildi.</p>
    </div>
  `;
}
