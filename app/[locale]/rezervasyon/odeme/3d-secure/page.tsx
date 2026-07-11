import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ThreeDSecureScreen } from '@/components/payment/three-d-secure-screen';
import { VakifbankAcsForm } from '@/components/payment/vakifbank-acs-form';
import { getPaymentProvider, getPaymentProviderType } from '@/lib/payment/provider';
import { getPaymentCallbackUrl } from '@/lib/payment/site-url';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '3D Secure Doğrulama | Hat Naturel',
    robots: { index: false, follow: false },
  };
}

function toAbsoluteUrl(value: string): string | null {
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

export default async function ThreeDSecurePage(props: PageProps): Promise<React.ReactElement> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setRequestLocale(params.locale);

  const { locale } = params;
  const ref = searchParams.ref;

  if (!ref) {
    redirect(`/${locale}/rezervasyon`);
  }

  const provider = getPaymentProvider();
  const record = await provider.getStatus(ref);

  if (!record) {
    redirect(`/${locale}/rezervasyon/odeme/sonuc?status=fail&ref=${encodeURIComponent(ref)}&reason=expired`);
  }

  if (getPaymentProviderType() === 'vakifbank') {
    if (!record.acsUrl || !record.paReq || !record.md) {
      redirect(`/${locale}/rezervasyon/odeme/sonuc?status=fail&ref=${encodeURIComponent(ref)}`);
    }

    const acsUrl = toAbsoluteUrl(record.acsUrl);
    const termUrl = getPaymentCallbackUrl();

    if (!acsUrl || !termUrl.startsWith('http')) {
      redirect(`/${locale}/rezervasyon/odeme/sonuc?status=fail&ref=${encodeURIComponent(ref)}`);
    }

    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4 py-10">
        <div className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-semibold text-neutral-900">3D Secure yönlendirmesi hazırlanıyor</h1>
            <p className="text-sm text-neutral-600">
              Bankanın güvenli doğrulama ekranına aktarılıyorsunuz. Lütfen sayfayı kapatmayın.
            </p>
          </div>

          <VakifbankAcsForm
            actionUrl={acsUrl}
            paReq={record.paReq}
            termUrl={termUrl}
            md={record.md}
          />
        </div>
      </div>
    );
  }

  const maskedPhone = '***** ** 42';

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-8">
      <div className="w-full max-w-md">
        <ThreeDSecureScreen
          reservationId={ref}
          amount={record.amountCharged}
          merchantName="Hat Naturel Resort"
          maskedPhone={maskedPhone}
          locale={locale}
        />
      </div>
    </div>
  );
}
