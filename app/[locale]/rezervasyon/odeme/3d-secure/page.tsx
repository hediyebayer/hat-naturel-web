import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ThreeDSecureScreen } from '@/components/payment/three-d-secure-screen';

interface PageProps {
  params: { locale: string };
  searchParams: { ref?: string };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '3D Secure Doğrulama | Hat Naturel',
    robots: { index: false, follow: false },
  };
}

export default async function ThreeDSecurePage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  unstable_setRequestLocale(params.locale);

  const { locale } = params;
  const ref = searchParams.ref;

  if (!ref) {
    redirect(`/${locale}/rezervasyon`);
  }

  // Server-side fetch status
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  let amount = 0;

  try {
    const res = await fetch(`${baseUrl}/api/payment/status?ref=${ref}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = (await res.json()) as {
        ok: boolean;
        record?: { amountCharged: number };
      };
      if (data.ok && data.record) {
        amount = data.record.amountCharged;
      }
    }
  } catch {
    // Fetch failed — amount remains 0, UI shows as is
  }

  // Masked phone placeholder (gerçek VakıfBank entegrasyonunda record'dan gelecek)
  const maskedPhone = '***** ** 42';

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-8">
      <div className="w-full max-w-md">
        <ThreeDSecureScreen
          reservationId={ref}
          amount={amount}
          merchantName="Hat Naturel Resort"
          maskedPhone={maskedPhone}
          locale={locale}
        />
      </div>
    </div>
  );
}
