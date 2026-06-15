import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { sendReservationEmails } = vi.hoisted(() => ({
  sendReservationEmails: vi.fn(),
}));

const { validateOrderPricing } = vi.hoisted(() => ({
  validateOrderPricing: vi.fn(),
}));

vi.mock('@/lib/payment/emails', () => ({
  sendReservationEmails,
}));

vi.mock('@/lib/payment/order', () => ({
  validateOrderPricing,
}));

vi.mock('@/lib/payment/provider', async () => {
  const { MockVakifBankProvider } = await vi.importActual<
    typeof import('@/lib/payment/mock-vakifbank-provider')
  >('@/lib/payment/mock-vakifbank-provider');

  let instance: InstanceType<typeof MockVakifBankProvider> | null = null;

  return {
    getPaymentProvider: () => {
      if (!instance) {
        instance = new MockVakifBankProvider();
      }
      return instance;
    },
    _resetProviderInstance: () => {
      instance = null;
    },
  };
});

import { POST as initiatePost } from '@/app/api/payment/initiate/route';
import { POST as verifyPost } from '@/app/api/payment/verify/route';
import { GET as statusGet } from '@/app/api/payment/status/route';
import { _resetProviderInstance } from '@/lib/payment/provider';

const futureYY = (new Date().getFullYear() + 5) % 100;

const validPayload = {
  order: {
    roomSlug: 'ucgen-1-1',
    roomName: '1+1 Üçgen Bungalov',
    checkIn: '2027-03-10',
    checkOut: '2027-03-13',
    guests: 2,
    nights: 3,
    totalPrice: 15000,
    depositAmount: 4500,
    depositMode: 'full' as const,
  },
  guest: {
    firstName: 'Ayşe',
    lastName: 'Kaya',
    idType: 'tc' as const,
    idNumber: '12345678901',
    email: 'ayse@example.com',
    phone: '+905001234567',
    address: 'Test Sokağı No:1',
    city: 'İstanbul',
    district: 'Beşiktaş',
  },
  card: {
    pan: '4111111111111111',
    expMonth: 12,
    expYear: futureYY,
    cvv: '123',
    holder: 'AYSE KAYA',
  },
  consents: {
    kvkk: true as const,
    distance: true as const,
  },
  depositMode: 'full' as const,
};

function makePostRequest(url: string, body: string, headers?: HeadersInit): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    body,
    headers,
  });
}

