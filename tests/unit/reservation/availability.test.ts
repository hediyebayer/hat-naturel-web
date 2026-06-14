import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HatoperasyonRoom } from '@/lib/reservation/hatoperasyon-client';

const { fetchHatoperasyonAvailability } = vi.hoisted(() => ({
  fetchHatoperasyonAvailability: vi.fn(),
}));

vi.mock('@/lib/reservation/hatoperasyon-client', async () => {
  const actual = await vi.importActual<typeof import('@/lib/reservation/hatoperasyon-client')>(
    '@/lib/reservation/hatoperasyon-client',
  );

  return {
    ...actual,
    fetchHatoperasyonAvailability,
  };
});

import {
  calculateFallbackAvailability,
  getAvailability,
  pickBestForCategory,
  validateQuery,
} from '@/lib/reservation/availability';
import { ROOMS } from '@/lib/data/rooms';

function makeRoom(overrides: Partial<HatoperasyonRoom>): HatoperasyonRoom {
  return {
    bungalowId: 'B1',
    name: 'B1',
    capacity: 5,
    type: null,
    features: {},
    isAvailable: true,
    pricePerNight: 6500,
    totalPrice: 13000,
    ...overrides,
  };
}

describe('reservation/availability', () => {
  beforeEach(() => {
    fetchHatoperasyonAvailability.mockReset();
  });

  describe('validateQuery()', () => {
    it('geçerli tarih ve misafir sayısı için gece sayısını hesaplar', () => {
      expect(
        validateQuery({
          checkIn: '2026-07-10',
          checkOut: '2026-07-13',
          guests: 2,
        }),
      ).toEqual({ isValid: true, nights: 3 });
    });

    it('geçersiz tarih formatını reddeder', () => {
      expect(
        validateQuery({
          checkIn: '2026/07/10',
          checkOut: '2026-07-13',
          guests: 2,
        }),
      ).toEqual({
        isValid: false,
        nights: 0,
        error: 'Geçersiz tarih formatı.',
      });
    });

    it('çıkış tarihi girişten sonra değilse reddeder', () => {
      expect(
        validateQuery({
          checkIn: '2026-07-10',
          checkOut: '2026-07-10',
          guests: 2,
        }),
      ).toEqual({
        isValid: false,
        nights: 0,
        error: 'Çıkış tarihi giriş tarihinden sonra olmalı.',
      });
    });

    it('0 misafiri reddeder', () => {
      expect(
        validateQuery({
          checkIn: '2026-07-10',
          checkOut: '2026-07-12',
          guests: 0,
        }),
      ).toEqual({
        isValid: false,
        nights: 2,
        error: 'En az 1 misafir olmalı.',
      });
    });
  });

  describe('calculateFallbackAvailability()', () => {
    it('fallback fiyatta gece sayısı ile çarpar', () => {
      const room = ROOMS.find((item) => item.slug === 'ucgen-1-1');
      expect(room).toBeDefined();

      const result = calculateFallbackAvailability(room!, 3, 2);

      expect(result.isAvailable).toBe(true);
      expect(result.pricePerNight).toBe(6500);
      expect(result.totalPrice).toBe(19500);
      expect(result.nights).toBe(3);
    });

    it('kapasite aşılırsa unavailableReason döner', () => {
      const room = ROOMS.find((item) => item.slug === 'ucgen-1-1');
      expect(room).toBeDefined();

      const result = calculateFallbackAvailability(room!, 2, 6);

      expect(result.isAvailable).toBe(false);
      expect(result.totalPrice).toBe(0);
      expect(result.unavailableReason).toBe('Maksimum 5 kişi konaklayabilir.');
    });
  });

  describe('pickBestForCategory()', () => {
    it('müsait odalar arasından en düşük fiyatlıyı seçer', () => {
      const result = pickBestForCategory(
        [
          makeRoom({ bungalowId: 'B1', name: 'B1', capacity: 5, isAvailable: true, pricePerNight: 7000 }),
          makeRoom({ bungalowId: 'B2', name: 'B2', capacity: 5, isAvailable: true, pricePerNight: 6200 }),
          makeRoom({ bungalowId: 'B3', name: 'B3', capacity: 5, isAvailable: false, pricePerNight: 5000 }),
        ],
        'ucgen-1-1',
        2,
      );

      expect(result?.bungalowId).toBe('B2');
      expect(result?.pricePerNight).toBe(6200);
    });

    it('müsait oda yoksa eşleşenler arasından en düşük fiyatlıyı seçer', () => {
      const result = pickBestForCategory(
        [
          makeRoom({ bungalowId: 'B4', name: 'B4', capacity: 5, isAvailable: false, pricePerNight: 7600 }),
          makeRoom({ bungalowId: 'B5', name: 'B5', capacity: 5, isAvailable: false, pricePerNight: 7100 }),
        ],
        'ucgen-1-1',
        2,
      );

      expect(result?.bungalowId).toBe('B5');
      expect(result?.isAvailable).toBe(false);
    });

    it('kapasitesi yetersiz odaları eşleşmeden çıkarır', () => {
      const result = pickBestForCategory(
        [makeRoom({ bungalowId: 'B6', name: 'B6', capacity: 5 })],
        'ucgen-2-1',
        6,
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getAvailability()', () => {
    it('başarılı Hatoperasyon yanıtını web odalarına map eder', async () => {
      fetchHatoperasyonAvailability.mockResolvedValue({
        ok: true,
        nights: 2,
        rooms: [
          makeRoom({ bungalowId: 'B1', name: 'B1', capacity: 5, pricePerNight: 6800, totalPrice: 13600 }),
          makeRoom({ bungalowId: 'B2', name: 'B2', capacity: 5, pricePerNight: 6200, totalPrice: 12400 }),
          makeRoom({ bungalowId: 'SK10', name: 'SK10', capacity: 7, pricePerNight: 9000, totalPrice: 18000 }),
          makeRoom({ bungalowId: 'MOK11', name: 'MOK11', capacity: 7, pricePerNight: 11000, totalPrice: 22000, isAvailable: false, unavailableReason: 'Bakımda' }),
          makeRoom({ bungalowId: 'B8', name: 'B8', capacity: 7, pricePerNight: 12000, totalPrice: 24000 }),
        ],
      });

      const result = await getAvailability({
        checkIn: '2026-07-10',
        checkOut: '2026-07-12',
        guests: 2,
      });

      expect(result.isValidQuery).toBe(true);
      expect(result.isFallback).toBeUndefined();
      expect(fetchHatoperasyonAvailability).toHaveBeenCalledWith({
        from: '2026-07-10',
        to: '2026-07-12',
        guests: 2,
      });

      const ucgen = result.rooms.find((room) => room.room.slug === 'ucgen-1-1');
      const sari = result.rooms.find((room) => room.room.slug === 'sari');
      const mor = result.rooms.find((room) => room.room.slug === 'mor');
      const bej = result.rooms.find((room) => room.room.slug === 'bej');

      expect(ucgen).toMatchObject({
        isAvailable: true,
        pricePerNight: 6200,
        totalPrice: 12400,
      });
      expect(sari).toMatchObject({
        isAvailable: true,
        pricePerNight: 9000,
        totalPrice: 18000,
      });
      expect(mor).toMatchObject({
        isAvailable: false,
        unavailableReason: 'Bakımda',
      });
      expect(bej).toMatchObject({
        isAvailable: false,
        pricePerNight: 0,
        totalPrice: 0,
        unavailableReason: 'Bu tarihler için müsait değil.',
      });
    });

    it('Hatoperasyon hata verirse fallback fiyatları döner', async () => {
      fetchHatoperasyonAvailability.mockResolvedValue({
        ok: false,
        error: 'timeout',
      });

      const result = await getAvailability({
        checkIn: '2026-07-10',
        checkOut: '2026-07-12',
        guests: 2,
      });

      expect(result.isValidQuery).toBe(true);
      expect(result.isFallback).toBe(true);
      expect(result.nights).toBe(2);

      const ucgen = result.rooms.find((room) => room.room.slug === 'ucgen-1-1');
      const mor = result.rooms.find((room) => room.room.slug === 'mor');

      expect(ucgen).toMatchObject({
        isAvailable: true,
        pricePerNight: 6500,
        totalPrice: 13000,
      });
      expect(mor).toMatchObject({
        isAvailable: true,
        pricePerNight: 7500,
        totalPrice: 15000,
      });
    });

    it('geçersiz sorguda dış servisi çağırmaz', async () => {
      const result = await getAvailability({
        checkIn: 'invalid',
        checkOut: '2026-07-12',
        guests: 2,
      });

      expect(result).toEqual({
        query: {
          checkIn: 'invalid',
          checkOut: '2026-07-12',
          guests: 2,
        },
        nights: 0,
        rooms: [],
        isValidQuery: false,
        errorMessage: 'Geçersiz tarih formatı.',
      });
      expect(fetchHatoperasyonAvailability).not.toHaveBeenCalled();
    });
  });
});
