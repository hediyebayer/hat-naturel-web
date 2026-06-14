/**
 * Yasal sayfalarda kullanılan şirket bilgileri.
 * Banka denetimi öncesinde TÜMÜ doldurulmalıdır.
 *
 * ⚠️ TODO: Aşağıdaki placeholder değerleri gerçek bilgilerle değiştirin.
 *    - legalName : Ticaret sicilindeki tam ünvan
 *    - taxOffice  : Vergi dairesi adı
 *    - taxNo      : 10 haneli vergi kimlik numarası
 *    - mersis     : MERSİS numarası (e-Devlet)
 *    - address    : Kayıtlı ticari adres
 *    - phone      : Müşteri hizmetleri numarası
 *    - email      : İletişim e-postası
 *    - kep        : Kayıtlı elektronik posta adresi
 *    - web        : www.hatnaturel.com.tr (değişmeyebilir)
 */
export const COMPANY_INFO = {
  legalName:   'DOLDURULACAK — Hat Naturel Turizm Ltd. Şti.',
  taxOffice:   'DOLDURULACAK — Sapanca Vergi Dairesi',
  taxNo:       'DOLDURULACAK — 000 000 0000',
  mersis:      'DOLDURULACAK — 0000000000000000',
  address:     'Nailiye Mah. Nailiye/4 Sk. No:6/1 Sapanca / Sakarya',
  phone:       '+90 533 917 54 24',
  email:       'hatnaturel@gmail.com',
  kep:         'DOLDURULACAK — hatnaturel@hs01.kep.tr',
  web:         'https://www.hatnaturel.com.tr',
} as const;

/** Yasal sayfaların son güncelleme tarihi (banka denetimi öncesi güncel tutun) */
export const LAST_UPDATED = '14 Haziran 2026';

/** Oda/gece başı kapora oranı (%30) */
export const DEPOSIT_RATIO: number = parseFloat(
  process.env.NEXT_PUBLIC_DEPOSIT_RATIO ?? '0.3',
);
