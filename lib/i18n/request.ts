import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, FALLBACK_LOCALE, type Locale } from './config';

/**
 * 8 dilin hepsi için mesaj dosyası mevcut:
 * - tr, en, de, ru, ar, fr, es, it
 * Eğer dosya yüklenemezse EN fallback'e döner.
 */
export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    // Dosya yoksa veya parse hatası varsa EN fallback
    messages = (await import(`@/messages/${FALLBACK_LOCALE}.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
