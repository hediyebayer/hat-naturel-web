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
const PUBLIC_KEY_HEADER = 'X-Public-Key';
const GENERIC_AVAILABILITY_ERROR = 'Müsaitlik bilgisi şu an alınamıyor, lütfen tekrar deneyin.';
const GENERIC_RESERVATION_ERROR = 'Rezervasyon işletme sistemine aktarılamadı.';

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

export interface CreateReservationPayload {
  bungalowId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestCount: number;
  checkIn: string;
  checkOut: string;
  depositMode: 'full' | 'deposit';
  paidAmount: number;
  source: 'website';
}

export type CreateReservationResult =
  | { ok: true; remoteReservationId?: string }
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
    console.error(
      '[hatoperasyon-client] Missing env variables: HATOPERASYON_API_URL or HATOPERASYON_PUBLIC_API_KEY not set.',
    );
    return {
      ok: false,
      error: GENERIC_AVAILABILITY_ERROR,
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
      cache: 'no-store',
    });

    if (!res.ok) {
      const responseText = await res.text().catch(() => '');
      console.error(
        `[hatoperasyon-client] API error: HTTP ${res.status}`,
        responseText ? `(response: ${responseText.slice(0, 200)})` : '',
      );
      return {
        ok: false,
        error: GENERIC_AVAILABILITY_ERROR,
      };
    }

    const data: unknown = await res.json();
    if (!isAvailabilityResponse(data)) {
      console.error(
        '[hatoperasyon-client] Invalid response schema received from API.',
        JSON.stringify(data).slice(0, 200),
      );
      return {
        ok: false,
        error: GENERIC_AVAILABILITY_ERROR,
      };
    }

    return { ok: true, rooms: data.rooms, nights: data.query.nights };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Bilinmeyen hata.';
    console.error(`[hatoperasyon-client] Fetch error: ${message}`);
    return { ok: false, error: GENERIC_AVAILABILITY_ERROR };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Hatoperasyon API'sine public reservation kaydı açar.
 * Hata durumunda throw etmez; ok=false ile detay döner.
 */
export async function createReservation(
  payload: CreateReservationPayload,
): Promise<CreateReservationResult> {
  const baseUrl = process.env.HATOPERASYON_API_URL;
  const apiKey = process.env.HATOPERASYON_PUBLIC_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error(
      '[hatoperasyon-client] Missing env variables for reservation sync: HATOPERASYON_API_URL or HATOPERASYON_PUBLIC_API_KEY not set.',
    );
    return {
      ok: false,
      error: 'Hatoperasyon env eksik',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/public/reservations`, {
      method: 'POST',
      headers: {
        [PUBLIC_KEY_HEADER]: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!res.ok) {
      const responseText = await res.text().catch(() => '');
      console.error(
        `[hatoperasyon-client] Reservation create API error: HTTP ${res.status}`,
        responseText ? `(response: ${responseText.slice(0, 200)})` : '',
      );
      return {
        ok: false,
        error: `Hatoperasyon reservation create HTTP ${res.status}`,
      };
    }

    const data: unknown = await res.json().catch(() => ({}));
    const remoteReservationId = extractReservationId(data);

    return remoteReservationId
      ? { ok: true, remoteReservationId }
      : { ok: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Bilinmeyen hata.';
    console.error(`[hatoperasyon-client] Reservation create fetch error: ${message}`);
    return {
      ok: false,
      error: e instanceof DOMException && e.name === 'AbortError'
        ? 'Hatoperasyon reservation create timeout'
        : `${GENERIC_RESERVATION_ERROR} ${message}`,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractReservationId(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const obj = data as Record<string, unknown>;
  const reservationId = obj.reservationId;
  return typeof reservationId === 'string' && reservationId.trim().length > 0
    ? reservationId
    : undefined;
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

  if (name === 'SK10') return 'sari';
  if (name === 'MOK11') return 'mor';
  if (name === 'BK12') return 'bej';
  if (name === 'TK13') return 'turkuaz';
  if (name === 'MAK14') return 'mavi';

  if (/^B\d+$/.test(name)) {
    return 'ucgen-1-1';
  }

  return null;
}

/**
 * mapBungalowToSlug + kapasite versiyonu.
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
