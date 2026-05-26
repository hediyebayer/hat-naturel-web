'use client';

import { motion } from 'framer-motion';

/**
 * İletişim sayfası form bölümü için floating dekoratif arka plan.
 * - 3 büyük soft glow blob (altın + lacivert)
 * - Subtle grid pattern (mobile gizli)
 * Hareketli ama dikkat dağıtmaz.
 */
export function FloatingDecorations(): React.ReactElement {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Blob 1 — altın, sol üst, çok yavaş drift */}
      <motion.div
        aria-hidden
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[-10rem] top-20 h-[30rem] w-[30rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Blob 2 — lacivert, sağ orta */}
      <motion.div
        aria-hidden
        animate={{
          x: [0, -30, 25, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute right-[-12rem] top-1/2 h-[32rem] w-[32rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(29,51,112,0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Blob 3 — altın, sol alt */}
      <motion.div
        aria-hidden
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -25, 30, 0],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute bottom-10 left-1/4 h-[26rem] w-[26rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 hidden opacity-[0.02] sm:block"
        style={{
          backgroundImage:
            'linear-gradient(rgba(29,51,112,1) 1px, transparent 1px), linear-gradient(90deg, rgba(29,51,112,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
