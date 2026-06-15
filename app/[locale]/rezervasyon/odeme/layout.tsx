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

  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-20">
      <Container size="lg">
        {children}
      </Container>
    </div>
  );
}
