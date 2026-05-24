'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ROOMS, TOTAL_HOUSE_COUNT, CATEGORIES } from '@/lib/data/rooms';

interface RoomsHeroProps {
  title: string;
  subtitle: string;
}

export function RoomsHero({ title, subtitle }: RoomsHeroProps) {
  // En öne çıkan 3 görseli arka plan kolajı için kullan (mavi kaldırıldı)
  const collage = [
    ROOMS.find((r) => r.slug === 'mor')?.images[0],
    ROOMS.find((r) => r.slug === 'ucgen-2-1')?.images[0],
    ROOMS.find((r) => r.slug === 'sari')?.images[0],
  ].filter(Boolean) as string[];

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-neutral-950 via-primary-950 to-primary-900 pt-28 pb-24 text-white md:pt-36 md:pb-32">
      {/* Animated blurred backdrop using room images */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {collage.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.28, scale: 1 }}
            transition={{ duration: 2.5, delay: i * 0.3, ease: 'easeOut' }}
            className="absolute inset-0"
            style={{
              clipPath: ['inset(0 66% 0 0)', 'inset(0 33% 0 33%)', 'inset(0 0 0 66%)'][i],
            }}
          >
            <Image src={src} alt="" fill priority className="object-cover blur-[2px]" sizes="100vw" />
          </motion.div>
        ))}
        {/* Dark veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-primary-950/80 to-primary-950/95" />
        {/* Soft radial highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.12),transparent_55%)]" />
      </div>

      {/* Floating dots / particles */}
      <FloatingDots />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur"
        >
          🌿 Bungalov Köşkler
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 font-serif text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl"
        >
          {title.split(' ').map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }}
              className="mr-3 inline-block"
            >
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-base text-white/85 md:text-lg"
        >
          {subtitle}
        </motion.p>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mx-auto mt-10 grid max-w-2xl grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/5 py-4 backdrop-blur"
        >
          <Stat value={`${TOTAL_HOUSE_COUNT}`} label="Müstakil Ev" />
          <Stat value={`${CATEGORIES.length}`} label="Farklı Konsept" />
          <Stat value="85–95" label="m² Yaşam Alanı" />
        </motion.div>
      </div>

      {/* Bottom wave divider */}
      <svg
        className="absolute bottom-0 left-0 w-full text-neutral-50"
        viewBox="0 0 1440 80"
        fill="currentColor"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0,32 C240,80 480,80 720,48 C960,16 1200,16 1440,48 L1440,80 L0,80 Z" />
      </svg>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-4 text-center">
      <div className="font-serif text-2xl font-bold text-white md:text-3xl">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-white/70 md:text-xs">
        {label}
      </div>
    </div>
  );
}

function FloatingDots() {
  // Deterministic positions to avoid SSR hydration mismatch
  const dots = [
    { x: 10, y: 22, d: 6 },
    { x: 85, y: 15, d: 8 },
    { x: 25, y: 70, d: 4 },
    { x: 70, y: 60, d: 10 },
    { x: 50, y: 85, d: 5 },
    { x: 92, y: 75, d: 7 },
    { x: 5, y: 55, d: 9 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.d, height: d.d }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
