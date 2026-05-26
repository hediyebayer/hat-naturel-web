import type { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ScrollText } from 'lucide-react';
import { locales } from '@/lib/i18n/config';
import { Container } from '@/components/ui/container';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.rules',
  });

  const languages = Object.fromEntries(
    locales.map((loc) => [loc, `/${loc}/kurallar`]),
  );

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/kurallar`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `/${params.locale}/kurallar`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Kurallar sayfası — tesis kuralları, konaklama koşulları.
 * İçerik daha sonra kullanıcı tarafından eklenecek (placeholder hazır).
 */
export default function KurallarPage({
  params,
}: PageProps): React.ReactElement {
  unstable_setRequestLocale(params.locale);

  return (
    <main className="bg-white">
      <KurallarContent />
    </main>
  );
}

function KurallarContent(): React.ReactElement {
  const t = useTranslations('rules');

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary-900 pt-32 pb-16 text-white md:pt-40 md:pb-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_70%)]"
        />
        <Container size="lg" className="relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            <ScrollText size={14} />
            {t('badge')}
          </span>
          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            <span className="block">{t('heroTitle')}</span>
            <span className="mt-2 block italic font-light text-accent">
              {t('heroTitleItalic')}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {t('heroLead')}
          </p>
        </Container>
      </section>

      {/* İÇERİK — placeholder, kurallar buraya gelecek */}
      <section className="py-16 md:py-24">
        <Container size="md">
          <div className="prose prose-neutral max-w-none">
            <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
              {t('placeholder')}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
