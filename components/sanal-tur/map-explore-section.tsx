'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Eye, Play, X, Compass } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Harita Önizleme Bölümü
 * "Oteli haritadan gezmek ister misin?" → tıklayınca Street View iframe açılır
 * Önizleme olarak bir cover image + play button gösterir
 */
export function MapExploreSection() {
  const [isOpen, setIsOpen] = useState(false);
  const tourUrl =
    SITE_CONFIG.virtualTour?.embedUrl ||
    'https://www.google.com/maps/embed';

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-dark backdrop-blur-sm">
            <Map size={14} />
            360° Sanal Tur
          </span>
          <h2 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            Oteli{' '}
            <span className="italic font-light text-accent-dark">
              Haritadan
            </span>{' '}
            Gezmek İster misin?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
            Google Street View ile tesisin her köşesini önceden keşfet. Tek
            tıkla içeri buyur, 360° dön, her yeri gör.
          </p>
        </motion.div>

        {/* COVER / IFRAME container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="mt-12"
        >
          <div className="group relative">
            {/* Rotating conic border */}
            <div
              className="absolute -inset-px rounded-3xl opacity-60"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.5) 90deg, transparent 180deg, rgba(212,175,55,0.3) 270deg, transparent 360deg)',
                animation: 'globe-rotate 9s linear infinite',
              }}
            />

            {/* Outer glow */}
            <div
              className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              style={{ animation: 'aurora-drift 14s ease-in-out infinite alternate' }}
            />

            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-2 shadow-[0_25px_70px_-25px_rgba(0,0,0,0.25)]">
              {/* Köşe markerları */}
              <span className="pointer-events-none absolute left-3 top-3 z-30 h-3 w-3 border-l-2 border-t-2 border-accent" />
              <span className="pointer-events-none absolute right-3 top-3 z-30 h-3 w-3 border-r-2 border-t-2 border-accent" />
              <span className="pointer-events-none absolute bottom-3 left-3 z-30 h-3 w-3 border-b-2 border-l-2 border-accent" />
              <span className="pointer-events-none absolute bottom-3 right-3 z-30 h-3 w-3 border-b-2 border-r-2 border-accent" />

              <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100">
                <AnimatePresence mode="wait">
                  {!isOpen ? (
                    // COVER — Click to open
                    <motion.button
                      key="cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsOpen(true)}
                      className="group/cover absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900"
                    >
                      {/* Subtle animated pattern bg */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            'radial-gradient(circle at 30% 50%, rgba(212,175,55,0.3) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(212,175,55,0.2) 0%, transparent 60%)',
                          animation: 'aurora-drift 20s ease-in-out infinite alternate',
                        }}
                      />

                      {/* Center play */}
                      <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-4">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary-900 shadow-[0_15px_50px_rgba(212,175,55,0.6)] transition-all sm:h-20 sm:w-20 md:h-24 md:w-24"
                        >
                          {/* Pulse rings */}
                          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-30" />
                          <span
                            className="absolute -inset-3 rounded-full border border-accent/30 sm:-inset-4"
                            style={{
                              animation: 'led-corner-pulse 2.5s ease-in-out infinite',
                            }}
                          />
                          <Play
                            className="h-5 w-5 translate-x-0.5 sm:h-7 sm:w-7 md:h-9 md:w-9"
                            fill="currentColor"
                          />
                        </motion.div>
                        <div className="text-center text-white">
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md sm:gap-2 sm:px-4 sm:py-1.5 sm:text-[10px] sm:tracking-[0.25em]">
                            <Compass className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            360° Etkileşimli
                          </div>
                          <p className="mt-2 font-serif text-base italic sm:mt-3 sm:text-xl md:mt-4 md:text-2xl lg:text-3xl">
                            İçeri Buyurun
                          </p>
                          <p className="mt-1 text-[10px] text-white/70 sm:mt-2 sm:text-xs md:text-sm">
                            Tıkla, 360° dön, her yeri keşfet
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ) : (
                    // IFRAME — Aktif sanal tur
                    <motion.div
                      key="iframe"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <iframe
                        src={tourUrl}
                        title="Hat Naturel Resort 360° Sanal Tur"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                      {/* Close button */}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-lg backdrop-blur transition hover:bg-white"
                        aria-label="Sanal turu kapat"
                      >
                        <X size={18} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Alt meta */}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-500 sm:mt-6 sm:gap-2 sm:text-xs">
            <Eye className="h-3 w-3 text-accent" />
            Sanal tura tıkla, 360° döndürerek tesisi gez
          </p>
        </motion.div>
      </div>
    </section>
  );
}
