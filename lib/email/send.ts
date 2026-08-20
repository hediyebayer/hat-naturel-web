/**
 * Paylaşılan email gönderim katmanı (rezervasyon + iletişim formu ortak).
 *
 * Gönderim zinciri:
 *   1. RESEND_API_KEY tanımlıysa      → Resend HTTP API (doğrulanmış domain'den)
 *   2. SMTP_USER + SMTP_PASS varsa    → Gmail SMTP (app password) — DNS gerekmez
 *   3. İkisi de yoksa                 → mock (console.warn) — geliştirme ortamı
 *
 * SMTP yolunda gönderici adresi SMTP_USER olmak zorundadır (Gmail From'u
 * kendisiyle eşleşmeyen adresleri yeniden yazar); görünen ad korunur.
 */

import nodemailer, { type Transporter } from 'nodemailer';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const GMAIL_SCRIPT_URL = process.env.GMAIL_SCRIPT_URL;
const GMAIL_SCRIPT_TOKEN = process.env.GMAIL_SCRIPT_TOKEN;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

export interface EmailPayload {
  /** Gönderici görünen adı, örn. "Hat Naturel Resort". */
  fromName: string;
  /** Resend kullanılırkenki gönderici adresi (doğrulanmış domain'den olmalı). */
  fromAddress: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}

export type EmailTransport = 'resend' | 'gmail_script' | 'smtp' | 'mock';

export function getEmailTransport(): EmailTransport {
  if (RESEND_API_KEY) return 'resend';
  // Gmail Apps Script köprüsü: HTTPS 443 üzerinden gerçek Gmail gönderimi.
  // DigitalOcean outbound SMTP (25/465/587) bloğu nedeniyle SMTP'ye tercih edilir.
  if (GMAIL_SCRIPT_URL && GMAIL_SCRIPT_TOKEN) return 'gmail_script';
  if (SMTP_USER && SMTP_PASS) return 'smtp';
  return 'mock';
}

let cachedTransporter: Transporter | null = null;

function getSmtpTransporter(): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return cachedTransporter;
}

/**
 * Email gönderir. Aktif transport'a göre Resend, Gmail Apps Script köprüsü
 * (HTTPS) veya SMTP kullanılır; hiçbiri yapılandırılmamışsa mock olarak loglar
 * (hata fırlatmaz).
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  const transport = getEmailTransport();

  if (transport === 'resend') {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${payload.fromName} <${payload.fromAddress}>`,
        to: [payload.to],
        reply_to: payload.replyTo,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Resend hatası: ${response.status} — ${text}`);
    }
    return;
  }

  if (transport === 'gmail_script') {
    const response = await fetch(GMAIL_SCRIPT_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: GMAIL_SCRIPT_TOKEN,
        fromName: payload.fromName,
        to: payload.to,
        replyTo: payload.replyTo,
        subject: payload.subject,
        html: payload.html,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const text = await response.text();
    if (!response.ok || !text.includes('"ok":true')) {
      throw new Error(`Gmail script hatası: ${response.status} — ${text.slice(0, 200)}`);
    }
    return;
  }

  if (transport === 'smtp') {
    const transporter = getSmtpTransporter();
    await transporter.sendMail({
      // Gmail From adresini SMTP_USER olarak yazar; görünen ad korunur.
      from: `"${payload.fromName}" <${SMTP_USER}>`,
      to: payload.to,
      replyTo: payload.replyTo,
      subject: payload.subject,
      html: payload.html,
    });
    return;
  }

  // Mock — geliştirme ortamı, hiçbir şey gönderilmez.
  // eslint-disable-next-line no-console
  console.warn('[email/send] RESEND_API_KEY ve SMTP yapılandırması yok — mock:', {
    to: payload.to,
    subject: payload.subject,
  });
}
