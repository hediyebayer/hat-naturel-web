/**
 * JSON-LD structured data helper'ları.
 * Schema.org — Google Rich Results + LLM/AI (GEO) zenginleştirilmiş.
 *
 * Kural: Uydurma rating/review EKLENMEZ. Gerçek veri olmadan aggregateRating
 * üretmek schema.org ihlalidir ve Google'dan ceza alır.
 */

import { SITE_CONFIG } from '@/lib/constants';
import type { Room } from '@/lib/data/rooms';
import type { Locale } from '@/lib/i18n/config';

const BASE_URL = SITE_CONFIG.url;

// Hatoperasyon'dan gelmeyen sabit konaklama bilgileri.
// Buradaki değerler gerçek tesis bilgisidir (lib/data/rooms.ts'teki CATEGORIES ile uyumlu).
const LODGING_CONSTANTS = {
  checkinTime: '14:30',
  checkoutTime: '11:30',
  petsAllowed: false,
  smokingAllowed: false,
  numberOfRooms: 9, // 3 (2+1 üçgen) + 6 (1+1 üçgen + köşkler) — lib/data/rooms.ts CATEGORIES toplamı
  currenciesAccepted: 'TRY',
  paymentAccepted: 'Credit Card, Bank Transfer',
} as const;

// Amenity mapping — schema.org standart isimleri + value (boolean) ile
// LLM ve Google'ın daha iyi anlaması için zenginleştirilmiş.
const LODGING_AMENITIES = [
  { name: 'Heated outdoor pool', value: true },
  { name: 'Sauna', value: true },
  { name: 'Jacuzzi', value: true },
  { name: 'Free parking', value: true },
  { name: 'Free Wi-Fi', value: true },
  { name: 'Smart TV with Netflix and YouTube', value: true },
  { name: 'Air conditioning', value: true },
  { name: 'Kitchen', value: true },
  { name: 'Barbecue grill', value: true },
  { name: 'Fire pit', value: true },
  { name: 'Private terrace', value: true },
  { name: 'Playground', value: true },
  { name: '24/7 Security', value: true },
  { name: 'Pets allowed', value: false },
  { name: 'Smoking allowed', value: false },
] as const;

function buildPostalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: 'Nailiye Mah. Nailiye/4 Sk. No:6/1',
    addressLocality: 'Sapanca',
    addressRegion: 'Sakarya',
    postalCode: '54600',
    addressCountry: 'TR',
  } as const;
}

function buildGeo() {
  return {
    '@type': 'GeoCoordinates',
    latitude: SITE_CONFIG.contact.coordinates.lat,
    longitude: SITE_CONFIG.contact.coordinates.lng,
  } as const;
}

