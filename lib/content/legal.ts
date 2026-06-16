/**
 * Yasal sayfalarda kullanılan şirket bilgileri.
 *
 * Hassas/resmî alanlar (ticari ünvan, vergi no, MERSİS, KEP) ortam
 * değişkenlerinden okunur — koda gömülmez. Banka başvurusu öncesinde
 * bu değerler `.env.local` / sunucu ortamında doldurulmalıdır:
 *
 *   COMPANY_LEGAL_NAME   = Ticaret sicilindeki tam ünvan
 *   COMPANY_TAX_OFFICE   = Vergi dairesi adı
 *   COMPANY_TAX_NO       = 10 haneli vergi kimlik numarası
 *   COMPANY_MERSIS       = MERSİS numarası (e-Devlet)
 *   COMPANY_KEP          = Kayıtlı elektronik posta adresi
 *
 * Bir alan tanımsızsa `undefined` döner; yasal sayfalar bu alanı
 * "DOLDURULACAK" gibi placeholder göstermek yerine GİZLER (banka denetimi
 * sırasında eksik/placeholder metin görünmemesi için).
 */

function envOrUndefined(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v && v.length > 0 ? v : undefined;
}

export const COMPANY_INFO = {
  // Resmî alanlar — env'den (eksikse undefined → sayfada gizlenir)
  legalName: envOrUndefined(process.env.COMPANY_LEGAL_NAME),
  taxOffice: envOrUndefined(process.env.COMPANY_TAX_OFFICE),
  taxNo: envOrUndefined(process.env.COMPANY_TAX_NO),
  mersis: envOrUndefined(process.env.COMPANY_MERSIS),
  kep: envOrUndefined(process.env.COMPANY_KEP),
  // Zaten kamuya açık olan sabit bilgiler
  address: 'Nailiye Mah. Nailiye/4 Sk. No:6/1 Sapanca / Sakarya',
  phone: '+90 533 917 54 24',
  email: 'hatnaturel@gmail.com',
  web: 'https://www.hatnaturel.com.tr',
} as const;

/**
 * Resmî şirket bilgilerinin (ünvan + vergi no + MERSİS) tamamı dolu mu?
 * Banka başvurusu öncesi `true` olmalı.
 */
export const COMPANY_INFO_COMPLETE: boolean = Boolean(
  COMPANY_INFO.legalName && COMPANY_INFO.taxNo && COMPANY_INFO.mersis,
);

/** Yasal sayfaların son güncelleme tarihi (banka denetimi öncesi güncel tutun) */
export const LAST_UPDATED = '15 Haziran 2026';

/** Oda/gece başı kapora oranı (%30) */
export const DEPOSIT_RATIO: number = parseFloat(
  process.env.NEXT_PUBLIC_DEPOSIT_RATIO ?? '0.3',
);
