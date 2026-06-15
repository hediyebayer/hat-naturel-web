import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  SlidingWindowRateLimiter,
  getClientIp,
  getRateLimiter,
  resetRateLimiterStore,
} from '@/lib/security/rate-limit';

describe('security/rate-limit', () => {
  beforeEach(() => {
    resetRateLimiterStore();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  it('limit dolana kadar izin verir, sonra engeller', () => {
    const limiter = getRateLimiter();

    expect(limiter.consume('k1', { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
    expect(limiter.consume('k1', { limit: 2, windowMs: 60_000 }).allowed).toBe(true);

    const blocked = limiter.consume('k1', { limit: 2, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('window geçince tekrar izin verir', () => {
    const limiter = getRateLimiter();

    limiter.consume('k2', { limit: 1, windowMs: 60_000 });
    vi.setSystemTime(new Date('2026-01-01T00:01:00.001Z'));

    const result = limiter.consume('k2', { limit: 1, windowMs: 60_000 });
    expect(result.allowed).toBe(true);
  });

  it('getClientIp x-forwarded-for ilk IPyi alır', () => {
    const request = new NextRequest('http://localhost/api/test', {
      headers: {
        'x-forwarded-for': '198.51.100.1, 10.0.0.1',
      },
    });

    expect(getClientIp(request)).toBe('198.51.100.1');
  });

  it('getClientIp x-real-ip fallback kullanır', () => {
    const request = new NextRequest('http://localhost/api/test', {
      headers: {
        'x-real-ip': '203.0.113.7',
      },
    });

    expect(getClientIp(request)).toBe('203.0.113.7');
  });

  it('custom limiter instance bağımsız store ile çalışır', () => {
    const store = new Map<string, { timestamps: number[]; expiresAt: number }>();
    const limiter = new SlidingWindowRateLimiter({
      get(key) {
        return store.get(key) ?? null;
      },
      set(key, entry) {
        store.set(key, entry);
      },
      delete(key) {
        store.delete(key);
      },
    });

    expect(limiter.consume('custom', { limit: 1, windowMs: 10_000 }).allowed).toBe(true);
    expect(limiter.consume('custom', { limit: 1, windowMs: 10_000 }).allowed).toBe(false);
  });
});
