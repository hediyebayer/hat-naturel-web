import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ConnectLanding } from '@/components/baglan/connect-landing';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Bağlan | Hat Naturel Sapanca',
  robots: { index: false, follow: false },
};

export default async function BaglanPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'baglan' });

  return (
    <ConnectLanding
      kicker={t('kicker')}
      title={t('title')}
      subtitle={t('subtitle')}
      webLabel={t('web')}
      instagramLabel={t('instagram')}
      whatsappLabel={t('whatsapp')}
      footer={t('footer')}
    />
  );
}
