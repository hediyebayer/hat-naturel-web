/**
 * POST /api/payment/callback
 *
 * VakıfBank SuccessUrl / FailureUrl callback noktası.
 * Banka form-urlencoded POST eder; Status=Y/A ise provizyon tamamlanır.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getPaymentProvider, getPaymentProviderType } from '@/lib/payment/provider';
import { VakifBankProvider } from '@/lib/payment/vakifbank-provider';
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();

  const status = String(formData.get('Status') ?? '').trim();
  const verifyEnrollmentRequestId = String(formData.get('VerifyEnrollmentRequestId') ?? '').trim();
  const mpiTransactionId = String(formData.get('MpiTransactionId') ?? '').trim();
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

  const wasAlreadySuccess = record.status === 'success';
  const result = await provider.finalizeCallback({
    reservationId,
    status,
    cavv: String(formData.get('CAVV') ?? '').trim() || undefined,
    eci: String(formData.get('ECI') ?? '').trim() || undefined,
    mpiTransactionId: mpiTransactionId || verifyEnrollmentRequestId || undefined,
    errorCode: String(formData.get('ErrorCode') ?? '').trim() || undefined,
    errorMessage: String(formData.get('ErrorMessage') ?? '').trim() || undefined,
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
