import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Compass, ArrowRight, Globe } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SITE_CONFIG } from '@/lib/constants';
import { VirtualTourBackground } from './virtual-tour-background';
import { RotatingGlobe } from './rotating-globe';

interface VirtualTourSectionProps {
  locale: string;
  preview?: boolean;
}

export function VirtualTourSection({
  locale,
  preview = false,
}: VirtualTourSectionProps): React.ReactElement {
  const t = useTranslations('virtualTour');

  return (
    <section
      className={`relative overflow-hidden ${preview ? 'py-28 md:py-32' : 'pt-32 pb-16 min-h-screen flex items-center bg-primary-900'}`}
      aria-labelledby="virtual-tour-heading"
    >
      {/* 5 katmanlı arka plan tema */}
      <VirtualTourBackground />

      {/* 3D Dönen Dünya (background dekorasyon) */}
      <RotatingGlobe />

      <Container size="xl" className="relative z-10">
        {preview ? (
          <div className="space-y-12">
            {/* TEXT ÜSTTE — sinematik genişlik için stack layout */}
            <div className="mx-auto max-w-3xl text-center text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-sm">
                <Globe size={14} className="animate-spin-slow" />
                Sanal Deneyim
              </span>
              <h2
                id="virtual-tour-heading"
                className="mt-6 font-serif text-4xl italic tracking-tight text-white drop-shadow-lg md:text-6xl"
              >
                {t('title')}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-300 md:text-lg">
                {t('subtitle')}
              </p>
            </div>

            {/* IFRAME — GENİŞ + SİNEMATİK 16:9 oran */}
            <div className="relative mx-auto max-w-6xl group">
              {/* Outer glow halo */}
              <div
                className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 opacity-50 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                style={{ animation: 'slow-spin 12s linear infinite' }}
              />

              {/* Rotating conic border (premium altın halka) */}
              <div
                className="absolute -inset-px rounded-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.6) 90deg, transparent 180deg, rgba(212,175,55,0.4) 270deg, transparent 360deg)',
                  animation: 'globe-rotate 8s linear infinite',
                }}
              />

              {/* Glassmorphism frame */}
              <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-primary-900/40 p-2 shadow-[0_0_80px_-20px_rgba(212,175,55,0.4)] backdrop-blur-md transition-all duration-500 group-hover:border-accent/60 group-hover:shadow-[0_0_100px_-15px_rgba(212,175,55,0.6)]">
                {/* Üst köşelerde dekoratif altın işaretler */}
                <div className="pointer-events-none absolute left-3 top-3 z-20 flex h-6 w-6 items-center justify-center">
                  <div className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-accent" />
                </div>
                <div className="pointer-events-none absolute right-3 top-3 z-20 flex h-6 w-6 items-center justify-center">
                  <div className="absolute right-0 top-0 h-2 w-2 border-r-2 border-t-2 border-accent" />
                </div>
                <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex h-6 w-6 items-center justify-center">
                  <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-accent" />
                </div>
                <div className="pointer-events-none absolute bottom-3 right-3 z-20 flex h-6 w-6 items-center justify-center">
                  <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-accent" />
                </div>

                {/* iframe — daha geniş ve yüksek (sinematik) */}
                <iframe
                  src={SITE_CONFIG.virtualTour.embedUrl}
                  title="Hat Naturel Resort 360° Sanal Tur"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-[480px] w-full rounded-2xl border-0 sm:h-[560px] md:h-[640px] lg:h-[700px]"
                />
              </div>

              {/* Alt orta — Compass meta */}
              <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-5">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
                  <Compass size={12} className="text-accent" />
                  360° Tam Panorama
                </div>
                <span className="hidden h-1 w-1 rounded-full bg-accent/40 sm:block" />
                <Link
                  href={`/${locale}/sanal-tur`}
                  className="group/cta inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-primary-900 shadow-[0_8px_24px_rgba(212,175,55,0.3)] transition-all hover:scale-105 hover:bg-accent-light hover:shadow-[0_12px_36px_rgba(212,175,55,0.5)]"
                >
                  Tesisi Keşfedin
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover/cta:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // FULL MODE (/sanal-tur sayfası)
          <div className="mx-auto flex w-full max-w-7xl flex-col">
            <div className="mb-10 text-center text-white">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-sm">
                <Globe size={14} className="animate-spin-slow" />
                Sanal Deneyim
              </span>
              <h1
                id="virtual-tour-heading"
                className="font-serif text-4xl italic tracking-tight text-white md:text-6xl"
              >
                {t('title')}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300">
                {t('subtitle')}
              </p>
            </div>
            <div className="group relative">
              <div
                className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-accent/0 via-accent/25 to-accent/0 opacity-60 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                style={{ animation: 'slow-spin 14s linear infinite' }}
              />
              <div
                className="absolute -inset-px rounded-3xl opacity-50"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.5) 90deg, transparent 180deg, rgba(212,175,55,0.3) 270deg, transparent 360deg)',
                  animation: 'globe-rotate 10s linear infinite',
                }}
              />
              <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-primary-800/30 p-1.5 shadow-[0_0_80px_-20px_rgba(212,175,55,0.3)] backdrop-blur-md transition-all duration-700">
                <iframe
                  src={SITE_CONFIG.virtualTour.embedUrl}
                  title="Hat Naturel Resort 360° Sanal Tur"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-[80vh] min-h-[600px] w-full rounded-2xl border-0"
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
