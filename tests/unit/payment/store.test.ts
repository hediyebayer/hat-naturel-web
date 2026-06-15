import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  storeGet,
  storeIncrementVerifyAttempt,
  storeSet,
  storeSize,
  storeUpdate,
} from '@/lib/payment/store';
import type { PaymentRecord } from '@/lib/payment/types';

function makeRecord(
  reservationId = 'HN-11111111-1111-1111-1111-111111111111',
): PaymentRecord {
  return {
    reservationId,
    status: 'awaiting_3ds',
    guest: {
      firstName: 'Ayşe',
      lastName: 'Kaya',
      idType: 'tc',
      idNumber: '12345678901',
      email: 'ayse@example.com',
      phone: '+905001234567',
      address: 'Test Sokak No:1',
      city: 'İstanbul',
      district: 'Kadıköy',
    },
    order: {
      roomSlug: 'ucgen-1-1',
      roomName: '1+1 Üçgen Bungalov',
      checkIn: '2026-07-10',
      checkOut: '2026-07-12',
      guests: 2,
      nights: 2,
      totalPrice: 13000,
      depositAmount: 3900,
      depositMode: 'deposit',
    },
    card: {
      maskedPan: '411111******1111',
      last4: '1111',
      brand: 'visa',
      holder: 'AYSE KAYA',
      expMonth: 12,
      expYear: 31,
    },
    amountCharged: 3900,
    currency: 'TRY',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    verifyAttempts: 0,
  };
}

describe('payment/store', () => {
  beforeEach(() => {
    Reflect.deleteProperty(globalThis, '__hnPaymentStore');
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(globalThis, '__hnPaymentStore');
  });

  it('storeSet + storeGet kaydı saklar', () => {
    const record = makeRecord();

    storeSet(record);

    expect(storeSize()).toBe(1);
    expect(storeGet(record.reservationId)).toEqual(record);
  });

  it('TTL dolunca storeGet null döndürür ve kaydı siler', () => {
    const record = makeRecord();
    storeSet(record);

    vi.setSystemTime(new Date('2026-01-01T01:00:00.001Z'));

    expect(storeGet(record.reservationId)).toBeNull();
    expect(storeSize()).toBe(0);
  });

  it('cleanup yeni yazma sırasında süresi dolmuş kayıtları temizler', () => {
    const first = makeRecord('HN-AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
    const second = makeRecord('HN-BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB');

    storeSet(first);
    vi.setSystemTime(new Date('2026-01-01T01:00:00.001Z'));
    storeSet(second);

    expect(storeSize()).toBe(1);
    expect(storeGet(first.reservationId)).toBeNull();
    expect(storeGet(second.reservationId)).toEqual(second);
  });

  it('storeUpdate patch merge yapar', () => {
    const record = makeRecord();
    storeSet(record);

    const updated = storeUpdate(record.reservationId, {
      status: 'success',
      paidAt: new Date('2026-01-01T00:05:00.000Z'),
    });

    expect(updated).toBe(true);
    expect(storeGet(record.reservationId)).toMatchObject({
      status: 'success',
      paidAt: new Date('2026-01-01T00:05:00.000Z'),
    });
  });

  it('başarısız verify denemelerini sayar', () => {
    const record = makeRecord();
    storeSet(record);

    const first = storeIncrementVerifyAttempt(record.reservationId);
    const second = storeIncrementVerifyAttempt(record.reservationId);

    expect(first).toEqual({ updated: true, attempts: 1, locked: false });
    expect(second).toEqual({ updated: true, attempts: 2, locked: false });
    expect(storeGet(record.reservationId)?.status).toBe('awaiting_3ds');
    expect(storeGet(record.reservationId)?.verifyAttempts).toBe(2);
  });

  it('3. başarısız verify denemesinde kaydı kilitler', () => {
    const record = makeRecord();
    storeSet(record);

    storeIncrementVerifyAttempt(record.reservationId);
    storeIncrementVerifyAttempt(record.reservationId);
    const third = storeIncrementVerifyAttempt(record.reservationId);

    expect(third).toEqual({ updated: true, attempts: 3, locked: true });
    expect(storeGet(record.reservationId)).toMatchObject({
      status: 'failed',
      verifyAttempts: 3,
      failReason: 'invalid_otp',
    });
  });

  it('olmayan kayıt update edilirse false döner', () => {
    expect(storeUpdate('HN-CCCCCCCC-CCCC-CCCC-CCCC-CCCCCCCCCCCC', { status: 'failed' })).toBe(false);
  });
});
