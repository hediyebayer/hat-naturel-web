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

            {/* iframe — sağ, sinematik 16:9 */}
            <div className="group relative">
              {/* Outer rotating conic border (subtle altın halka) */}
              <div
                className="absolute -inset-px rounded-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.5) 90deg, transparent 180deg, rgba(212,175,55,0.3) 270deg, transparent 360deg)',
                  animation: 'globe-rotate 8s linear infinite',
                }}
              />

              {/* Glassmorphism frame */}
              <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-primary-800/50 p-1 shadow-[0_0_40px_-10px_rgba(212,175,55,0.25)] backdrop-blur-md transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.45)]">
                {/* 4 köşede dekoratif altın L marker'lar */}
                <span className="pointer-events-none absolute left-2 top-2 z-20 h-3 w-3 border-l-2 border-t-2 border-accent" />
                <span className="pointer-events-none absolute right-2 top-2 z-20 h-3 w-3 border-r-2 border-t-2 border-accent" />
                <span className="pointer-events-none absolute bottom-2 left-2 z-20 h-3 w-3 border-b-2 border-l-2 border-accent" />
                <span className="pointer-events-none absolute bottom-2 right-2 z-20 h-3 w-3 border-b-2 border-r-2 border-accent" />

                {/* iframe — sinematik 16:9 (kare değil, daha geniş) */}
                <div className="relative aspect-video">
                  <iframe
                    src={SITE_CONFIG.virtualTour.embedUrl}
                    title="Hat Naturel Resort 360° Sanal Tur"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full rounded-xl border-0"
                  />
                </div>
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
            <div className="group relative">
              <div
                className="absolute -inset-px rounded-3xl opacity-50"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.5) 90deg, transparent 180deg, rgba(212,175,55,0.3) 270deg, transparent 360deg)',
                  animation: 'globe-rotate 10s linear infinite',
                }}
              />
              <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-primary-800/30 p-1.5 shadow-[0_0_80px_-20px_rgba(212,175,55,0.3)] backdrop-blur-md">
                <iframe
                  src={SITE_CONFIG.virtualTour.embedUrl}
                  title="Hat Naturel Resort 360° Sanal Tur"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-[78vh] min-h-[560px] w-full rounded-2xl border-0"
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
