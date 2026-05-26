'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { SITE_CONFIG } from '@/lib/constants';

interface ContactHeroVideoProps {
  locale: string;
  title: string;
  heroLead: string;
  scrollCueLabel: string;
  whatsappCta: string;
  callCta: string;
}

/**
 * İletişim sayfası hero — ana sayfa hero tarzı:
 *  - Full-screen video background (loop, muted, autoplay)
 *  - Scroll parallax (içerik scroll'da fade out)
 *  - Stagger fade-in (eyebrow → başlık → alt başlık → CTA)
 *  - Lacivert overlay + radial vinyet (okunabilirlik)
 *  - Scroll indicator (zıplayan ChevronDown)
 */
export function ContactHeroVideo({
  locale: _locale,
  title,
  heroLead,
  scrollCueLabel,
  whatsappCta,
  callCta,
}: ContactHeroVideoProps): React.ReactElement {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-primary-900"
      aria-label={title}
    >
      {/* Arkaplan video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/videos/iletisim-bg-poster.jpg"
        aria-hidden="true"
      >
        <source src="/videos/iletisim-bg.mp4" type="video/mp4" />
      </video>

      {/* Lacivert overlay — okunabilirlik */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-primary-900/40 via-primary-900/30 to-primary-900/80"
      />

      {/* Yumuşak beyaz vinyet — premium dokunuş */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.08),transparent_70%)]"
      />

      {/* İçerik — stagger fade-in */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex h-full items-center justify-center text-center text-white"
      >
        <Container size="lg">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="block h-px w-16 bg-white/70" aria-hidden />
            <span className="mt-4 text-xs font-medium uppercase tracking-[0.4em] text-white/90">
              İletişim · Rezervasyon
            </span>
          </motion.div>

          {/* Başlık */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {title}
          </motion.h1>

          {/* Alt başlık */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-100 drop-shadow sm:text-lg lg:text-xl"
          >
            {heroLead}
          </motion.p>

          {/* CTA Butonlar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <ButtonLink
              href={buildWhatsAppUrl()}
              size="lg"
              className="!bg-white !text-primary-900 hover:!bg-neutral-100"
            >
              {whatsappCta}
            </ButtonLink>
            <ButtonLink
              href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
              variant="outline"
              size="lg"
              className="!border-white/70 !bg-transparent !text-white backdrop-blur hover:!bg-white/15"
            >
              {callCta}
            </ButtonLink>
          </motion.div>
        </Container>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest">
            {scrollCueLabel}
          </span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
