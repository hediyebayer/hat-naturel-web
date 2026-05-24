/**
 * Oda (bungalov) veri kaynağı.
 * Eski hatnaturel.com.tr sitesinden çekilen içerikler + temizlenmiş açıklamalar.
 * Görseller public/images/rooms/<slug>/*.jpg altında local olarak duruyor.
 */

export type Amenity =
  | 'pool'
  | 'bbq'
  | 'swing'
  | 'ac'
  | 'wifi'
  | 'smartTv'
  | 'kitchen'
  | 'toiletries'
  | 'waterTank'
  | 'fireExtinguisher'
  | 'security'
  | 'firePit'
  | 'gardenFurniture'
  | 'fireplace'
  | 'hairDryer'
  | 'fridge'
  | 'wardrobe'
  | 'towels'
  | 'generator';

export interface Room {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  longDescription: string;
  specs: {
    area: number;        // m²
    guests: number;      // standart kapasite
    extraGuests: number; // ek yatak
    bedrooms: number;
    bathrooms: number;
  };
  amenities: Amenity[];
  images: string[];      // public/images/rooms/<slug>/... yolu
  accentColor: string;   // tailwind class fragment (border / glow)
  theme: 'green' | 'blue' | 'purple' | 'yellow' | 'turquoise' | 'beige' | 'wood';
  featured?: boolean;
}

const COMMON_AMENITIES: Amenity[] = [
  'bbq', 'swing', 'ac', 'wifi', 'smartTv', 'kitchen', 'toiletries',
  'waterTank', 'fireExtinguisher', 'security', 'firePit', 'gardenFurniture',
  'fireplace', 'hairDryer', 'fridge', 'wardrobe', 'towels', 'generator',
];

export const ROOMS: Room[] = [
  {
    slug: 'bej',
    name: 'Bej Köşk 1+1',
    shortName: 'Bej 1+1',
    tagline: 'Zarif sadelik, doğa manzarası',
    description:
      'Standart 1+1 evimiz; 85 m² ferah yaşam alanı, doğa manzaralı müstakil bungalov.',
    longDescription:
      'Hat Naturel Resort Sapanca tesisimizin 1+1 standart bungalovlarından Bej Köşk, 85 m² genişliğinde salon ve oda yapısıyla size evinizdeki konforu sunar. Doğa manzaralı müstakil yapısı, modern iç tasarımı ve sıcak atmosferiyle çiftler ve küçük aileler için ideal bir kaçamak.',
    specs: { area: 85, guests: 2, extraGuests: 3, bedrooms: 1, bathrooms: 1 },
    amenities: ['pool', ...COMMON_AMENITIES],
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg'].map(
      (n) => `/images/rooms/bej/${n}`,
    ),
    accentColor: 'from-amber-200/40 via-amber-100/20 to-transparent',
    theme: 'beige',
    featured: true,
  },
  {
    slug: 'turkuaz',
    name: 'Turkuaz 1+1',
    shortName: 'Turkuaz 1+1',
    tagline: 'Iki banyolu konfor, çiftler için',
    description:
      '85 m² genişliğinde, çift banyolu ferah 1+1 bungalov — pratik konfor arayanlara.',
    longDescription:
      'Turkuaz 1+1 evimiz 85 m² genişliğe ve 2 ayrı banyoya sahiptir; bu sayede çiftlere ve yakın arkadaşlara rahat bir tatil deneyimi sunar. Doğanın içinde, modern donanımıyla ev konforu hissini koruyan ideal bir konaklama seçeneği.',
    specs: { area: 85, guests: 2, extraGuests: 3, bedrooms: 1, bathrooms: 2 },
    amenities: ['pool', ...COMMON_AMENITIES],
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'].map(
      (n) => `/images/rooms/turkuaz/${n}`,
    ),
    accentColor: 'from-teal-300/40 via-cyan-200/20 to-transparent',
    theme: 'turquoise',
  },
  {
    slug: 'ucgen-1-1',
    name: '1+1 Üçgen Bungalov',
    shortName: '1+1 Üçgen',
    tagline: 'Ikonik üçgen tasarım, sıcak ahşap',
    description:
      'En çok tercih edilen 1+1 üçgen bungalov — aileler için geniş ve konforlu.',
    longDescription:
      '1+1 Üçgen Bungalov’larımız tesisin en çok tercih edilen yapılarındandır. İkonik üçgen mimarisi, sıcak ahşap dokuları ve şömineli oda sobasıyla doğanın içinde benzersiz bir atmosfer sunar. 5 kişiye kadar konaklama imkanı ile aileler ve arkadaş grupları için ideal, hem fiyat hem konfor olarak avantajlı bir seçim.',
    specs: { area: 85, guests: 5, extraGuests: 0, bedrooms: 1, bathrooms: 1 },
    amenities: COMMON_AMENITIES,
    images: [
      '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg',
      '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg',
    ].map(
      (n) => `/images/rooms/ucgen-1-1/${n}`,
    ),
    accentColor: 'from-orange-300/40 via-amber-200/20 to-transparent',
    theme: 'wood',
    featured: true,
  },
  {
    slug: 'mavi',
    name: 'Mavi Köşk 2+1',
    shortName: 'Mavi 2+1',
    tagline: 'Görkemli aile köşkü, geniş bahçe',
    description:
      '90 m² genişliğinde, 2 yatak odalı ve 2 banyolu görkemli aile köşkü.',
    longDescription:
      'Hat Naturel Resort\'un gözde evlerinden Mavi Köşk, görkemli yapısı ile size doğa manzarası eşliğinde farklı bir atmosfer sunar. 90 m² genişliğindeki köşk, 2 yatak odası ve 2 banyosuyla geniş aileler için ideal.',
    specs: { area: 90, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 2 },
    amenities: COMMON_AMENITIES,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'].map(
      (n) => `/images/rooms/mavi/${n}`,
    ),
    accentColor: 'from-sky-300/40 via-blue-200/20 to-transparent',
    theme: 'blue',
  },
  {
    slug: 'mor',
    name: 'Mor Köşk 2+1',
    shortName: 'Mor 2+1',
    tagline: 'Dikkat çeken köşk, sessizliğin keyfi',
    description:
      '95 m² genişlikte, 2+1 tasarımıyla ferah ortam — ailelere özel.',
    longDescription:
      'Tesisin en dikkat çeken evlerinden Mor Köşk, 2+1 yapısı ve 95 m² genişliğiyle ferah bir ortam sağlar. Doğanın sessizliği ile ailecek huzurlu bir tatil deneyimi arıyorsanız doğru tercih.',
    specs: { area: 95, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 2 },
    amenities: COMMON_AMENITIES,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg'].map(
      (n) => `/images/rooms/mor/${n}`,
    ),
    accentColor: 'from-violet-400/40 via-purple-200/20 to-transparent',
    theme: 'purple',
    featured: true,
  },
  {
    slug: 'sari',
    name: 'Sarı Köşk 2+1',
    shortName: 'Sarı 2+1',
    tagline: 'Özel tasarım, müstakil keyif',
    description:
      'Özel tasarım 95 m² 2+1 köşk; ferahlık ve yaşamsal genişlikle dikkat çeker.',
    longDescription:
      'Sarı Köşk 2+1 evimiz özel dizayn olarak tasarlanmıştır. Odaların ferahlığı ve yaşamsal genişliğiyle öne çıkan köşkümüz, müstakil bir yapıda doğa manzarası eşliğinde sizleri ağırlar.',
    specs: { area: 95, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 2 },
    amenities: COMMON_AMENITIES,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'].map(
      (n) => `/images/rooms/sari/${n}`,
    ),
    accentColor: 'from-yellow-300/40 via-amber-200/20 to-transparent',
    theme: 'yellow',
  },
  {
    slug: 'ucgen-2-1',
    name: 'Üçgen 2+1',
    shortName: 'Üçgen 2+1',
    tagline: 'Geniş aile, ikonik üçgen mimari',
    description:
      '95 m² genişliğinde üçgen mimari 2+1 — tam bir aileye rahatça yaşam alanı.',
    longDescription:
      'Hat Naturel Resort Sapanca\'da Üçgen 2+1 evlerimiz standart yapılarımızdandır. 95 m² büyüklüğünde tam bir aileye rahatça yaşam alanı sunan evimiz doğa manzaralıdır. İkonik üçgen mimarisi ile fotoğraflık bir atmosfer yaratır.',
    specs: { area: 95, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 1 },
    amenities: ['pool', ...COMMON_AMENITIES],
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'].map(
      (n) => `/images/rooms/ucgen-2-1/${n}`,
    ),
    accentColor: 'from-emerald-300/40 via-green-200/20 to-transparent',
    theme: 'green',
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}

