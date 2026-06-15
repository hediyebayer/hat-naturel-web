import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { OrderSummary } from '@/components/payment/order-summary';
import { StepIndicator } from '@/components/payment/step-indicator';
import { GuestInfoForm } from '@/components/payment/guest-info-form';
import { SecurityBadges } from '@/components/payment/security-badges';
import { getOrderFromQuery } from '@/lib/payment/order';

interface PageProps {
  params: { locale: string };
  searchParams: {
    room?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    deposit?: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Rezervasyon | Hat Naturel',
    robots: { index: false, follow: false },
  };
}

export default async function OdemePage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  unstable_setRequestLocale(params.locale);

  const { locale } = params;
  const roomSlug = searchParams.room ?? '';
  const checkIn = searchParams.checkIn ?? '';
  const checkOut = searchParams.checkOut ?? '';
  const guests = Number(searchParams.guests ?? 2);
  const depositMode = searchParams.deposit === 'deposit' ? 'deposit' : 'full';

  // Geçersiz query → redirect
  if (!roomSlug || !checkIn || !checkOut) {
    redirect(`/${locale}/rezervasyon`);
  }

  const orderResult = await getOrderFromQuery({ roomSlug, checkIn, checkOut, guests });
  if (!orderResult) {
    redirect(`/${locale}/rezervasyon`);
  }

  const t = await getTranslations({ locale, namespace: 'payment.guest' });
  const tSummary = await getTranslations({ locale, namespace: 'payment.summary' });

  return (
    <>
      <StepIndicator currentStep={1} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Sol: Misafir Formu */}
        <section>
          <Heading level={1} visualLevel={3} className="mb-2">
            {t('title')}
          </Heading>
          <Text variant="small" muted className="mb-6">
            {t('subtitle')}
          </Text>

          {/* Kapora seçimi */}
          <div className="mb-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-neutral-200">
            <p className="mb-3 text-sm font-semibold text-neutral-700">{t('depositLabel')}</p>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-neutral-50">
                <input
                  type="radio"
                  name="depositModeDisplay"
                  value="full"
                  defaultChecked={depositMode === 'full'}
                  form="deposit-form"
                  className="mt-0.5 text-primary-600 focus:ring-primary-500"
                  readOnly
                />
                <span className="text-sm text-neutral-700">
                  <strong>{tSummary('fullPayment')}</strong>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-neutral-50">
                <input
                  type="radio"
                  name="depositModeDisplay"
                  value="deposit"
                  defaultChecked={depositMode === 'deposit'}
                  form="deposit-form"
                  className="mt-0.5 text-primary-600 focus:ring-primary-500"
                  readOnly
                />
                <span className="text-sm text-neutral-700">
                  <strong>{tSummary('depositOption')}</strong>
                </span>
              </label>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
            <GuestInfoForm
              locale={locale}
              roomSlug={roomSlug}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={String(guests)}
              depositMode={depositMode}
            />
          </div>
        </section>

        {/* Sağ: Sipariş Özeti */}
        <div className="space-y-4">
          <OrderSummary
            room={orderResult.availableRoom}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            depositMode={depositMode}
            locale={locale}
          />
          <SecurityBadges locale={locale} />
        </div>
      </div>
    </>
  );
}
