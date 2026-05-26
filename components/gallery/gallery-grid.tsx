'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { GALLERY_IMAGES, type GalleryCategory } from '@/lib/data/gallery';
import { cn } from '@/lib/utils/cn';

const FILTERS: ReadonlyArray<'all' | GalleryCategory> = [
  'all',
  'drone',
  'ground',
  'restaurant',
  'night',
];

/**
 * Galeri grid + lightbox.
 *
 * - Filtre chip'leri: Tümü / Drone / Yer
 * - Masonry-ish grid (column-count, mobil 1 → desktop 3)
 * - Lightbox: keyboard nav (Esc, ←, →) + swipe, fade animasyonu
 * - Lazy load (next/image)
 */
export function GalleryGrid(): React.ReactElement {
  const t = useTranslations('gallery');
  const [filter, setFilter] = useState<'all' | GalleryCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return GALLERY_IMAGES;
    return GALLERY_IMAGES.filter((img) => img.category === filter);
  }, [filter]);

  const openLightbox = useCallback((index: number): void => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback((): void => {
    setLightboxIndex(null);
  }, []);

  const goPrevious = useCallback((): void => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filtered.length - 1 : prev - 1;
    });
  }, [filtered.length]);

  const goNext = useCallback((): void => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filtered.length - 1 ? 0 : prev + 1;
    });
  }, [filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') goPrevious();
      else if (e.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, goPrevious, goNext]);

  return (
    <div>
      {/* Filtre chip'leri */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
        {FILTERS.map((key) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-primary-900 text-white shadow-medium ring-2 ring-accent ring-offset-2'
                  : 'bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-50 hover:ring-primary-300',
              )}
            >
              {t(key)}
              <span
                className={cn(
                  'ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
                  isActive
                    ? 'bg-accent text-primary-900'
                    : 'bg-neutral-100 text-neutral-600',
                )}
              >
                {key === 'all'
                  ? GALLERY_IMAGES.length
                  : GALLERY_IMAGES.filter((i) => i.category === key).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Masonry grid — column-based, doğal masonry */}
      <motion.div
        layout
        className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>div]:mb-4 [&>div]:break-inside-avoid"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((img, i) => (
            <motion.div
              key={img.src}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <button
                type="button"
                onClick={() => openLightbox(i)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-soft transition-all duration-300 hover:shadow-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                aria-label={`${t('viewLarger')} — ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1920}
                  height={1280}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="block h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay — hover'da görünür */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Zoom ikonu — sağ üst */}
                <div className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md ring-1 ring-white/30 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
                  <ZoomIn size={18} />
                </div>

                {/* Kategori badge — sol alt */}
                <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                  {t(img.category)}
                </span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={t('viewLarger')}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeLightbox}
              aria-label={t('close')}
              className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition-colors hover:bg-white/20 md:right-8 md:top-8"
            >
              <X size={22} />
            </button>

            {/* Counter */}
            <span className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md ring-1 ring-white/20 md:left-8 md:top-8">
              {lightboxIndex + 1} / {filtered.length}
            </span>

            {/* Previous */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrevious();
              }}
              aria-label={t('previous')}
              className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/20 hover:scale-110 md:left-6 md:h-14 md:w-14"
            >
              <ChevronLeft size={26} />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label={t('next')}
              className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/20 hover:scale-110 md:right-6 md:h-14 md:w-14"
            >
              <ChevronRight size={26} />
            </button>

            {/* Image — animated when switching */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] max-w-[92vw] md:max-w-[85vw]"
            >
              <Image
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].alt}
                width={1920}
                height={1280}
                sizes="92vw"
                priority
                className="max-h-[88vh] w-auto rounded-2xl object-contain shadow-strong"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
