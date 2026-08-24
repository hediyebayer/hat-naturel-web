/**
 * POST /api/payment/callback
 *
 * VakıfBank SuccessUrl / FailureUrl callback noktası.
 * Banka form-urlencoded POST eder; Status=Y/A ise provizyon tamamlanır.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getPaymentProvider, getPaymentProviderType } from '@/lib/payment/provider';
import { VakifBankProvider, verifyVakifBankCallbackHash } from '@/lib/payment/vakifbank-provider';
import { sendReservationEmails } from '@/lib/payment/emails';
import { syncReservationToHatoperasyon } from '@/lib/payment/hatoperasyon-sync';
import { getSiteBaseUrl } from '@/lib/payment/site-url';
import { storeGet } from '@/lib/payment/store';
import { getClientIp } from '@/lib/security/rate-limit';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

const RESERVATION_ID_REGEX = /^HN-[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/;

// Open-redirect koruması: locale yalnızca whitelist'ten gelebilir. Aksi halde
// stored locale (ör. `/evil.com`) `new URL()` içinde host'u ele geçirebilirdi.
function safeLocale(value: string | undefined): Locale {
  return (locales as readonly string[]).includes(value ?? '') ? (value as Locale) : defaultLocale;
}

function getRedirectUrl(_request: NextRequest, locale: string, search: URLSearchParams): URL {
  return new URL(`/${safeLocale(locale)}/rezervasyon/odeme/sonuc?${search.toString()}`, getSiteBaseUrl());
}

function shouldLogVerboseDebug(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const callbackFields: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    callbackFields[key] = String(value).trim();
  }

  const status = callbackFields.Status ?? callbackFields.status ?? '';
  const verifyEnrollmentRequestId = callbackFields.VerifyEnrollmentRequestId ?? '';
  const mpiTransactionId = callbackFields.MpiTransactionId ?? '';
  const reservationId = verifyEnrollmentRequestId || mpiTransactionId;

  if (!RESERVATION_ID_REGEX.test(reservationId)) {
    return NextResponse.redirect(
      getRedirectUrl(
        request,
        'tr',
        new URLSearchParams({ status: 'fail', ref: reservationId || 'unknown' }),
      ),
      { status: 302 },
    );
  }

  const provider = getPaymentProvider();
  const providerType = getPaymentProviderType();
  const record = await provider.getStatus(reservationId);
  const locale = record?.locale ?? 'tr';

  if (!record) {
    return NextResponse.redirect(
      getRedirectUrl(
        request,
        locale,
        new URLSearchParams({ status: 'fail', ref: reservationId, reason: 'expired' }),
      ),
      { status: 302 },
    );
  }

  if (providerType !== 'vakifbank' || !(provider instanceof VakifBankProvider)) {
    return NextResponse.redirect(
      getRedirectUrl(
        request,
        locale,
        new URLSearchParams({ status: 'fail', ref: reservationId, reason: 'cancelled' }),
      ),
      { status: 302 },
    );
  }

  const hashVerification = verifyVakifBankCallbackHash(callbackFields);
  if (!hashVerification.ok) {
    // eslint-disable-next-line no-console
    console.warn(
      `[api/payment/callback] HashData doğrulaması başarısız ref=${reservationId} reason=${hashVerification.reason ?? 'unknown'}`,
    );
    return NextResponse.redirect(
      getRedirectUrl(
        request,
        locale,
        new URLSearchParams({ status: 'fail', ref: reservationId, reason: 'hash_mismatch' }),
      ),
      { status: 302 },
    );
  }

  if (hashVerification.mode === 'skipped') {
    // eslint-disable-next-line no-console
    console.warn(
      `[api/payment/callback] HashData doğrulaması atlandı ref=${reservationId} reason=${hashVerification.reason ?? 'config'}`,
    );
  } else if (shouldLogVerboseDebug()) {
    // eslint-disable-next-line no-console
    console.info(
      `[api/payment/callback] HashData doğrulandı ref=${reservationId} fields=${hashVerification.matchedFieldSet?.join(',') ?? '-'}`,
    );
  }

  // VakıfBank alan adları: Cavv/Eci (büyük-küçük harf duyarlı). Banka 'Cavv',
  // 'Eci' gönderiyor; bazen 'CAVV'/'ECI' de olabilir — iki varyantı da dene.
  const cavvRaw = callbackFields.Cavv || callbackFields.CAVV || '';
  const eciRaw = callbackFields.Eci || callbackFields.ECI || '';

  const wasAlreadySuccess = record.status === 'success';
  const result = await provider.finalizeCallback({
    reservationId,
    status,
    cavv: cavvRaw || undefined,
    eci: eciRaw || undefined,
    // reservationId/VerifyEnrollmentRequestId (0012 alıyordu ama banka MPI'yı
    // buluyordu; Xid ile 1115 'bulunamıyor' — yani doğru referans bu).
    mpiTransactionId: verifyEnrollmentRequestId || mpiTransactionId || undefined,
    errorCode: callbackFields.ErrorCode || undefined,
    errorMessage: callbackFields.ErrorMessage || undefined,
    clientIp: getClientIp(request),
  });

  if (result.ok && !wasAlreadySuccess) {
    const updatedRecord = storeGet(reservationId);
    if (updatedRecord) {
      sendReservationEmails({
        guest: updatedRecord.guest,
        order: updatedRecord.order,
        card: updatedRecord.card,
        reservationId: updatedRecord.reservationId,
        amountCharged: updatedRecord.amountCharged,
      }).catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error('[api/payment/callback] email gönderim hatası:', error);
      });

      syncReservationToHatoperasyon(updatedRecord, 'api/payment/callback').catch((error: unknown) => {
        console.error('[api/payment/callback] hatoperasyon sync unexpected wrapper error:', error);
      });
    }
  }

  return NextResponse.redirect(
    getRedirectUrl(
      request,
      locale,
      new URLSearchParams({
        status: result.ok ? 'success' : 'fail',
        ref: reservationId,
      }),
    ),
    { status: 302 },
  );
}
