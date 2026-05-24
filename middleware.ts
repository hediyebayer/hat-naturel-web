import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/lib/i18n/config';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  // Match all pathnames except for
  // - /api, /_next, /_vercel
  // - files with extensions (e.g. favicon.ico, robots.txt)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
