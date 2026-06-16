/**
 * Ödeme modu yardımcıları.
 *
 * `NEXT_PUBLIC_PAYMENT_MODE` env değişkeni ile kontrol edilir:
 *   - 'live'  : Üretim/banka denetimi görünümü. DEMO filigranı/notları GİZLENİR,
 *               akış baştan sona gerçek ödeme deneyimi gibi görünür.
 *   - 'demo'  : Geliştirme/test görünümü. DEMO uyarıları görünür (varsayılan).
 *
 * NOT: Bu yalnızca GÖRÜNÜM modudur. Gerçek tahsilatı belirleyen şey
 * sunucu tarafındaki `PAYMENT_PROVIDER` env'idir (mock | vakifbank).
 * Banka onayı + gerçek kimlik bilgileri gelene kadar provider 'mock' kalır;
 * görünüm 'live' olsa bile gerçek para çekilmez.
 */

export type PaymentMode = 'live' | 'demo';

/** İstemci tarafında okunabilen ödeme görünüm modu. */
export function getPaymentMode(): PaymentMode {
  return process.env.NEXT_PUBLIC_PAYMENT_MODE === 'live' ? 'live' : 'demo';
}

/** DEMO görsel işaretleri (filigran, demo notu) gösterilsin mi? */
export function showDemoBadges(): boolean {
  return getPaymentMode() !== 'live';
}
