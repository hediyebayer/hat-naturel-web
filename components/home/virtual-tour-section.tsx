import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Compass, ArrowRight } from 'lucide-react';
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
 * `preview=true` → anasayfa teaser
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
      className={preview ? 'bg-primary-900 py-20 text-white' : 'py-12'}
      aria-labelledby="virtual-tour-heading"
    >
      <Container>
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
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-neutral-900"
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
