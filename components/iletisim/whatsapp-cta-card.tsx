'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface WhatsappCtaCardProps {
  href: string;
  title: string;
  cta: string;
  lead: string;
  displayNumber: string;
}

/**
 * WhatsApp premium CTA kartı — animasyonlu, scroll'da reveal, hover'da:
 * - 3D lift + shadow expand
 * - Shine sweep animation
 * - Pulse ring on icon
 * - Animated arrow
 */
export function WhatsappCtaCard({
  href,
  title,
  cta,
  lead,
  displayNumber,
}: WhatsappCtaCardProps): React.ReactElement {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-6 text-white shadow-[0_10px_40px_-10px_rgba(37,211,102,0.5)] transition-shadow duration-300 hover:shadow-[0_20px_60px_-10px_rgba(37,211,102,0.8)]"
    >
      {/* Animated shine sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />

      {/* Top-right glow blob */}
      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
      />

      {/* Bottom-left subtle glow */}
      <span
        aria-hidden
        className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/5 blur-2xl"
      />

      <div className="relative flex items-center gap-4">
        {/* Icon container with pulse */}
        <span className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
          <motion.span
            animate={{ rotate: [0, -8, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
          >
            <MessageCircle size={26} strokeWidth={1.8} />
          </motion.span>
          {/* Pulse dot */}
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
          </span>
        </span>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
            {title}
          </p>
          <p className="mt-1 font-serif text-2xl font-light">{cta}</p>
          <p className="mt-1 text-sm text-white/90">{lead}</p>
        </div>
      </div>

      {/* Right number badge with arrow */}
      <motion.span
        whileHover={{ scale: 1.05 }}
        aria-hidden
        className="relative hidden flex-shrink-0 items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-medium ring-1 ring-white/20 transition-colors group-hover:bg-white/25 sm:inline-flex"
      >
        {displayNumber}
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowRight size={14} />
        </motion.span>
      </motion.span>
    </motion.a>
  );
}
