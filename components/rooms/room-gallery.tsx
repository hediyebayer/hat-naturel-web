'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Expand, Camera } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RoomGalleryProps {
  images: string[];
  alt: string;
}

export function RoomGallery({ images, alt }: RoomGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Mouse parallax + 3D tilt for main image (premium feel)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 22, stiffness: 140, mass: 0.4 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  // Image position shift (parallax) — daha dramatik (±45px)
  const imageX = useTransform(springX, [-1, 1], [-45, 45]);
  const imageY = useTransform(springY, [-1, 1], [-30, 30]);
  // 3D tilt — perspective rotation (kart içine doğru eğiliyor gibi)
  const rotateY = useTransform(springX, [-1, 1], [8, -8]);
  const rotateX = useTransform(springY, [-1, 1], [-6, 6]);

  const mainImageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const prev = useCallback(
    () => setActive((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setActive((i) => (i + 1) % images.length),
    [images.length],
  );

  // Keyboard nav + body scroll lock for lightbox
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

  // ⚡ BUG FIX: thumbnail click handler — explicit index, not from key
  const handleThumbnailClick = (idx: number) => {
    setActive(idx);
  };

  return (
    <>
      {/* MAIN + THUMBS LAYOUT */}
      <div className="grid gap-5 md:grid-cols-[1fr_140px] lg:grid-cols-[1fr_160px]">
        {/* ═══════════════════════════════════════════
            MAIN IMAGE — premium with mouse parallax
            ═══════════════════════════════════════════ */}
        <div
          ref={mainImageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] md:aspect-[16/10]"
          style={{ perspective: '1200px' }}
        >
          {/* ⚡ FIX: key by image URL+index, not just active number */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${images[active]}-${active}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 3D tilt wrapper — mouse yönüne göre eğilir */}
              <motion.div
                className="absolute inset-0"
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                }}
              >
                {/* Parallax wrapper — mouse yönüne göre kayar */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    x: imageX,
                    y: imageY,
                    scale: 1.12,
                  }}
                >
                  <Image
                    src={images[active]}
                    alt={`${alt} — Görsel ${active + 1}/${images.length}`}
                    fill
                    priority={active === 0}
                    quality={90}
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 65vw, 800px"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Light reflection — mouse yönüne göre parlama (glass effect) */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: useTransform(
                [springX, springY] as never,
                ([x, y]: number[]) =>
                  `radial-gradient(circle at ${50 + x * 35}% ${50 + y * 35}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
              ),
            }}
          />

          {/* Subtle vignette */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.2)_100%)]" />

          {/* Arrows — premium glass */}
          <button
            onClick={prev}
            aria-label="Önceki görsel"
            className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/85 text-neutral-800 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Sonraki görsel"
            className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/85 text-neutral-800 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Expand button */}
          <button
            onClick={() => setLightbox(true)}
            aria-label="Tam ekran görüntüle"
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/75"
          >
            <Expand className="h-3.5 w-3.5" />
            Tam Ekran
          </button>

          {/* Counter — left bottom */}
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <Camera className="h-3 w-3 text-accent" />
            <span className="tabular-nums">
              {String(active + 1).padStart(2, '0')}
              <span className="mx-1 text-white/50">/</span>
              {String(images.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            THUMBNAILS — premium klas (vertical desktop)
            ═══════════════════════════════════════════ */}
        <div className="md:max-h-[480px] md:overflow-y-auto md:pr-1 md:[scrollbar-width:thin]">
          <div className="flex gap-3 overflow-x-auto pb-2 md:flex-col md:overflow-x-visible md:pb-0">
            {images.map((src, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  // ⚡ BUG FIX: unique key with index, not just src
                  key={`thumb-${i}-${src}`}
                  onClick={() => handleThumbnailClick(i)}
                  whileHover={{ scale: isActive ? 1 : 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    'group/thumb relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl transition-all duration-300 md:h-24 md:w-full md:aspect-[4/3]',
                    isActive ? 'z-10' : 'opacity-65 hover:opacity-100',
                  )}
                  aria-label={`Görsel ${i + 1}`}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  {/* Active border with animated glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeThumbnail"
                      className="pointer-events-none absolute -inset-0.5 rounded-xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(212,175,55,0.8) 50%, rgba(255,255,255,0.95) 100%)',
                        boxShadow:
                          '0 0 20px rgba(255,255,255,0.5), 0 0 8px rgba(212,175,55,0.4)',
                      }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    />
                  )}

                  {/* Image wrapper */}
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image
                      src={src}
                      alt={`${alt} thumb ${i + 1}`}
                      fill
                      sizes="(max-width:768px) 80px, 160px"
                      quality={75}
                      className={cn(
                        'object-cover transition-transform duration-500',
                        isActive
                          ? 'scale-105'
                          : 'group-hover/thumb:scale-110',
                      )}
                    />

                    {/* Gradient overlay — non-active darker */}
                    <div
                      className={cn(
                        'pointer-events-none absolute inset-0 transition-opacity duration-300',
                        isActive
                          ? 'bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-100'
                          : 'bg-black/20 opacity-100 group-hover/thumb:opacity-0',
                      )}
                    />

                    {/* Number badge */}
                    <div
                      className={cn(
                        'absolute bottom-1.5 right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums transition-all',
                        isActive
                          ? 'bg-white text-neutral-900 shadow-md'
                          : 'bg-black/60 text-white/90 backdrop-blur-sm',
                      )}
                    >
                      {i + 1}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile only: total count footer */}
          <div className="mt-2 text-center text-[10px] font-medium uppercase tracking-wider text-neutral-500 md:hidden">
            {images.length} görsel
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LIGHTBOX — fullscreen viewer
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/95 p-4 backdrop-blur-md"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(false);
              }}
              aria-label="Kapat"
              className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Önceki"
              className="absolute left-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Sonraki"
              className="absolute right-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* ⚡ FIX: explicit key to avoid stale image */}
            <motion.div
              key={`lightbox-${active}-${images[active]}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative h-[85vh] w-[90vw] max-w-6xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${alt} tam ekran ${active + 1}`}
                fill
                sizes="90vw"
                quality={95}
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
