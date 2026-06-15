import { use } from "react";
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import {
  generateLodgingBusinessSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo/schema';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ButtonLink } from '@/components/ui/button';
import { HeroSection } from '@/components/home/hero-section';
import { ReservationBar } from '@/components/reservation/reservation-bar';
import { AboutSection } from '@/components/home/about-section';
import { MapSection } from '@/components/home/map-section';
import { VirtualTourSection } from '@/components/home/virtual-tour-section';
import { ROOMS, type Room } from '@/lib/data/rooms';
import { RoomDisplayCard } from '@/components/rooms/room-grid-display';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(props: HomePageProps): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.home',
  });

  const languages = Object.fromEntries(
    locales.map((loc) => [loc, `/${loc}`]),
  );

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `/${params.locale}`,
      type: 'website',
      images: [
        {
          url: '/images/brand/og-default.jpg',
          width: 1200,
          height: 1000,
          alt: 'Hat Naturel Resort Sapanca — doğayla iç içe bungalov tatili',
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

export default function HomePage(props: HomePageProps): React.ReactElement {
  const params = use(props.params);
  setRequestLocale(params.locale);
  const t = useTranslations('home');

  // JSON-LD structured data — LodgingBusiness + Organization + WebSite
  const lodgingSchema = generateLodgingBusinessSchema(params.locale as Locale);
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema(params.locale as Locale);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([lodgingSchema, orgSchema, websiteSchema]),
        }}
      />
      {/* Hero — drone manzarası + slow zoom + parallax + stagger fade-in */}
      <HeroSection locale={params.locale} />

      {/* Rezervasyon barı — hero'nun altına yapışık */}
      <ReservationBar locale={params.locale} />

      {/* About / Neden Hat Naturel — 'Doğanın Yanı Başında Bir Mola' */}
      <AboutSection />

      {/* Featured rooms — odalar sayfasındaki RoomDisplayCard ile aynı görünüm */}
      <section className="bg-white pt-8 pb-20">
        <Container size="xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
              Konaklama
            </span>
            <Heading level={2} className="mt-2">
              {t('roomsTitle')}
            </Heading>
            <Text muted className="mt-3">
              {t('roomsSubtitle')}
            </Text>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(['ucgen-2-1', 'ucgen-1-1', 'mor']
              .map((slug) => ROOMS.find((r) => r.slug === slug))
              .filter(Boolean) as Room[]).map((room, i) => (
              <RoomDisplayCard
                key={room.slug}
                room={room}
                locale={params.locale}
                index={i}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <ButtonLink
              href={`/${params.locale}/odalar`}
              variant="outline"
              size="lg"
            >
              {t('seeAllRooms')}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* 360° Sanal Tur */}
      <VirtualTourSection locale={params.locale} preview />

      {/* Konum / Harita */}
      <MapSection />
    </>
  );
}
