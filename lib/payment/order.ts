/**
 * Query parametrelerinden OrderSummary oluşturur.
 * getAvailability() çağırarak slug'a uyan odayı bulur.
 * Bulunamazsa null döner (caller redirect yapacak).
 */

import { DEPOSIT_RATIO } from '@/lib/content/legal';
import type { OrderSummaryInput } from '@/lib/payment/schemas';
import {
  getAvailability,
  type AvailableRoom,
  type AvailabilityQuery,
} from '@/lib/reservation/availability';

const PRICE_TOLERANCE_TL = 1;

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

export interface OrderPriceValidationResult {
  ok: boolean;
  canonicalOrder?: OrderSummaryInput;
  reason?: 'not_available' | 'price_mismatch';
  usesFallbackPricing?: boolean;
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
    roomName: match.room.name, // gerçek oda adı (lib/data/rooms.ts) — e-posta/kayıtta görünür
  };
}

function isWithinPriceTolerance(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) <= PRICE_TOLERANCE_TL;
}

/**
 * Payment initiate çağrısında istemciden gelen fiyat alanlarını,
 * sunucunun yeniden hesapladığı availability sonucu ile doğrular.
 *
 * Hatoperasyon erişilemezse getAvailability() fallback fiyat döndürür;
 * ödeme akışı tamamen kilitlenmesin diye fallback fiyatı da kabul ederiz.
 */
export async function validateOrderPricing(
  order: OrderSummaryInput,
): Promise<OrderPriceValidationResult> {
  const availability = await getAvailability({
    checkIn: order.checkIn,
    checkOut: order.checkOut,
    guests: order.guests,
  });

  if (!availability.isValidQuery) {
    return { ok: false, reason: 'not_available' };
  }

  const match = availability.rooms.find((room) => room.room.slug === order.roomSlug);
  if (!match || !match.isAvailable) {
    return { ok: false, reason: 'not_available' };
  }

  const canonicalOrder: OrderSummaryInput = {
    ...order,
    nights: match.nights,
    totalPrice: match.totalPrice,
    depositAmount: Math.round(match.totalPrice * DEPOSIT_RATIO),
  };

  const isValid =
    order.nights === canonicalOrder.nights
    && isWithinPriceTolerance(order.totalPrice, canonicalOrder.totalPrice)
    && isWithinPriceTolerance(order.depositAmount, canonicalOrder.depositAmount);

  if (!isValid) {
    return {
      ok: false,
      reason: 'price_mismatch',
      canonicalOrder,
      usesFallbackPricing: availability.isFallback === true,
    };
  }

  return {
    ok: true,
    canonicalOrder,
    usesFallbackPricing: availability.isFallback === true,
  };
}
