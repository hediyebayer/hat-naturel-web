import { describe, it, expect } from 'vitest';
import { guestInfoSchema, cardInfoSchema, initiatePaymentSchema, verifyPaymentSchema } from '@/lib/payment/schemas';

// ---------------------------------------------------------------------------
// guestInfoSchema
// ---------------------------------------------------------------------------

describe('guestInfoSchema', () => {
  const validGuest = {
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    idType: 'tc' as const,
    idNumber: '12345678901',
    email: 'ahmet@example.com',
    phone: '+905339175424',
    address: 'Test Caddesi No:1',
    city: 'İstanbul',
    district: 'Kadıköy',
  };

  it('geçerli misafir bilgisi parse edilir', () => {
    const result = guestInfoSchema.safeParse(validGuest);
    expect(result.success).toBe(true);
  });

  it('geçersiz email hata verir', () => {
    const result = guestInfoSchema.safeParse({
      ...validGuest,
      email: 'gecersiz-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it('kısa ad hata verir', () => {
    const result = guestInfoSchema.safeParse({
      ...validGuest,
      firstName: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('kısa telefon hata verir', () => {
    const result = guestInfoSchema.safeParse({
      ...validGuest,
      phone: '123',
    });
    expect(result.success).toBe(false);
  });

  it('pasaport idType geçerli', () => {
    const result = guestInfoSchema.safeParse({
      ...validGuest,
      idType: 'passport',
      idNumber: 'U12345678',
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// cardInfoSchema
// ---------------------------------------------------------------------------

describe('cardInfoSchema', () => {
  const futureYear = new Date().getFullYear() + 5;
  const futureYY = futureYear % 100;

  const validCard = {
    pan: '4111111111111111',
    expMonth: 12,
    expYear: futureYY,
    cvv: '123',
    holder: 'TEST USER',
  };

  it('geçerli kart başarı ile parse edilir', () => {
    const result = cardInfoSchema.safeParse(validCard);
    expect(result.success).toBe(true);
  });

  it('Luhn hatalı PAN reddedilir', () => {
    const result = cardInfoSchema.safeParse({
      ...validCard,
      pan: '4111111111111112',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      expect(flat.pan).toBeDefined();
    }
  });

  it('geçmiş son kullanma tarihi reddedilir', () => {
    const result = cardInfoSchema.safeParse({
      ...validCard,
      expMonth: 1,
      expYear: 20, // 2020
    });
    expect(result.success).toBe(false);
  });

  it('geçersiz CVV reddedilir', () => {
    const result = cardInfoSchema.safeParse({
      ...validCard,
      cvv: '12', // 2 hane — min 3
    });
    expect(result.success).toBe(false);
  });

  it('4 haneli CVV (Amex) kabul edilir', () => {
    const result = cardInfoSchema.safeParse({
      ...validCard,
      cvv: '1234',
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// initiatePaymentSchema — consents
// ---------------------------------------------------------------------------

describe('initiatePaymentSchema consents', () => {
  const futureYY = (new Date().getFullYear() + 5) % 100;

  const validPayload = {
    order: {
      roomSlug: 'ucgen-1-1',
      roomName: '1+1 Üçgen Bungalov',
      checkIn: '2027-01-01',
      checkOut: '2027-01-04',
      guests: 2,
      nights: 3,
      totalPrice: 15000,
      depositAmount: 4500,
      depositMode: 'full' as const,
    },
    guest: {
      firstName: 'Test',
      lastName: 'Kullanıcı',
      idType: 'tc' as const,
      idNumber: '12345678901',
      email: 'test@test.com',
      phone: '+905001234567',
      address: 'Test Sk. No:1',
      city: 'Ankara',
      district: 'Çankaya',
    },
    card: {
      pan: '4111111111111111',
      expMonth: 12,
      expYear: futureYY,
      cvv: '123',
      holder: 'TEST USER',
    },
    consents: {
      kvkk: true as const,
      distance: true as const,
    },
    depositMode: 'full' as const,
  };

  it('geçerli payload kabul edilir', () => {
    const result = initiatePaymentSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('kvkk false ise reddedilir', () => {
    const result = initiatePaymentSchema.safeParse({
      ...validPayload,
      consents: { kvkk: false, distance: true },
    });
    expect(result.success).toBe(false);
  });

  it('distance false ise reddedilir', () => {
    const result = initiatePaymentSchema.safeParse({
      ...validPayload,
      consents: { kvkk: true, distance: false },
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// verifyPaymentSchema
// ---------------------------------------------------------------------------

describe('verifyPaymentSchema', () => {
  it('geçerli reservationId + 6 haneli OTP kabul edilir', () => {
    const result = verifyPaymentSchema.safeParse({
      reservationId: 'HN-1718000000000-ABC123',
      otp: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('5 haneli OTP reddedilir', () => {
    const result = verifyPaymentSchema.safeParse({
      reservationId: 'HN-1718000000000-ABC123',
      otp: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('OTP harf içeriyorsa reddedilir', () => {
    const result = verifyPaymentSchema.safeParse({
      reservationId: 'HN-1718000000000-ABC123',
      otp: '12345a',
    });
    expect(result.success).toBe(false);
  });

  it('geçersiz reservationId formatı reddedilir', () => {
    const result = verifyPaymentSchema.safeParse({
      reservationId: 'GECERSIZ-ID',
      otp: '123456',
    });
    expect(result.success).toBe(false);
  });
});
