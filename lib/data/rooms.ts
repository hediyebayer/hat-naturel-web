/**
 * Oda (bungalov) veri kaynağı.
 * Eski hatnaturel.com.tr sitesinden çekilen içerikler + temizlenmiş açıklamalar.
 * Görseller public/images/rooms/<slug>/*.jpg altında local olarak duruyor.
 */

export type Amenity =
  // Mevcut (silinmedi)
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
  | 'sauna'
  // YENİ — Hediye'nin verdiği liste
  | 'jacuzzi'           // 🛁 Jakuzi (üçgen bungalovlarda)
  | 'sunbed'            // Şezlong (havuz başı)
  | 'doubleSwing'       // Çift kişilik yataklı salıncak
  | 'streamingTv'       // 📺 TV + YouTube & Netflix
  | 'coolingPool'       // 🏊 Özel serinleme havuzu (Mor Köşk için)
  // Tesis içi olanaklar (ortak)
  | 'cafe'              // ☕ Kafe
  | 'parking'           // 🚗 Ücretsiz otopark
  | 'playground'        // 🎠 Çocuk oyun parkı
  | 'waterfall'         // 💧 Mini şelale
  | 'naturalArea'       // 🌿 Geniş doğal alan
  | 'lakeView'          // 🌊 Göl manzarası
  | 'privateVeranda'    // 🌳 Özel veranda ve yeşil alan
  | 'noPets';           // 🐾 Pet kabul edilmiyor

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
  /** Yatak düzeni — örn: 'Asma katta çift kişilik yatak + alt katta çekyat' */
  bedConfig?: string[];
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
    subtitle: 'Bej, Turkuaz ve Sarı — 85-95 m² ferah, havuzsuz köşkler',
    totalCount: 3,
    hasPool: false,
  },
  {
    id: 'kosk-2-1-havuzlu',
    title: '2+1 Köşk (Yaz Havuzlu)',
    titleEn: '2+1 Lodge (Summer Pool)',
    subtitle: 'Mor — yaz aylarında özel havuzlu aile köşkü',
    totalCount: 1,
    hasPool: true,
    poolNote: 'Yaz sezonunda kullanıma açıktır',
  },
];

/**
 * Tesis içi ortak olanaklar — tüm odalarda var
 */
const FACILITY_AMENITIES: Amenity[] = [
  'cafe',
  'parking',
  'playground',
  'waterfall',
  'naturalArea',
  'lakeView',
  'noPets',
];

/**
 * Temel oda donanımı — tüm odalarda var
 */
const BASE_ROOM_AMENITIES: Amenity[] = [
  'ac',
  'wifi',
  'streamingTv',
  'kitchen',
  'fridge',
  'hairDryer',
  'wardrobe',
  'towels',
  'toiletries',
  'waterTank',
  'fireExtinguisher',
  'security',
  'generator',
];

/**
 * Dış alan ortak donanımı — tüm odalarda var
 */
const OUTDOOR_AMENITIES: Amenity[] = [
  'bbq',
  'firePit',
  'privateVeranda',
  'gardenFurniture',
];

/**
 * Üçgen bungalov özel amenities (ısıtmalı havuz + jakuzi + sauna + şezlong + çift salıncak)
 */
const TRIANGLE_BUNGALOW_AMENITIES: Amenity[] = [
  'heatedPool',
  'jacuzzi',
  'sauna',
  'sunbed',
  'doubleSwing',
  ...BASE_ROOM_AMENITIES,
  ...OUTDOOR_AMENITIES,
  ...FACILITY_AMENITIES,
];

/**
 * 1+1 Köşk amenity'leri (havuzsuz, sade)
 * Şömine var, klima + mutfak + standart dış donanım
 */
const KOSK_1_1_AMENITIES: Amenity[] = [
  'fireplace',
  ...BASE_ROOM_AMENITIES,
  ...OUTDOOR_AMENITIES,
  ...FACILITY_AMENITIES,
];

/**
 * Mor Köşk 2+1 amenity'leri (özel serinleme havuzu + şezlong + çift salıncak + şömine)
 */
