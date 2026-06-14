/**
 * Kart yardımcı fonksiyonları.
 * Luhn algoritması, brand tespiti, PAN maskeleme, exp formatlama.
 *
 * ⚠️ PAN bu modülden ASLA dışarı çıkmaz — yalnızca masked/last4 döner.
 */

import type { CardBrand } from './types';

// ---------------------------------------------------------------------------
// Luhn algoritması
// ---------------------------------------------------------------------------

/**
 * Luhn algoritması ile kart numarası doğrular.
 * @returns true geçerli, false geçersiz
 */
export function luhnCheck(pan: string): boolean {
  const digits = pan.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]!, 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// ---------------------------------------------------------------------------
// Brand tespiti (BIN prefix'e göre)
// ---------------------------------------------------------------------------

/**
 * Kart numarasına göre marka tespit eder.
 * - Visa: 4 ile başlar
 * - Mastercard: 51-55 veya 2221-2720
 * - Troy: 9792 ile başlar
 * - Amex: 34 veya 37 ile başlar
 */
export function detectBrand(pan: string): CardBrand {
  const digits = pan.replace(/\D/g, '');
  if (!digits) return 'unknown';

  // Troy: 9792
  if (/^9792/.test(digits)) return 'troy';

  // Amex: 34 veya 37
  if (/^3[47]/.test(digits)) return 'amex';

  // Mastercard: 51-55 veya 2221-2720
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(digits)) return 'mastercard';

  // Visa: 4
  if (/^4/.test(digits)) return 'visa';

  return 'unknown';
}

// ---------------------------------------------------------------------------
// Maskeleme
// ---------------------------------------------------------------------------

/**
 * PAN'ı maskeler: ilk 6 + son 4 hane görünür, ortası '*'.
 * "4111111111111111" → "411111******1111"
 */
export function maskPan(pan: string): string {
  const digits = pan.replace(/\D/g, '');
  if (digits.length < 10) return '*'.repeat(digits.length);

  const prefix = digits.slice(0, 6);
  const suffix = digits.slice(-4);
  const masked = '*'.repeat(digits.length - 10);

  return `${prefix}${masked}${suffix}`;
}

/**
 * Son 4 haneyi döndürür.
 */
export function getLast4(pan: string): string {
  const digits = pan.replace(/\D/g, '');
  return digits.slice(-4);
}

// ---------------------------------------------------------------------------
// Formatlama
// ---------------------------------------------------------------------------

/**
 * PAN'ı 4'lü gruplarla formatlar: "4111 1111 1111 1111"
 */
export function formatPan(pan: string): string {
  const digits = pan.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Ay/Yıl'ı "MM/YY" formatına çevirir.
 * @param month 1-12
 * @param year  iki veya dört haneli yıl (24 veya 2024)
 */
export function formatExp(month: number, year: number): string {
  const yy = year > 99 ? year % 100 : year;
  return `${String(month).padStart(2, '0')}/${String(yy).padStart(2, '0')}`;
}

/**
 * "MM/YY" string'ini { month, year } objesine parse eder.
 * Geçersizse null döner.
 */
export function parseExp(expStr: string): { month: number; year: number } | null {
  const match = expStr.replace(/\s/g, '').match(/^(\d{2})\/(\d{2})$/);
  if (!match) return null;
  const month = parseInt(match[1]!, 10);
  const year = 2000 + parseInt(match[2]!, 10);
  if (month < 1 || month > 12) return null;
  return { month, year };
}

/**
 * Kartın süresi geçmiş mi kontrol eder.
 * @param expMonth 1-12
 * @param expYear  dört haneli yıl
 */
export function isExpired(expMonth: number, expYear: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expYear < currentYear) return true;
  if (expYear === currentYear && expMonth < currentMonth) return true;
  return false;
}
