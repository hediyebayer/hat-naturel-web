/**
 * JSON-LD structured data helper'ları.
 * Schema.org — Google Rich Results için.
 */

import { SITE_CONFIG } from '@/lib/constants';
import type { Room } from '@/lib/data/rooms';
import type { Locale } from '@/lib/i18n/config';

const BASE_URL = SITE_CONFIG.url;

// ─────────────────────────────────────────────────────────────────────────────
// LodgingBusiness — tesis bilgileri
// ─────────────────────────────────────────────────────────────────────────────

export function generateLodgingBusinessSchema(locale: Locale): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: SITE_CONFIG.legalName,
    image: `${BASE_URL}/images/brand/og-default.jpg`,
    '@id': BASE_URL,
    url: `${BASE_URL}/${locale}`,
    telephone: SITE_CONFIG.contact.phoneRaw,
    email: SITE_CONFIG.contact.email,
    priceRange: '₺₺₺',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nailiye Mah. Nailiye/4 Sk. No:6/1',
      addressLocality: 'Sapanca',
      addressRegion: 'Sakarya',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.contact.coordinates.lat,
      longitude: SITE_CONFIG.contact.coordinates.lng,
    },
    sameAs: [
      SITE_CONFIG.socialMedia.instagram,
      SITE_CONFIG.socialMedia.facebook,
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Heated Pool' },
      { '@type': 'LocationFeatureSpecification', name: 'Sauna' },
      { '@type': 'LocationFeatureSpecification', name: 'Jacuzzi' },
      { '@type': 'LocationFeatureSpecification', name: 'Free Parking' },
      { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi' },
      { '@type': 'LocationFeatureSpecification', name: 'Playground' },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Security' },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HotelRoom — oda detayı
// ─────────────────────────────────────────────────────────────────────────────

export function generateHotelRoomSchema(room: Room, locale: Locale): unknown {
  const roomUrl = `${BASE_URL}/${locale}/odalar/${room.slug}`;
  const coverImage = room.images[0]
    ? `${BASE_URL}${room.images[0]}`
    : `${BASE_URL}/images/brand/og-default.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.longDescription,
    url: roomUrl,
    image: coverImage,
    bed: {
      '@type': 'BedDetails',
      numberOfBeds: room.specs.bedrooms,
    },
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: room.specs.guests + room.specs.extraGuests,
    },
    amenityFeature: room.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BreadcrumbList — breadcrumb navigasyon
// ─────────────────────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Organization — tesis organizasyon bilgileri
// ─────────────────────────────────────────────────────────────────────────────

export function generateOrganizationSchema(): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.legalName,
    url: BASE_URL,
    logo: `${BASE_URL}/images/brand/og-default.jpg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.contact.phoneRaw,
      contactType: 'Reservations',
      availableLanguage: ['Turkish', 'English'],
    },
    sameAs: [
      SITE_CONFIG.socialMedia.instagram,
      SITE_CONFIG.socialMedia.facebook,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Restaurant — kahvaltı servisi
// ─────────────────────────────────────────────────────────────────────────────

export function generateRestaurantSchema(locale: Locale): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: `${SITE_CONFIG.legalName} - Kahvaltı`,
    url: `${BASE_URL}/${locale}/restoran`,
    servesCuisine: 'Turkish Breakfast',
    priceRange: '₺₺',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nailiye Mah. Nailiye/4 Sk. No:6/1',
      addressLocality: 'Sapanca',
      addressRegion: 'Sakarya',
      addressCountry: 'TR',
    },
    telephone: SITE_CONFIG.contact.phoneRaw,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:30',
      closes: '11:30',
    },
  };
}
