export const SITE_CONFIG = {
  name: 'Hat Naturel Resort',
  url: 'https://www.hatnaturel.com.tr',
  ogImage: '/images/og-default.jpg',
  contact: {
    phone: '+90 000 000 00 00',
    email: 'info@hatnaturel.com.tr',
    address: 'Sapanca, Sakarya, Türkiye',
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.000000!2d30.265!3d40.690!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
  },
  socialMedia: {
    instagram: 'https://www.instagram.com/hatnaturelresort',
    facebook: 'https://www.facebook.com/hatnaturelresort',
  },
} as const;

export const NAVIGATION = [
  { key: 'home', href: '/' },
  { key: 'rooms', href: '/odalar' },
  { key: 'gallery', href: '/galeri' },
  { key: 'virtualTour', href: '/sanal-tur' },
  { key: 'restaurant', href: '/restoran' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '/iletisim' },
] as const;

export const RESERVATION_HREF = '/rezervasyon';
