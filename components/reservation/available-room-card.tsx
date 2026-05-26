import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Users, BedDouble, Bath, Maximize } from 'lucide-react';
import {
  type AvailableRoom,
  formatPrice,
} from '@/lib/reservation/availability';
import { useTranslatedRoom } from '@/lib/data/use-translated-room';

interface AvailableRoomCardProps {
  data: AvailableRoom;
  locale: string;
  /** Detay sayfasına gönderilecek query string (checkIn, checkOut, guests) */
  query: string;
}

/**
 * Rezervasyon sayfasındaki müsait oda kartı.
 * Sol: görsel. Sağ: bilgi + fiyat + CTA.
 */
export function AvailableRoomCard({
  data,
  locale,
  query,
}: AvailableRoomCardProps): React.ReactElement {
  const { room, isAvailable, pricePerNight, totalPrice, nights, unavailableReason } = data;
  const t = useTranslations('reservation');
  const tRoomDetail = useTranslations('roomDetail');
  const tr = useTranslatedRoom(room);
  const firstImage = room.images[0] ?? '/images/rooms/placeholder.jpg';

  return (
    <article
      className={`group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition hover:shadow-lg ${
        !isAvailable ? 'opacity-60' : ''
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Görsel */}
        <div className="relative aspect-[4/3] w-full md:aspect-auto">
          <Image
            src={firstImage}
            alt={tr.name}
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* İçerik */}
        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-xl text-neutral-900 sm:text-2xl">
                {tr.name}
              </h3>
              {!isAvailable && (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-700">
                  {t('unavailable')}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-neutral-600">{tr.tagline}</p>

            {/* Özellikler */}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-600">
              <span className="flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" aria-hidden />
                {room.specs.area} m²
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" aria-hidden />
                {room.specs.guests}+{room.specs.extraGuests} {tRoomDetail('guestsUnit')}
              </span>
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" aria-hidden />
                {room.specs.bedrooms} {t('bedroomLabel')}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" aria-hidden />
                {room.specs.bathrooms} banyo
              </span>
            </div>

            {unavailableReason && (
              <p className="mt-3 text-xs text-red-600">{unavailableReason}</p>
            )}
          </div>

          {/* Fiyat + CTA */}
          <div className="mt-5 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs text-neutral-500">
                {nights} gece toplam
              </div>
              <div className="font-serif text-2xl text-neutral-900">
                {formatPrice(totalPrice)}
              </div>
              <div className="text-xs text-neutral-500">
                Gecelik {formatPrice(pricePerNight)}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/${locale}/odalar/${room.slug}`}
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                Detay
              </Link>
              {isAvailable && (
                <Link
                  href={`/${locale}/iletisim?room=${room.slug}&${query}`}
                  className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  Rezervasyon Yap
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
