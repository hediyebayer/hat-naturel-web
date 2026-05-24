import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { ROOMS, getRoomBySlug, getRelatedRooms } from '@/lib/data/rooms';
import { RoomGallery } from '@/components/rooms/room-gallery';
import { AmenityList } from '@/components/rooms/amenity-list';
import { RoomDisplayCard } from '@/components/rooms/room-grid-display';
import { RESERVATION_HREF } from '@/lib/constants';
import {
  Maximize2,
  Users,
  BedDouble,
  Bath,
  UserPlus,
  ChevronRight,
} from 'lucide-react';

interface PageProps {
  params: { locale: string; slug: string };
}

export function generateStaticParams() {
  return ROOMS.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const room = getRoomBySlug(params.slug);
  if (!room) return { title: 'Oda bulunamadı' };
  return {
    title: `${room.name} — Hat Naturel Resort Sapanca`,
    description: room.description,
    openGraph: {
      title: room.name,
      description: room.description,
      images: room.images.slice(0, 1),
    },
  };
}

export default function RoomDetailPage({ params }: PageProps) {
  unstable_setRequestLocale(params.locale);
  const room = getRoomBySlug(params.slug);
  if (!room) notFound();

  const related = getRelatedRooms(room.slug, 3);

  return (
    <>
      {/* BREADCRUMB strip */}
      <section className="border-b border-neutral-200 bg-white py-4">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <a href={`/${params.locale}`} className="hover:text-primary-700">
              Anasayfa
            </a>
            <ChevronRight className="h-4 w-4" />
            <a
              href={`/${params.locale}/odalar`}
              className="hover:text-primary-700"
            >
              Odalar
            </a>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-neutral-800">{room.name}</span>
          </nav>
        </Container>
      </section>

      {/* HERO + GALLERY */}
      <section className="bg-white py-10 md:py-16">
        <Container size="xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
                  {room.specs.bedrooms === 1 ? '1+1' : '2+1'} Bungalov
                </span>
                {room.featured && (
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-dark">
                    ⭐ Öne Çıkan
                  </span>
                )}
              </div>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
                {room.name}
              </h1>
              <p className="mt-2 text-lg text-neutral-600">{room.tagline}</p>
            </div>
            <div className="flex gap-3">
              <ButtonLink
                href={`/${params.locale}/iletisim`}
                variant="outline"
                size="lg"
              >
                Bilgi Al
              </ButtonLink>
              <ButtonLink
                href={`/${params.locale}${RESERVATION_HREF}?room=${room.slug}`}
                size="lg"
              >
                Rezerve Et
              </ButtonLink>
            </div>
          </div>

          {/* Gallery */}
          <RoomGallery images={room.images} alt={room.name} />

          {/* SPECS strip */}
          <div className="mt-8 grid grid-cols-2 gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-soft sm:grid-cols-5">
            <SpecBig
              icon={<Maximize2 className="h-5 w-5" />}
              label="Alan"
              value={`${room.specs.area} m²`}
            />
            <SpecBig
              icon={<Users className="h-5 w-5" />}
              label="Kapasite"
              value={`${room.specs.guests} kişi`}
            />
            <SpecBig
              icon={<UserPlus className="h-5 w-5" />}
              label="Ek Yatak"
              value={`+${room.specs.extraGuests}`}
            />
            <SpecBig
              icon={<BedDouble className="h-5 w-5" />}
              label="Yatak Odası"
              value={`${room.specs.bedrooms}`}
            />
            <SpecBig
              icon={<Bath className="h-5 w-5" />}
              label="Banyo"
              value={`${room.specs.bathrooms}`}
            />
          </div>
        </Container>
      </section>

      {/* CONTENT: description + amenities */}
      <section className="py-14 md:py-20">
        <Container size="xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            {/* Description */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                Hakkında
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-900 md:text-4xl">
                Doğanın içinde ev konforu
              </h2>
              <p className="mt-5 text-base leading-relaxed text-neutral-700 md:text-lg">
                {room.longDescription}
              </p>

              {/* Yatak Düzeni / Kapasite Bilgisi (varsa) */}
              {room.bedConfig && room.bedConfig.length > 0 && (
                <div className="mt-8 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl animate-bounce-slow">🛏️</span>
                    <h3 className="font-serif text-lg font-bold text-primary-900">
                      Yatak Düzeni & Kapasite
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {room.bedConfig.map((line, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-primary-900"
                      >
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 rounded-2xl border-l-4 border-primary-500 bg-primary-50/60 p-5">
                <p className="text-sm text-primary-900">
                  💡 <strong>İpucu:</strong> Hafta içi tarihler daha sakin ve daha
                  avantajlı. Rezervasyon öncesi bizimle iletişime geçerek en uygun
                  paketi konuşalım.
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                Olanaklar
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-900 md:text-4xl">
                Bu bungalovda sizi neler bekliyor?
              </h2>
              <div className="mt-6">
                <AmenityList amenities={room.amenities} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* RELATED ROOMS — odalar sayfasıyla aynı görünüm */}
      <section className="bg-white py-16 md:py-20">
        <Container size="xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
              Diğer Köşkler
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-900 md:text-4xl">
              İlginizi Çekebilir
            </h2>
          </div>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <RoomDisplayCard
                key={r.slug}
                room={r}
                locale={params.locale}
                index={i}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function SpecBig({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-3 py-2 transition-colors hover:bg-primary-50/60">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
        {icon}
      </span>
      <div>
        <div className="text-xs uppercase tracking-wider text-neutral-500">
          {label}
        </div>
        <div className="font-serif text-lg font-semibold text-neutral-900">
          {value}
        </div>
      </div>
    </div>
  );
}
