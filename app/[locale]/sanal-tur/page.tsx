import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { locales } from '@/lib/i18n/config';
import { FloatingIconsBg } from '@/components/sanal-tur/floating-icons-bg';
import { SanalTurHero } from '@/components/sanal-tur/sanal-tur-hero';
import { LiveTourSection } from '@/components/sanal-tur/live-tour-section';
import { LocationSection } from '@/components/sanal-tur/location-section';
import { MapExploreSection } from '@/components/sanal-tur/map-explore-section';
import { GuestPhotosSection } from '@/components/sanal-tur/guest-photos-section';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.virtualTour',
  });

  const languages = Object.fromEntries(
    locales.map((loc) => [loc, `/${loc}/sanal-tur`]),
  );

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/sanal-tur`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `/${params.locale}/sanal-tur`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function VirtualTourPage({
  params,
}: PageProps): React.ReactElement {
  unstable_setRequestLocale(params.locale);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-900">
      {/* Beyaz arka plan + hareketli floating ikonlar */}
      <FloatingIconsBg />

      {/* Sayfa içeriği */}
      <div className="relative z-10">
        <SanalTurHero />

        <div id="canli-tur" className="scroll-mt-24">
          <LiveTourSection />
        </div>

        <div id="konum" className="scroll-mt-24">
          <LocationSection />
        </div>

        <div id="harita-gez" className="scroll-mt-24">
          <MapExploreSection />
        </div>

        <div id="galeri" className="scroll-mt-24">
          <GuestPhotosSection />
        </div>
      </div>
    </main>
  );
}
