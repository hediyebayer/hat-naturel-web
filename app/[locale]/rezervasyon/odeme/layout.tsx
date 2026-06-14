import { unstable_setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/container';

interface OdemeLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function OdemeLayout({
  children,
  params,
}: OdemeLayoutProps): React.ReactElement {
  unstable_setRequestLocale(params.locale);

  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-20">
      <Container size="lg">
        {children}
      </Container>
    </div>
  );
}
