import type { Locale } from '@/lib/i18n/config';
import type {
  BlogPost,
  GalleryImage,
  Offer,
  Room,
  SiteInfo,
} from './types';

/**
 * İçerik kaynağı kontratı.
 * Şimdilik tek implementasyon: StaticContentAdapter.
 * İleride: ApiContentAdapter (admin panelden CMS).
 */
export interface ContentAdapter {
  getRooms(locale: Locale): Promise<Room[]>;
  getRoomBySlug(slug: string, locale: Locale): Promise<Room | null>;
  getBlogPosts(locale: Locale): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string, locale: Locale): Promise<BlogPost | null>;
  getGalleryImages(): Promise<GalleryImage[]>;
  getOffers(locale: Locale): Promise<Offer[]>;
  getSiteInfo(locale: Locale): Promise<SiteInfo>;
}
