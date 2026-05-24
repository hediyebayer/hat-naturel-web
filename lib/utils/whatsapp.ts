import { SITE_CONFIG } from '@/lib/constants';

/**
 * WhatsApp wa.me URL üretir. message parametresi pre-fill metnidir.
 * @example
 *   buildWhatsAppUrl() → https://wa.me/905339175424?text=Merhaba...
 *   buildWhatsAppUrl({ message: 'Selam' }) → custom mesaj
 */
export function buildWhatsAppUrl(opts?: { message?: string }): string {
  const number = SITE_CONFIG.whatsapp.number;
  const message = opts?.message ?? SITE_CONFIG.whatsapp.defaultMessage;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
