import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { TOTAL_HOUSE_COUNT } from '@/lib/data/rooms';
import { RoomsHero } from '@/components/rooms/rooms-hero';
import { CategorySection } from '@/components/rooms/category-section';
import { ButtonLink } from '@/components/ui/button';
import { RESERVATION_HREF } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Bungalov & Köşklerimiz — Hat Naturel Resort Sapanca',
  description: `Sapanca'da doğanın içinde ${TOTAL_HOUSE_COUNT} müstakil bungalov ve köşk. 3 Üçgen 2+1, 1 Üçgen 1+1, 2 Köşk 1+1 (havuzsuz), 2 Köşk 2+1 (yaz havuzlu).`,
};

interface RoomsPageProps {
  params: { locale: string };
}

export default function RoomsPage({ params }: RoomsPageProps) {
  unstable_setRequestLocale(params.locale);

  return (
    <main className="min-h-screen bg-[#0B132B] text-white selection:bg-accent/30">
      <RoomsHero />

      {/* Main Content Section */}
      <section className="relative bg-[#0B132B] py-16 md:py-24 z-10">
        <Container size="xl" className="relative">
          {/* Reservation Banner / Header */}
          <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7FE5F5]">
                Konaklama Deneyimi
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-white md:text-4xl">
                Doğanın İçinde Konfor
              </h2>
              <p className="mt-3 max-w-xl text-white/70 font-sans tracking-wide">
                Sapanca&apos;nın huzur veren atmosferinde, size özel tasarlanmış {TOTAL_HOUSE_COUNT} farklı evimizden birini seçerek tatilinizi unutulmaz kılın.
              </p>
            </div>
            <ButtonLink href={`/${params.locale}${RESERVATION_HREF}`} size="lg" className="bg-accent text-[#0B132B] hover:bg-accent-light border-none shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Hemen Rezervasyon Yap
            </ButtonLink>
          </div>

          {/* Categories & Rooms */}
          <CategorySection locale={params.locale} />
        </Container>
      </section>

      {/* CTA strip */}
      <section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0B132B] to-[#0A1128] py-20 text-white z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.05),transparent_50%)]" />
        <Container className="relative text-center">
          <h2 className="font-serif text-3xl font-bold md:text-5xl text-white">
            Karar veremediniz mi?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-white/70 text-lg">
            Size en uygun bungalovu birlikte seçelim. Bir mesaj atın, telefonla
            arayalım — tüm sorularınızı yanıtlayalım.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink
              href={`/${params.locale}/iletisim`}
              variant="outline"
              size="lg"
              className="!border-white/20 !text-white hover:!bg-white/5"
            >
              Bize Ulaşın
            </ButtonLink>
            <ButtonLink href={`/${params.locale}${RESERVATION_HREF}`} size="lg" className="bg-accent text-[#0B132B] hover:bg-accent-light border-none shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              Rezervasyon Yap
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
