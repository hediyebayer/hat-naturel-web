export const locales = ['tr', 'en', 'de', 'ru', 'ar', 'fr', 'es', 'it'] as const;
export const defaultLocale = 'tr' as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  ru: 'Русский',
  ar: 'العربية',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
};

export const localeFlags: Record<Locale, string> = {
  tr: '🇹🇷',
  en: '🇬🇧',
  de: '🇩🇪',
  ru: '🇷🇺',
  ar: '🇸🇦',
  fr: '🇫🇷',
  es: '🇪🇸',
  it: '🇮🇹',
};

/** Yeni eklenen diller için EN fallback. Mesaj dosyası yoksa İngilizce kullan. */
export const FALLBACK_LOCALE: Locale = 'en';
