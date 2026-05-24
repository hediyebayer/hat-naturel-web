import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import {
  CATEGORIES,
  TOTAL_HOUSE_COUNT,
  getRoomsByCategory,
} from '@/lib/data/rooms';
import { RoomCard } from '@/components/rooms/room-card';
import { RoomsHero } from '@/components/rooms/rooms-hero';
import { ButtonLink } from '@/components/ui/button';
import { RESERVATION_HREF } from '@/lib/constants';
import { Waves, Sparkles } from 'lucide-react';

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
    <>
      <RoomsHero
        title="Bungalov & Köşklerimiz"
        subtitle={`Her biri farklı konseptle tasarlanmış ${TOTAL_HOUSE_COUNT} müstakil ev — 4 farklı tipte. Çift, küçük aile ya da kalabalık grup için Sapanca'da size en uygun kaçamağı bulun.`}
      />

      <section className="bg-neutral-50 py-16 md:py-24">
        <Container size="xl">
          {/* Kategori özeti */}
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                Konaklama Tipleri
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-900 md:text-4xl">
                {TOTAL_HOUSE_COUNT} Ev, {CATEGORIES.length} Farklı Konsept
              </h2>
              <p className="mt-3 max-w-xl text-neutral-600">
                Tesisimizde toplam {TOTAL_HOUSE_COUNT} müstakil ev bulunmakta:{' '}
                {CATEGORIES.map((c, i) => (
                  <span key={c.id}>
                    <strong className="font-semibold text-neutral-800">
                      {c.totalCount} adet {c.title}
                    </strong>
                    {i < CATEGORIES.length - 1 ? ', ' : '.'}
                  </span>
                ))}
              </p>
            </div>
            <ButtonLink href={`/${params.locale}${RESERVATION_HREF}`} size="lg">
              Hemen Rezervasyon Yap
            </ButtonLink>
          </div>

          {/* Kategori başına gruplanmış grid */}
          <div className="space-y-20">
            {CATEGORIES.map((category) => {
              const rooms = getRoomsByCategory(category.id);
              if (rooms.length === 0) return null;

              return (
                <div key={category.id} className="scroll-mt-24" id={category.id}>
                  {/* Kategori başlığı */}
                  <div className="mb-8 flex flex-col gap-3 border-l-4 border-primary-500 pl-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
                          {category.title}
                        </h3>
                        <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
                          {category.totalCount} adet
                        </span>
                        {category.hasPool && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
                            <Waves className="h-3 w-3" />
                            Yaz Havuzlu
                          </span>
                        )}
                        {!category.hasPool && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700">
                            Havuzsuz
                          </span>
                        )}
                      </div>
                      <p className="mt-2 max-w-2xl text-neutral-600">
                        {category.subtitle}
                      </p>
                      {category.poolNote && (
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-700">
                          <Sparkles className="h-3 w-3" />
                          {category.poolNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bu kategoriye ait kartlar */}
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {rooms.map((room, i) => (
                      <RoomCard
                        key={room.slug}
                        room={room}
                        locale={params.locale}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA strip */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800 py-16 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_55%)]" />
        <Container className="relative text-center">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            Karar veremediniz mi?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">
            Size en uygun bungalovu birlikte seçelim. Bir mesaj atın, telefonla
            arayalım — tüm sorularınızı yanıtlayalım.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink
              href={`/${params.locale}/iletisim`}
              variant="outline"
              size="lg"
              className="!border-white !text-white hover:!bg-white/10"
            >
              Bize Ulaşın
            </ButtonLink>
            <ButtonLink href={`/${params.locale}${RESERVATION_HREF}`} size="lg">
              Rezervasyon Yap
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
