/**
 * Payment Zod şemaları.
 * Tüm boundary validation buradan geçer.
 * RHF resolver olarak da kullanılır (UI builder'ın görevi).
 */

import { z } from 'zod';
import { luhnCheck } from './card-utils';

// ---------------------------------------------------------------------------
// Yardımcı
// ---------------------------------------------------------------------------

const currentYear = new Date().getFullYear();
const currentYY = currentYear % 100; // 25, 26, ...

// ---------------------------------------------------------------------------
// Guest Info
// ---------------------------------------------------------------------------

export const guestInfoSchema = z
  .object({
    firstName: z.string().trim().min(2, 'Ad en az 2 karakter olmalı'),
    lastName: z.string().trim().min(2, 'Soyad en az 2 karakter olmalı'),
    idType: z.enum(['tc', 'passport']),
    idNumber: z.string().trim().min(6, 'Kimlik no en az 6 karakter olmalı').max(20),
    email: z.string().trim().email('Geçerli bir e-posta adresi giriniz'),
    phone: z
      .string()
      .trim()
      .min(10, 'Geçerli bir telefon numarası giriniz')
      .max(20),
    address: z.string().trim().min(5, 'Adres en az 5 karakter olmalı'),
    city: z.string().trim().min(2, 'Şehir en az 2 karakter olmalı'),
    district: z.string().trim().min(2, 'İlçe en az 2 karakter olmalı'),
  })
  .superRefine((data, ctx) => {
    // T.C. kimlik: tam 11 haneli sayısal olmalı (plan acceptance kriteri)
    if (data.idType === 'tc' && !/^\d{11}$/.test(data.idNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['idNumber'],
        message: 'T.C. kimlik numarası 11 haneli sayılardan oluşmalıdır',
      });
    }
  });

export type GuestInfoInput = z.infer<typeof guestInfoSchema>;

// ---------------------------------------------------------------------------
// Card Info (raw — provider sınırında kullanılır, store'a kaydedilmez)
// ---------------------------------------------------------------------------

export const cardInfoSchema = z
  .object({
    pan: z
      .string()
      .trim()
      .min(13)
      .max(19)
      .refine(
        (v) => luhnCheck(v.replace(/\D/g, '')),
        { message: 'invalidPan' },
      ),
    expMonth: z.number().int().min(1).max(12),
    expYear: z
      .number()
      .int()
      .min(currentYY, 'Kartın son kullanma tarihi geçmiş')
      .max(currentYY + 20),
    cvv: z
      .string()
      .trim()
      .regex(/^\d{3,4}$/, 'invalidCvv'),
    holder: z.string().trim().min(3, 'Kart sahibi adı en az 3 karakter olmalı'),
  })
  .refine(
    (data) => {
      // Ay + yıl kombinasyonu geçmiş mi?
      const now = new Date();
      const cy = now.getFullYear() % 100;
      const cm = now.getMonth() + 1;
      const yy = data.expYear > 99 ? data.expYear % 100 : data.expYear;
      if (yy < cy) return false;
      if (yy === cy && data.expMonth < cm) return false;
      return true;
    },
    { message: 'expired', path: ['expMonth'] },
  );

export type CardInfoInput = z.infer<typeof cardInfoSchema>;

// ---------------------------------------------------------------------------
// Consents
// ---------------------------------------------------------------------------

export const consentsSchema = z.object({
  kvkk: z.literal(true, {
    errorMap: () => ({ message: 'KVKK onayı zorunludur' }),
  }),
  distance: z.literal(true, {
    errorMap: () => ({ message: 'Mesafeli satış sözleşmesi onayı zorunludur' }),
  }),
});

export type ConsentsInput = z.infer<typeof consentsSchema>;

// ---------------------------------------------------------------------------
// Order Summary (API body'deki order kısmı)
// ---------------------------------------------------------------------------

export const orderSummarySchema = z.object({
  roomSlug: z.string().min(1),
  roomName: z.string().min(1),
  checkIn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Giriş tarihi yyyy-MM-dd formatında olmalı'),
  checkOut: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Çıkış tarihi yyyy-MM-dd formatında olmalı'),
  guests: z.number().int().min(1).max(10),
  nights: z.number().int().min(1),
  totalPrice: z.number().positive(),
  depositAmount: z.number().nonnegative(),
  depositMode: z.enum(['full', 'deposit']),
});

export type OrderSummaryInput = z.infer<typeof orderSummarySchema>;

// ---------------------------------------------------------------------------
// Initiate Payment (tam API body)
// ---------------------------------------------------------------------------

export const initiatePaymentSchema = z.object({
  order: orderSummarySchema,
  guest: guestInfoSchema,
  card: cardInfoSchema,
  consents: consentsSchema,
  depositMode: z.enum(['full', 'deposit']),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;

// ---------------------------------------------------------------------------
// Verify Payment
// ---------------------------------------------------------------------------

export const verifyPaymentSchema = z.object({
  reservationId: z
    .string()
    .regex(/^HN-\d+-[A-Z0-9]{6}$/, 'Geçersiz rezervasyon ID formatı'),
  otp: z
    .string()
    .regex(/^\d{6}$/, 'OTP 6 haneli sayı olmalı'),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
