import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { OrderSummary } from '@/components/payment/order-summary';
import { DepositSelector } from '@/components/payment/deposit-selector';
import { StepIndicator } from '@/components/payment/step-indicator';
import { GuestInfoForm } from '@/components/payment/guest-info-form';
import { SecurityBadges } from '@/components/payment/security-badges';
import { getOrderFromQuery } from '@/lib/payment/order';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    room?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    deposit?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Rezervasyon | Hat Naturel',
    robots: { index: false, follow: false },
  };
}

export default async function OdemePage(props: PageProps): Promise<React.ReactElement> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setRequestLocale(params.locale);

  const { locale } = params;
  // NOT: Ödeme kill-switch guard'ı layout.tsx'te (tüm /odeme/* alt sayfaları korunur).
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

          {/* Kapora seçimi — interaktif: URL ?deposit= parametresini günceller */}
          <DepositSelector value={depositMode} />

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
