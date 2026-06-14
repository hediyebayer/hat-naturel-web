/**
 * Mock VakıfBank VPOS Provider.
 * Gerçek banka çağrısı yapmaz — in-memory store üzerinde çalışır.
 *
 * Kural:
 * - initiate()  → reservationId üretir, record 'awaiting_3ds'
 * - verify()    → OTP /^\d{6}$/ ise success, değilse failed
 * - getStatus() → store'dan kaydı getirir
 *
 * reservationId formatı: HN-{timestamp}-{RAND6}
 */

import type { PaymentProvider } from './provider';
import type {
  InitiateInput,
  InitiateResult,
  VerifyInput,
  VerifyResult,
  PaymentRecord,
  CardInfo,
} from './types';
import { storeSet, storeGet, storeUpdate } from './store';
import { maskPan, getLast4, detectBrand } from './card-utils';

// ---------------------------------------------------------------------------
// Yardımcı
// ---------------------------------------------------------------------------

function generateReservationId(): string {
  const ts = Date.now();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ambiguous chars hariç
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `HN-${ts}-${rand}`;
}

function calculateAmountCharged(
  totalPrice: number,
  depositMode: 'full' | 'deposit',
): number {
  if (depositMode === 'full') return totalPrice;
  const ratio = parseFloat(process.env.NEXT_PUBLIC_DEPOSIT_RATIO ?? '0.3');
  return Math.round(totalPrice * ratio);
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

export class MockVakifBankProvider implements PaymentProvider {
  async initiate(input: InitiateInput): Promise<InitiateResult> {
    const reservationId = generateReservationId();
    const amountCharged = calculateAmountCharged(
      input.order.totalPrice,
      input.depositMode,
    );

    // Kart maskeleme — PAN raw olarak ASLA store'a yazılmaz
    const cardInfo: CardInfo = {
      maskedPan: maskPan(input.card.pan),
      last4: getLast4(input.card.pan),
      brand: detectBrand(input.card.pan),
      holder: input.card.holder,
      expMonth: input.card.expMonth,
      expYear: input.card.expYear,
    };

    const record: PaymentRecord = {
      reservationId,
      status: 'awaiting_3ds',
      guest: input.guest,
      order: {
        ...input.order,
        depositMode: input.depositMode,
      },
      card: cardInfo,
      amountCharged,
      currency: 'TRY',
      createdAt: new Date(),
    };

    storeSet(record);

    const locale = input.locale ?? 'tr';
    const redirectUrl = `/${locale}/rezervasyon/odeme/3d-secure?ref=${reservationId}`;

    // eslint-disable-next-line no-console
    console.info(
      `[MockVakifBank] initiate | ref=${reservationId} | masked=${cardInfo.maskedPan} | amount=${amountCharged} TRY`,
    );

    return { ok: true, reservationId, redirectUrl, amountCharged };
  }

  async verify(input: VerifyInput): Promise<VerifyResult> {
    const record = storeGet(input.reservationId);

    if (!record) {
      return {
        ok: false,
        status: 'failed',
        reservationId: input.reservationId,
        reason: 'expired',
      };
    }

    // Mock kural: 6 haneli rakam → success
    const otpValid = /^\d{6}$/.test(input.otp);

    if (otpValid) {
      storeUpdate(input.reservationId, {
        status: 'success',
        paidAt: new Date(),
      });

      // eslint-disable-next-line no-console
      console.info(
        `[MockVakifBank] verify success | ref=${input.reservationId}`,
      );

      return { ok: true, status: 'success', reservationId: input.reservationId };
    } else {
      storeUpdate(input.reservationId, {
        status: 'failed',
        failReason: 'invalid_otp',
      });

      // eslint-disable-next-line no-console
      console.warn(
        `[MockVakifBank] verify failed | ref=${input.reservationId} | reason=invalid_otp`,
      );

      return {
        ok: false,
        status: 'failed',
        reservationId: input.reservationId,
        reason: 'invalid_otp',
      };
    }
  }

  async getStatus(reservationId: string): Promise<PaymentRecord | null> {
    return storeGet(reservationId);
  }
}
