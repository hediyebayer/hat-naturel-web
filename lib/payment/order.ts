/**
 * Query parametrelerinden OrderSummary oluşturur.
 * getAvailability() çağırarak slug'a uyan odayı bulur.
 * Bulunamazsa null döner (caller redirect yapacak).
 */

import {
  getAvailability,
  type AvailableRoom,
  type AvailabilityQuery,
} from '@/lib/reservation/availability';

interface OrderQuery {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface OrderResult {
  availableRoom: AvailableRoom;
  roomName: string;
}

/**
 * Verilen sorguya göre tek bir oda özetini döndürür.
 *
 * @example
 *   const result = await getOrderFromQuery({
 *     roomSlug: 'ucgen-1-1',
 *     checkIn: '2026-07-01',
 *     checkOut: '2026-07-04',
 *     guests: 2,
 *   });
 *   if (!result) redirect(`/${locale}/rezervasyon`);
 */
export async function getOrderFromQuery(
  query: OrderQuery,
): Promise<OrderResult | null> {
  const availQuery: AvailabilityQuery = {
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    guests: query.guests,
  };

  const result = await getAvailability(availQuery);

  if (!result.isValidQuery) return null;

  const match = result.rooms.find((r) => r.room.slug === query.roomSlug);
  if (!match) return null;
  if (!match.isAvailable) return null;

  return {
    availableRoom: match,
    roomName: match.room.slug, // Gerçek isim UI'da i18n ile çekilecek
  };
}
