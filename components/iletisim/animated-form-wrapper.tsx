'use client';

import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface AnimatedFormWrapperProps {
  reachUsKicker: string;
  reachUsLead: string;
  children: ReactNode;
}

/**
 * Form sarmalayıcı — animasyonlu kicker + heading + sparkle dekorasyon.
 * Form border gradient + altın corner sparkle'lar (subtle hareket).
 */
export function AnimatedFormWrapper({
  reachUsKicker,
  reachUsLead,
  children,
}: AnimatedFormWrapperProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      {/* Kicker */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-3"
      >
        <motion.span
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Send size={18} className="text-accent" />
        </motion.span>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-700">
          {reachUsKicker}
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-3 font-serif text-3xl font-bold tracking-tight text-neutral-900"
      >
        {reachUsLead}
      </motion.h2>

      {/* Form wrapper — animated gradient border + corner sparkles */}
      <div className="relative mt-8">
        {/* Animated gradient border ring */}
        <motion.div
          aria-hidden
          animate={{
            background: [
              'linear-gradient(0deg, rgba(212,175,55,0.4), rgba(29,51,112,0.3), rgba(212,175,55,0.4))',
              'linear-gradient(120deg, rgba(212,175,55,0.4), rgba(29,51,112,0.3), rgba(212,175,55,0.4))',
              'linear-gradient(240deg, rgba(212,175,55,0.4), rgba(29,51,112,0.3), rgba(212,175,55,0.4))',
              'linear-gradient(360deg, rgba(212,175,55,0.4), rgba(29,51,112,0.3), rgba(212,175,55,0.4))',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-3xl p-[1.5px]"
        >
          <div className="h-full w-full rounded-3xl bg-white" />
        </motion.div>

        {/* Corner sparkles */}
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-2 -top-2 z-10"
        >
          <Sparkles
            size={16}
            className="text-accent drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
          />
        </motion.div>
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5], rotate: [0, -180, -360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-1 -right-1 z-10"
        >
          <Sparkles size={12} className="text-accent/70" />
        </motion.div>

        {/* Form içerik */}
        <div className="relative rounded-3xl bg-white p-6 shadow-[0_20px_60px_-20px_rgba(10,19,48,0.15)] sm:p-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
