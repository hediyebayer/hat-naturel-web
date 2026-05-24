import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { playfair, inter } from '@/styles/fonts';
import { locales, type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import '../globals.css';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  return {
    title: {
      default: t('defaultTitle'),
      template: `%s | ${t('brand')}`,
    },
    description: t('defaultDescription'),
    metadataBase: new URL('https://www.hatnaturel.com.tr'),
    openGraph: {
      type: 'website',
      locale: params.locale,
      siteName: t('brand'),
      images: [
        {
          url: '/images/brand/og-default.jpg',
          width: 1200,
          height: 1000,
          alt: 'Hat Naturel Sapanca Bungalov',
        },
      ],
    },
    icons: {
      icon: '/images/brand/logo-sm.jpg',
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps): Promise<React.ReactElement> {
  if (!locales.includes(params.locale as Locale)) notFound();
  unstable_setRequestLocale(params.locale);

  const messages = await getMessages();

  return (
    <html lang={params.locale} className={`${playfair.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={messages} locale={params.locale}>
          <a href="#main" className="skip-link">
            Ana içeriğe geç
          </a>
          <Header locale={params.locale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={params.locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
