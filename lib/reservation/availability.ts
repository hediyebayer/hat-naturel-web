/**
 * Müsaitlik & fiyat servisi.
 *
 * Hatoperasyon public API'sine bağlanır:
 *   GET https://hatoperasyon.com/api/public/availability
 *   Headers: X-Public-Key: <HATOPERASYON_PUBLIC_API_KEY>
 *
 * Hatoperasyon erişilemezse veya hata dönerse, ROOMS verisinden
 * fallback mock fiyat gösterir ('isFallback' true ile işaretlenir).
 */

import { differenceInCalendarDays, parseISO, isValid, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/** Timezone — backend (hatoperasyon) ile aynı TZ kullanımı */
const TZ = 'Europe/Istanbul';
import { getOrderedRooms, type Room } from '@/lib/data/rooms';
import {
  fetchHatoperasyonAvailability,
  mapBungalowToSlugWithCapacity,
  type HatoperasyonRoom,
} from '@/lib/reservation/hatoperasyon-client';

// URL manipulation'a karşı korunmak için guests üst sınırı
const MAX_GUESTS = 10;

// Hatoperasyon erişilemezse kullanılacak fallback fiyatlar
const FALLBACK_BASE_PRICES: Record<string, number> = {
  'ucgen-2-1': 8500,
  'ucgen-1-1': 6500,
  bej: 4500,
  turkuaz: 4500,
  sari: 4500,
  mor: 7500,
};

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
  /** Hatoperasyon erişilemediği için fallback fiyat gösteriliyorsa true */
  isFallback?: boolean;
}

/**
 * Sorgu parametrelerini validate eder ve sebebi döndürür.
 */
function validateQuery(query: AvailabilityQuery): {
  isValid: boolean;
  nights: number;
  error?: string;
} {
  // TZ-safe parse: YYYY-MM-DD string'ini Istanbul TZ'de startOfDay olarak çöz
  // Böylece lokal sunucu TZ'sinden bağımsız olur (1 günlük kayma riskini önler)
  const checkInDate = startOfDay(toZonedTime(parseISO(query.checkIn), TZ));
  const checkOutDate = startOfDay(toZonedTime(parseISO(query.checkOut), TZ));

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

  if (query.guests > MAX_GUESTS) {
    return {
      isValid: false,
      nights,
      error: `Misafir sayısı en fazla ${MAX_GUESTS} olabilir.`,
    };
  }

  return { isValid: true, nights };
}

/**
 * Fallback hesap — hatoperasyon erişilmediginde devreye girer.
 * Sabit base fiyat × gece sayısı, sadece kapasite kontrolü.
 */
function calculateFallbackAvailability(
  room: Room,
  nights: number,
  guests: number,
): AvailableRoom {
  const basePrice = FALLBACK_BASE_PRICES[room.slug] ?? 5000;
  const maxCapacity = room.specs.guests + room.specs.extraGuests;

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
 * Hatoperasyon'dan dönen birden fazla bungalovu (B1, B5, B6, ...)
 * tek bir web kategorisinde (örn "ucgen-1-1") en uygun olana göre birleştirir.
 * En uygun: müsait olan + en düşük fiyatlı.
 */
function pickBestForCategory(
  hatoperasyonRooms: HatoperasyonRoom[],
  slug: string,
  guests: number,
): HatoperasyonRoom | undefined {
  const matches = hatoperasyonRooms.filter(
    (r) =>
      mapBungalowToSlugWithCapacity(r.name, r.capacity) === slug &&
      r.capacity >= guests,
  );
  if (matches.length === 0) return undefined;

  // Önce müsait olanlar, sonra fiyata göre artık
  const available = matches.filter((r) => r.isAvailable);
  const pool = available.length > 0 ? available : matches;
  pool.sort((a, b) => a.pricePerNight - b.pricePerNight);
  return pool[0];
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

  // Hatoperasyon'dan gerçek veri çek
  const hatoperasyonResult = await fetchHatoperasyonAvailability({
    from: query.checkIn,
    to: query.checkOut,
    guests: query.guests,
  });

  // Erişim hatası — fallback'e düş
  if (!hatoperasyonResult.ok) {
    // Teknik detayı sunucu loguna yaz; kullanıcıya genel mesaj gösterilir.
    console.error(
      '[availability] Hatoperasyon erişilemiyor, fallback fiyatlar kullanılıyor.',
      `Hata: ${hatoperasyonResult.error}`,
    );
    const fallbackRooms = getOrderedRooms().map((room) =>
      calculateFallbackAvailability(room, validation.nights, query.guests),
    );
    return {
      query,
      nights: validation.nights,
      rooms: fallbackRooms,
      isValidQuery: true,
      isFallback: true,
    };
  }

  // Hatoperasyon boş array döndüyse (hiç oda yok) — özel mesajla fallback'e düş
  const backendEmpty = hatoperasyonResult.rooms.length === 0;

  // Her web oda kategorisi için hatoperasyon'dan en uygun bungalovu seç
  // Üçgen bungalovlar önde, köşkler arkada (getOrderedRooms)
  const rooms = getOrderedRooms().map<AvailableRoom>((room) => {
    const match = pickBestForCategory(
      hatoperasyonResult.rooms,
      room.slug,
      query.guests,
    );

    if (!match) {
      // Web'de tanımlı ama hatoperasyon'da eşleşme yok
      const reason = backendEmpty
        ? 'Şu an müsaitlik bilgisi alınamıyor, lütfen bizimle iletişime geçin.'
        : 'Bu tarihler için müsait değil.';
      return {
        room,
        isAvailable: false,
        pricePerNight: 0,
        totalPrice: 0,
        nights: validation.nights,
        unavailableReason: reason,
      };
    }

    return {
      room,
      isAvailable: match.isAvailable,
      pricePerNight: match.pricePerNight,
      totalPrice: match.totalPrice,
      nights: validation.nights,
      unavailableReason: match.unavailableReason,
    };
  });

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


