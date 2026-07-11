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
import {
  sendHatoperasyonSyncFailureAlert,
  sendReservationEmails,
} from '@/lib/payment/emails';
import { storeGet } from '@/lib/payment/store';
import { getRateLimiter } from '@/lib/security/rate-limit';
import { arePaymentsDisabled } from '@/lib/payment/kill-switch';
import { createReservation } from '@/lib/reservation/hatoperasyon-client';

const MAX_BODY_SIZE = 2_000; // 2KB
const VERIFY_RATE_LIMIT = { limit: 5, windowMs: 60_000 };

const SLUG_TO_FALLBACK_BUNGALOW_ID: Partial<Record<string, string>> = {
  sari: 'SK10',
  mor: 'MOK11',
  bej: 'BK12',
  turkuaz: 'TK13',
  mavi: 'MAK14',
};

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

        syncReservationToHatoperasyon(record).catch((err: unknown) => {
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

async function syncReservationToHatoperasyon(
  record: NonNullable<ReturnType<typeof storeGet>>,
): Promise<void> {
  const bungalowId = resolveBungalowId(record.order.bungalowId, record.order.roomSlug);

  if (!bungalowId) {
    const error = `Bungalow ID çözümlenemedi (roomSlug=${record.order.roomSlug})`;
    console.error(`[api/payment/verify] ${error} | ref=${record.reservationId}`);
    await notifyHatoperasyonSyncFailure(record, error);
    return;
  }

  const syncResult = await createReservation({
    bungalowId,
    guestName: `${record.guest.firstName} ${record.guest.lastName}`.trim(),
    guestPhone: record.guest.phone,
    guestEmail: record.guest.email,
    guestCount: record.order.guests,
    checkIn: record.order.checkIn,
    checkOut: record.order.checkOut,
    depositMode: record.order.depositMode,
    paidAmount: record.amountCharged,
    source: 'website',
  });

  if (syncResult.ok) {
    console.info(
      `[api/payment/verify] hatoperasyon reservation sync success | ref=${record.reservationId}${syncResult.remoteReservationId ? ` | remote=${syncResult.remoteReservationId}` : ''}`,
    );
    return;
  }

  console.error(
    `[api/payment/verify] hatoperasyon reservation sync failed | ref=${record.reservationId} | error=${syncResult.error}`,
  );
  await notifyHatoperasyonSyncFailure(record, syncResult.error, bungalowId);
}

function resolveBungalowId(
  storedBungalowId: string | undefined,
  roomSlug: string,
): string | undefined {
  if (storedBungalowId && storedBungalowId.trim().length > 0) {
    return storedBungalowId;
  }

  return SLUG_TO_FALLBACK_BUNGALOW_ID[roomSlug];
}

async function notifyHatoperasyonSyncFailure(
  record: NonNullable<ReturnType<typeof storeGet>>,
  error: string,
  bungalowId?: string,
): Promise<void> {
  try {
    await sendHatoperasyonSyncFailureAlert({
      reservationId: record.reservationId,
      guestName: `${record.guest.firstName} ${record.guest.lastName}`.trim(),
      guestPhone: record.guest.phone,
      guestEmail: record.guest.email,
      roomName: record.order.roomName,
      roomSlug: record.order.roomSlug,
      bungalowId: bungalowId ?? record.order.bungalowId,
      checkIn: record.order.checkIn,
      checkOut: record.order.checkOut,
      guestCount: record.order.guests,
      paidAmount: record.amountCharged,
      depositMode: record.order.depositMode,
      error,
    });
  } catch (alertError: unknown) {
    console.error(
      '[api/payment/verify] hatoperasyon sync failure alert gönderim hatası:',
      alertError,
    );
  }
}
