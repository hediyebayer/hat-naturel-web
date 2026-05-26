'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Zap } from 'lucide-react';

interface ContactHeroProps {
  title: string;
  heroLeadShort: string;
  heroLead: string;
  quickResponse: string;
}

/**
 * İletişim sayfası premium animasyonlu hero.
 * - Aurora gradient blob'lar (3 katman, ters yönde drift)
 * - 18 floating particle (altın yıldız tozu)
 * - SVG orbit halkaları (3 ring, perspective rotation)
 * - Animasyonlu badge + stagger reveal başlık
 * - Hover'da etkileşimli rozetler
 */
export function ContactHero({
  title,
  heroLeadShort,
  heroLead,
  quickResponse,
}: ContactHeroProps): React.ReactElement {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${(i * 23) % 95 + 2}%`,
        top: `${(i * 37) % 88 + 5}%`,
        size: ((i * 7) % 3) + 1,
        delay: (i * 11) % 8,
        duration: 8 + ((i * 5) % 6),
      })),
    [],
  );

  return (
    <section
      className="relative isolate overflow-hidden bg-primary-900 pb-24 pt-32 text-white sm:pb-32 sm:pt-36"
      aria-label={title}
    >
      {/* L0: Drone bg image (en altta) */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <Image
          src="/images/iletisim/contact-bg.jpg"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* L1: Lacivert gradient base — image üzerinde okunabilirlik overlay'i */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, rgba(7,9,26,0.85) 0%, rgba(10,19,48,0.78) 50%, rgba(26,42,94,0.82) 100%)',
        }}
      />

      {/* L2: Dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:32px_32px]"
      />

      {/* L3: Aurora blob 1 — altın, sol üst, drift */}
      <motion.div
        aria-hidden
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-32 top-20 -z-10 h-[28rem] w-[28rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* L4: Aurora blob 2 — lacivert, sağ alt */}
      <motion.div
        aria-hidden
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 20, -15, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-32 bottom-0 -z-10 h-[32rem] w-[32rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(29,51,112,0.5) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* L5: Aurora blob 3 — altın, orta */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/3 -z-10 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
      />

      {/* L6: SVG orbit halkalar — perspective rotation */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-[0.15]"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-accent/40"
          style={{ transform: 'rotateX(70deg)' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-8 rounded-full border border-accent/30"
          style={{ transform: 'rotateX(70deg) rotateZ(45deg)' }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-16 rounded-full border border-accent/25"
          style={{ transform: 'rotateX(70deg) rotateZ(90deg)' }}
        />
      </div>

      {/* L7: Floating particles — altın yıldız tozu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden sm:block"
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              y: [0, -40, -80, -100],
              x: [0, p.id % 2 === 0 ? 15 : -15, 0, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeOut',
            }}
            className="absolute rounded-full bg-accent-light"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              boxShadow: '0 0 8px rgba(240,216,117,0.8)',
            }}
          />
        ))}
      </div>

      {/* L8: Vinyet — kenar koyulaşma */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,9,26,0.6)_100%)]"
      />

      {/* İÇERİK */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Gold pulse badge */}
        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.15)]"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-accent"
          />
          Hat Naturel · Sapanca
        </motion.span>

        {/* Başlık — stagger reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="mt-10 font-serif text-4xl leading-[1.2] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:text-6xl lg:text-[5.5rem]"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="block pb-2 font-light"
          >
            {title}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-2 block pb-2 font-medium italic text-white/95"
          >
            {heroLeadShort}
          </motion.span>
        </motion.h1>

        {/* Lead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mx-auto mt-10 max-w-2xl font-sans text-base text-white/85 leading-relaxed md:text-lg"
        >
          {heroLead}
        </motion.p>

        {/* Hızlı yanıt rozeti — pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm text-white/90 backdrop-blur-md ring-1 ring-white/15 transition-shadow hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Zap size={14} className="text-accent" />
          </motion.span>
          <span>{quickResponse}</span>
        </motion.div>
      </div>

      {/* Scroll indicator — bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-12 w-[1px] bg-gradient-to-b from-accent/80 to-transparent"
        />
      </motion.div>
    </section>
  );
}
