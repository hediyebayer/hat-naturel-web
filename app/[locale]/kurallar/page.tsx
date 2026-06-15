import type { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ScrollText, AlertTriangle, LogIn, LogOut } from 'lucide-react';
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
      images: [
        {
          url: '/images/brand/og-default.jpg',
          width: 1200,
          height: 1000,
          alt: 'Hat Naturel Resort Sapanca — tesis kuralları',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/brand/og-default.jpg'],
    },
  };
}

/**
 * Kurallar sayfası — Hat Naturel Resort tesis kuralları.
 * Yapı:
 *  1. Hero (lacivert + ScrollText badge)
 *  2. Genel Kurallar listesi (info + warning ayrımı)
 *  3. Giriş/Çıkış saatleri — 2 kart (LogIn/LogOut)
 *  4. Teşekkür notu (gold accent)
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

interface RuleItem {
  key: string;
  type: 'info' | 'warning';
}

/**
 * Kuralların sırası ve uyarı/bilgi tipi.
 * i18n key'leri rules.items namespace'inden gelir.
 */
const RULES: ReadonlyArray<RuleItem> = [
  { key: 'identity', type: 'info' },
  { key: 'identityWarning', type: 'warning' },
  { key: 'guests', type: 'info' },
  { key: 'guestsWarning', type: 'warning' },
  { key: 'pets', type: 'info' },
  { key: 'trash', type: 'info' },
  { key: 'furniture', type: 'info' },
  { key: 'pool', type: 'info' },
  { key: 'poolWarning', type: 'warning' },
  { key: 'fire', type: 'info' },
  { key: 'breakfast', type: 'info' },
  { key: 'reservation', type: 'info' },
];

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

      {/* GENEL KURALLAR */}
      <section className="bg-gradient-to-b from-white to-neutral-50 py-16 md:py-24">
        <Container size="md">
          <h2 className="mb-8 text-center font-serif text-2xl font-bold text-primary-900 md:mb-12 md:text-3xl">
            {t('sectionGeneral')}
          </h2>
          <ul className="space-y-3 md:space-y-4">
            {RULES.map((rule) => (
              <RuleRow key={rule.key} ruleKey={rule.key} type={rule.type} />
            ))}
          </ul>
        </Container>
      </section>

      {/* GİRİŞ / ÇIKIŞ SAATLERİ */}
      <section className="bg-white py-16 md:py-24">
        <Container size="lg">
          <h2 className="mb-8 text-center font-serif text-2xl font-bold text-primary-900 md:mb-12 md:text-3xl">
            {t('sectionCheckIn')}
          </h2>
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {/* Giriş kartı */}
            <CheckCard
              icon={<LogIn className="h-6 w-6" />}
              title={t('checkInTitle')}
              time={t('checkInTime')}
              description={t('checkInDesc')}
              accent="primary"
            />
            {/* Çıkış kartı */}
            <CheckCard
              icon={<LogOut className="h-6 w-6" />}
              title={t('checkOutTitle')}
              time={t('checkOutTime')}
              description={t('checkOutDesc')}
              accent="gold"
            />
          </div>
        </Container>
      </section>

      {/* TEŞEKKÜR NOTU */}
      <section className="bg-gradient-to-b from-neutral-50 to-white pb-20 md:pb-28">
        <Container size="sm">
          <div className="text-center">
            <p className="font-serif text-xl italic text-primary-700 md:text-2xl">
              {t('thanksNote')}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────
   RULE ROW — bilgi (▫️) ya da uyarı (❗) satırı
   ───────────────────────────────────────────── */
interface RuleRowProps {
  ruleKey: string;
  type: 'info' | 'warning';
}

function RuleRow({ ruleKey, type }: RuleRowProps): React.ReactElement {
  const t = useTranslations('rules.items');
  const isWarning = type === 'warning';

  return (
    <li
      className={
        isWarning
          ? 'flex gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-4 md:gap-4 md:p-5'
          : 'flex gap-3 rounded-2xl border border-neutral-200 bg-white p-4 md:gap-4 md:p-5'
      }
    >
      <span
        aria-hidden
        className={
          isWarning
            ? 'mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600'
            : 'mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700'
        }
      >
        {isWarning ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </span>
      <p
        className={
          isWarning
            ? 'text-sm font-medium leading-relaxed text-red-900 md:text-base'
            : 'text-sm leading-relaxed text-neutral-700 md:text-base'
        }
      >
        {t(ruleKey)}
      </p>
    </li>
  );
}

/* ─────────────────────────────────────────────
   CHECK CARD — Giriş / Çıkış saat kartı
   ───────────────────────────────────────────── */
interface CheckCardProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  description: string;
  accent: 'primary' | 'gold';
}

function CheckCard({
  icon,
  title,
  time,
  description,
  accent,
}: CheckCardProps): React.ReactElement {
  const isGold = accent === 'gold';
  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft md:p-8">
      {/* Decorative corner glow */}
      <span
        aria-hidden
        className={
          isGold
            ? 'absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/15 blur-3xl'
            : 'absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary-200/40 blur-3xl'
        }
      />
      <div className="relative">
        <span
          className={
            isGold
              ? 'inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent-dark'
              : 'inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700'
          }
        >
          {icon}
        </span>
        <h3 className="mt-4 font-serif text-xl font-bold text-primary-900 md:text-2xl">
          {title}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={
              isGold
                ? 'font-serif text-4xl font-bold text-accent-dark md:text-5xl'
                : 'font-serif text-4xl font-bold text-primary-700 md:text-5xl'
            }
          >
            {time}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
