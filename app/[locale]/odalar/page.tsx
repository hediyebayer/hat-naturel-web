import { use } from "react";
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/lib/i18n/config';
import { Container } from '@/components/ui/container';
import { RoomsHero } from '@/components/rooms/rooms-hero';
import { RoomGridDisplay } from '@/components/rooms/room-grid-display';
import { ButtonLink } from '@/components/ui/button';
import { RESERVATION_HREF } from '@/lib/constants';
import { useTranslations } from 'next-intl';

export async function generateMetadata(props: RoomsPageProps): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.rooms',
  });

  const languages = Object.fromEntries(
    locales.map((loc) => [loc, `/${loc}/odalar`]),
  );

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/odalar`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `/${params.locale}/odalar`,
      type: 'website',
      images: [
        {
          url: '/images/brand/og-default.jpg',
          width: 1200,
          height: 1000,
          alt: 'Hat Naturel Resort Sapanca — bungalov ve köşkler',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/brand/og-default.jpg'],
    },
  };
}

interface RoomsPageProps {
  params: Promise<{ locale: string }>;
}

export default function RoomsPage(props: RoomsPageProps) {
  const params = use(props.params);
  setRequestLocale(params.locale);
  const t = useTranslations('rooms');

  return (
    // Tam beyaz arka plan
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-accent/30">
      <RoomsHero />
      {/* Odalar grid — her oda/kategori bir kart, köşelerden LED ışık */}
      <section className="relative bg-white py-20 md:py-28">
        <Container size="xl" className="relative">
          <RoomGridDisplay locale={params.locale} />
        </Container>
      </section>
      {/* CTA strip — beyaz tema */}
      <section className="relative overflow-hidden border-t border-neutral-200 bg-gradient-to-b from-white to-neutral-50 py-20 text-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08),transparent_50%)]" />
        <Container className="relative text-center">
          <h2 className="font-serif text-3xl font-bold text-neutral-900 md:text-5xl">
            {t('ctaTitle')}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
            {t('ctaText')}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink
              href={`/${params.locale}/iletisim`}
              variant="outline"
              size="lg"
              className="!border-neutral-300 !text-neutral-700 hover:!bg-neutral-100"
            >
              {t('ctaContact')}
            </ButtonLink>
            <ButtonLink
              href={`/${params.locale}${RESERVATION_HREF}`}
              size="lg"
              className="border-none bg-accent text-neutral-900 shadow-[0_8px_24px_rgba(212,175,55,0.4)] hover:bg-accent-light"
            >
              {t('ctaReserve')}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
