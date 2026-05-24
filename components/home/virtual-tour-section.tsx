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
      className={`relative overflow-hidden ${preview ? 'py-24' : 'pt-32 pb-16 min-h-screen flex items-center bg-primary-900'}`}
      aria-labelledby="virtual-tour-heading"
    >
      <VirtualTourBackground />
      
      <Container className="relative z-10">
        {preview ? (
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-accent uppercase backdrop-blur-sm">
                <Compass size={14} /> Sanal Deneyim
              </span>
              <h2
                id="virtual-tour-heading"
                className="mt-6 text-4xl md:text-5xl font-serif italic tracking-tight text-white drop-shadow-sm"
              >
                {t('title')}
              </h2>
              <p className="mt-4 text-lg text-neutral-300 max-w-lg leading-relaxed">
                {t('subtitle')}
              </p>
              <Link
                href={`/${locale}/sanal-tur`}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-primary-900 transition-all hover:bg-accent-light hover:scale-105"
              >
                Tesisi Keşfedin
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative group">
              {/* Conic-gradient rotating border & Glassmorphism frame */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" style={{ animation: 'slow-spin 8s linear infinite' }} />
              <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-primary-800/50 backdrop-blur-md shadow-[0_0_40px_-10px_rgba(212,175,55,0.2)] p-1 transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-[0_0_50px_-10px_rgba(212,175,55,0.4)]">
                <iframe
                  src={SITE_CONFIG.virtualTour.embedUrl}
                  title="Hat Naturel Resort 360° Sanal Tur"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-[400px] w-full rounded-xl border-0 sm:h-[480px]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto flex flex-col h-[85vh]">
            <div className="text-center mb-10 text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-accent uppercase backdrop-blur-sm mb-4">
                <Compass size={14} /> Sanal Deneyim
              </span>
              <h1 id="virtual-tour-heading" className="text-4xl md:text-5xl font-serif italic tracking-tight text-white">
                {t('title')}
              </h1>
              <p className="mt-3 text-lg text-neutral-300 max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </div>
            <div className="relative flex-1 group min-h-[500px]">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md" style={{ animation: 'slow-spin 12s linear infinite' }} />
              <div className="relative h-full overflow-hidden rounded-3xl border border-accent/20 bg-primary-800/30 backdrop-blur-md shadow-[0_0_60px_-15px_rgba(212,175,55,0.2)] p-1.5 transition-all duration-700">
                <iframe
                  src={SITE_CONFIG.virtualTour.embedUrl}
                  title="Hat Naturel Resort 360° Sanal Tur"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-full w-full rounded-2xl border-0"
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
