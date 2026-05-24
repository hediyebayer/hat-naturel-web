import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ButtonLink } from '@/components/ui/button';
import { HeroSection } from '@/components/home/hero-section';
import { AboutSection } from '@/components/home/about-section';
import { MapSection } from '@/components/home/map-section';
import { VirtualTourSection } from '@/components/home/virtual-tour-section';
import { ROOMS, type Room } from '@/lib/data/rooms';
import { RoomDisplayCard } from '@/components/rooms/room-grid-display';

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({
  params,
}: HomePageProps): React.ReactElement {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations('home');
  return (
    <>
      {/* Hero — drone manzarası + slow zoom + parallax + stagger fade-in */}
      <HeroSection locale={params.locale} />

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
              Tüm Bungalov & Köşkleri Gör →
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
