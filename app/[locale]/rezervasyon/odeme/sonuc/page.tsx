import type { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ButtonLink } from '@/components/ui/button';
import { OrderSummary } from '@/components/payment/order-summary';
import { StepIndicator } from '@/components/payment/step-indicator';
import { getOrderFromQuery } from '@/lib/payment/order';

interface PageProps {
  params: { locale: string };
  searchParams: {
    status?: string;
    ref?: string;
    reason?: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ödeme Sonucu | Hat Naturel',
    robots: { index: false, follow: false },
  };
}

interface StatusRecord {
  reservationId: string;
  status: string;
  amountCharged: number;
  currency: string;
  paidAt: string | null;
  maskedPan: string;
  last4: string;
  brand: string;
  failReason: string | null;
  order: {
    roomSlug: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    totalPrice: number;
    depositAmount: number;
    depositMode: 'full' | 'deposit';
  };
  guest: { firstName: string; lastName: string; email: string };
}

async function fetchRecord(ref: string): Promise<StatusRecord | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_BASE_URL ??
      'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/payment/status?ref=${encodeURIComponent(ref)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok: boolean; record?: StatusRecord };
    return data.ok && data.record ? data.record : null;
  } catch {
    return null;
  }
}

const REASON_LABELS: Record<string, string> = {
  invalid_otp: 'Girdiğiniz kod hatalı veya geçersiz.',
  expired: 'Doğrulama süresi doldu.',
  cancelled: 'İşlem iptal edildi.',
};

export default async function SonucPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  unstable_setRequestLocale(params.locale);

  const { locale } = params;
  const status = searchParams.status;
  const ref = searchParams.ref;
  const reason = searchParams.reason;

  const t = await getTranslations({ locale, namespace: 'payment.result' });

  const record = ref ? await fetchRecord(ref) : null;

  const isSuccess = status === 'success' && !!record && record.status === 'success';

  // Başarılı: oda verisi çek
  let availableRoom = null;
  if (record) {
    const orderResult = await getOrderFromQuery({
      roomSlug: record.order.roomSlug,
      checkIn: record.order.checkIn,
      checkOut: record.order.checkOut,
      guests: record.order.guests,
    });
    availableRoom = orderResult?.availableRoom ?? null;
  }

  const retryQuery = record
    ? new URLSearchParams({
        room: record.order.roomSlug,
        checkIn: record.order.checkIn,
        checkOut: record.order.checkOut,
        guests: String(record.order.guests),
      }).toString()
    : '';

  return (
    <>
      <StepIndicator currentStep={4} />

      <div className="mx-auto max-w-2xl">
        {isSuccess ? (
          /* ─── SUCCESS ─── */
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 text-center">
            <CheckCircle2 size={56} className="mx-auto mb-4 text-green-500" />
            <Heading level={1} visualLevel={3} className="mb-3">
              {t('successTitle')}
            </Heading>
            <Text variant="body" muted className="mb-2">
              {t('successBody', {
                email: record!.guest.email,
                ref: record!.reservationId,
              })}
            </Text>

            {/* Referans no */}
            <div className="my-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2 text-sm font-mono font-semibold text-green-700 ring-1 ring-green-200">
              <span className="text-green-400">#</span>
              {record!.reservationId}
            </div>

            {/* Kart özeti */}
            <p className="text-xs text-neutral-400 mb-6">
              {record!.brand.toUpperCase()} •••• {record!.last4}
            </p>

            {/* Oda özeti */}
            {availableRoom && (
              <div className="mb-8 text-left">
                <OrderSummary
                  room={availableRoom}
                  checkIn={record!.order.checkIn}
                  checkOut={record!.order.checkOut}
                  guests={record!.order.guests}
                  depositMode={record!.order.depositMode}
                  locale={locale}
                  compact
                />
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <ButtonLink href={`/${locale}`} variant="primary">
                {t('home')}
              </ButtonLink>
              <ButtonLink href={`/${locale}/iletisim`} variant="outline">
                {t('contact')}
              </ButtonLink>
            </div>
          </div>
        ) : (
          /* ─── FAIL ─── */
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 text-center">
            <XCircle size={56} className="mx-auto mb-4 text-red-500" />
            <Heading level={1} visualLevel={3} className="mb-3">
              {t('failTitle')}
            </Heading>
            <Text variant="body" muted className="mb-4">
              {t('failBody')}
            </Text>

            {reason && REASON_LABELS[reason] && (
              <div className="mb-6 rounded-xl bg-red-50 px-5 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {REASON_LABELS[reason]}
              </div>
            )}

            {ref && (
              <p className="mb-6 text-xs text-neutral-400">
                Referans: <span className="font-mono">{ref}</span>
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {retryQuery && (
                <ButtonLink
                  href={`/${locale}/rezervasyon/odeme?${retryQuery}`}
                  variant="primary"
                >
                  {t('retry')}
                </ButtonLink>
              )}
              <ButtonLink href={`/${locale}/iletisim`} variant="outline">
                {t('contact')}
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
