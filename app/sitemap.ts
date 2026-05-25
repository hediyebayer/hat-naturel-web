import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { locales } from '@/lib/i18n/config';
import { ROOMS } from '@/lib/data/rooms';

const BASE_URL = SITE_CONFIG.url;

const STATIC_ROUTES = [
  '',
  'odalar',
  'galeri',
  'restoran',
  'sanal-tur',
  'iletisim',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = STATIC_ROUTES.flatMap((route) => {
    return locales.map((locale) => {
      const path = route === '' ? '' : `/${route}`;
      const url = `${BASE_URL}/${locale}${path}`;

      // Alternate languages için tüm locale'leri map'le
      const languages = Object.fromEntries(
        locales.map((l) => {
          const altPath = route === '' ? '' : `/${route}`;
          return [l, `${BASE_URL}/${l}${altPath}`];
        }),
      );

      return {
        url,
        lastModified: new Date(),
        changeFrequency:
          route === '' ? ('weekly' as const) : ('monthly' as const),
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages,
        },
      };
    });
  });

  // Dinamik oda sayfaları
  const roomRoutes = ROOMS.flatMap((room) => {
    return locales.map((locale) => {
      const url = `${BASE_URL}/${locale}/odalar/${room.slug}`;

      const languages = Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}/odalar/${room.slug}`]),
      );

      return {
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
        alternates: {
          languages,
        },
      };
    });
  });

  return [...staticRoutes, ...roomRoutes];
}
