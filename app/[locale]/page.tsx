import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ButtonLink } from '@/components/ui/button';
import { MapSection } from '@/components/home/map-section';
import { VirtualTourSection } from '@/components/home/virtual-tour-section';
import { RESERVATION_HREF } from '@/lib/constants';

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
      {/* Hero (placeholder — gerçek görsel sonra) */}
      <section
        className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700"
        aria-label="Hero"
      >
        {/* Doku katmanı — lacivert kumaş hissi */}
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:3px_3px]" />
        {/* Vinyet ışık — ortadan dışa */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.15),transparent_60%)]" />
        <Container className="relative z-10 text-center text-white">
          {/* Altın üst çizgi — boutique vurgu */}
          <span className="mx-auto block h-px w-16 bg-accent" aria-hidden />
          <span className="mt-4 inline-block text-xs uppercase tracking-[0.3em] text-accent-light">
            Sapanca Bungalov
          </span>
          <Heading
            level={1}
            className="!text-white drop-shadow-lg max-w-3xl mx-auto"
          >
            {t('heroTitle')}
          </Heading>
          <Text
            variant="lead"
            className="mt-6 max-w-2xl mx-auto !text-neutral-100"
          >
            {t('heroSubtitle')}
          </Text>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink
              href={`/${params.locale}${RESERVATION_HREF}`}
              size="lg"
              className="!bg-accent !text-primary-900 hover:!bg-accent-light"
            >
              {t('heroCta')}
            </ButtonLink>
            <ButtonLink
              href={`/${params.locale}/odalar`}
              variant="outline"
              size="lg"
              className="!border-white/60 !text-white hover:!bg-white/10"
            >
              {t('roomsTitle')}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* About teaser */}
      <section className="py-20">
        <Container size="lg">
          <div className="text-center">
            <Heading level={2}>{t('aboutTitle')}</Heading>
            <Text variant="lead" muted className="mt-4 max-w-2xl mx-auto">
              {t('aboutLead')}
            </Text>
            <Text className="mt-6 max-w-3xl mx-auto" muted>
              {t('aboutBody')}
            </Text>
          </div>
        </Container>
      </section>

      {/* Placeholder — M2'de oda kartları */}
      <section className="bg-neutral-100 py-20">
        <Container className="text-center">
          <Heading level={2}>{t('roomsTitle')}</Heading>
          <Text muted className="mt-3">
            {t('roomsSubtitle')}
          </Text>
          <Text className="mt-10 italic" muted>
            (M2 — Oda kartları yakında)
          </Text>
        </Container>
      </section>

      {/* 360° Sanal Tur */}
      <VirtualTourSection locale={params.locale} preview />

      {/* Konum / Harita */}
      <MapSection />
    </>
  );
}
