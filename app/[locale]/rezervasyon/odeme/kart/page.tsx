import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { OrderSummary } from '@/components/payment/order-summary';
import { StepIndicator } from '@/components/payment/step-indicator';
import { CardForm } from '@/components/payment/card-form';
import { SecurityBadges } from '@/components/payment/security-badges';
import { getOrderFromQuery } from '@/lib/payment/order';
import { DEPOSIT_RATIO } from '@/lib/content/legal';
import type { OrderSummary as OrderSummaryType } from '@/lib/payment/types';

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
    title: 'Kart Bilgileri | Hat Naturel',
    robots: { index: false, follow: false },
  };
}

export default async function KartPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  unstable_setRequestLocale(params.locale);

  const { locale } = params;
  const roomSlug = searchParams.room ?? '';
  const checkIn = searchParams.checkIn ?? '';
  const checkOut = searchParams.checkOut ?? '';
  const guests = Number(searchParams.guests ?? 2);
  const depositMode = searchParams.deposit === 'deposit' ? 'deposit' as const : 'full' as const;

  if (!roomSlug || !checkIn || !checkOut) {
    redirect(`/${locale}/rezervasyon`);
  }

  const orderResult = await getOrderFromQuery({ roomSlug, checkIn, checkOut, guests });
  if (!orderResult) {
    redirect(`/${locale}/rezervasyon`);
  }

  const t = await getTranslations({ locale, namespace: 'payment.card' });

  const { availableRoom } = orderResult;
  const depositAmount = Math.round(availableRoom.totalPrice * DEPOSIT_RATIO);

  // Build the OrderSummary type for API
  const order: OrderSummaryType = {
    roomSlug,
    roomName: availableRoom.room.slug, // locale-agnostic key; server translates
    checkIn,
    checkOut,
    guests,
    nights: availableRoom.nights,
    totalPrice: availableRoom.totalPrice,
    depositAmount,
    depositMode,
  };

  return (
    <>
      <StepIndicator currentStep={2} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Sol: Kart Formu */}
        <section>
          <Heading level={1} visualLevel={3} className="mb-2">
            {t('title')}
          </Heading>
          <Text variant="small" muted className="mb-6">
            Kart bilgileriniz 3D Secure ile korumalı olarak işlenmektedir.
          </Text>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
            <CardForm locale={locale} order={order} />
          </div>
        </section>

        {/* Sağ: Sipariş Özeti */}
        <div className="space-y-4">
          <OrderSummary
            room={availableRoom}
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
