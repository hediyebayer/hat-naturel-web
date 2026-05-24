import type { Locale } from '@/lib/i18n/config';
import type { ContentAdapter } from './adapter';
import type {
  GalleryImage,
  Offer,
  Room,
  SiteInfo,
} from './types';
import { ROOMS_STATIC } from './data/rooms';

/**
 * Statik (kod içinde tanımlı) içerik adapter'ı.
 * İleride DB/CMS adapter ile değiştirilebilir.
 *
 * NOT: Locale parametresi şu an pass-through. M3'te lokalize içerik
 * (lib/content/data/rooms.{tr,en}.ts) yapılacak.
 */
export class StaticContentAdapter implements ContentAdapter {
  async getRooms(_locale: Locale): Promise<Room[]> {
    return ROOMS_STATIC;
  }

  async getRoomBySlug(slug: string, _locale: Locale): Promise<Room | null> {
    return ROOMS_STATIC.find((r) => r.slug === slug) ?? null;
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    return [];
  }

  async getOffers(_locale: Locale): Promise<Offer[]> {
    return [];
  }

  async getSiteInfo(_locale: Locale): Promise<SiteInfo> {
    return {
      brandName: 'Hat Naturel Resort',
      tagline: 'Sapanca\'da doğayla iç içe',
      description: 'Premium bungalov tatil tesisi',
    };
  }
}
