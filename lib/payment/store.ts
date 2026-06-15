/**
 * In-memory payment record store.
 * globalThis singleton — Next.js HMR'da store sıfırlanmaz.
 * TTL: 1 saat. Her yazma işleminde eski kayıtlar temizlenir.
 *
 * NOT: Serverless cold-start sonrası store kaybolur — demo için kabul.
 * Gerçek entegrasyonda PostgreSQL + Prisma kullanılacak.
 */

import type { PaymentRecord } from './types';

export const MAX_VERIFY_ATTEMPTS = 3;

const TTL_MS = 60 * 60 * 1_000; // 1 saat

interface StoreEntry {
  record: PaymentRecord;
  expiresAt: number;
}

// HMR-safe global singleton
declare global {
  // eslint-disable-next-line no-var
  var __hnPaymentStore: Map<string, StoreEntry> | undefined;
}

function getStore(): Map<string, StoreEntry> {
  if (!globalThis.__hnPaymentStore) {
    globalThis.__hnPaymentStore = new Map<string, StoreEntry>();
  }
  return globalThis.__hnPaymentStore;
}

/** Süresi dolan kayıtları temizler */
function cleanup(): void {
  const store = getStore();
  const now = Date.now();
  const keysToDelete: string[] = [];
  store.forEach((entry, key) => {
    if (entry.expiresAt < now) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach((key) => store.delete(key));
}

/** Yeni kayıt ekler / var olanı günceller */
export function storeSet(record: PaymentRecord): void {
  cleanup();
  getStore().set(record.reservationId, {
    record,
    expiresAt: Date.now() + TTL_MS,
  });
}

/** Kaydı getirir — süresi dolduysa null */
export function storeGet(reservationId: string): PaymentRecord | null {
  const store = getStore();
  const entry = store.get(reservationId);
  if (!entry) return null;

  if (entry.expiresAt < Date.now()) {
    store.delete(reservationId);
    return null;
  }

  return entry.record;
}

/** Kaydın belirli alanlarını günceller (patch merge) */
export function storeUpdate(
  reservationId: string,
  patch: Partial<PaymentRecord>,
): boolean {
  const store = getStore();
  const entry = store.get(reservationId);
  if (!entry) return false;

  store.set(reservationId, {
    record: { ...entry.record, ...patch },
    expiresAt: entry.expiresAt,
  });
  return true;
}

/** Tüm aktif kayıtların sayısını döndürür (test/debug) */
export function storeSize(): number {
  cleanup();
  return getStore().size;
}

/** Başarısız verify denemesini sayar; limit aşılırsa kaydı kilitler */
export function storeIncrementVerifyAttempt(reservationId: string): {
  updated: boolean;
  attempts: number;
  locked: boolean;
} {
  const entry = getStore().get(reservationId);
  if (!entry) {
    return { updated: false, attempts: 0, locked: false };
  }

  const attempts = entry.record.verifyAttempts + 1;
  const locked = attempts >= MAX_VERIFY_ATTEMPTS;

  getStore().set(reservationId, {
    record: {
      ...entry.record,
      verifyAttempts: attempts,
      status: locked ? 'failed' : entry.record.status,
      failReason: locked ? 'invalid_otp' : entry.record.failReason,
    },
    expiresAt: entry.expiresAt,
  });

  return { updated: true, attempts, locked };
}
