/**
 * POST /api/payment/verify
 *
 * Body: verifyPaymentSchema
 * Response:
 *   200 { ok: true, status: 'success', reservationId }
 *   200 { ok: false, status: 'failed', reason }
 *   400 { ok: false, message, fieldErrors? }
 *   500 { ok: false, message }
 */

import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { verifyPaymentSchema } from '@/lib/payment/schemas';
import { getPaymentProvider } from '@/lib/payment/provider';
import { sendReservationEmails } from '@/lib/payment/emails';
import { syncReservationToHatoperasyon } from '@/lib/payment/hatoperasyon-sync';
import { storeGet } from '@/lib/payment/store';
import { getRateLimiter } from '@/lib/security/rate-limit';
import { arePaymentsDisabled } from '@/lib/payment/kill-switch';

const MAX_BODY_SIZE = 2_000; // 2KB
const VERIFY_RATE_LIMIT = { limit: 5, windowMs: 60_000 };

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (arePaymentsDisabled()) {
      return NextResponse.json(
        { ok: false, message: 'Ödeme alımı geçici olarak kapalı. Lütfen bizimle iletişime geçin.' },
        { status: 503 },
      );
    }

    const text = await request.text();

    if (text.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { ok: false, message: 'İstek gövdesi çok büyük.' },
        { status: 413 },
      );
    }

    const json: unknown = JSON.parse(text);
    const validated = verifyPaymentSchema.parse(json);

    const rateLimit = getRateLimiter().consume(
      `payment:verify:${validated.reservationId}`,
      VERIFY_RATE_LIMIT,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Çok fazla doğrulama denemesi. Lütfen bekleyip tekrar deneyin.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const preVerifyRecord = storeGet(validated.reservationId);
    const wasAlreadySuccess = preVerifyRecord?.status === 'success';

    const provider = getPaymentProvider();
    const result = await provider.verify({
      reservationId: validated.reservationId,
      otp: validated.otp,
    });

    if (result.ok && result.status === 'success' && !wasAlreadySuccess) {
      const record = storeGet(validated.reservationId);

      if (record) {
        sendReservationEmails({
          guest: record.guest,
          order: record.order,
          card: record.card,
          reservationId: record.reservationId,
          amountCharged: record.amountCharged,
        }).catch((err: unknown) => {
          console.error('[api/payment/verify] email gönderim hatası:', err);
        });

        syncReservationToHatoperasyon(record, 'api/payment/verify').catch((err: unknown) => {
          console.error('[api/payment/verify] hatoperasyon sync unexpected wrapper error:', err);
        });
      } else {
        console.error(
          `[api/payment/verify] payment success but store record not found for ${validated.reservationId}`,
        );
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Geçersiz doğrulama isteği.',
          fieldErrors: e.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (e instanceof SyntaxError) {
      return NextResponse.json(
        { ok: false, message: 'Geçersiz JSON formatı.' },
        { status: 400 },
      );
    }

    console.error('[api/payment/verify] beklenmedik hata:', e);
    return NextResponse.json(
      { ok: false, message: 'Doğrulama tamamlanamadı, lütfen tekrar deneyin.' },
      { status: 500 },
    );
  }
}

