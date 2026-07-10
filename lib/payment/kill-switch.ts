/**
 * Ödeme kill-switch yardımcısı.
 *
 * Hatoperasyon rezervasyon KAYDI (takvime düşürme) endpoint'i hazır olana kadar
 * tüm ödeme akışı kapalı tutulur. Müşteri mock ödeme yapıp "rezervasyonum oldu"
 * sanmasın diye kart/ödeme aşaması devre dışıdır.
 *
 * Kontrol: NEXT_PUBLIC_PAYMENTS_DISABLED env değişkeni.
 *   'true'  → ödeme kapalı (UI'da 'İletişime Geç', /odeme/* redirect, API 503).
 *   'false' → ödeme açık.
 *
 * Hazır olunca: NEXT_PUBLIC_PAYMENTS_DISABLED=false yapılır.
 */

/** Ödeme akışı şu an kapalı mı? */
export function arePaymentsDisabled(): boolean {
  return process.env.NEXT_PUBLIC_PAYMENTS_DISABLED === 'true';
}
