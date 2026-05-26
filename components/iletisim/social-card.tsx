'use client';

import { motion } from 'framer-motion';
import { Instagram, Facebook } from 'lucide-react';

interface SocialCardProps {
  followUsLabel: string;
  handle: string;
  instagramUrl: string;
  facebookUrl: string;
}

/**
 * Sosyal medya kartı — Aman/Six Senses tarzı klas monokromatik.
 * Lacivert gradient bg + altın aksanlar. Butonlar hover'da altın'a döner.
 */
export function SocialCard({
  followUsLabel,
  handle,
  instagramUrl,
  facebookUrl,
}: SocialCardProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -6 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-6 text-white shadow-[0_10px_40px_-15px_rgba(10,19,48,0.5)] transition-shadow duration-500 hover:shadow-[0_25px_60px_-15px_rgba(212,175,55,0.35)]"
    >
      {/* Altın corner glow — sağ üst (nefes alan) */}
      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent/20 blur-3xl"
      />

      {/* Daha derin lacivert corner — sol alt */}
      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -bottom-14 -left-14 h-32 w-32 rounded-full bg-primary-500/20 blur-3xl"
      />

      {/* Altın hairline top */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
      />

      {/* Altın hairline bottom */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-6 right-6 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="relative">
        {/* Kicker — minimal sade */}
        <div className="flex items-center gap-2">
          <motion.span
            aria-hidden
            animate={{ scaleX: [0, 1, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-px w-6 origin-left bg-accent"
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-light">
            {followUsLabel}
          </p>
        </div>

        {/* Handle — Playfair italic premium */}
        <p className="mt-3 font-serif text-xl italic text-white/95">
          {handle}
        </p>

        {/* Sosyal butonlar — minimal lacivert, hover'da altın */}
        <div className="mt-6 flex gap-3">
          <ClassyIconButton
            href={instagramUrl}
            label="Instagram"
            icon={<Instagram size={18} strokeWidth={1.8} />}
            delay={0.6}
          />
          <ClassyIconButton
            href={facebookUrl}
            label="Facebook"
            icon={<Facebook size={18} strokeWidth={1.8} />}
            delay={0.7}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ClassyIconButton({
  href,
  label,
  icon,
  delay,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}): React.ReactElement {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 text-white/90 backdrop-blur-sm transition-all duration-500 hover:border-accent/60 hover:bg-accent hover:text-primary-900 hover:shadow-[0_10px_25px_-5px_rgba(212,175,55,0.5)]"
    >
      {/* Shine sweep — hover'da */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      {icon}
    </motion.a>
  );
}