export function getRelatedRooms(slug: string, count = 3): Room[] {
  return ROOMS.filter((r) => r.slug !== slug).slice(0, count);
}

// Amenity → human readable label + icon adı (lucide-react)
export const AMENITY_META: Record<
  Amenity,
  { label: string; labelEn: string; icon: string }
> = {
  pool:             { label: 'Havuz (sezonluk)',     labelEn: 'Pool (seasonal)',  icon: 'Waves' },
  bbq:              { label: 'Barbekü Mangal',       labelEn: 'BBQ Grill',        icon: 'Flame' },
  swing:            { label: 'Salıncak',              labelEn: 'Swing',            icon: 'Baby' },
  ac:               { label: 'Klima',                 labelEn: 'Air Conditioning', icon: 'Wind' },
  wifi:             { label: 'Ücretsiz WiFi',         labelEn: 'Free WiFi',        icon: 'Wifi' },
  smartTv:          { label: 'Akıllı TV',             labelEn: 'Smart TV',         icon: 'Tv' },
  kitchen:          { label: 'Tam Donanımlı Mutfak',  labelEn: 'Full Kitchen',     icon: 'ChefHat' },
  toiletries:       { label: 'Buklet Malzemeleri',    labelEn: 'Toiletries',       icon: 'SprayCan' },
  waterTank:        { label: 'Su Deposu',             labelEn: 'Water Tank',       icon: 'Droplet' },
  fireExtinguisher: { label: 'Yangın Tüpü',           labelEn: 'Fire Extinguisher',icon: 'CircleAlert' },
  security:         { label: '7/24 Güvenlik Kamerası',labelEn: '24/7 Security',    icon: 'ShieldCheck' },
  firePit:          { label: 'Ateş Çukuru',           labelEn: 'Fire Pit',         icon: 'Flame' },
  gardenFurniture:  { label: 'Bahçe Mobilyası',       labelEn: 'Garden Furniture', icon: 'Armchair' },
  fireplace:        { label: 'Şömineli Odun Sobası',  labelEn: 'Wood Stove',       icon: 'Flame' },
  hairDryer:        { label: 'Saç Kurutma Makinesi',  labelEn: 'Hair Dryer',       icon: 'Wind' },
  fridge:           { label: 'Buzdolabı',             labelEn: 'Refrigerator',     icon: 'Refrigerator' },
  wardrobe:         { label: 'Elbise Dolabı',         labelEn: 'Wardrobe',         icon: 'Shirt' },
  towels:           { label: 'Banyo Havlusu',         labelEn: 'Bath Towels',      icon: 'Bath' },
  generator:        { label: 'Jeneratör',              labelEn: 'Generator',        icon: 'Zap' },
};
