import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAvailability,
  formatPrice,
  type AvailabilityQuery,
} from '@/lib/reservation/availability';
import * as hatoperasyonClient from '@/lib/reservation/hatoperasyon-client';
import type { HatoperasyonRoom } from '@/lib/reservation/hatoperasyon-client';

// Mock hatoperasyon-client module
vi.mock('@/lib/reservation/hatoperasyon-client', async () => {
  const actual = await vi.importActual<typeof hatoperasyonClient>(
    '@/lib/reservation/hatoperasyon-client',
  );
  return {
    ...actual,
    fetchHatoperasyonAvailability: vi.fn(),
  };
});

describe('availability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAvailability - Validation', () => {
    it('returns isValidQuery=false for invalid checkIn date', async () => {
      const query: AvailabilityQuery = {
        checkIn: 'not-a-date',
        checkOut: '2026-06-04',
        guests: 2,
      };

      const result = await getAvailability(query);

      expect(result.isValidQuery).toBe(false);
      expect(result.errorMessage).toContain('tarih');
      expect(result.rooms).toHaveLength(0);
    });

    it('returns isValidQuery=false for invalid checkOut date', async () => {
      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: 'invalid',
        guests: 2,
      };

      const result = await getAvailability(query);

      expect(result.isValidQuery).toBe(false);
      expect(result.errorMessage).toContain('tarih');
    });

    it('returns isValidQuery=false when checkOut < checkIn', async () => {
      const query: AvailabilityQuery = {
        checkIn: '2026-06-10',
        checkOut: '2026-06-05',
        guests: 2,
      };

      const result = await getAvailability(query);

      expect(result.isValidQuery).toBe(false);
      expect(result.errorMessage).toContain('tarih');
      expect(result.errorMessage).toContain('sonra');
    });

    it('returns isValidQuery=false when checkIn === checkOut (0 nights)', async () => {
      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-01',
        guests: 2,
      };

      const result = await getAvailability(query);

      expect(result.isValidQuery).toBe(false);
      expect(result.nights).toBe(0);
    });

    it('returns isValidQuery=false when guests is 0', async () => {
      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 0,
      };

      const result = await getAvailability(query);

      expect(result.isValidQuery).toBe(false);
      expect(result.errorMessage).toContain('misafir');
    });

    it('returns isValidQuery=false when guests is negative', async () => {
      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: -1,
      };

      const result = await getAvailability(query);

      expect(result.isValidQuery).toBe(false);
    });

    it('returns isValidQuery=false when guests exceeds upper bound (URL manipulation guard)', async () => {
      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 999,
      };

      const result = await getAvailability(query);

      expect(result.isValidQuery).toBe(false);
      expect(result.errorMessage).toContain('en fazla');
    });
  });

  describe('getAvailability - Happy Path', () => {
    it('returns valid result when backend succeeds', async () => {
      const mockRooms: HatoperasyonRoom[] = [
        {
          bungalowId: 'b1',
          name: 'B1',
          capacity: 5,
          type: 'ucgen',
          features: {},
          isAvailable: true,
          pricePerNight: 6500,
          totalPrice: 19500,
        },
        {
          bungalowId: 'sk10',
          name: 'SK10',
          capacity: 5,
          type: 'kosk',
          features: {},
          isAvailable: true,
          pricePerNight: 4500,
          totalPrice: 13500,
        },
      ];

      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: true,
          rooms: mockRooms,
          nights: 3,
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 4,
      };

      const result = await getAvailability(query);

      expect(result.isValidQuery).toBe(true);
      expect(result.isFallback).toBeUndefined();
      expect(result.nights).toBe(3);
      expect(result.rooms.length).toBeGreaterThan(0);

      // At least some rooms should be mapped
      const ucgenRoom = result.rooms.find((r) => r.room.slug === 'ucgen-1-1');
      expect(ucgenRoom).toBeDefined();
    });

    it('calculates nights correctly (2026-06-01 to 2026-06-04 = 3 nights)', async () => {
      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: true,
          rooms: [],
          nights: 3,
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 2,
      };

      const result = await getAvailability(query);

      expect(result.nights).toBe(3);
    });

    it('calculates nights correctly (2026-06-01 to 2026-06-02 = 1 night)', async () => {
      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: true,
          rooms: [],
          nights: 1,
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-02',
        guests: 2,
      };

      const result = await getAvailability(query);

      expect(result.nights).toBe(1);
    });

    it('passes correct params to fetchHatoperasyonAvailability', async () => {
      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: true,
          rooms: [],
          nights: 5,
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-07-10',
        checkOut: '2026-07-15',
        guests: 6,
      };

      await getAvailability(query);

      expect(
        hatoperasyonClient.fetchHatoperasyonAvailability,
      ).toHaveBeenCalledWith({
        from: '2026-07-10',
        to: '2026-07-15',
        guests: 6,
      });
    });
  });

  describe('getAvailability - Fallback', () => {
    it('returns fallback rooms when backend fails', async () => {
      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: false,
          error: 'Network timeout',
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 2,
      };

      const result = await getAvailability(query);

      expect(result.isValidQuery).toBe(true);
      expect(result.isFallback).toBe(true);
      expect(result.rooms.length).toBeGreaterThan(0);
      expect(result.nights).toBe(3);
    });

    it('marks room as unavailable when guests > maxCapacity in fallback', async () => {
      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: false,
          error: 'API down',
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 9, // Tüm odaların maxCapacity'sini aşan ama MAX_GUESTS'i (10) aşmayan
      };

      const result = await getAvailability(query);

      expect(result.isFallback).toBe(true);
      // Tüm odalar müsait olmayacak (en büyük oda 8 kişilik, 9 kapasiteyi aşar)
      const allUnavailable = result.rooms.every((r) => !r.isAvailable);
      expect(allUnavailable).toBe(true);

      // En az bir oda unavailableReason içermeli
      const withReason = result.rooms.find((r) => r.unavailableReason);
      expect(withReason).toBeDefined();
      expect(withReason?.unavailableReason).toContain('Maksimum');
    });

    it('uses fallback base prices for each room category', async () => {
      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: false,
          error: 'API down',
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 2,
      };

      const result = await getAvailability(query);

      // Fallback prices: ucgen-2-1: 8500, ucgen-1-1: 6500, bej: 4500, etc.
      const ucgen21 = result.rooms.find((r) => r.room.slug === 'ucgen-2-1');
      expect(ucgen21?.pricePerNight).toBe(8500);

      const ucgen11 = result.rooms.find((r) => r.room.slug === 'ucgen-1-1');
      expect(ucgen11?.pricePerNight).toBe(6500);

      const bej = result.rooms.find((r) => r.room.slug === 'bej');
      expect(bej?.pricePerNight).toBe(4500);
    });

    it('calculates totalPrice = pricePerNight * nights in fallback', async () => {
      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: false,
          error: 'API down',
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-06',
        guests: 2,
      };

      const result = await getAvailability(query);

      expect(result.nights).toBe(5);

      const ucgen11 = result.rooms.find((r) => r.room.slug === 'ucgen-1-1');
      expect(ucgen11?.totalPrice).toBe(6500 * 5);
    });
  });

  describe('getAvailability - pickBestForCategory logic', () => {
    it('picks available + cheapest room when multiple bungalows match', async () => {
      const mockRooms: HatoperasyonRoom[] = [
        {
          bungalowId: 'b1',
          name: 'B1',
          capacity: 5,
          type: 'ucgen',
          features: {},
          isAvailable: true,
          pricePerNight: 7000,
          totalPrice: 21000,
        },
        {
          bungalowId: 'b2',
          name: 'B2',
          capacity: 5,
          type: 'ucgen',
          features: {},
          isAvailable: true,
          pricePerNight: 6500, // Daha ucuz
          totalPrice: 19500,
        },
        {
          bungalowId: 'b3',
          name: 'B3',
          capacity: 5,
          type: 'ucgen',
          features: {},
          isAvailable: false,
          pricePerNight: 6000, // En ucuz ama müsait değil
          totalPrice: 18000,
        },
      ];

      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: true,
          rooms: mockRooms,
          nights: 3,
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 4,
      };

      const result = await getAvailability(query);

      const ucgen11 = result.rooms.find((r) => r.room.slug === 'ucgen-1-1');
      expect(ucgen11?.isAvailable).toBe(true);
      expect(ucgen11?.pricePerNight).toBe(6500); // B2 seçildi
    });

    it('picks cheapest unavailable room if all are unavailable', async () => {
      const mockRooms: HatoperasyonRoom[] = [
        {
          bungalowId: 'b1',
          name: 'B1',
          capacity: 5,
          type: 'ucgen',
          features: {},
          isAvailable: false,
          pricePerNight: 7500,
          totalPrice: 22500,
          unavailableReason: 'Booked',
        },
        {
          bungalowId: 'b2',
          name: 'B2',
          capacity: 5,
          type: 'ucgen',
          features: {},
          isAvailable: false,
          pricePerNight: 7000, // Daha ucuz
          totalPrice: 21000,
          unavailableReason: 'Booked',
        },
      ];

      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: true,
          rooms: mockRooms,
          nights: 3,
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 4,
      };

      const result = await getAvailability(query);

      const ucgen11 = result.rooms.find((r) => r.room.slug === 'ucgen-1-1');
      expect(ucgen11?.isAvailable).toBe(false);
      expect(ucgen11?.pricePerNight).toBe(7000); // B2 seçildi (en ucuz)
      expect(ucgen11?.unavailableReason).toBe('Booked');
    });

    it('marks room as unavailable if defined in web but not in backend', async () => {
      // Backend'de sadece B1 var, SK10/MOK11/BK12/TK13 yok
      const mockRooms: HatoperasyonRoom[] = [
        {
          bungalowId: 'b1',
          name: 'B1',
          capacity: 5,
          type: 'ucgen',
          features: {},
          isAvailable: true,
          pricePerNight: 6500,
          totalPrice: 19500,
        },
      ];

      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: true,
          rooms: mockRooms,
          nights: 3,
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 2,
      };

      const result = await getAvailability(query);

      const sari = result.rooms.find((r) => r.room.slug === 'sari');
      expect(sari?.isAvailable).toBe(false);
      expect(sari?.unavailableReason).toContain('müsait değil');
      expect(sari?.pricePerNight).toBe(0);
    });

    it('filters rooms by capacity (guests)', async () => {
      const mockRooms: HatoperasyonRoom[] = [
        {
          bungalowId: 'b1',
          name: 'B1',
          capacity: 5, // Küçük kapasite
          type: 'ucgen',
          features: {},
          isAvailable: true,
          pricePerNight: 6000,
          totalPrice: 18000,
        },
        {
          bungalowId: 'b5',
          name: 'B5',
          capacity: 7, // Büyük kapasite (2+1)
          type: 'ucgen',
          features: {},
          isAvailable: true,
          pricePerNight: 8500,
          totalPrice: 25500,
        },
      ];

      vi.mocked(hatoperasyonClient.fetchHatoperasyonAvailability).mockResolvedValue(
        {
          ok: true,
          rooms: mockRooms,
          nights: 3,
        },
      );

      const query: AvailabilityQuery = {
        checkIn: '2026-06-01',
        checkOut: '2026-06-04',
        guests: 6, // 6 kişi
      };

      const result = await getAvailability(query);

      // B1 (capacity 5) üçgen-1-1'e eşleşir ama guests=6 > 5 → filtrelenir
      // B5 (capacity 7) üçgen-2-1'e eşleşir, guests=6 <= 7 → OK
      const ucgen11 = result.rooms.find((r) => r.room.slug === 'ucgen-1-1');
      const ucgen21 = result.rooms.find((r) => r.room.slug === 'ucgen-2-1');

      // ucgen-1-1 backend'de match yok (B1 filtrelendi)
      expect(ucgen11?.isAvailable).toBe(false);

      // ucgen-2-1 B5 ile eşleşti
      expect(ucgen21?.isAvailable).toBe(true);
      expect(ucgen21?.pricePerNight).toBe(8500);
    });
  });

  describe('formatPrice', () => {
    it('formats 4500 correctly (Turkish locale)', () => {
      const result = formatPrice(4500);
      expect(result).toBe('₺4.500');
    });

    it('formats 0 correctly', () => {
      const result = formatPrice(0);
      expect(result).toBe('₺0');
    });

    it('formats 10000 correctly', () => {
      const result = formatPrice(10000);
      expect(result).toBe('₺10.000');
    });

    it('formats 123456 correctly', () => {
      const result = formatPrice(123456);
      expect(result).toBe('₺123.456');
    });

    it('rounds decimal to integer (4500.75)', () => {
      const result = formatPrice(4500.75);
      expect(result).toBe('₺4.501');
    });

    it('rounds decimal to integer (4500.25)', () => {
      const result = formatPrice(4500.25);
      expect(result).toBe('₺4.500');
    });

    it('handles negative numbers', () => {
      const result = formatPrice(-1000);
      expect(result).toBe('-₺1.000');
    });

    it('handles very large numbers', () => {
      const result = formatPrice(1234567890);
      expect(result).toBe('₺1.234.567.890');
    });
  });
});
