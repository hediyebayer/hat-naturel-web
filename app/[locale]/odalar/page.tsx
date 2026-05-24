import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { ROOMS } from '@/lib/data/rooms';
import { RoomCard } from '@/components/rooms/room-card';
import { RoomsHero } from '@/components/rooms/rooms-hero';
import { ButtonLink } from '@/components/ui/button';
import { RESERVATION_HREF } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Bungalov Evlerimiz — Hat Naturel Resort Sapanca',
  description:
    'Sapanca\'da doğanın içinde, modern konforla buluşan 7 farklı bungalov. Mor, Mavi, Sarı, Bej Köşkler, Turkuaz ve ikonik Üçgen evler.',
};

interface RoomsPageProps {
  params: { locale: string };
}

export default function RoomsPage({ params }: RoomsPageProps) {
  unstable_setRequestLocale(params.locale);

  return (
    <>
      <RoomsHero
        title="Doğanın Içindeki Köşkleriniz"
        subtitle={`Her biri farklı konseptle tasarlanmış 7 ayrı bungalov. Çift, küçük aile ya da kalabalık grup — Sapanca'da size en uygun kaçamağı bulun.`}
      />

      <section className="bg-neutral-50 py-16 md:py-24">
        <Container size="xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                Tüm Köşkler
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-900 md:text-4xl">
                Hangi köşk size daha yakın?
              </h2>
              <p className="mt-3 max-w-xl text-neutral-600">
                Her bungalovumuz Sapanca&apos;nın eşsiz doğasında müstakil bir
                alanda; modern donanım, sıcak ahşap dokular ve doğa manzarası.
              </p>
            </div>
            <ButtonLink href={`/${params.locale}${RESERVATION_HREF}`} size="lg">
              Hemen Rezervasyon Yap
            </ButtonLink>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ROOMS.map((room, i) => (
              <RoomCard key={room.slug} room={room} locale={params.locale} index={i} />
            ))}
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
            Size en uygun köşkü birlikte seçelim. Bir mesaj atın, telefonla
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
