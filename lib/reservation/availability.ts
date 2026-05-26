/**
 * Müsaitlik & fiyat servisi.
 *
 * Şu anda mock data döndürüyor.
 * İleride hatoperasyon API'sine bağlanacak — sadece bu dosya değişecek,
 * çağıran sayfa/component'ler aynı kalacak.
 *
 * Sözleşme (contract):
 *   getAvailability({ checkIn, checkOut, guests }) -> AvailabilityResult
 */

import { differenceInCalendarDays, parseISO, isValid } from 'date-fns';
import { ROOMS, type Room } from '@/lib/data/rooms';

// Mock fiyatlandırma — gerçek fiyatlar hatoperasyon'dan çekilecek
const MOCK_BASE_PRICES: Record<string, number> = {
  'ucgen-2-1': 8500,
  'ucgen-1-1': 6500,
  bej: 4500,
  turkuaz: 4500,
  sari: 4500,
  mor: 7500,
};

// Hafta sonu (Cuma, Cumartesi, Pazar) için ek fiyat çarpanı
const WEEKEND_MULTIPLIER = 1.25;

export interface AvailabilityQuery {
  checkIn: string;  // yyyy-MM-dd
  checkOut: string; // yyyy-MM-dd
  guests: number;
}

export interface AvailableRoom {
  room: Room;
  isAvailable: boolean;
  /** Geceleme başı ortalama fiyat (TL) */
  pricePerNight: number;
  /** Toplam fiyat = ortalama × gece sayısı */
  totalPrice: number;
  /** Gece sayısı */
  nights: number;
  /** Müsait değilse sebep (opsiyonel) */
  unavailableReason?: string;
}

export interface AvailabilityResult {
  query: AvailabilityQuery;
  nights: number;
  rooms: AvailableRoom[];
  /** Sorgu geçerli mi (tarihler doğru parse ediliyor mu) */
  isValidQuery: boolean;
  errorMessage?: string;
}

/**
 * Sorgu parametrelerini validate eder ve sebebi döndürür.
 */
function validateQuery(query: AvailabilityQuery): {
  isValid: boolean;
  nights: number;
  error?: string;
} {
  const checkInDate = parseISO(query.checkIn);
  const checkOutDate = parseISO(query.checkOut);

  if (!isValid(checkInDate) || !isValid(checkOutDate)) {
    return { isValid: false, nights: 0, error: 'Geçersiz tarih formatı.' };
  }

  const nights = differenceInCalendarDays(checkOutDate, checkInDate);
  if (nights < 1) {
    return {
      isValid: false,
      nights: 0,
      error: 'Çıkış tarihi giriş tarihinden sonra olmalı.',
    };
  }

  if (query.guests < 1) {
    return { isValid: false, nights, error: 'En az 1 misafir olmalı.' };
  }

  return { isValid: true, nights };
}

/**
 * Bir odanın belirli tarihler arasındaki müsaitliğini ve fiyatını hesaplar.
 * MOCK: Şimdilik tüm odalar müsait, fiyat sabit base × gece sayısı.
 */
function calculateRoomAvailability(
  room: Room,
  nights: number,
  guests: number,
): AvailableRoom {
  const basePrice = MOCK_BASE_PRICES[room.slug] ?? 5000;
  const maxCapacity = room.specs.guests + room.specs.extraGuests;

  // Kapasite kontrolü
  if (guests > maxCapacity) {
    return {
      room,
      isAvailable: false,
      pricePerNight: basePrice,
      totalPrice: 0,
      nights,
      unavailableReason: `Maksimum ${maxCapacity} kişi konaklayabilir.`,
    };
  }

  return {
    room,
    isAvailable: true,
    pricePerNight: basePrice,
    totalPrice: basePrice * nights,
    nights,
  };
}

/**
 * Ana servis fonksiyonu — sayfa/component'ler bunu çağırır.
 *
 * @example
 *   const result = await getAvailability({
 *     checkIn: '2026-06-01',
 *     checkOut: '2026-06-04',
 *     guests: 4,
 *   });
 */
export async function getAvailability(
  query: AvailabilityQuery,
): Promise<AvailabilityResult> {
  const validation = validateQuery(query);

  if (!validation.isValid) {
    return {
      query,
      nights: 0,
      rooms: [],
      isValidQuery: false,
      errorMessage: validation.error,
    };
  }

  const rooms = ROOMS.map((room) =>
    calculateRoomAvailability(room, validation.nights, query.guests),
  );

  return {
    query,
    nights: validation.nights,
    rooms,
    isValidQuery: true,
  };
}

/**
 * Fiyatı TL formatında yazdırır: 4.500 ₺
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(price);
}

// Eslint için kullanılmayan ama public API'de tutulan sabit
export { WEEKEND_MULTIPLIER };
