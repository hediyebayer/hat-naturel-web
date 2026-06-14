import { describe, it, expect, beforeEach } from 'vitest';
import { MockVakifBankProvider } from '@/lib/payment/mock-vakifbank-provider';
import { storeSize } from '@/lib/payment/store';
import type { InitiateInput } from '@/lib/payment/types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('MockVakifBankProvider', () => {
  let provider: MockVakifBankProvider;

  beforeEach(() => {
    provider = new MockVakifBankProvider();
  });

  describe('initiate()', () => {
    it('başarılı sonuç döner ve reservationId HN- ile başlar', async () => {
      const result = await provider.initiate(validInitiateInput);

      expect(result.ok).toBe(true);
      expect(result.reservationId).toMatch(/^HN-\d+-[A-Z0-9]{6}$/);
      expect(result.redirectUrl).toContain('/tr/rezervasyon/odeme/3d-secure?ref=HN-');
      expect(result.amountCharged).toBe(15000); // full payment
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
      expect(result.ok).toBe(true);

      const record = await provider.getStatus(result.reservationId);
      expect(record).not.toBeNull();
      expect(record?.card.maskedPan).toBe('411111******1111');
      expect(record?.card.last4).toBe('1111');
      expect(record?.card.brand).toBe('visa');

      // PAN tam olarak ASLA store'da olmamalı
      const raw = JSON.stringify(record);
      expect(raw).not.toContain('4111111111111111');
    });

    it('initiate sonrası durum awaiting_3ds', async () => {
      const result = await provider.initiate(validInitiateInput);
      expect(result.ok).toBe(true);

      const record = await provider.getStatus(result.reservationId);
      expect(record?.status).toBe('awaiting_3ds');
    });
  });

  describe('verify()', () => {
    it('6 haneli OTP ile success döner', async () => {
      const initiated = await provider.initiate(validInitiateInput);
      expect(initiated.ok).toBe(true);

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

    it('harf içeren OTP ile failed döner', async () => {
      const initiated = await provider.initiate(validInitiateInput);

      const result = await provider.verify({
        reservationId: initiated.reservationId,
        otp: 'abc123',
      });

      expect(result.ok).toBe(false);
      expect(result.status).toBe('failed');
      if (!result.ok) {
        expect(result.reason).toBe('invalid_otp');
      }
    });

    it('5 haneli OTP ile failed döner', async () => {
      const initiated = await provider.initiate(validInitiateInput);

      const result = await provider.verify({
        reservationId: initiated.reservationId,
        otp: '12345',
      });

      expect(result.ok).toBe(false);
      expect(result.status).toBe('failed');
    });

    it('bilinmeyen reservationId ile expired döner', async () => {
      const result = await provider.verify({
        reservationId: 'HN-0000000000000-ZZZZZZ',
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
      const record = await provider.getStatus('HN-0000000000000-XXXXXX');
      expect(record).toBeNull();
    });
  });
});
