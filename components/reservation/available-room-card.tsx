import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Users,
  BedDouble,
  Bath,
  Maximize,
  Waves,
  Flame,
  Bath as BathIcon,
  Sparkle,
} from 'lucide-react';
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
  /**
   * Hatoperasyon erişilemediğinde fallback fiyatlar gösteriliyorsa true.
   * Fiyatın yanında 'tahmini' etiketi gösterilir, rezervasyon butonu pasifleşir.
   */
  isFallback?: boolean;
}

/**
 * Rezervasyon sayfasındaki müsait oda kartı.
 * Sol: görsel. Sağ: bilgi + fiyat + CTA.
 */
export function AvailableRoomCard({
  data,
  locale,
  query,
  isFallback = false,
}: AvailableRoomCardProps): React.ReactElement {
  const { room, isAvailable, pricePerNight, totalPrice, nights, unavailableReason } = data;
  const t = useTranslations('reservation');
  const tRooms = useTranslations('rooms');
  const tRoomDetail = useTranslations('roomDetail');
  const tr = useTranslatedRoom(room);
  const firstImage = room.images[0] ?? '/images/rooms/placeholder.jpg';

  // Amenity flagleri — anasayfadaki RoomDisplayCard ile aynı mantık
  const hasHeatedPool = room.amenities.includes('heatedPool');
  const hasCoolingPool = room.amenities.includes('coolingPool');
  const hasSauna = room.amenities.includes('sauna');
  const hasJacuzzi = room.amenities.includes('jacuzzi');
  const hasSummerPool = room.amenities.includes('pool');
  const hasFireplace = room.amenities.includes('fireplace');
  const hasFirePit = room.amenities.includes('firePit');

  return (
    <article
      className={`group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition hover:shadow-lg ${
        !isAvailable ? 'opacity-60' : ''
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Görsel */}
        <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto">
          <Image
            src={firstImage}
            alt={tr.name}
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Amenity badges — anasayfadaki kartla aynı sağ üst köşede */}
          <div className="absolute right-2 top-2 flex flex-col items-end gap-1 sm:right-3 sm:top-3 sm:gap-1.5">
            {hasHeatedPool && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/60 bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.6)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
                <Waves className="h-2.5 w-2.5" />
                {tRooms('badgeHeatedPool')}
              </span>
            )}
            {hasJacuzzi && (
              <span className="inline-flex items-center gap-1 rounded-full border border-violet-300/60 bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
                <BathIcon className="h-2.5 w-2.5" />
                {tRooms('badgeJacuzzi')}
              </span>
            )}
            {hasSauna && (
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/60 bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_15px_rgba(251,146,60,0.6)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
                <Flame className="h-2.5 w-2.5" />
                {tRooms('badgeSauna')}
              </span>
            )}
            {hasCoolingPool && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/50 bg-gradient-to-r from-cyan-400 to-teal-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_12px_rgba(127,229,245,0.5)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
                <Waves className="h-2.5 w-2.5" />
                {tRooms('badgeCoolingPool')}
              </span>
            )}
            {hasSummerPool && !hasHeatedPool && !hasCoolingPool && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/50 bg-cyan-500/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_12px_rgba(127,229,245,0.5)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
                <Waves className="h-2.5 w-2.5" />
                {tRooms('badgePool')}
              </span>
            )}
            {hasFireplace && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-gradient-to-r from-amber-600 to-orange-700 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_15px_rgba(217,119,6,0.55)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
                <Flame className="h-2.5 w-2.5" />
                {tRooms('badgeFireplace')}
              </span>
            )}
            {hasFirePit && (
              <span className="inline-flex items-center gap-1 rounded-full border border-red-400/60 bg-gradient-to-r from-red-500 to-orange-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.55)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
                <Sparkle className="h-2.5 w-2.5" />
                {tRooms('badgeFirePit')}
              </span>
            )}
          </div>
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
                {room.specs.guests + room.specs.extraGuests} {tRoomDetail('guestsUnit')}
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
                {nights} {t('nightsTotal')}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl text-neutral-900">
                  {formatPrice(totalPrice)}
                </span>
                {isFallback && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-300">
                    {t('estimatedLabel')}
                  </span>
                )}
              </div>
              <div className="text-xs text-neutral-500">
                {t('perNight')} {formatPrice(pricePerNight)}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/${locale}/odalar/${room.slug}`}
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                {t('detailBtn')}
              </Link>
              {isAvailable && !isFallback && (
                <Link
                  href={`/${locale}/rezervasyon/odeme?room=${room.slug}&${query}`}
                  className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  {t('reserveBtn')}
                </Link>
              )}
              {isAvailable && isFallback && (
                <Link
                  href={`/${locale}/iletisim?room=${room.slug}&${query}`}
                  className="rounded-full border border-amber-500 bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
                >
                  {t('contactForPrice')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
