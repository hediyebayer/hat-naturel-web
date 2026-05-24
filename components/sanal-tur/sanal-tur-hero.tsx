'use client';

import { motion } from 'framer-motion';
import { Compass, Video, MapPin, Camera } from 'lucide-react';

export function SanalTurHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Üst kicker */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-dark backdrop-blur-sm"
        >
          <Compass size={14} className="animate-spin-slow" />
          Sanal Deneyim Merkezi
        </motion.span>

        {/* Ana başlık */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
          className="mt-8 font-serif text-4xl font-bold leading-[1.2] tracking-tight text-neutral-900 md:text-6xl lg:text-7xl"
        >
          <span className="block pb-2 font-light italic text-accent-dark">
            Hat Naturel&apos;i
          </span>
          <span className="block bg-gradient-to-r from-primary-700 via-primary-900 to-primary-700 bg-clip-text pb-2 font-bold text-transparent">
            Keşfetmenin 4 Yolu
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg"
        >
          Canlı görüntülü tur, 360° harita, misafir fotoğrafları ve adres
          bilgileri — tesisi gelmeden tanımanın her yolu burada.
        </motion.p>

        {/* Quick links — 4 ikon chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: Video, label: 'Canlı Tur', href: '#canli-tur' },
            { icon: MapPin, label: 'Konum', href: '#konum' },
            { icon: Compass, label: '360° Harita', href: '#harita-gez' },
            { icon: Camera, label: 'Misafir Galerimiz', href: '#galeri' },
          ].map((chip, i) => (
            <motion.a
              key={chip.label}
              href={chip.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              whileHover={{ y: -3, scale: 1.05 }}
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur-md transition-all hover:border-accent/50 hover:text-accent-dark hover:shadow-md"
            >
              <chip.icon
                size={14}
                className="text-accent transition-transform group-hover:rotate-12"
              />
              {chip.label}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
