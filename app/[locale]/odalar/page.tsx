import type { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/lib/i18n/config';
import { Container } from '@/components/ui/container';
import { RoomsHero } from '@/components/rooms/rooms-hero';
import { RoomGridDisplay } from '@/components/rooms/room-grid-display';
import { ButtonLink } from '@/components/ui/button';
import { RESERVATION_HREF } from '@/lib/constants';

export async function generateMetadata({
  params,
}: RoomsPageProps): Promise<Metadata> {
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

interface RoomsPageProps {
  params: { locale: string };
}

export default function RoomsPage({ params }: RoomsPageProps) {
  unstable_setRequestLocale(params.locale);

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
            Karar veremediniz mi?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
            Size en uygun bungalovu birlikte seçelim. Bir mesaj atın, telefonla
            arayalım — tüm sorularınızı yanıtlayalım.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink
              href={`/${params.locale}/iletisim`}
              variant="outline"
              size="lg"
              className="!border-neutral-300 !text-neutral-700 hover:!bg-neutral-100"
            >
              Bize Ulaşın
            </ButtonLink>
            <ButtonLink
              href={`/${params.locale}${RESERVATION_HREF}`}
              size="lg"
              className="border-none bg-accent text-neutral-900 shadow-[0_8px_24px_rgba(212,175,55,0.4)] hover:bg-accent-light"
            >
              Rezervasyon Yap
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
