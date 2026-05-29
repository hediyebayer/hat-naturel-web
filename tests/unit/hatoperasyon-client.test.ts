import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchHatoperasyonAvailability,
  mapBungalowToSlug,
  mapBungalowToSlugWithCapacity,
  type HatoperasyonAvailabilityResponse,
} from '@/lib/reservation/hatoperasyon-client';

describe('hatoperasyon-client', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    // Her test için temiz env
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.unstubAllGlobals();
  });

  describe('fetchHatoperasyonAvailability', () => {
    describe('Happy Path', () => {
      it('returns ok=true with rooms array when backend responds 200', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'test-key-123';

        const mockResponse: HatoperasyonAvailabilityResponse = {
          query: { from: '2026-06-01', to: '2026-06-04', guests: 4, nights: 3 },
          rooms: [
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
          ],
        };

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockResponse),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 4,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.rooms).toHaveLength(1);
          expect(result.nights).toBe(3);
          expect(result.rooms[0].name).toBe('B1');
        }
      });

      it('sends correct X-Public-Key header', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'secret-key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ query: {}, rooms: [] }),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/public/availability'),
          expect.objectContaining({
            headers: { 'X-Public-Key': 'secret-key' },
          }),
        );
      });

      it('includes correct query params in URL', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ query: {}, rooms: [] }),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 5,
        });

        const calls = mockFetch.mock.calls as unknown as Array<[string, RequestInit?]>;
        expect(calls.length).toBeGreaterThan(0);
        const calledUrl = calls[0]![0];
        expect(calledUrl).toContain('from=2026-06-01');
        expect(calledUrl).toContain('to=2026-06-04');
        expect(calledUrl).toContain('guests=5');
      });

      it('strips trailing slash from base URL', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com/';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ query: {}, rooms: [] }),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        const calls = mockFetch.mock.calls as unknown as Array<[string, RequestInit?]>;
        expect(calls.length).toBeGreaterThan(0);
        const calledUrl = calls[0]![0];
        expect(calledUrl).not.toContain('//api/public');
        expect(calledUrl).toContain('/api/public/availability');
      });
    });

    describe('Error Cases', () => {
      it('returns ok=false when env variables are missing', async () => {
        delete process.env.HATOPERASYON_API_URL;
        delete process.env.HATOPERASYON_PUBLIC_API_KEY;

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('env değişkenleri');
        }
      });

      it('returns ok=false when API URL is missing', async () => {
        delete process.env.HATOPERASYON_API_URL;
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
      });

      it('returns ok=false when API key is missing', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        delete process.env.HATOPERASYON_PUBLIC_API_KEY;

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
      });

      it('returns ok=false when backend returns 401', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'invalid-key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 401,
            text: () => Promise.resolve('Unauthorized'),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('401');
          // Backend response text'i error mesajına DAHİL EDİLMEMELİ
          // (API key leak riski — backend hata text'inde key echo edebilir).
          expect(result.error).not.toContain('Unauthorized');
        }
      });

      it('returns ok=false when backend returns 500', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            text: () => Promise.resolve('Internal Server Error'),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('500');
        }
      });

      it('returns ok=false when fetch throws network error', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const mockFetch = vi.fn(() =>
          Promise.reject(new Error('Network error')),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('Fetch hatası');
          expect(result.error).toContain('Network error');
        }
      });

      it('returns ok=false when JSON parsing fails', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.reject(new Error('Invalid JSON')),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('Invalid JSON');
        }
      });

      it('returns ok=false when response schema is invalid (rooms not array)', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ query: { nights: 3 }, rooms: null }),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('geçersiz');
        }
      });

      it('returns ok=false when response schema is invalid (query missing)', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ rooms: [] }),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
      });

      it('returns ok=true when response has valid schema with empty rooms array', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({ query: { nights: 3 }, rooms: [] }),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.rooms).toEqual([]);
          expect(result.nights).toBe(3);
        }
      });

      it('handles text() rejection gracefully', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            text: () => Promise.reject(new Error('text() failed')),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('500');
          // text() catch'i boş string döndürüyor
        }
      });

      it('truncates long error messages to 200 chars', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        const longMessage = 'X'.repeat(300);
        const mockFetch = vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 400,
            text: () => Promise.resolve(longMessage),
          } as Response),
        );
        vi.stubGlobal('fetch', mockFetch);

        const result = await fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          // Hatoperasyon 400: <200 karakter>
          expect(result.error.length).toBeLessThan(250);
        }
      });
    });

    describe('Timeout Handling', () => {
      it('aborts request after 8 seconds (timeout)', async () => {
        process.env.HATOPERASYON_API_URL = 'https://api.example.com';
        process.env.HATOPERASYON_PUBLIC_API_KEY = 'key';

        vi.useFakeTimers();

        const mockFetch = vi.fn(
          (_url: string, options?: { signal?: AbortSignal }) => {
            return new Promise((resolve, reject) => {
              // AbortSignal listener
              options?.signal?.addEventListener('abort', () => {
                reject(new DOMException('Aborted', 'AbortError'));
              });
              // Simulate slow response
              setTimeout(() => resolve({ ok: true } as Response), 10000);
            });
          },
        );
        vi.stubGlobal('fetch', mockFetch);

        const promise = fetchHatoperasyonAvailability({
          from: '2026-06-01',
          to: '2026-06-04',
          guests: 2,
        });

        // Fast-forward 8 seconds (timeout)
        await vi.advanceTimersByTimeAsync(8000);

        const result = await promise;
        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toContain('Fetch hatası');
        }

        vi.useRealTimers();
      });
    });
  });

  describe('mapBungalowToSlug', () => {
    describe('Happy Path - Köşkler', () => {
      it('maps SK10 to sari', () => {
        expect(mapBungalowToSlug('SK10')).toBe('sari');
      });

      it('maps MOK11 to mor', () => {
        expect(mapBungalowToSlug('MOK11')).toBe('mor');
      });

      it('maps BK12 to bej', () => {
        expect(mapBungalowToSlug('BK12')).toBe('bej');
      });

      it('maps TK13 to turkuaz', () => {
        expect(mapBungalowToSlug('TK13')).toBe('turkuaz');
      });

      it('maps MAK14 to mavi', () => {
        expect(mapBungalowToSlug('MAK14')).toBe('mavi');
      });
    });

    describe('Happy Path - Üçgen Bungalovlar', () => {
      it('maps B1 to ucgen-1-1', () => {
        expect(mapBungalowToSlug('B1')).toBe('ucgen-1-1');
      });

      it('maps B5 to ucgen-1-1', () => {
        expect(mapBungalowToSlug('B5')).toBe('ucgen-1-1');
      });

      it('maps B9 to ucgen-1-1', () => {
        expect(mapBungalowToSlug('B9')).toBe('ucgen-1-1');
      });
    });

    describe('Edge Cases - Case insensitive', () => {
      it('handles lowercase input (b1)', () => {
        expect(mapBungalowToSlug('b1')).toBe('ucgen-1-1');
      });

      it('handles lowercase input (sk10)', () => {
        expect(mapBungalowToSlug('sk10')).toBe('sari');
      });

      it('handles mixed case (mOk11)', () => {
        expect(mapBungalowToSlug('mOk11')).toBe('mor');
      });
    });

    describe('Edge Cases - Whitespace tolerance', () => {
      it('trims leading/trailing whitespace ( SK10 )', () => {
        expect(mapBungalowToSlug(' SK10 ')).toBe('sari');
      });

      it('trims whitespace for bungalow ( B1 )', () => {
        expect(mapBungalowToSlug(' B1 ')).toBe('ucgen-1-1');
      });
    });

    describe('Error Cases', () => {
      it('returns null for unknown name', () => {
        expect(mapBungalowToSlug('XYZ99')).toBeNull();
      });

      it('returns null for empty string', () => {
        expect(mapBungalowToSlug('')).toBeNull();
      });

      it('returns null for invalid bungalow format (B)', () => {
        expect(mapBungalowToSlug('B')).toBeNull();
      });

      it('returns null for random text', () => {
        expect(mapBungalowToSlug('random text')).toBeNull();
      });
    });
  });

  describe('mapBungalowToSlugWithCapacity', () => {
    describe('Happy Path - Üçgen Bungalovlar', () => {
      it('maps B1 with capacity 5 to ucgen-1-1', () => {
        expect(mapBungalowToSlugWithCapacity('B1', 5)).toBe('ucgen-1-1');
      });

      it('maps B1 with capacity 7 to ucgen-2-1', () => {
        expect(mapBungalowToSlugWithCapacity('B1', 7)).toBe('ucgen-2-1');
      });

      it('maps B5 with capacity 8 to ucgen-2-1', () => {
        expect(mapBungalowToSlugWithCapacity('B5', 8)).toBe('ucgen-2-1');
      });

      it('maps B9 with capacity 4 to ucgen-1-1', () => {
        expect(mapBungalowToSlugWithCapacity('B9', 4)).toBe('ucgen-1-1');
      });
    });

    describe('Edge Cases - Boundary capacity', () => {
      it('treats capacity 6 as ucgen-1-1 (< 7)', () => {
        expect(mapBungalowToSlugWithCapacity('B1', 6)).toBe('ucgen-1-1');
      });

      it('treats capacity 7 as ucgen-2-1 (>= 7)', () => {
        expect(mapBungalowToSlugWithCapacity('B1', 7)).toBe('ucgen-2-1');
      });

      it('handles capacity 0 as ucgen-1-1', () => {
        expect(mapBungalowToSlugWithCapacity('B1', 0)).toBe('ucgen-1-1');
      });
    });

    describe('Happy Path - Köşkler (capacity irrelevant)', () => {
      it('maps SK10 with any capacity to sari', () => {
        expect(mapBungalowToSlugWithCapacity('SK10', 2)).toBe('sari');
        expect(mapBungalowToSlugWithCapacity('SK10', 10)).toBe('sari');
      });

      it('maps MOK11 with any capacity to mor', () => {
        expect(mapBungalowToSlugWithCapacity('MOK11', 3)).toBe('mor');
        expect(mapBungalowToSlugWithCapacity('MOK11', 99)).toBe('mor');
      });

      it('maps BK12 with any capacity to bej', () => {
        expect(mapBungalowToSlugWithCapacity('BK12', 1)).toBe('bej');
      });

      it('maps TK13 with any capacity to turkuaz', () => {
        expect(mapBungalowToSlugWithCapacity('TK13', 5)).toBe('turkuaz');
      });
    });

    describe('Error Cases', () => {
      it('returns null for unknown name with capacity', () => {
        expect(mapBungalowToSlugWithCapacity('UNKNOWN', 5)).toBeNull();
      });

      it('returns null for empty string', () => {
        expect(mapBungalowToSlugWithCapacity('', 5)).toBeNull();
      });
    });
  });
});
