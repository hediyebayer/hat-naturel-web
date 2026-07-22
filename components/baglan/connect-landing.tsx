'use client';

import { motion } from 'framer-motion';
import { Globe, Instagram, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

interface ConnectLandingProps {
  kicker: string;
  title: string;
  subtitle: string;
  webLabel: string;
  instagramLabel: string;
  whatsappLabel: string;
  footer: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

interface LinkButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function LinkButton({ href, icon, label }: LinkButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variants={itemVariants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/15 bg-white/5 px-6 py-5 text-white backdrop-blur-sm transition-all duration-500 hover:border-accent/60 hover:bg-accent/10 hover:shadow-[0_12px_30px_-8px_rgba(212,175,55,0.35)]"
    >
      {/* Shine sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      {/* Icon container */}
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-accent transition-all duration-300 group-hover:border-accent/60 group-hover:bg-accent group-hover:text-primary-900">
        {icon}
      </span>

      {/* Label */}
      <span className="relative text-lg font-medium tracking-wide">{label}</span>

      {/* Arrow */}
      <span className="relative ml-auto text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
        →
      </span>
    </motion.a>
  );
}

export function ConnectLanding({
  kicker,
  title,
  subtitle,
  webLabel,
  instagramLabel,
  whatsappLabel,
  footer,
}: ConnectLandingProps) {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 px-4 py-12">
      {/* Corner glows */}
      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl"
      />
      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-primary-500/15 blur-3xl"
      />

      {/* Hairline top */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />

      {/* Main content card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-sm"
      >
        {/* Brand / Logo area */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          {/* Kicker */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-accent" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-light">
              {kicker}
            </p>
            <span className="h-px w-8 bg-accent" />
          </div>

          {/* Brand name */}
          <h1 className="font-serif text-2xl italic text-white">
            {title}
          </h1>

          {/* Hairline separator */}
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

          {/* Subtitle */}
          <p className="mt-4 text-sm text-white/60">{subtitle}</p>
        </motion.div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <LinkButton
            href={SITE_CONFIG.url}
            icon={<Globe size={20} strokeWidth={1.8} />}
            label={webLabel}
          />
          <LinkButton
            href={SITE_CONFIG.socialMedia.instagram}
            icon={<Instagram size={20} strokeWidth={1.8} />}
            label={instagramLabel}
          />
          <LinkButton
            href={whatsappUrl}
            icon={<MessageCircle size={20} strokeWidth={1.8} />}
            label={whatsappLabel}
          />
        </div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-10 text-center">
          <p className="text-xs text-white/60">{footer}</p>
          <p className="mt-1 text-xs text-white/50">{SITE_CONFIG.contact.addressShort}</p>
        </motion.div>
      </motion.div>

      {/* Hairline bottom */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />
    </div>
  );
}
