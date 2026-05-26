'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedContactCardProps {
  icon: ReactNode;
  title: string;
  lines?: string[];
  primary?: { label: string; href: string };
  badge?: { icon: ReactNode; text: string };
  index?: number;
}

/**
 * İletişim kartı — Aman/Six Senses tarzı klas monokromatik tasarım.
 * - Lacivert primary-900 ikon kutusu + altın aksanlar
 * - Hover'da altın LED glow + hairline
 * - Subtle 3D lift + ikon rotate
 * - Konic gradient ring (hover'da görünür)
 */
export function AnimatedContactCard({
  icon,
  title,
  lines,
  primary,
  badge,
  index = 0,
}: AnimatedContactCardProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 1, 0.5, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_4px_20px_-8px_rgba(10,19,48,0.08)] transition-all duration-500 hover:border-accent/30 hover:shadow-[0_20px_50px_-15px_rgba(10,19,48,0.18)]"
    >
      {/* Altın LED corner glow — sağ üst (hover'da) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-14 h-28 w-28 rounded-full bg-accent/25 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
      />

      {/* Lacivert LED corner glow — sol alt (hover'da) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-14 -left-14 h-24 w-24 rounded-full bg-primary-500/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
      />

      {/* Altın hairline top (hover'da) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-4">
        {/* İkon kutusu — lacivert gradient + altın ikon */}
        <motion.span
          whileHover={{ scale: 1.08, rotate: 5 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-accent shadow-[0_8px_20px_-8px_rgba(10,19,48,0.5)] ring-1 ring-primary-800/40"
        >
          {/* İç altın halka — subtle */}
          <span
            aria-hidden
            className="absolute inset-1 rounded-xl ring-1 ring-inset ring-accent/20"
          />

          {/* Yumuşak konik gradient — hover'da dönen (Aman tarzı) */}
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-60"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.4) 90deg, transparent 180deg, transparent 360deg)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />

          {/* Asıl ikon */}
          <span className="relative">{icon}</span>
        </motion.span>

        <div className="min-w-0 flex-1">
          {/* Title — altın underline hover */}
          <h3 className="relative inline-block font-serif text-base font-semibold text-neutral-900">
            {title}
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-accent via-accent/70 to-transparent transition-all duration-500 group-hover:w-full"
            />
          </h3>

          {primary && (
            <a
              href={primary.href}
              className="mt-1.5 block break-words text-sm text-neutral-700 transition-colors hover:text-primary-700 sm:text-base"
            >
              {primary.label}
            </a>
          )}

          {lines?.map((line, i) => (
            <p
              key={i}
              className="mt-1.5 text-sm leading-relaxed text-neutral-600"
            >
              {line}
            </p>
          ))}

          {badge && (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/8 px-3 py-1 text-xs font-medium text-accent-dark transition-colors hover:bg-accent/15"
              style={{ background: 'rgba(212,175,55,0.08)' }}
            >
              {badge.icon}
              {badge.text}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
