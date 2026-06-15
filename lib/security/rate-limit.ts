/**
 * In-memory sliding-window rate limiting.
 *
 * Harici bağımlılık yok. Interface katmanı bırakıldı;
 * ileride Redis store implementasyonu takılabilir.
 */

import type { NextRequest } from 'next/server';

export interface RateLimitEntry {
  timestamps: number[];
  expiresAt: number;
}

export interface RateLimitStore {
  get(key: string): RateLimitEntry | null;
  set(key: string, entry: RateLimitEntry): void;
  delete(key: string): void;
}

class MemoryRateLimitStore implements RateLimitStore {
  private readonly store = new Map<string, RateLimitEntry>();

  get(key: string): RateLimitEntry | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry;
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  key: string;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
}

export class SlidingWindowRateLimiter {
  constructor(private readonly store: RateLimitStore) {}

  consume(key: string, options: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    const windowStart = now - options.windowMs;
    const existing = this.store.get(key);
    const timestamps = existing?.timestamps.filter((ts) => ts > windowStart) ?? [];

    if (timestamps.length >= options.limit) {
      const oldest = timestamps[0] ?? now;
      const resetAt = oldest + options.windowMs;
      return {
        allowed: false,
        key,
        limit: options.limit,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
        resetAt,
      };
    }

    timestamps.push(now);
    const resetAt = timestamps[0] + options.windowMs;

    this.store.set(key, {
      timestamps,
      expiresAt: now + options.windowMs,
    });

    return {
      allowed: true,
      key,
      limit: options.limit,
      remaining: Math.max(0, options.limit - timestamps.length),
      retryAfterSeconds: 0,
      resetAt,
    };
  }
}

const memoryStore = new MemoryRateLimitStore();
const rateLimiter = new SlidingWindowRateLimiter(memoryStore);

export function getRateLimiter(): SlidingWindowRateLimiter {
  return rateLimiter;
}

export function resetRateLimiterStore(): void {
  memoryStore.clear();
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  return 'unknown';
}