describe('payment API routes', () => {
  beforeEach(() => {
    process.env.PAYMENT_PROVIDER = 'mock';
    Reflect.deleteProperty(globalThis, '__hnPaymentStore');
    _resetProviderInstance();
    sendReservationEmails.mockReset();
    sendReservationEmails.mockResolvedValue(undefined);
    validateOrderPricing.mockReset();
    validateOrderPricing.mockResolvedValue({
      ok: true,
      canonicalOrder: validPayload.order,
      usesFallbackPricing: false,
    });
  });

  describe('POST /api/payment/initiate', () => {
    it('body 20KB üstündeyse 413 döner', async () => {
      const response = await initiatePost(
        makePostRequest(
          'http://localhost/api/payment/initiate',
          'x'.repeat(20_001),
          { 'content-type': 'application/json' },
        ),
      );

      expect(response.status).toBe(413);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        message: 'İstek gövdesi çok büyük.',
      });
    });

    it('zod validation hatasında 400 döner', async () => {
      const invalidPayload = {
        ...validPayload,
        guest: {
          ...validPayload.guest,
          firstName: 'A',
        },
      };

      const response = await initiatePost(
        makePostRequest(
          'http://localhost/api/payment/initiate',
          JSON.stringify(invalidPayload),
          { 'content-type': 'application/json' },
        ),
      );

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.ok).toBe(false);
      expect(json.message).toBe('Form bilgileri eksik veya hatalı.');
      expect(json.fieldErrors).toBeTruthy();
      expect(JSON.stringify(json.fieldErrors)).toContain('Ad en az 2 karakter olmalı');
    });

    it('başarılı initiate akışında reservationId ve redirectUrl döner', async () => {
      const response = await initiatePost(
        makePostRequest(
          'http://localhost/api/payment/initiate',
          JSON.stringify(validPayload),
          {
            'content-type': 'application/json',
            'x-locale': 'tr',
            'x-forwarded-for': '203.0.113.5',
          },
        ),
      );

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toMatchObject({
        ok: true,
        amountCharged: 15000,
      });
      expect(json.reservationId).toMatch(
        /^HN-[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/,
      );
      expect(json.redirectUrl).toContain(
        `/tr/rezervasyon/odeme/3d-secure?ref=${json.reservationId}`,
      );
    });

  });

  describe('POST /api/payment/verify', () => {
    async function initiateReservation(): Promise<string> {
      const response = await initiatePost(
        makePostRequest(
          'http://localhost/api/payment/initiate',
          JSON.stringify(validPayload),
          {
            'content-type': 'application/json',
            'x-locale': 'tr',
            'x-forwarded-for': '203.0.113.7',
          },
        ),
      );
      const json = await response.json();
      return json.reservationId as string;
    }

    it('body 2KB üstündeyse 413 döner', async () => {
      const response = await verifyPost(
        makePostRequest(
          'http://localhost/api/payment/verify',
          'x'.repeat(2_001),
          { 'content-type': 'application/json' },
        ),
      );

      expect(response.status).toBe(413);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        message: 'İstek gövdesi çok büyük.',
      });
    });

    it('zod validation hatasında 400 döner', async () => {
      const response = await verifyPost(
        makePostRequest(
          'http://localhost/api/payment/verify',
          JSON.stringify({ reservationId: 'bad-id', otp: '123' }),
          { 'content-type': 'application/json' },
        ),
      );

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.ok).toBe(false);
      expect(json.message).toBe('Geçersiz doğrulama isteği.');
      expect(json.fieldErrors.reservationId).toContain('Geçersiz rezervasyon ID formatı');
      expect(json.fieldErrors.otp).toContain('OTP 6 haneli sayı olmalı');
    });

    it('başarılı verify akışı success döner ve email yalnızca bir kez tetiklenir', async () => {
      const reservationId = await initiateReservation();

      const firstResponse = await verifyPost(
        makePostRequest(
          'http://localhost/api/payment/verify',
          JSON.stringify({ reservationId, otp: '123456' }),
          { 'content-type': 'application/json' },
        ),
      );
      const secondResponse = await verifyPost(
        makePostRequest(
          'http://localhost/api/payment/verify',
          JSON.stringify({ reservationId, otp: '123456' }),
          { 'content-type': 'application/json' },
        ),
      );

      await expect(firstResponse.json()).resolves.toMatchObject({
        ok: true,
        status: 'success',
        reservationId,
      });
      await expect(secondResponse.json()).resolves.toMatchObject({
        ok: true,
        status: 'success',
        reservationId,
      });
      expect(sendReservationEmails).toHaveBeenCalledTimes(1);
    });

  });

  describe('GET /api/payment/status', () => {
    async function createVerifiedReservation(): Promise<string> {
      const initiateResponse = await initiatePost(
        makePostRequest(
          'http://localhost/api/payment/initiate',
          JSON.stringify(validPayload),
          {
            'content-type': 'application/json',
            'x-locale': 'tr',
            'x-forwarded-for': '203.0.113.8',
          },
        ),
      );
      const initiated = await initiateResponse.json();
      await verifyPost(
        makePostRequest(
          'http://localhost/api/payment/verify',
          JSON.stringify({ reservationId: initiated.reservationId, otp: '123456' }),
          { 'content-type': 'application/json' },
        ),
      );
      return initiated.reservationId as string;
    }

    it('ref parametresi yoksa 400 döner', async () => {
      const response = await statusGet(
        new NextRequest('http://localhost/api/payment/status'),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        message: 'missing_ref',
      });
    });

    it('olmayan kayıt için 404 döner', async () => {
      const response = await statusGet(
        new NextRequest(
          'http://localhost/api/payment/status?ref=HN-11111111-1111-1111-1111-111111111111',
        ),
      );

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        message: 'not_found',
      });
    });

    it('başarılı akışta PII içermeyen minimal record döner', async () => {
      const reservationId = await createVerifiedReservation();

      const response = await statusGet(
        new NextRequest(`http://localhost/api/payment/status?ref=${reservationId}`),
      );

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.ok).toBe(true);
      expect(json.record).toEqual({
        status: 'success',
        amountCharged: 15000,
        last4: '1111',
        brand: 'visa',
      });
    });

  });
});
