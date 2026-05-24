'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RoomGalleryProps {
  images: string[];
  alt: string;
}

export function RoomGallery({ images, alt }: RoomGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(
    () => setActive((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setActive((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, prev, next]);

  return (
    <>
      {/* MAIN + THUMBS LAYOUT */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        {/* Main image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100 shadow-medium md:aspect-[16/10]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={`${alt} — ${active + 1}/${images.length}`}
                fill
                priority={active === 0}
                sizes="(max-width:768px) 100vw, 75vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* arrows */}
          <button
            onClick={prev}
            aria-label="Önceki görsel"
            className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-neutral-800 shadow-md backdrop-blur transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Sonraki görsel"
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-neutral-800 shadow-md backdrop-blur transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* expand */}
          <button
            onClick={() => setLightbox(true)}
            aria-label="Tam ekran görüntüle"
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-neutral-900/70 px-4 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-neutral-900"
          >
            <Expand className="h-4 w-4" />
            Büyüt
          </button>

          {/* counter */}
          <div className="absolute bottom-4 left-4 rounded-full bg-neutral-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {active + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails (vertical on desktop, horizontal scroll on mobile) */}
        <div className="md:max-h-[480px] md:overflow-y-auto md:pr-1">
          <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-x-visible">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                className={cn(
                  'relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all md:h-20 md:w-28',
                  i === active
                    ? 'ring-primary-600 scale-100'
                    : 'ring-transparent opacity-70 hover:opacity-100',
                )}
                aria-label={`Görsel ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} thumb ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/95 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
              aria-label="Kapat"
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Önceki"
              className="absolute left-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Sonraki"
              className="absolute right-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative h-[85vh] w-[90vw] max-w-6xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${alt} fullscreen`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur">
              {active + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
