/**
 * Hatoperasyon public API client'ı.
 *
 * Production: https://hatoperasyon.com/api/public/availability
 * Local: http://localhost:3000/api/public/availability
 *
 * URL ve API key env değişkenlerinden okunur:
 *   HATOPERASYON_API_URL
 *   HATOPERASYON_PUBLIC_API_KEY
 */

const REQUEST_TIMEOUT_MS = 8000;
const REVALIDATE_SECONDS = 60;
const PUBLIC_KEY_HEADER = 'X-Public-Key';
const ERROR_TEXT_MAX_LENGTH = 200;

export interface HatoperasyonRoom {
  bungalowId: string;
  name: string;
  capacity: number;
  type: string | null;
  features: Record<string, unknown>;
  isAvailable: boolean;
  unavailableReason?: string;
  pricePerNight: number;
  totalPrice: number;
}

export interface HatoperasyonAvailabilityResponse {
  query: { from: string; to: string; guests: number; nights: number };
  rooms: HatoperasyonRoom[];
}

export interface FetchAvailabilityParams {
  from: string;  // yyyy-MM-dd
  to: string;    // yyyy-MM-dd
  guests: number;
}

export type FetchAvailabilityResult =
  | { ok: true; rooms: HatoperasyonRoom[]; nights: number }
  | { ok: false; error: string };

/**
 * Hatoperasyon API'sine müsaitlik sorgusu yapar.
 * Hata durumunda ok=false döner (throw etmez), çağıran fallback yapsın.
 */
export async function fetchHatoperasyonAvailability(
  params: FetchAvailabilityParams,
): Promise<FetchAvailabilityResult> {
  const baseUrl = process.env.HATOPERASYON_API_URL;
  const apiKey = process.env.HATOPERASYON_PUBLIC_API_KEY;

  if (!baseUrl || !apiKey) {
    return {
      ok: false,
      error: 'Hatoperasyon env değişkenleri tanımlı değil.',
    };
  }

  const url = new URL(`${baseUrl.replace(/\/$/, '')}/api/public/availability`);
  url.searchParams.set('from', params.from);
  url.searchParams.set('to', params.to);
  url.searchParams.set('guests', String(params.guests));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      headers: { [PUBLIC_KEY_HEADER]: apiKey },
      signal: controller.signal,
      // 60sn ISR cache — müsaitlik dakika hassasiyetinde yeterli, backend'i korur.
      // Booking confirm flow eklenirse o adım için ayrıca no-store kullanılmalı.
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      // API key leak riskine karşı backend response text'ini ÇAĞIRANA döndürme.
      // (Önceden slice(0, 200) ile dahil ediliyordu — silindi.)
      // Diagnostic için sadece server logu yeterli.
      await res.text().catch(() => '');
      return {
        ok: false,
        error: `Hatoperasyon ${res.status}`,
      };
    }

    const data: unknown = await res.json();
    if (!isAvailabilityResponse(data)) {
      return {
        ok: false,
        error: 'Hatoperasyon geçersiz yanıt döndü.',
      };
    }

    return { ok: true, rooms: data.rooms, nights: data.query.nights };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Bilinmeyen hata.';
    return { ok: false, error: `Fetch hatası: ${message}` };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Runtime type guard — backend response'unun beklenen şemaya uyduğunu doğrular.
 * Schema değişirse veya backend bozuk JSON dönerse crash yerine ok=false döner.
 */
function isAvailabilityResponse(
  data: unknown,
): data is HatoperasyonAvailabilityResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.rooms)) return false;
  if (!obj.query || typeof obj.query !== 'object') return false;
  const query = obj.query as Record<string, unknown>;
  return typeof query.nights === 'number' && query.nights >= 0;
}

/**
 * Hatoperasyon bungalov ismini (B1, SK10, MOK11...) web slug'ına çevirir.
 *
 * Kural:
 * - B1-B9 → ucgen-1-1 veya ucgen-2-1 (kapasiteye göre çağıran ayırır)
 * - SK10 → sari (Sarı Köşk)
 * - MOK11 → mor (Mor Köşk)
 * - BK12 → bej
 * - TK13 → turkuaz
 * - MAK14 → mavi (Mavi Köşk — varsa)
 *
 * Bu fonksiyon kapasiteye bakmadan slug döner. Üçgen ayrımı için
 * çağıran kod kapasite kullanır.
 */
export function mapBungalowToSlug(bungalowName: string): string | null {
  const name = bungalowName.toUpperCase().trim();

  // Köşk eşleştirmeleri (sabit prefix)
  if (name === 'SK10') return 'sari';
  if (name === 'MOK11') return 'mor';
  if (name === 'BK12') return 'bej';
  if (name === 'TK13') return 'turkuaz';
  if (name === 'MAK14') return 'mavi';

  // B1-B9 üçgen — kapasiteye göre kategorize edilir (availability.ts içinde).
  if (/^B\d+$/.test(name)) {
    // Burada kapasiteye bakmadığımız için varsayılan: 1+1
    // (availability.ts pickBestForCategory'de capacity ile filter eder)
    return 'ucgen-1-1';
  }

  return null;
}

/**
 * mapBungalowToSlug fonksiyonunun gelişmiş versiyonu — kapasiteye göre
 * üçgen 1+1 / 2+1 ayrımı yapar.
 *
 * (Şu an availability.ts içinde kullanılmıyor — pickBestForCategory
 * her iki kategori için ayrı match'liyor. İleride lazım olabilir.)
 */
export function mapBungalowToSlugWithCapacity(
  bungalowName: string,
  capacity: number,
): string | null {
  const name = bungalowName.toUpperCase().trim();

  if (/^B\d+$/.test(name)) {
    return capacity >= 7 ? 'ucgen-2-1' : 'ucgen-1-1';
  }

  return mapBungalowToSlug(bungalowName);
}
