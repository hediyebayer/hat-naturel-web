import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { CalendarDays, Users, MoveRight } from 'lucide-react';
import { type AvailableRoom, formatPrice } from '@/lib/reservation/availability';
import { DEPOSIT_RATIO } from '@/lib/content/legal';

interface OrderSummaryProps {
  room: AvailableRoom;
  checkIn: string;   // yyyy-MM-dd
  checkOut: string;  // yyyy-MM-dd
  guests: number;
  depositMode?: 'full' | 'deposit';
  locale: string;
  /** Kompakt mod — görsel gizli (sonuç sayfası) */
  compact?: boolean;
}

function formatDateShort(dateStr: string): string {
  // Parse yyyy-MM-dd safely (no TZ shift)
  const [year, month, day] = dateStr.split('-').map(Number);
  const months = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ];
  return `${day} ${months[(month ?? 1) - 1]} ${year}`;
}

export async function OrderSummary({
  room,
  checkIn,
  checkOut,
  guests,
  depositMode = 'full',
  locale,
  compact = false,
}: OrderSummaryProps): Promise<React.ReactElement> {
  const t = await getTranslations({ locale, namespace: 'payment.summary' });
  const tRoomNames = await getTranslations({ locale, namespace: 'roomNames' });

  const { pricePerNight, totalPrice, nights } = room;
  const depositAmount = Math.round(totalPrice * DEPOSIT_RATIO);
  const remainingAmount = totalPrice - depositAmount;
  const chargedAmount = depositMode === 'deposit' ? depositAmount : totalPrice;

  const roomName = tRoomNames(`${room.room.slug}.name`);
  const roomTagline = tRoomNames(`${room.room.slug}.tagline`);
  const firstImage = room.room.images[0] ?? '/images/rooms/placeholder.jpg';

  const nightsLabel = t('nights', { count: nights });
  const guestsLabel = t('guests', { count: guests });

  return (
    <aside
      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 md:sticky md:top-24"
      aria-label={t('ariaLabel')}
    >
      {/* Oda görseli */}
      {!compact && (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={firstImage}
            alt={roomName}
            fill
            sizes="(max-width: 1024px) 100vw, 380px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Başlık */}
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
          {t('title')}
        </p>
        <h2 className="font-serif text-xl text-neutral-900">{roomName}</h2>
        {roomTagline && (
          <p className="mt-0.5 text-sm text-neutral-500">{roomTagline}</p>
        )}

        {/* Tarih & misafir */}
        <div className="mt-4 space-y-2 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="flex-shrink-0 text-primary-600" />
            <span className="flex items-center gap-1.5 flex-wrap">
              <span>{formatDateShort(checkIn)}</span>
              <MoveRight size={13} className="text-neutral-400" />
              <span>{formatDateShort(checkOut)}</span>
              <span className="text-neutral-400">({nightsLabel})</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={15} className="flex-shrink-0 text-primary-600" />
            <span>{guestsLabel}</span>
          </div>
        </div>

        {/* Fiyat kırılımı */}
        <div className="mt-5 space-y-2.5 border-t border-neutral-100 pt-4 text-sm">
          <div className="flex items-center justify-between text-neutral-600">
            <span>
              {formatPrice(pricePerNight)} × {nightsLabel}
            </span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          {depositMode === 'deposit' && (
            <>
              <div className="flex items-center justify-between font-medium text-amber-700">
                <span>{t('deposit')}</span>
                <span>{formatPrice(depositAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>{t('payAtProperty')}</span>
                <span>{formatPrice(remainingAmount)}</span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
            <span className="font-semibold text-neutral-900">
              {depositMode === 'deposit' ? t('payNow') : t('total')}
            </span>
            <span className="text-lg font-bold text-primary-700">
              {formatPrice(chargedAmount)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