const MOR_KOSK_AMENITIES: Amenity[] = [
  'coolingPool',
  'sunbed',
  'doubleSwing',
  'fireplace',
  ...BASE_ROOM_AMENITIES,
  ...OUTDOOR_AMENITIES,
  ...FACILITY_AMENITIES,
];

/**
 * Sarı Köşk 2+1 amenity'leri (havuzsuz ama geniş, şömine)
 */
const SARI_KOSK_AMENITIES: Amenity[] = [
  'fireplace',
  ...BASE_ROOM_AMENITIES,
  ...OUTDOOR_AMENITIES,
  ...FACILITY_AMENITIES,
];

// (Legacy COMMON_AMENITIES kaldırıldı — artık preset'ler kullanılıyor)

export const ROOMS: Room[] = [
  {
    slug: 'bej',
    name: 'Bej Köşk 1+1',
    shortName: 'Bej 1+1',
    tagline: 'Zarif sadelik, doğa manzarası',
    category: 'kosk-1-1-havuzsuz',
    bedConfig: [
      '🛏️ Asma katta çift kişilik yatak',
      '🛋️ Ortak alanda çift kişilik çekyat',
      '🛋️ Tek kişilik ek çekyat',
      '👪 Maksimum 5 kişi konaklayabilir',
    ],
    description:
      'Standart 1+1 köşkümüz; 85 m² ferah yaşam alanı, doğa manzaralı müstakil bungalov. (Havuzsuz)',
    longDescription:
      'Hat Naturel Resort Sapanca tesisimizin 1+1 standart köşklerinden Bej Köşk, 85 m² genişliğinde salon ve oda yapısıyla size evinizdeki konforu sunar. Doğa manzaralı müstakil yapısı, modern iç tasarımı ve sıcak atmosferiyle çiftler ve küçük aileler için ideal bir kaçamak. Bu köşkümüz havuzsuzdur; ancak tesisin ortak alanlarındaki sosyal imkânlardan tam olarak faydalanabilirsiniz.',
    specs: { area: 85, guests: 2, extraGuests: 3, bedrooms: 1, bathrooms: 1 },
    amenities: KOSK_1_1_AMENITIES,
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
    bedConfig: [
      '🛏️ Asma katta çift kişilik yatak',
      '🛋️ Ortak alanda çift kişilik çekyat',
      '🛋️ Tek kişilik ek çekyat',
      '👪 Maksimum 5 kişi konaklayabilir',
    ],
    description:
      '85 m² genişliğinde, çift banyolu ferah 1+1 köşk — pratik konfor arayanlara. (Havuzsuz)',
    longDescription:
      'Turkuaz Köşk 1+1 evimiz 85 m² genişliğe ve 2 ayrı banyoya sahiptir; bu sayede çiftlere ve yakın arkadaşlara rahat bir tatil deneyimi sunar. Doğanın içinde, modern donanımıyla ev konforu hissini koruyan ideal bir konaklama seçeneği. Köşkümüz havuzsuzdur; tesisin ortak sosyal alanlarından faydalanabilirsiniz.',
    specs: { area: 85, guests: 2, extraGuests: 3, bedrooms: 1, bathrooms: 2 },
    amenities: KOSK_1_1_AMENITIES,
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
    tagline: 'Isıtmalı havuz + jakuzi + sauna, ikonik üçgen',
    category: 'ucgen-1-1',
    count: 6,
    bedConfig: [
      '🛏️ Asma katta çift kişilik yatak',
      '🛋️ Ortak alanda çift kişilik çekyat',
      '🛋️ Tek kişilik ek çekyat',
      '👪 Maksimum 5 kişi konaklayabilir',
    ],
    description:
      'Tesisin en popüler yapılarından — özel ısıtmalı havuz, sauna ve ikonik üçgen tasarım. Tesisimizde 6 adet bulunur.',
    longDescription:
      '1+1 Üçgen Bungalov’larımız tesisimizin en çok tercih edilen yapılarındandır ve toplam 6 adet bulunur. İkonik üçgen mimarisi ve sıcak ahşap dokularıyla doğanın içinde benzersiz bir atmosfer sunar. **Bungalov içi özel ısıtmalı havuz, jakuzi, sauna** ve havuz başı şezlong + çift kişilik yataklı salıncak ile yıl boyu spa keyfi yaşarsınız. **Yatak düzeni:** Asma katta çift kişilik yatak + ortak alanda çift kişilik çekyat ve tek kişilik çekyat ile maksimum 5 kişi konaklayabilir. Çiftler ve küçük aileler için ideal, hem fiyat hem konfor olarak avantajlı bir seçim.',
    specs: { area: 85, guests: 2, extraGuests: 3, bedrooms: 1, bathrooms: 1 },
    amenities: TRIANGLE_BUNGALOW_AMENITIES,
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
      'Tesisin en dikkat çeken köşklerinden Mor Köşk, 2+1 yapısı ve 95 m² genişliğiyle ferah bir ortam sağlar. Yaz sezonunda kullanıma açılan **özel serinleme havuzu**, havuz başı şezlong ve çift kişilik yataklı büyük salıncağı sayesinde sıcak günlerde ailecek serinleme keyfini bahçenizde yaşayabilirsiniz. Şömine konforu ile kış aylarında da aynı sıcak atmosfer; doğanın sessizliği eşliğinde ailecek huzurlu bir tatil deneyimi için ideal tercih.',
    specs: { area: 95, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 2 },
    amenities: MOR_KOSK_AMENITIES,
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
    tagline: 'Özel tasarım, geniş aile köşkü',
    category: 'kosk-1-1-havuzsuz',
    description:
      'Özel tasarım 95 m² 2+1 köşk; ferahlık ve yaşamsal genişlikle dikkat çeker. (Havuzsuz)',
    longDescription:
      'Sarı Köşk 2+1 evimiz özel dizayn olarak tasarlanmıştır. Odaların ferahlığı ve yaşamsal genişliğiyle öne çıkan köşkümüz, müstakil yapısı ile sizleri doğa manzarası eşliğinde ağırlar. Doğa manzaralı geniş bahçesinde ailecek unutulmaz anlar yaşayabilirsiniz. Köşkümüz havuzsuzdur; tesisin ortak sosyal alanlarından faydalanabilirsiniz.',
    specs: { area: 95, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 2 },
    amenities: SARI_KOSK_AMENITIES,
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
    tagline: 'Isıtmalı havuz + jakuzi + sauna, geniş aile',
    category: 'ucgen-2-1',
    count: 3,
    bedConfig: [
      '🛏️ Ebeveyn odasında 1 adet çift kişilik yatak',
      '🛏️ Asma katta 2 adet tek kişilik yatak',
      '🛋️ Ortak alanda çift kişilik çekyat',
      '🛋️ Ortak alanda tek kişilik çekyat',
      '👪 Maksimum 7 kişi konaklayabilir',
    ],
    description:
      '95 m² genişliğinde üçgen mimari 2+1 — özel ısıtmalı havuz, sauna ve geniş aileye rahat yaşam alanı. Tesisimizde 3 adet bulunur.',
    longDescription:
      'Hat Naturel Resort Sapanca\'da 2+1 Üçgen Bungalov’larımız geniş aile yapısı için tasarlanmıştır ve tesiste toplam 3 adet bulunur. 95 m² büyüklüğünde tam bir aileye rahatça yaşam alanı sunan bungalovlarımız doğa manzaralıdır. **Bungalov içi özel ısıtmalı havuz, jakuzi, sauna**, havuz başı şezlong ve çift kişilik yataklı salıncak ile her mevsim spa keyfi yaşanır. İkonik üçgen mimarisi ile fotoğraflık bir atmosfer yaratır; her biri benzer iç tasarım ve donanıma sahiptir.',
    specs: { area: 95, guests: 4, extraGuests: 3, bedrooms: 2, bathrooms: 1 },
    amenities: TRIANGLE_BUNGALOW_AMENITIES,
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
  // Bungalov içi — havuz/sauna/jakuzi grup
  pool:             { label: 'Havuz (yaz sezonu)',   labelEn: 'Pool (summer)',    icon: 'Waves' },
  heatedPool:       { label: 'Isıtmalı Özel Havuz',   labelEn: 'Heated Pool',      icon: 'Waves' },
  coolingPool:      { label: 'Özel Serinleme Havuzu', labelEn: 'Cooling Pool',     icon: 'Waves' },
  sauna:            { label: 'Sauna',                  labelEn: 'Sauna',            icon: 'Flame' },
  jacuzzi:          { label: 'Jakuzi',                 labelEn: 'Jacuzzi',          icon: 'Bath' },
  sunbed:           { label: 'Şezlong',                labelEn: 'Sunbeds',          icon: 'Sun' },
  doubleSwing:      { label: 'Çift Kişilik Salıncak', labelEn: 'Double Swing',     icon: 'Heart' },
  swing:            { label: 'Çocuk Salıncakı',        labelEn: 'Kids Swing',       icon: 'Baby' },

  // Bungalov içi — oda donanımı
  ac:               { label: 'Klima',                 labelEn: 'Air Conditioning', icon: 'Wind' },
  wifi:             { label: 'Ücretsiz Wi-Fi',        labelEn: 'Free Wi-Fi',       icon: 'Wifi' },
  smartTv:          { label: 'Akıllı TV',             labelEn: 'Smart TV',         icon: 'Tv' },
  streamingTv:      { label: 'TV (YouTube & Netflix)', labelEn: 'TV (YouTube & Netflix)', icon: 'Tv' },
  kitchen:          { label: 'Tam Donanımlı Mutfak',  labelEn: 'Full Kitchen',     icon: 'ChefHat' },
  fridge:           { label: 'Buzdolabı',             labelEn: 'Refrigerator',     icon: 'Refrigerator' },
  fireplace:        { label: 'Şömine',                labelEn: 'Fireplace',        icon: 'Flame' },
  hairDryer:        { label: 'Saç Kurutma Makinesi',  labelEn: 'Hair Dryer',       icon: 'Wind' },
  wardrobe:         { label: 'Elbise Dolabı',         labelEn: 'Wardrobe',         icon: 'Shirt' },
  towels:           { label: 'Banyo Havlusu',         labelEn: 'Bath Towels',      icon: 'Bath' },
  toiletries:       { label: 'Buklet Malzemeleri',    labelEn: 'Toiletries',       icon: 'SprayCan' },

  // Dış alan & çevre
  bbq:              { label: 'Mangal Ekipmanları',    labelEn: 'BBQ Equipment',    icon: 'Flame' },
  firePit:          { label: 'Ateş Çukuru',           labelEn: 'Fire Pit',         icon: 'Flame' },
  privateVeranda:   { label: 'Özel Veranda & Bahçe',  labelEn: 'Private Veranda',  icon: 'TreePine' },
  gardenFurniture:  { label: 'Bahçe Mobilyası',       labelEn: 'Garden Furniture', icon: 'Armchair' },
  lakeView:         { label: 'Göl Manzarası',          labelEn: 'Lake View',         icon: 'Mountain' },

  // Güvenlik & altyapı
  waterTank:        { label: 'Su Deposu',             labelEn: 'Water Tank',       icon: 'Droplet' },
  fireExtinguisher: { label: 'Yangın Tüpü',           labelEn: 'Fire Extinguisher',icon: 'CircleAlert' },
  security:         { label: '7/24 Güvenlik Kamerası',labelEn: '24/7 Security',    icon: 'ShieldCheck' },
  generator:        { label: 'Jeneratör',              labelEn: 'Generator',        icon: 'Zap' },

  // Tesis içi ortak olanaklar
  cafe:             { label: 'Tesis Kafesi',          labelEn: 'On-site Cafe',     icon: 'Coffee' },
  parking:          { label: 'Ücretsiz Otopark',      labelEn: 'Free Parking',     icon: 'Car' },
  playground:       { label: 'Çocuk Oyun Parkı',      labelEn: 'Playground',       icon: 'PartyPopper' },
  waterfall:        { label: 'Mini Şelale',            labelEn: 'Mini Waterfall',   icon: 'Droplets' },
  naturalArea:      { label: 'Geniş Doğal Alan',      labelEn: 'Wide Natural Area',icon: 'TreePine' },

  // Politika
  noPets:           { label: 'Evcil Hayvan Kabul Edilmiyor', labelEn: 'No Pets Allowed', icon: 'Ban' },
};