function buildAmenityFeatures() {
  return LODGING_AMENITIES.map((a) => ({
    '@type': 'LocationFeatureSpecification',
    name: a.name,
    value: a.value,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// LodgingBusiness — tesis bilgileri
// ─────────────────────────────────────────────────────────────────────────────

export function generateLodgingBusinessSchema(locale: Locale): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': ['LodgingBusiness', 'Resort'],
    '@id': `${BASE_URL}/#lodging`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    description:
      'Boutique bungalow resort in Sapanca, Sakarya. Triangle bungalows with private heated pools, sauna, jacuzzi and themed lodges set in a natural retreat near Lake Sapanca.',
    image: [
      `${BASE_URL}/images/brand/og-default.jpg`,
      `${BASE_URL}/images/home/hero-sapanca.jpg`,
    ],
    logo: `${BASE_URL}/images/brand/logo-navy.png`,
    url: `${BASE_URL}/${locale}`,
    telephone: SITE_CONFIG.contact.phoneRaw,
    email: SITE_CONFIG.contact.email,
    priceRange: '₺₺₺',
    currenciesAccepted: LODGING_CONSTANTS.currenciesAccepted,
    paymentAccepted: LODGING_CONSTANTS.paymentAccepted,
    address: buildPostalAddress(),
    geo: buildGeo(),
    hasMap: SITE_CONFIG.contact.mapDirectionsUrl,
    areaServed: {
      '@type': 'Place',
      name: 'Sapanca, Sakarya, Türkiye',
    },
    checkinTime: LODGING_CONSTANTS.checkinTime,
    checkoutTime: LODGING_CONSTANTS.checkoutTime,
    petsAllowed: LODGING_CONSTANTS.petsAllowed,
    smokingAllowed: LODGING_CONSTANTS.smokingAllowed,
    numberOfRooms: LODGING_CONSTANTS.numberOfRooms,
    availableLanguage: [
      'Turkish',
      'English',
      'German',
      'Russian',
      'Arabic',
      'French',
      'Spanish',
      'Italian',
    ],
    sameAs: [
      SITE_CONFIG.socialMedia.instagram,
      SITE_CONFIG.socialMedia.facebook,
    ],
    amenityFeature: buildAmenityFeatures(),
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale}/rezervasyon`,
        inLanguage: locale,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: {
        '@type': 'LodgingReservation',
        name: 'Bungalow reservation',
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HotelRoom — oda detayı
// ─────────────────────────────────────────────────────────────────────────────

export function generateHotelRoomSchema(
  room: Room,
  locale: Locale,
  i18n?: { name?: string; description?: string },
): unknown {
  const roomUrl = `${BASE_URL}/${locale}/odalar/${room.slug}`;
  const maxGuests = room.specs.guests + room.specs.extraGuests;

  return {
    '@context': 'https://schema.org',
    '@type': ['HotelRoom', 'Accommodation'],
    '@id': `${roomUrl}#room`,
    name: i18n?.name ?? room.name,
    description: i18n?.description ?? room.longDescription,
    url: roomUrl,
    image: room.images.slice(0, 4).map((img) => `${BASE_URL}${img}`),
    bed: {
      '@type': 'BedDetails',
      numberOfBeds: room.specs.bedrooms,
      typeOfBed: room.specs.bedrooms >= 2 ? 'Double' : 'Queen',
    },
    occupancy: {
      '@type': 'QuantitativeValue',
      value: room.specs.guests,
      maxValue: maxGuests,
      unitText: 'guests',
    },
    numberOfRooms: room.specs.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: room.specs.area,
      unitCode: 'MTK', // square meter (UN/CEFACT)
      unitText: 'square meters',
    },
    amenityFeature: room.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    containedInPlace: { '@id': `${BASE_URL}/#lodging` },
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale}/rezervasyon?room=${room.slug}`,
        inLanguage: locale,
      },
    },
    // ⚠️ offers — fiyat dinamik (Hatoperasyon'dan). Hardcoded fiyat üretmek
    // yanıltıcı olur. Bu yüzden offer eklenmiyor; live availability
    // /rezervasyon sayfasından görülür (potentialAction.target).
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
    '@id': `${BASE_URL}/#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/brand/logo-navy.png`,
      width: 512,
      height: 512,
    },
    image: `${BASE_URL}/images/brand/og-default.jpg`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.contact.phoneRaw,
        contactType: 'Reservations',
        areaServed: 'TR',
        availableLanguage: [
          'Turkish',
          'English',
          'German',
          'Russian',
          'Arabic',
          'French',
          'Spanish',
          'Italian',
        ],
      },
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.contact.phoneRaw,
        contactType: 'Customer Service',
        availableLanguage: ['Turkish', 'English'],
      },
    ],
    address: buildPostalAddress(),
    sameAs: [
      SITE_CONFIG.socialMedia.instagram,
      SITE_CONFIG.socialMedia.facebook,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────
// LocalBusiness — iletişim sayfası için (Google Knowledge Panel + Maps)
// ─────────────────────────────────────────────────────────────────────

export function generateLocalBusinessSchema(locale: Locale): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: SITE_CONFIG.name,
    image: `${BASE_URL}/images/brand/og-default.jpg`,
    url: `${BASE_URL}/${locale}/iletisim`,
    telephone: SITE_CONFIG.contact.phoneRaw,
    email: SITE_CONFIG.contact.email,
    address: buildPostalAddress(),
    geo: buildGeo(),
    hasMap: SITE_CONFIG.contact.mapDirectionsUrl,
    priceRange: '₺₺₺',
    openingHoursSpecification: [
      {
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
        opens: '00:00',
        closes: '23:59',
        description: '24/7 reception',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.contact.phoneRaw,
      contactType: 'Reservations',
      availableLanguage: [
        'Turkish',
        'English',
        'German',
        'Russian',
        'Arabic',
        'French',
        'Spanish',
        'Italian',
      ],
      contactOption: 'TollFree',
    },
    sameAs: [
      SITE_CONFIG.socialMedia.instagram,
      SITE_CONFIG.socialMedia.facebook,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────
// WebSite — sitelinks searchbox + dil bilgisi (LLM/Google için)
// ─────────────────────────────────────────────────────────────────────

export function generateWebSiteSchema(locale: Locale): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_CONFIG.name,
    url: BASE_URL,
    inLanguage: ['tr', 'en', 'de', 'ru', 'ar', 'fr', 'es', 'it'],
    publisher: { '@id': `${BASE_URL}/#organization` },
    description:
      'Boutique bungalow resort in Sapanca, Sakarya. Heated pool triangle bungalows and themed lodges near Lake Sapanca.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale}/rezervasyon?checkIn={check_in}&checkOut={check_out}&guests={guests}`,
      },
      'query-input': [
        'required name=check_in',
        'required name=check_out',
        'required name=guests',
      ],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Restaurant — kahvaltı servisi
// ─────────────────────────────────────────────────────────────────────────────

export function generateRestaurantSchema(locale: Locale): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${BASE_URL}/${locale}/restoran#restaurant`,
    name: `${SITE_CONFIG.name} — Kahvaltı`,
    description:
      'Traditional Turkish village breakfast at Hat Naturel Resort Sapanca — homemade jams, village cheeses, fresh eggs and unlimited brewed tea.',
    url: `${BASE_URL}/${locale}/restoran`,
    image: `${BASE_URL}/images/restoran/hero-kahvalti.jpg`,
    servesCuisine: ['Turkish breakfast', 'Turkish cuisine'],
    priceRange: '₺₺',
    address: buildPostalAddress(),
    geo: buildGeo(),
    telephone: SITE_CONFIG.contact.phoneRaw,
    containedInPlace: { '@id': `${BASE_URL}/#lodging` },
    acceptsReservations: true,
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
    hasMenu: {
      '@type': 'Menu',
      name: 'Breakfast menu',
      description:
        'A 12-plate village breakfast spread with unlimited brewed Turkish tea.',
    },
  };
}

// ─────────────────────────────────────────────────────────────────────
// FAQPage — yaygın sorular (sık aramalar için güçlü SEO sinyali)
// ─────────────────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

export function generateFaqSchema(items: FaqItem[]): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
