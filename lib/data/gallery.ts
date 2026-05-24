/**
 * Galeri görselleri — public/images/gallery/ altında.
 *
 * Dosya adı formatı: NN-{category}.jpg
 *   - NN: matematiksel sıra (01-99)
 *   - category: 'drone' | 'ground'
 *
 * Yeni görsel eklerken: 1920px max, JPEG q82, kebab category prefix.
 */

export type GalleryCategory = 'drone' | 'ground';

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
];

export const GALLERY_IMAGES: ReadonlyArray<GalleryImage> = FILES.map(
  ({ file, category }, index) => ({
    src: `/images/gallery/${file}`,
    alt: `Hat Naturel Resort Sapanca — Görsel ${index + 1}`,
    category,
  }),
);
