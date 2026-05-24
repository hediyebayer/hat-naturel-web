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

      {/* Kategoriler — yan yana 4 kart + scroll'da detay */}
      <section className="relative z-10 bg-[#0B132B] py-20 md:py-28">
        <Container size="xl" className="relative">
          <CategorySection locale={params.locale} />
        </Container>
      </section>

      {/* CTA strip */}
      <section className="relative z-10 overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0B132B] to-[#07091a] py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.05),transparent_50%)]" />
        <Container className="relative text-center">
          <h2 className="font-serif text-3xl font-bold text-white md:text-5xl">
            Karar veremediniz mi?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
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
            <ButtonLink
              href={`/${params.locale}${RESERVATION_HREF}`}
              size="lg"
              className="border-none bg-accent text-[#0B132B] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-accent-light"
            >
              Rezervasyon Yap
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
