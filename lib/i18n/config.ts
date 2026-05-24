export const locales = ['tr', 'en'] as const;
export const defaultLocale = 'tr' as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
};
