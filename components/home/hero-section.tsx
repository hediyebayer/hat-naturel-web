'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { RESERVATION_HREF } from '@/lib/constants';

interface HeroSectionProps {
  locale: string;
}

/**
 * Anasayfa hero bölümü.
 *
 * Animasyonlar:
 *  1. Görsel slow-zoom: ilk yüklendiğinde 1.08 → 1.0 (8 saniye)
 *  2. Parallax: sayfa scroll'da görsel yukarı kayar (50% scroll'a kadar -120px)
 *  3. Stagger fade-in: eyebrow → başlık → alt başlık → CTA sırayla (0.2s aralık)
 *  4. Scroll indicator: alt ortada zıplayan ok
 *
 * Görsel: DJI drone shot, Sapanca gölü manzaralı tesisimiz.
 */
export function HeroSection({ locale }: HeroSectionProps): React.ReactElement {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);

  // Parallax: section ekran içindeyken görseli yukarı kaydır
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-primary-900"
      aria-label="Hero — Hat Naturel Sapanca"
    >
      {/* Arkaplan görseli — slow zoom + parallax */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: imageY }}
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/images/home/hero-sapanca.jpg"
          alt="Hat Naturel Sapanca — drone manzarası, üçgen bungalov tesisi ve Sapanca gölü"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
        {/* Lacivert overlay — okunabilirlik */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-primary-900/40 via-primary-900/30 to-primary-900/80"
        />
        {/* Altın vinyet — premium dokunuş */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(212,175,55,0.10),transparent_70%)]"
        />
      </motion.div>

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
            <span className="block h-px w-16 bg-accent" aria-hidden />
            <span className="mt-4 text-xs font-medium uppercase tracking-[0.4em] text-accent-light">
              Sapanca · Bungalov
            </span>
          </motion.div>

          {/* Başlık */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {t('heroTitle')}
          </motion.h1>

          {/* Alt başlık */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-100 drop-shadow sm:text-lg lg:text-xl"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* CTA Butonlar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <ButtonLink
              href={`/${locale}${RESERVATION_HREF}`}
              size="lg"
              className="!bg-accent !text-primary-900 hover:!bg-accent-light"
            >
              {t('heroCta')}
            </ButtonLink>
            <ButtonLink
              href={`/${locale}/odalar`}
              variant="outline"
              size="lg"
              className="!border-white/70 !bg-white/10 !text-white backdrop-blur hover:!bg-white/20"
            >
              {t('roomsTitle')}
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
            Keşfedin
          </span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
