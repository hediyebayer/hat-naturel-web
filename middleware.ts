import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/lib/i18n/config';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
  // Browser Accept-Language header'ına göre otomatik dil seçimi kapalı.
  // İlk ziyarette her zaman Türkçe açılır, kullanıcı dil değiştiriciyle seçer.
  localeDetection: false,
});

export const config = {
  // Match all pathnames except for
  // - /api, /_next, /_vercel
  // - files with extensions (e.g. favicon.ico, robots.txt)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
