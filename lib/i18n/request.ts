import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, FALLBACK_LOCALE, type Locale } from './config';

/**
 * Şu an sadece TR ve EN için mesaj dosyası var.
 * Diğer diller seçilirse EN fallback ile çalışır (ileride çevrilebilir).
 */
const LOCALES_WITH_MESSAGES: Locale[] = ['tr', 'en'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  const messagesLocale = LOCALES_WITH_MESSAGES.includes(locale as Locale)
    ? locale
    : FALLBACK_LOCALE;

  return {
    locale,
    messages: (await import(`@/messages/${messagesLocale}.json`)).default,
  };
});
