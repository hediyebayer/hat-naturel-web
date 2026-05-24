import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Compass, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SITE_CONFIG } from '@/lib/constants';
import { VirtualTourBackground } from './virtual-tour-background';

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
      className={`relative overflow-hidden ${
        preview
          ? 'py-24'
          : 'min-h-screen flex items-center pt-32 pb-16 bg-primary-900'
      }`}
      aria-labelledby="virtual-tour-heading"
    >
      {/* 3D animasyonlu arka plan tema (perspective grid + orbit rings + aurora) */}
      <VirtualTourBackground />

      <Container className="relative z-10">
        {preview ? (
          // PREVIEW (anasayfa) — text sol, iframe sağ (sinematik 16:9)
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
            {/* Text — sol */}
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
                <Compass size={14} />
                Sanal Deneyim
              </span>
              <h2
                id="virtual-tour-heading"
                className="mt-6 font-serif text-4xl italic tracking-tight text-white drop-shadow-sm md:text-5xl"
              >
                {t('title')}
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-neutral-300 md:text-lg">
                {t('subtitle')}
              </p>
              <Link
                href={`/${locale}/sanal-tur`}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-primary-900 shadow-[0_8px_24px_rgba(212,175,55,0.3)] transition-all hover:scale-105 hover:bg-accent-light"
              >
                Tesisi Keşfedin
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* iframe — sağ, BUNGALOV temalı çerçeve */}
            <div className="group relative">
              {/* Üçgen çatı silüeti (bungalov referansı, üst orta) */}
              <div className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2">
                <svg
                  width="80"
                  height="32"
                  viewBox="0 0 80 32"
                  fill="none"
                  className="drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                >
                  <path
                    d="M40 2 L74 30 L6 30 Z"
                    fill="url(#roofGrad)"
                    stroke="rgba(212,175,55,0.8)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d2817" />
                      <stop offset="100%" stopColor="#5a3d23" />
                    </linearGradient>
                  </defs>
                  <line
                    x1="40"
                    y1="6"
                    x2="40"
                    y2="28"
                    stroke="rgba(212,175,55,0.5)"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              {/* Ahşap dokulu çerçeve (bungalov ahşap kaplama gibi) */}
              <div
                className="relative overflow-hidden rounded-2xl p-[10px] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5)] transition-shadow duration-500 group-hover:shadow-[0_30px_70px_-15px_rgba(212,175,55,0.35)]"
                style={{
                  background:
                    'linear-gradient(135deg, #3d2817 0%, #5a3d23 20%, #6b4a2a 40%, #5a3d23 60%, #3d2817 100%)',
                  backgroundSize: '200% 200%',
                }}
              >
                {/* Altın iç çerçeve (lambri detayı) */}
                <div className="relative overflow-hidden rounded-xl border-2 border-accent/40 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.2)]">
                  {/* 4 köşede altın ornament */}
                  <span className="pointer-events-none absolute left-1.5 top-1.5 z-20 h-4 w-4">
                    <span className="absolute left-0 top-0 h-full w-[2px] bg-accent" />
                    <span className="absolute left-0 top-0 h-[2px] w-full bg-accent" />
                    <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <span className="pointer-events-none absolute right-1.5 top-1.5 z-20 h-4 w-4">
                    <span className="absolute right-0 top-0 h-full w-[2px] bg-accent" />
                    <span className="absolute right-0 top-0 h-[2px] w-full bg-accent" />
                    <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <span className="pointer-events-none absolute bottom-1.5 left-1.5 z-20 h-4 w-4">
                    <span className="absolute bottom-0 left-0 h-full w-[2px] bg-accent" />
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-accent" />
                    <span className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <span className="pointer-events-none absolute bottom-1.5 right-1.5 z-20 h-4 w-4">
                    <span className="absolute bottom-0 right-0 h-full w-[2px] bg-accent" />
                    <span className="absolute bottom-0 right-0 h-[2px] w-full bg-accent" />
                    <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>

                  {/* Alt orta — bungalov label */}
                  <div className="pointer-events-none absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/40 bg-primary-900 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-accent shadow-md">
                    🏡 Hat Naturel Bungalov
                  </div>

                  {/* iframe */}
                  <div className="relative aspect-video">
                    <iframe
                      src={SITE_CONFIG.virtualTour.embedUrl}
                      title="Hat Naturel Resort 360° Sanal Tur"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                </div>

                {/* Ahşap doku — yatay damar simülasyonu (subtle) */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          // FULL MODE — /sanal-tur sayfası, tam geniş
          <div className="mx-auto flex w-full max-w-7xl flex-col">
            <div className="mb-10 text-center text-white">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-sm">
                <Compass size={14} />
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
            {/* BUNGALOV temalı çerçeve — full mode */}
            <div className="group relative">
              {/* Üçgen çatı (üst orta) */}
              <div className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2">
                <svg
                  width="110"
                  height="42"
                  viewBox="0 0 110 42"
                  fill="none"
                  className="drop-shadow-[0_3px_10px_rgba(212,175,55,0.4)]"
                >
                  <path
                    d="M55 3 L103 38 L7 38 Z"
                    fill="url(#roofGradFull)"
                    stroke="rgba(212,175,55,0.8)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="roofGradFull" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d2817" />
                      <stop offset="100%" stopColor="#5a3d23" />
                    </linearGradient>
                  </defs>
                  <line
                    x1="55"
                    y1="8"
                    x2="55"
                    y2="36"
                    stroke="rgba(212,175,55,0.5)"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              <div
                className="relative overflow-hidden rounded-3xl p-3 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.6)]"
                style={{
                  background:
                    'linear-gradient(135deg, #3d2817 0%, #5a3d23 20%, #6b4a2a 40%, #5a3d23 60%, #3d2817 100%)',
                }}
              >
                <div className="relative overflow-hidden rounded-2xl border-2 border-accent/40 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.2)]">
                  {/* Köşe ornamentleri */}
                  <span className="pointer-events-none absolute left-2 top-2 z-20 h-5 w-5">
                    <span className="absolute left-0 top-0 h-full w-[2px] bg-accent" />
                    <span className="absolute left-0 top-0 h-[2px] w-full bg-accent" />
                    <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <span className="pointer-events-none absolute right-2 top-2 z-20 h-5 w-5">
                    <span className="absolute right-0 top-0 h-full w-[2px] bg-accent" />
                    <span className="absolute right-0 top-0 h-[2px] w-full bg-accent" />
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <span className="pointer-events-none absolute bottom-2 left-2 z-20 h-5 w-5">
                    <span className="absolute bottom-0 left-0 h-full w-[2px] bg-accent" />
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-accent" />
                    <span className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <span className="pointer-events-none absolute bottom-2 right-2 z-20 h-5 w-5">
                    <span className="absolute bottom-0 right-0 h-full w-[2px] bg-accent" />
                    <span className="absolute bottom-0 right-0 h-[2px] w-full bg-accent" />
                    <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>

                  <iframe
                    src={SITE_CONFIG.virtualTour.embedUrl}
                    title="Hat Naturel Resort 360° Sanal Tur"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="h-[78vh] min-h-[560px] w-full border-0"
                  />
                </div>

                <div
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
