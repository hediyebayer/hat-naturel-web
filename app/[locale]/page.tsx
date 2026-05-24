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
import { ROOMS } from '@/lib/data/rooms';
import { RoomCard } from '@/components/rooms/room-card';

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

      {/* Featured rooms — lacivert zemin, beyaz text */}
      <section className="bg-primary-900 py-20 text-white">
        <Container size="xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Konaklama
            </span>
            <Heading level={2} className="mt-2 !text-white">
              {t('roomsTitle')}
            </Heading>
            <Text className="mt-3 !text-white/80">
              {t('roomsSubtitle')}
            </Text>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ROOMS.filter((r) => r.featured).map((room, i) => (
              <RoomCard
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
              className="!border-white/60 !text-white hover:!bg-white hover:!text-primary-900"
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
