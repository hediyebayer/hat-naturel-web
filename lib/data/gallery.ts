/**
 * Galeri görselleri — public/images/gallery/ altında.
 *
 * Dosya adı formatı: NN-{category}.jpg
 *   - NN: matematiksel sıra (01-99)
 *   - category: 'drone' | 'ground'
 *
 * Yeni görsel eklerken: 1920px max, JPEG q82, kebab category prefix.
 */

export type GalleryCategory = 'drone' | 'ground' | 'restaurant' | 'night';

export interface GalleryImage {
  /** Public path */
  src: string;
  /** alt text fallback */
  alt: string;
  category: GalleryCategory;
}

const FILES: ReadonlyArray<{ file: string; category: GalleryCategory }> = [
  { file: '01-drone.jpg', category: 'drone' },
  { file: '02-drone.jpg', category: 'drone' },
  { file: '03-drone.jpg', category: 'drone' },
  { file: '04-drone.jpg', category: 'drone' },
  { file: '05-drone.jpg', category: 'drone' },
  { file: '06-drone.jpg', category: 'drone' },
  { file: '07-drone.jpg', category: 'drone' },
  { file: '08-drone.jpg', category: 'drone' },
  { file: '09-drone.jpg', category: 'drone' },
  { file: '10-drone.jpg', category: 'drone' },
  { file: '11-ground.jpg', category: 'ground' },
  { file: '12-restaurant-01.jpg', category: 'restaurant' },
  { file: '12-restaurant-02.jpg', category: 'restaurant' },
  { file: '12-restaurant-03.jpg', category: 'restaurant' },
  { file: '12-restaurant-04.jpg', category: 'restaurant' },
  { file: '12-restaurant-05.jpg', category: 'restaurant' },
  { file: '12-restaurant-06.jpg', category: 'restaurant' },
  { file: '12-restaurant-07.jpg', category: 'restaurant' },
  { file: '20-night-01.jpg', category: 'night' },
  { file: '20-night-02.jpg', category: 'night' },
  { file: '20-night-03.jpg', category: 'night' },
  { file: '20-night-04.jpg', category: 'night' },
  { file: '20-night-05.jpg', category: 'night' },
  { file: '20-night-06.jpg', category: 'night' },
  { file: '30-ground.jpg', category: 'ground' },
  { file: '31-ground.jpg', category: 'ground' },
  { file: '32-ground.jpg', category: 'ground' },
  { file: '40-feat-01.jpg', category: 'ground' },
  { file: '40-feat-02.jpg', category: 'ground' },
  { file: '40-feat-03.jpg', category: 'ground' },
];

export const GALLERY_IMAGES: ReadonlyArray<GalleryImage> = FILES.map(
  ({ file, category }, index) => ({
    src: `/images/gallery/${file}`,
    alt: `Hat Naturel Resort Sapanca — Görsel ${index + 1}`,
    category,
  }),
);
