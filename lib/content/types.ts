import type { Locale } from '@/lib/i18n/config';

export interface Room {
  id: string;
  slug: string;
  name: string;
  type: string;
  capacity: number;
  bedrooms: string; // örn "2+1"
  pricePerNight: number; // TL, başlangıç
  description: string;
  amenities: string[];
  images: string[];
  featured?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  coverImage: string;
  locale: Locale;
  readingTimeMin: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category?: string;
  width: number;
  height: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  badge?: string;
  validUntil?: string;
}

export interface SiteInfo {
  brandName: string;
  tagline: string;
  description: string;
}
