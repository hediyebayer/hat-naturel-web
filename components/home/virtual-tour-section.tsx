'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Camera, Eye, Aperture, Move3d } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { SITE_CONFIG } from '@/lib/constants';

interface VirtualTourSectionProps {
  locale: string;
  /** true ise sadece preview (anasayfa için), tam sayfada CTA gizlenir */
  preview?: boolean;
}

/**
 * 360° Sanal Tur bölümü. Google Street View embed.
 * `preview=true` → anasayfa teaser (animasyonlu lacivert arka plan)
 * `preview=false` → /sanal-tur sayfası (tam ekran iframe)
 */
export function VirtualTourSection({
  locale,
  preview = false,
}: VirtualTourSectionProps): React.ReactElement {
  const t = useTranslations('virtualTour');
  const tCommon = useTranslations('common');

  return (
    <section
      className={
        preview
          ? 'relative isolate overflow-hidden bg-primary-900 py-20 text-white'
          : 'pt-32 pb-16'
      }
      aria-labelledby="virtual-tour-heading"
    >
      {preview && <AnimatedBackground />}

      <Container className="relative z-10">
        {preview ? (
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-medium text-accent-light">
                <Compass size={14} /> 360°
              </span>
              <Heading
                id="virtual-tour-heading"
                level={2}
                className="!text-white mt-4"
              >
                {t('title')}
              </Heading>
              <Text variant="lead" className="mt-4 !text-neutral-300">
                {t('subtitle')}
              </Text>
              <Link
                href={`/${locale}/sanal-tur`}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-neutral-900"
              >
                {tCommon('seeDetails')}
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl shadow-strong">
              <iframe
                src={SITE_CONFIG.virtualTour.embedUrl}
                title="Hat Naturel Resort 360° Sanal Tur"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-[360px] w-full border-0 sm:h-[420px]"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <Heading id="virtual-tour-heading" level={1}>
                {t('title')}
              </Heading>
              <Text variant="lead" muted className="mt-3">
                {t('subtitle')}
              </Text>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-medium">
              <iframe
                src={SITE_CONFIG.virtualTour.embedUrl}
                title="Hat Naturel Resort 360° Sanal Tur"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-[70vh] min-h-[480px] w-full border-0"
              />
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Animasyonlu Arka Plan (sadece preview için, içerik arkasında)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 5 katmanlı animasyon:
 * 1. Conic dönen ışın (10s)
 * 2. Pulse radial glow (4s nefes)
 * 3. Floating ikon parçacıkları (compass/kamera, 8-15s yukarı süzülür)
 * 4. Grid pattern (subtle, derinlik)
 * 5. Vinyet (kenarları karart)
 *
 * Tüm katmanlar pointer-events-none, content z-index üstünde.
 * motion-reduce ile a11y desteği.
 */
function AnimatedBackground(): React.ReactElement {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
      {/* 1. Conic dönen ışın — belirgin altın ışınlar */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2 motion-reduce:hidden"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.18) 60deg, transparent 120deg, transparent 240deg, rgba(212,175,55,0.14) 300deg, transparent 360deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* 2. Pulse radial glow — ortada belirgin altın halo */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.05) 50%, transparent 75%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 3. Floating ikon parçacıkları */}
      <FloatingIcons />

      {/* 4. Grid pattern — belirgin dot grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* 5. Vinyet — kenarları karart */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,19,48,0.7)_100%)]" />
    </div>
  );
}

/**
 * Yukarı doğru süzülen şeffaf ikonlar (compass/kamera/eye/aperture).
 * Her ikon farklı pozisyon, hız, gecikme ile.
 */
function FloatingIcons(): React.ReactElement {
  const icons = [
    { Icon: Compass, x: '8%', y: '20%', size: 52, dur: 11, delay: 0 },
    { Icon: Camera, x: '85%', y: '70%', size: 42, dur: 14, delay: 1.5 },
    { Icon: Eye, x: '15%', y: '75%', size: 48, dur: 12, delay: 4 },
    { Icon: Aperture, x: '78%', y: '15%', size: 58, dur: 15, delay: 0.8 },
    { Icon: Move3d, x: '50%', y: '55%', size: 36, dur: 10, delay: 2.5 },
    { Icon: Compass, x: '45%', y: '85%', size: 44, dur: 13, delay: 5 },
    { Icon: Camera, x: '30%', y: '40%', size: 34, dur: 12, delay: 3 },
    { Icon: Aperture, x: '65%', y: '50%', size: 38, dur: 13, delay: 6 },
    { Icon: Eye, x: '92%', y: '40%', size: 30, dur: 11, delay: 7 },
  ];

  return (
    <>
      {icons.map(({ Icon, x, y, size, dur, delay }, i) => (
        <motion.div
          key={i}
          className="absolute text-accent/40 motion-reduce:hidden"
          style={{ left: x, top: y, filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.3))' }}
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            y: [-30, -140],
            rotate: [0, 360],
          }}
          transition={{
            duration: dur,
            delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </>
  );
}
