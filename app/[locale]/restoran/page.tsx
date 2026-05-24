import type { Metadata } from 'next';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import {
  UtensilsCrossed,
  Coffee,
  Flame,
  Leaf,
  Cake,
  Clock,
  Phone,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

interface RestoranPageProps {
  params: { locale: string };
}

export const metadata: Metadata = {
  title: 'Restoran · Hat Naturel Resort Sapanca',
  description:
    "Sapanca'nın yerel ürünleriyle hazırlanan kahvaltı, öğle ve akşam menüleri. Aile dostu, doğa içinde açık restoran.",
};

/**
 * Restoran sayfası — Hat Naturel Mutfağı.
 *
 * Bölümler:
 *  1. Hero (lacivert gradient + altın badge)
 *  2. Intro paragrafı
 *  3. Mutfak imzası (4 özellik kartı)
 *  4. Servis saatleri (kahvaltı / öğle / akşam)
 *  5. CTA (WhatsApp + iletişim)
 */
export default function RestoranPage({
  params,
}: RestoranPageProps): React.ReactElement {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations('restaurant');

  const whatsappUrl = buildWhatsAppUrl({
    message: 'Merhaba, restoran rezervasyonu yapmak istiyorum.',
  });

  return (
    <>
      <RestoranHero locale={params.locale} />

      {/* INTRO */}
      <section className="bg-white py-20 md:py-28">
        <Container size="lg">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
              {t('subtitle')}
            </span>
            <Heading level={2} className="mt-4">
              {t('lead')}
            </Heading>
            <Text variant="lead" muted className="mt-6">
              {t('intro')}
            </Text>
          </div>
        </Container>
      </section>

      {/* MUTFAK İMZASI — 4 ÖZELLİK */}
      <section className="bg-neutral-50 py-20 md:py-28">
        <Container size="xl">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
              {t('badge')}
            </span>
            <Heading level={2} className="mt-3">
              {t('featuresTitle')}
            </Heading>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Coffee size={28} strokeWidth={1.5} />}
              title={t('feat1Title')}
              text={t('feat1Text')}
            />
            <FeatureCard
              icon={<Flame size={28} strokeWidth={1.5} />}
              title={t('feat2Title')}
              text={t('feat2Text')}
            />
            <FeatureCard
              icon={<Leaf size={28} strokeWidth={1.5} />}
              title={t('feat3Title')}
              text={t('feat3Text')}
            />
            <FeatureCard
              icon={<Cake size={28} strokeWidth={1.5} />}
              title={t('feat4Title')}
              text={t('feat4Text')}
            />
          </div>
        </Container>
      </section>

      {/* SERVİS SAATLERİ */}
      <section className="bg-primary-900 py-20 text-white md:py-28">
        <Container size="lg">
          <div className="mx-auto max-w-3xl text-center">
            <Clock className="mx-auto text-accent" size={40} strokeWidth={1.4} />
            <Heading level={2} className="!text-white mt-5">
              {t('hoursTitle')}
            </Heading>
            <Text variant="lead" className="mt-3 !text-neutral-300">
              {t('hoursNote')}
            </Text>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            <ServiceTime label={t('breakfast')} hours={t('breakfastHours')} />
            <ServiceTime label={t('lunch')} hours={t('lunchHours')} />
            <ServiceTime label={t('dinner')} hours={t('dinnerHours')} />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 md:py-28">
        <Container size="lg">
          <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-primary-900 to-primary-800 p-10 text-center text-white shadow-strong md:p-16">
            <UtensilsCrossed
              className="mx-auto text-accent"
              size={48}
              strokeWidth={1.4}
            />
            <Heading level={2} className="!text-white mt-6">
              {t('ctaTitle')}
            </Heading>
            <Text className="mx-auto mt-4 max-w-xl !text-neutral-300">
              {t('ctaText')}
            </Text>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white shadow-medium transition-transform hover:scale-[1.02]"
              >
                <MessageCircle size={18} />
                {t('ctaButton')}
              </a>
              <Link
                href={`/${params.locale}/iletisim`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-primary-900"
              >
                <Phone size={16} />
                {t('contactButton')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function RestoranHero({ locale: _locale }: { locale: string }): React.ReactElement {
  const t = useTranslations('restaurant');

  return (
    <section className="relative isolate overflow-hidden bg-primary-900 pb-20 pt-40 text-white md:pb-28 md:pt-48">
      {/* Lacivert gradient + subtle radial */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212,175,55,0.10) 0%, transparent 60%), linear-gradient(180deg, #07091a 0%, #0a1330 100%)',
        }}
      />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-md">
            <UtensilsCrossed size={14} />
            {t('badge')}
          </span>

          <h1 className="mt-10 font-serif text-4xl leading-[1.2] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:text-6xl lg:text-[5.5rem]">
            <span className="block pb-2 font-light">{t('heroTitle')}</span>
            <span className="mt-2 block pb-2 font-medium italic">
              {t('heroTitleItalic')}
            </span>
          </h1>

          <p className="mx-auto mt-10 max-w-2xl font-sans text-base text-white/85 leading-relaxed tracking-[0.02em] md:text-lg">
            {t('lead')}
          </p>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FeatureCard — 4 mutfak özelliği için
// ─────────────────────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}): React.ReactElement {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
      {/* Üst LED corner glow — altın */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
      />

      <div className="relative">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-900 text-accent shadow-sm">
          {icon}
        </div>
        <h3 className="mt-5 font-serif text-xl font-semibold text-neutral-900">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{text}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ServiceTime — kahvaltı / öğle / akşam kartı
// ─────────────────────────────────────────────────────────────────────────────

function ServiceTime({
  label,
  hours,
}: {
  label: string;
  hours: string;
}): React.ReactElement {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-white/10">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
        {label}
      </span>
      <p className="mt-3 font-serif text-2xl font-light text-white md:text-3xl">
        {hours}
      </p>
    </div>
  );
}
