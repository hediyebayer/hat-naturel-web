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
  | 'generator'
  | 'heatedPool'
  | 'sauna';

/**
 * Oda kategorisi — tipler. Aynı kategoride birden fazla oda olabilir;
 * adet (count) sahası kategori başlığında göstermek için kullanılır.
 */
export type RoomCategory =
  | 'ucgen-2-1'
  | 'ucgen-1-1'
  | 'kosk-1-1-havuzsuz'
  | 'kosk-2-1-havuzlu';

export interface Room {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: RoomCategory;
  /** Bu odadan kaç adet var (aynı tipte birden fazlaysa). Default 1. */
  count?: number;
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

/**
 * Kategori meta verisi — başlık, açıklama, görüntülenecek toplam adet.
 * Anasayfa ve /odalar sayfasında üst gruplama için.
 */
export interface CategoryMeta {
  id: RoomCategory;
  title: string;
  titleEn: string;
  subtitle: string;
  /** Toplam fiziksel ev adedi (Hediye'nin verdiği). */
  totalCount: number;
  hasPool: boolean;
  poolNote?: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'ucgen-2-1',
    title: '2+1 Üçgen Bungalov',
    titleEn: '2+1 Triangle Bungalow',
    subtitle: 'Geniş aileler için ikonik üçgen mimari — özel ısıtmalı havuz ve sauna',
    totalCount: 3,
    hasPool: true,
    poolNote: 'Isıtmalı havuz + sauna her mevsim açık',
  },
  {
    id: 'ucgen-1-1',
    title: '1+1 Üçgen Bungalov',
    titleEn: '1+1 Triangle Bungalow',
    subtitle: 'İkonik üçgen mimari — özel ısıtmalı havuz ve sauna ile yıl boyu spa keyfi',
    totalCount: 6,
    hasPool: true,
    poolNote: 'Isıtmalı havuz + sauna her mevsim açık',
  },
  {
    id: 'kosk-1-1-havuzsuz',
    title: '1+1 Köşk (Havuzsuz)',
    titleEn: '1+1 Lodge (No Pool)',
    subtitle: 'Bej ve Turkuaz — 85 m² ferah çift bungalovları',
    totalCount: 2,
    hasPool: false,
  },
  {
    id: 'kosk-2-1-havuzlu',
    title: '2+1 Köşk (Yaz Havuzlu)',
    titleEn: '2+1 Lodge (Summer Pool)',
    subtitle: 'Sarı ve Mor — yaz aylarında özel havuzlu aile köşkleri',
    totalCount: 2,
    hasPool: true,
    poolNote: 'Yaz sezonunda kullanıma açıktır',
  },
];

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
    category: 'kosk-1-1-havuzsuz',
    description:
      'Standart 1+1 köşkümüz; 85 m² ferah yaşam alanı, doğa manzaralı müstakil bungalov. (Havuzsuz)',
    longDescription:
      'Hat Naturel Resort Sapanca tesisimizin 1+1 standart köşklerinden Bej Köşk, 85 m² genişliğinde salon ve oda yapısıyla size evinizdeki konforu sunar. Doğa manzaralı müstakil yapısı, modern iç tasarımı ve sıcak atmosferiyle çiftler ve küçük aileler için ideal bir kaçamak. Bu köşkümüz havuzsuzdur; ancak tesisin ortak alanlarındaki sosyal imkânlardan tam olarak faydalanabilirsiniz.',
    specs: { area: 85, guests: 2, extraGuests: 3, bedrooms: 1, bathrooms: 1 },
    amenities: COMMON_AMENITIES,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg'].map(
      (n) => `/images/rooms/bej/${n}`,
    ),
    accentColor: 'from-amber-200/40 via-amber-100/20 to-transparent',
    theme: 'beige',
    featured: true,
  },
  {
    slug: 'turkuaz',
    name: 'Turkuaz Köşk 1+1',
    shortName: 'Turkuaz 1+1',
    tagline: 'İki banyolu konfor, çiftler için',
    category: 'kosk-1-1-havuzsuz',
    description:
      '85 m² genişliğinde, çift banyolu ferah 1+1 köşk — pratik konfor arayanlara. (Havuzsuz)',
    longDescription:
      'Turkuaz Köşk 1+1 evimiz 85 m² genişliğe ve 2 ayrı banyoya sahiptir; bu sayede çiftlere ve yakın arkadaşlara rahat bir tatil deneyimi sunar. Doğanın içinde, modern donanımıyla ev konforu hissini koruyan ideal bir konaklama seçeneği. Köşkümüz havuzsuzdur; tesisin ortak sosyal alanlarından faydalanabilirsiniz.',
    specs: { area: 85, guests: 2, extraGuests: 3, bedrooms: 1, bathrooms: 2 },
    amenities: COMMON_AMENITIES,
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
    tagline: 'Isıtmalı havuz + sauna, ikonik üçgen mimari',
    category: 'ucgen-1-1',
    count: 6,
    description:
      'Tesisin en popüler yapılarından — özel ısıtmalı havuz, sauna ve ikonik üçgen tasarım. Tesisimizde 6 adet bulunur.',
    longDescription:
      '1+1 Üçgen Bungalov’larımız tesisimizin en çok tercih edilen yapılarındandır ve toplam 6 adet bulunur. İkonik üçgen mimarisi, sıcak ahşap dokuları ve şömineli oda sobasıyla doğanın içinde benzersiz bir atmosfer sunar. **Özel ısıtmalı havuzu ve saunası** sayesinde mevsim fark etmeksizin yıl boyu spa keyfi yaşarsınız. 5 kişiye kadar konaklama imkanı ile aileler ve arkadaş grupları için ideal, hem fiyat hem konfor olarak avantajlı bir seçim.',
    specs: { area: 85, guests: 5, extraGuests: 3, bedrooms: 1, bathrooms: 1 },
    amenities: ['heatedPool', 'sauna', ...COMMON_AMENITIES],
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
    slug: 'mor',
    name: 'Mor Köşk 2+1',
    shortName: 'Mor 2+1',
    tagline: 'Yaz havuzlu, dikkat çeken köşk',
    category: 'kosk-2-1-havuzlu',
    description:
      '95 m² genişlikte, 2+1 tasarımıyla ferah ortam — özel yaz havuzlu aile köşkü.',
    longDescription:
      'Tesisin en dikkat çeken köşklerinden Mor Köşk, 2+1 yapısı ve 95 m² genişliğiyle ferah bir ortam sağlar. Yaz sezonunda kullanıma açılan özel havuzu sayesinde sıcak günlerde ailecek serinleme keyfini bahçenizde yaşayabilirsiniz. Doğanın sessizliği ile ailecek huzurlu bir tatil deneyimi arıyorsanız doğru tercih.',
    specs: { area: 95, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 2 },
    amenities: ['pool', ...COMMON_AMENITIES],
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
    tagline: 'Yaz havuzlu, özel tasarım köşk',
    category: 'kosk-2-1-havuzlu',
    description:
      'Özel tasarım 95 m² 2+1 köşk; özel yaz havuzu, ferahlık ve yaşamsal genişlikle dikkat çeker.',
    longDescription:
      'Sarı Köşk 2+1 evimiz özel dizayn olarak tasarlanmıştır. Odaların ferahlığı ve yaşamsal genişliğiyle öne çıkan köşkümüz, yaz aylarında kullanıma açılan özel havuzuyla müstakil bir tatil keyfi sunar. Doğa manzaralı geniş bahçesinde ailecek unutulmaz anlar yaşayabilirsiniz.',
    specs: { area: 95, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 2 },
    amenities: ['pool', ...COMMON_AMENITIES],
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'].map(
      (n) => `/images/rooms/sari/${n}`,
    ),
    accentColor: 'from-yellow-300/40 via-amber-200/20 to-transparent',
    theme: 'yellow',
    featured: true,
  },
  {
    slug: 'ucgen-2-1',
    name: '2+1 Üçgen Bungalov',
    shortName: 'Üçgen 2+1',
    tagline: 'Isıtmalı havuz + sauna, geniş aile için',
    category: 'ucgen-2-1',
    count: 3,
    description:
      '95 m² genişliğinde üçgen mimari 2+1 — özel ısıtmalı havuz, sauna ve geniş aileye rahat yaşam alanı. Tesisimizde 3 adet bulunur.',
    longDescription:
      'Hat Naturel Resort Sapanca\'da 2+1 Üçgen Bungalov’larımız geniş aile yapısı için tasarlanmıştır ve tesiste toplam 3 adet bulunur. 95 m² büyüklüğünde tam bir aileye rahatça yaşam alanı sunan bungalovlarımız doğa manzaralıdır. **Özel ısıtmalı havuz ve sauna** ile her mevsim spa keyfi yaşanır. İkonik üçgen mimarisi ile fotoğraflık bir atmosfer yaratır; her biri benzer iç tasarım ve donanıma sahiptir.',
    specs: { area: 95, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 1 },
    amenities: ['heatedPool', 'sauna', ...COMMON_AMENITIES],
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'].map(
      (n) => `/images/rooms/ucgen-2-1/${n}`,
    ),
    accentColor: 'from-emerald-300/40 via-green-200/20 to-transparent',
    theme: 'green',
    featured: true,
  },
];

/** Toplam fiziksel ev adedi (kategorilerdeki count toplamı = 8) */
export const TOTAL_HOUSE_COUNT = CATEGORIES.reduce(
  (acc, c) => acc + c.totalCount,
  0,
);

/** Kategori sayısı (5 demiştik ama 4 kategori var, count'larla 8 ev) */
export const CATEGORY_COUNT = CATEGORIES.length;

/** Bir kategoriye ait odaları getir */
export function getRoomsByCategory(category: RoomCategory): Room[] {
  return ROOMS.filter((r) => r.category === category);
}

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
  pool:             { label: 'Havuz (yaz sezonu)',   labelEn: 'Pool (summer)',    icon: 'Waves' },
  heatedPool:       { label: 'Isıtmalı Havuz',         labelEn: 'Heated Pool',      icon: 'Waves' },
  sauna:            { label: 'Sauna',                  labelEn: 'Sauna',            icon: 'Flame' },
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
