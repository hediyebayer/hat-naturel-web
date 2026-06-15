import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { locales } from '@/lib/i18n/config';
import { Camera } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { GalleryGrid } from '@/components/gallery/gallery-grid';
import { HeroPhotoCarousel } from '@/components/gallery/hero-photo-carousel';
import { GALLERY_IMAGES } from '@/lib/data/gallery';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.gallery',
  });

  const languages = Object.fromEntries(
    locales.map((loc) => [loc, `/${loc}/galeri`]),
  );

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/galeri`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `/${params.locale}/galeri`,
      type: 'website',
      images: [
        {
          url: '/images/brand/og-default.jpg',
          width: 1200,
          height: 1000,
          alt: 'Hat Naturel Resort Sapanca — galeri',
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
 * Galeri sayfası — tesisten drone + yer çekimleri.
 *
 * Sayfa yapısı:
 *  1. Hero (lacivert, dot pattern + gold radial + altın pulse badge + 2 satır italic başlık)
 *  2. GalleryGrid (client) — filtre chip'leri + masonry + lightbox
 */
export default async function GalleriPage(props: PageProps): Promise<React.ReactElement> {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <>
      <GaleriHero />

      <section className="bg-gradient-to-b from-white via-neutral-50 to-white py-20 md:py-28">
        {/* Decorative top divider */}
        <div
          aria-hidden
          className="mx-auto -mt-4 mb-12 h-px w-32 bg-gradient-to-r from-transparent via-accent to-transparent"
        />

        <Container size="xl">
          <GalleryGrid />
        </Container>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function GaleriHero(): React.ReactElement {
  const t = useTranslations('gallery');

  return (
    <section className="relative isolate overflow-hidden bg-primary-900 pb-20 pt-32 text-white md:pb-28 md:pt-40">
      {/* Layer 1: lacivert gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #07091a 0%, #0a1330 50%, #1a2a5e 100%)',
        }}
      />
      {/* Layer 2: dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      {/* Layer 3: gold radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.15),transparent_60%)]"
      />
      {/* Layer 4: vinyet */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,9,26,0.6)_100%)]"
      />

      <Container>
        {/* Üst: Badge + Büyük başlık + Lead */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-md">
            <Camera size={14} />
            {t('badge')}
          </span>

          {/* Başlık — 2 satır italic stili */}
          <h1 className="mt-10 font-serif text-4xl leading-[1.2] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:text-6xl lg:text-[5.5rem]">
            <span className="block pb-2 font-light">{t('heroTitle')}</span>
            <span className="mt-2 block pb-2 font-medium italic">
              {t('heroTitleItalic')}
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl font-sans text-base text-white/85 leading-relaxed tracking-[0.02em] md:text-lg">
            {t('heroLead')}
          </p>
        </div>

        {/* Dinamik dönen carousel — tüm galeri fotoğrafları 5sn'de bir gruba geçer */}
        <div className="mt-14 md:mt-16">
          <HeroPhotoCarousel
            images={GALLERY_IMAGES.map((img) => img.src)}
          />
        </div>
      </Container>
    </section>
  );
}
