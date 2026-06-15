import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEPOSIT_RATIO } from '@/lib/content/legal';
import type { AvailabilityResult } from '@/lib/reservation/availability';

const { getAvailability } = vi.hoisted(() => ({
  getAvailability: vi.fn(),
}));

vi.mock('@/lib/reservation/availability', () => ({
  getAvailability,
}));

import { getOrderFromQuery, validateOrderPricing } from '@/lib/payment/order';
import { ROOMS } from '@/lib/data/rooms';

function makeAvailabilityResult(overrides?: Partial<AvailabilityResult>): AvailabilityResult {
  return {
    query: {
      checkIn: '2026-07-10',
      checkOut: '2026-07-12',
      guests: 2,
    },
    nights: 2,
    rooms: [
      {
        room: ROOMS.find((room) => room.slug === 'ucgen-1-1')!,
        isAvailable: true,
        pricePerNight: 6500,
        totalPrice: 13000,
        nights: 2,
      },
    ],
    isValidQuery: true,
    ...overrides,
  };
}

describe('payment/order getOrderFromQuery()', () => {
  beforeEach(() => {
    getAvailability.mockReset();
  });

  it('uygun ve müsait oda için order sonucu döner', async () => {
    getAvailability.mockResolvedValue(makeAvailabilityResult());

    const result = await getOrderFromQuery({
      roomSlug: 'ucgen-1-1',
      checkIn: '2026-07-10',
      checkOut: '2026-07-12',
      guests: 2,
    });

    expect(getAvailability).toHaveBeenCalledWith({
      checkIn: '2026-07-10',
      checkOut: '2026-07-12',
      guests: 2,
    });
    expect(result).toEqual({
      availableRoom: makeAvailabilityResult().rooms[0],
      roomName: '1+1 Üçgen Bungalov', // gerçek oda adı (slug değil) — roomName bug fix
    });
  });

  it('availability sonucu geçersizse null döner', async () => {
    getAvailability.mockResolvedValue(
      makeAvailabilityResult({
        isValidQuery: false,
        rooms: [],
      }),
    );

    await expect(
      getOrderFromQuery({
        roomSlug: 'ucgen-1-1',
        checkIn: '2026-07-10',
        checkOut: '2026-07-12',
        guests: 2,
      }),
    ).resolves.toBeNull();
  });

  it('slug eşleşmezse null döner', async () => {
    getAvailability.mockResolvedValue(makeAvailabilityResult());

    await expect(
      getOrderFromQuery({
        roomSlug: 'mor',
        checkIn: '2026-07-10',
        checkOut: '2026-07-12',
        guests: 2,
      }),
    ).resolves.toBeNull();
  });

  it('oda müsait değilse null döner', async () => {
    getAvailability.mockResolvedValue(
      makeAvailabilityResult({
        rooms: [
          {
            ...makeAvailabilityResult().rooms[0],
            isAvailable: false,
            unavailableReason: 'Dolu',
          },
        ],
      }),
    );

    await expect(
      getOrderFromQuery({
        roomSlug: 'ucgen-1-1',
        checkIn: '2026-07-10',
        checkOut: '2026-07-12',
        guests: 2,
      }),
    ).resolves.toBeNull();
  });
});

describe('payment/order validateOrderPricing()', () => {
  beforeEach(() => {
    getAvailability.mockReset();
  });

  it('sunucu fiyatı ile eşleşen order için canonical sonucu döner', async () => {
    getAvailability.mockResolvedValue(makeAvailabilityResult());

    const result = await validateOrderPricing({
      roomSlug: 'ucgen-1-1',
      roomName: '1+1 Üçgen Bungalov',
      checkIn: '2026-07-10',
      checkOut: '2026-07-12',
      guests: 2,
      nights: 2,
      totalPrice: 13000,
      depositAmount: Math.round(13000 * DEPOSIT_RATIO),
      depositMode: 'full',
    });

    expect(result).toEqual({
      ok: true,
      canonicalOrder: {
        roomSlug: 'ucgen-1-1',
        roomName: '1+1 Üçgen Bungalov',
        checkIn: '2026-07-10',
        checkOut: '2026-07-12',
        guests: 2,
        nights: 2,
        totalPrice: 13000,
        depositAmount: Math.round(13000 * DEPOSIT_RATIO),
        depositMode: 'full',
      },
      usesFallbackPricing: false,
    });
  });

  it('manipüle fiyatı reddeder', async () => {
    getAvailability.mockResolvedValue(makeAvailabilityResult());

    await expect(
      validateOrderPricing({
        roomSlug: 'ucgen-1-1',
        roomName: '1+1 Üçgen Bungalov',
        checkIn: '2026-07-10',
        checkOut: '2026-07-12',
        guests: 2,
        nights: 2,
        totalPrice: 1,
        depositAmount: 1,
        depositMode: 'full',
      }),
    ).resolves.toMatchObject({
      ok: false,
      reason: 'price_mismatch',
      usesFallbackPricing: false,
      canonicalOrder: {
        totalPrice: 13000,
      },
    });
  });

  it('fallback fiyatını da kabul eder', async () => {
    getAvailability.mockResolvedValue(
      makeAvailabilityResult({
        isFallback: true,
      }),
    );

    const totalPrice = 13000;
    const result = await validateOrderPricing({
      roomSlug: 'ucgen-1-1',
      roomName: '1+1 Üçgen Bungalov',
      checkIn: '2026-07-10',
      checkOut: '2026-07-12',
      guests: 2,
      nights: 2,
      totalPrice,
      depositAmount: Math.round(totalPrice * DEPOSIT_RATIO),
      depositMode: 'deposit',
    });

    expect(result.ok).toBe(true);
    expect(result.usesFallbackPricing).toBe(true);
    expect(result.canonicalOrder?.totalPrice).toBe(totalPrice);
  });
});
