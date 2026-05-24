import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { VirtualTourSection } from '@/components/home/virtual-tour-section';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'virtualTour',
  });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function VirtualTourPage({
  params,
}: PageProps): React.ReactElement {
  unstable_setRequestLocale(params.locale);
  return <VirtualTourSection locale={params.locale} preview={false} />;
}
