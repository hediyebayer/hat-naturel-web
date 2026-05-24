'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ROOMS } from '@/lib/data/rooms';
import { StarryBackground } from './starry-background';

export function RoomsHero() {
  // Use 3 hero images
  const collage = [
    ROOMS.find((r) => r.slug === 'mor')?.images[0] || '/images/hero-1.jpg',
    ROOMS.find((r) => r.slug === 'ucgen-2-1')?.images[0] || '/images/hero-2.jpg',
    ROOMS.find((r) => r.slug === 'sari')?.images[0] || '/images/hero-3.jpg',
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#0B132B] pt-32 pb-24 text-white md:pt-40 md:pb-32">
      <StarryBackground />
      
      {/* Animated blurred backdrop using room images */}
      <div className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen opacity-20">
        {collage.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ duration: 3, delay: i * 0.4, ease: 'easeOut' }}
            className="absolute inset-0"
            style={{
              clipPath: ['inset(0 66% 0 0)', 'inset(0 33% 0 33%)', 'inset(0 0 0 66%)'][i],
            }}
          >
            <Image src={src} alt="" fill priority className="object-cover blur-[8px]" sizes="100vw" />
          </motion.div>
        ))}
        {/* Night veil gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur-md"
        >
          ✨ Hat Naturel Resort
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-8 font-serif text-5xl font-bold leading-tight tracking-tight md:text-7xl"
        >
          <span className="italic font-light text-accent/90">Sapanca&apos;nın</span> Sessiz Köşeleri
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-8 max-w-2xl font-sans text-base text-white/70 tracking-[0.02em] md:text-lg leading-relaxed"
        >
          Her biri farklı, her biri müstakil — doğa içinde 8 özel evinizden birini seçin, gerisi sadece huzur.
        </motion.p>

        {/* Minimalist chips inline instead of heavy stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-12 flex flex-wrap justify-center gap-3"
        >
          {['8 Müstakil Ev', '4 Farklı Konsept', '85–95 m² Yaşam Alanı'].map((stat, i) => (
            <span key={i} className="inline-flex items-center rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent/90 backdrop-blur-sm shadow-[0_0_15px_rgba(212,175,55,0.05)]">
              {stat}
            </span>
          ))}
        </motion.div>
      </div>
      
      {/* Soft gradient bottom edge instead of wave */}
      <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-b from-transparent to-[#0B132B]" />
    </section>
  );
}
