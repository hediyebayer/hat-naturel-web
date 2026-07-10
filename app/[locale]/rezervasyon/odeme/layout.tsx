import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/container';

interface OdemeLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function OdemeLayout(props: OdemeLayoutProps): Promise<React.ReactElement> {
  const params = await props.params;

  const {
    children
  } = props;

  setRequestLocale(params.locale);

  // KILL-SWITCH: Ödeme kapalıyken TÜM /odeme/* alt sayfaları (misafir formu, kart,
  // 3d-secure, sonuç) rezervasyona yönlendirilir. Doğrudan URL ile kart formuna
  // ulaşılamaz. Hatoperasyon rezervasyon kaydı bitince PAYMENTS_DISABLED=false.
  if (process.env.NEXT_PUBLIC_PAYMENTS_DISABLED === 'true') {
    redirect(`/${params.locale}/rezervasyon`);
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-20">
      <Container size="lg">
        {children}
      </Container>
    </div>
  );
}
