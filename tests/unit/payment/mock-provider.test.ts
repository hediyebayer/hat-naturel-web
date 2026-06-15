import { beforeEach, describe, expect, it } from 'vitest';
import { MockVakifBankProvider } from '@/lib/payment/mock-vakifbank-provider';
import { storeSize } from '@/lib/payment/store';
import type { InitiateInput } from '@/lib/payment/types';

const futureYY = (new Date().getFullYear() + 5) % 100;

const validInitiateInput: InitiateInput = {
  order: {
    roomSlug: 'ucgen-1-1',
    roomName: '1+1 Üçgen Bungalov',
    checkIn: '2027-03-10',
    checkOut: '2027-03-13',
    guests: 2,
    nights: 3,
    totalPrice: 15000,
    depositAmount: 4500,
    depositMode: 'full',
  },
  guest: {
    firstName: 'Ayşe',
    lastName: 'Kaya',
    idType: 'tc',
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
    kvkk: true,
    distance: true,
  },
  depositMode: 'full',
  locale: 'tr',
};

describe('MockVakifBankProvider', () => {
  let provider: MockVakifBankProvider;

  beforeEach(() => {
    Reflect.deleteProperty(globalThis, '__hnPaymentStore');
    provider = new MockVakifBankProvider();
  });

  describe('initiate()', () => {
    it('başarılı sonuç döner ve reservationId HN-UUID formatındadır', async () => {
      const result = await provider.initiate(validInitiateInput);

      expect(result.ok).toBe(true);
      expect(result.reservationId).toMatch(
        /^HN-[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/,
      );
      expect(result.redirectUrl).toContain('/tr/rezervasyon/odeme/3d-secure?ref=HN-');
      expect(result.amountCharged).toBe(15000);
    });

    it('%30 kapora modunda amountCharged doğru hesaplanır', async () => {
      const depositInput: InitiateInput = {
        ...validInitiateInput,
        depositMode: 'deposit',
        order: { ...validInitiateInput.order, depositMode: 'deposit' },
      };

      const result = await provider.initiate(depositInput);
      expect(result.ok).toBe(true);
      expect(result.amountCharged).toBe(Math.round(15000 * 0.3));
    });

    it('store boyutu artar', async () => {
      const before = storeSize();
      await provider.initiate(validInitiateInput);
      const after = storeSize();
      expect(after).toBeGreaterThan(before);
    });

    it('kart bilgisi store kaydında masked PAN olarak yer alır', async () => {
      const result = await provider.initiate(validInitiateInput);
      const record = await provider.getStatus(result.reservationId);

      expect(record).not.toBeNull();
      expect(record?.card.maskedPan).toBe('411111******1111');
      expect(record?.card.last4).toBe('1111');
      expect(record?.card.brand).toBe('visa');
      expect(record?.verifyAttempts).toBe(0);

      const raw = JSON.stringify(record);
      expect(raw).not.toContain('4111111111111111');
    });

    it('initiate sonrası durum awaiting_3ds', async () => {
      const result = await provider.initiate(validInitiateInput);
      const record = await provider.getStatus(result.reservationId);

      expect(record?.status).toBe('awaiting_3ds');
    });
  });

  describe('verify()', () => {
    it('6 haneli OTP ile success döner', async () => {
      const initiated = await provider.initiate(validInitiateInput);

      const result = await provider.verify({
        reservationId: initiated.reservationId,
        otp: '123456',
      });

      expect(result.ok).toBe(true);
      expect(result.status).toBe('success');
    });

    it('6 haneli OTP sonrası durum success olur', async () => {
      const initiated = await provider.initiate(validInitiateInput);
      await provider.verify({ reservationId: initiated.reservationId, otp: '000000' });

      const record = await provider.getStatus(initiated.reservationId);
      expect(record?.status).toBe('success');
      expect(record?.paidAt).toBeDefined();
    });

    it('geçersiz OTP denemeleri 3 kez olursa kayıt kilitlenir', async () => {
      const initiated = await provider.initiate(validInitiateInput);

      for (const otp of ['abc123', '12345', '12 345']) {
        const result = await provider.verify({
          reservationId: initiated.reservationId,
          otp,
        });

        expect(result.ok).toBe(false);
        expect(result.status).toBe('failed');
      }

      const record = await provider.getStatus(initiated.reservationId);
      expect(record?.verifyAttempts).toBe(3);
      expect(record?.status).toBe('failed');
      expect(record?.failReason).toBe('invalid_otp');
    });

    it('ilk iki başarısız denemede kayıt hemen kilitlenmez', async () => {
      const initiated = await provider.initiate(validInitiateInput);

      await provider.verify({ reservationId: initiated.reservationId, otp: 'abc123' });
      await provider.verify({ reservationId: initiated.reservationId, otp: '12345' });

      const record = await provider.getStatus(initiated.reservationId);
      expect(record?.verifyAttempts).toBe(2);
      expect(record?.status).toBe('awaiting_3ds');
    });

    it('başarı sonrası tekrar verify edilirse idempotent success döner', async () => {
      const initiated = await provider.initiate(validInitiateInput);
      await provider.verify({ reservationId: initiated.reservationId, otp: '123456' });

      const result = await provider.verify({
        reservationId: initiated.reservationId,
        otp: '654321',
      });

      expect(result).toEqual({
        ok: true,
        status: 'success',
        reservationId: initiated.reservationId,
      });
    });

    it('bilinmeyen reservationId ile expired döner', async () => {
      const result = await provider.verify({
        reservationId: 'HN-00000000-0000-0000-0000-000000000000',
        otp: '123456',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe('expired');
      }
    });
  });

  describe('getStatus()', () => {
    it('var olan kaydı döner', async () => {
      const initiated = await provider.initiate(validInitiateInput);
      const record = await provider.getStatus(initiated.reservationId);

      expect(record).not.toBeNull();
      expect(record?.reservationId).toBe(initiated.reservationId);
      expect(record?.guest.email).toBe(validInitiateInput.guest.email);
    });

    it('var olmayan ID için null döner', async () => {
      const record = await provider.getStatus('HN-00000000-0000-0000-0000-000000000000');
      expect(record).toBeNull();
    });
  });
});
