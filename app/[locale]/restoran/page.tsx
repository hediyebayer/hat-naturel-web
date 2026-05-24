import type { Metadata } from 'next';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Coffee, Clock, Sun, Infinity as InfinityIcon } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { BreakfastMenu, TeaHighlight } from '@/components/restoran/breakfast-menu';

interface RestoranPageProps {
  params: { locale: string };
}

export const metadata: Metadata = {
  title: 'Kahvaltı · Hat Naturel Resort Sapanca',
  description:
    "Doğanın içinde, sınırsız çay eşliğinde köy kahvaltısı. Patates kızartması, sigara böreği, omlet, peynir tabağı, zeytin söğüş, bal-tereyağ, reçel ve daha fazlası.",
};

/**
 * Restoran sayfası — sadece kahvaltı.
 *
 * Bölümler:
 *  1. Hero (sabah teması, güneş animasyonlu, lacivert→altın gradient)
 *  2. Intro paragrafı
 *  3. Kahvaltı menüsü (12 tabak, sıralı animasyon, hover lift)
 *  4. Sınırsız çay vurgusu (gold accent)
 *  5. Kahvaltı saatleri (büyük tek kart)
 *  6. CTA (WhatsApp + iletişim)
 */
export default function RestoranPage({
  params,
}: RestoranPageProps): React.ReactElement {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations('restaurant');

  return (
    <>
      <RestoranHero />

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

      {/* KAHVALTI MENÜSÜ — 12 tabak animasyonlu */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-amber-50 py-20 md:py-28">
        {/* Decorative top divider */}
        <div
          aria-hidden
          className="mx-auto mb-12 h-px w-32 bg-gradient-to-r from-transparent via-accent to-transparent"
        />

        {/* Background sun — sağ üst, çok soft */}
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(252,211,77,0.2) 0%, rgba(253,224,71,0.1) 50%, transparent 100%)',
          }}
        />

        <Container size="xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              <Sun size={14} className="animate-pulse" />
              {t('menuBadge')}
            </span>
            <Heading level={2} className="mt-3">
              {t('menuTitle')}
            </Heading>
            <Text variant="lead" muted className="mt-4 mx-auto max-w-2xl">
              {t('menuSubtitle')}
            </Text>
          </div>

          <BreakfastMenu />
        </Container>
      </section>

      {/* SINIRSIZ ÇAY VURGUSU */}
      <section className="bg-primary-900 py-20 text-white md:py-28">
        <Container size="lg">
          <TeaHighlight />
        </Container>
      </section>

      {/* KAHVALTI SAATLERİ — büyük tek kart */}
      <section className="bg-gradient-to-b from-white to-amber-50 py-20 md:py-28">
        <Container size="lg">
          <div className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-white p-10 text-center shadow-[0_20px_60px_-20px_rgba(212,175,55,0.3)] md:p-14">
              {/* Decorative gold corner */}
              <span
                aria-hidden
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
              />
              <span
                aria-hidden
                className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl"
              />

              <div className="relative">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 text-accent shadow-medium">
                  <Clock size={32} strokeWidth={1.5} />
                </span>
                <Heading level={2} className="mt-6">
                  {t('hoursTitle')}
                </Heading>
                <p className="mt-3 text-sm text-neutral-600">
                  {t('hoursNote')}
                </p>

                {/* Saat */}
                <div className="mt-8 inline-flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br from-amber-50 to-white px-10 py-6 ring-1 ring-amber-200/60">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-700">
                    {t('breakfast')}
                  </span>
                  <span className="font-serif text-4xl font-light text-primary-900 md:text-5xl">
                    {t('breakfastHours')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO — sabah teması
// ─────────────────────────────────────────────────────────────────────────────

function RestoranHero(): React.ReactElement {
  const t = useTranslations('restaurant');

  return (
    <section className="relative isolate overflow-hidden bg-primary-900 pb-20 pt-32 text-white md:pb-28 md:pt-40">
      {/* Layer 0: Background kahvaltı fotoğrafı — yavaş Ken Burns zoom */}
      <Image
        src="/images/restoran/hero-kahvalti.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover motion-safe:animate-[heroZoom_20s_ease-out_infinite_alternate]"
      />
      {/* Layer 1: dark overlay — okunabilirlik */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, rgba(7,9,26,0.85) 0%, rgba(10,19,48,0.75) 50%, rgba(42,26,62,0.80) 100%)',
        }}
      />
      {/* Layer 2: sunrise glow — bottom amber */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-amber-500/20 via-amber-300/5 to-transparent"
      />
      {/* Layer 3: pulsing sun — sağ üst */}
      <div
        aria-hidden
        className="absolute -right-20 top-20 -z-10 h-64 w-64 animate-pulse rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(252,211,77,0.12) 50%, transparent 100%)',
          animationDuration: '4s',
        }}
      />
      {/* Layer 4: vinyet — kenarları koyulaştır */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,9,26,0.7)_100%)]"
      />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-md">
            <Coffee size={14} />
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

          {/* Sınırsız çay rozeti */}
          <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm text-white/90 backdrop-blur-md ring-1 ring-amber-300/30">
            <InfinityIcon size={14} className="text-accent" />
            <span>{t('teaPromise')}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
