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
    // Kırık beyaz arka plan (warm ivory, Aman Resorts paleti)
    <main className="min-h-screen bg-[#FAF8F3] text-neutral-900 selection:bg-accent/30">
      <RoomsHero />

      {/* Kategoriler — tek sıra yan yana 4 kart */}
      <section className="relative bg-[#FAF8F3] py-20 md:py-28">
        <Container size="xl" className="relative">
          <CategorySection locale={params.locale} />
        </Container>
      </section>

      {/* CTA strip — kırık beyaz tema */}
      <section className="relative overflow-hidden border-t border-neutral-200/60 bg-gradient-to-b from-[#FAF8F3] to-[#F2EDE3] py-20 text-neutral-900">
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
