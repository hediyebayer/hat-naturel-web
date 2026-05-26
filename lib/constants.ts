/**
 * Tesis bilgileri tek kaynak (single source of truth).
 * Hat Naturel Resort Sapanca — gerçek konum, iletişim ve sanal tur bilgileri.
 */
export const SITE_CONFIG = {
  name: 'Hat Naturel Resort',
  legalName: 'Hat Naturel Sapanca',
  url: 'https://www.hatnaturel.com.tr',
  ogImage: '/images/og-default.jpg',
  contact: {
    phone: '+90 533 917 54 24',
    phoneRaw: '+905339175424',
    email: 'hatnaturel@gmail.com',
    address: 'Nailiye Mah. Nailiye/4 Sk. No:6/1 Sapanca / Sakarya',
    addressShort: 'Sapanca, Sakarya',
    // Google Maps embed (lokasyon harita) — Hat Naturel Resort Sapanca pin
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.2479578919147!2d30.2625779108129!3d40.66850524015906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cca56f6cd2f859%3A0xbce7f150e8540274!2sHAT%20NATUREL%20RESORT%20SAPANCA!5e0!3m2!1str!2str!4v1710883380522!5m2!1str!2str',
    // "Yol tarifi al" — Google Maps üzerinden direkt aç
    mapDirectionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=HAT+NATUREL+RESORT+SAPANCA&destination_place_id=ChIJWfjSbG-lzBQRdAJU6FDx57w',
    coordinates: { lat: 40.66850524, lng: 30.26257791 },
  },
  // Google Street View embed — 360° tesis görüntüleme
  virtualTour: {
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1751282567227!6m8!1m7!1sCAoSLEFGMVFpcE82UzVqbkV1aHZzQWs0SzNKRDJlLTJ3R0VYYWJGQlpDZDZjMDhF!2m2!1d40.66864244965133!2d30.26540175088224!3f151.9861990905399!4f8.733223319116348!5f0.7820865974627469',
  },
  // WhatsApp — wa.me uluslararası format, + ve boşluksuz
  whatsapp: {
    number: '905339175424',
    displayNumber: '+90 533 917 54 24',
    defaultMessage: 'Merhaba, Hat Naturel Sapanca hakkında bilgi almak istiyorum.',
  },
  socialMedia: {
    instagram: 'https://www.instagram.com/hatnaturelsapanca',
    instagramHandle: '@hatnaturelsapanca',
    facebook: 'https://www.facebook.com/hatnaturelresort',
  },
} as const;

export const NAVIGATION = [
  { key: 'home', href: '/' },
  { key: 'rooms', href: '/odalar' },
  { key: 'gallery', href: '/galeri' },
  { key: 'virtualTour', href: '/sanal-tur' },
  { key: 'restaurant', href: '/restoran' },
  { key: 'rules', href: '/kurallar' },
  { key: 'contact', href: '/iletisim' },
] as const;

export const RESERVATION_HREF = '/rezervasyon';
