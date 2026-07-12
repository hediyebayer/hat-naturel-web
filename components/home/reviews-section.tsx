'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Star, Quote, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { fadeInUp, withDelay } from '@/lib/motion/variants';
import { REVIEWS, REVIEW_STATS, GOOGLE_REVIEWS_URL } from '@/lib/data/reviews';

/**
 * Anasayfa "Misafir Yorumları" bölümü.
 * Google Business Profile'dan seçilmiş gerçek yorumlar (manuel).
 *
 * Not: Yorum metinleri her zaman Türkçe orijinal halindedir (gerçek yorum,
 * çeviri yapılmaz). Sadece section başlık/etiketleri i18n'lidir.
 */

/** Küçük Google "G" logosu (inline SVG, marka gösterimi). */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden="true"
      role="img"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < count
              ? 'h-4 w-4 fill-accent text-accent'
              : 'h-4 w-4 fill-neutral-200 text-neutral-200'
          }
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const t = useTranslations('home.reviews');

  return (
    <section className="relative overflow-hidden bg-neutral-50 py-24 md:py-28">
      {/* Soft accent glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

      <Container size="xl" className="relative">
        {/* Başlık */}
        <motion.div {...fadeInUp} className="text-center">
          {/* Kicker — Google rozeti */}
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-dark shadow-sm">
            <GoogleG className="h-3.5 w-3.5" />
            {t('kicker')}
          </span>

          <Heading level={2} className="mt-6">
            {t('title')}
          </Heading>

          {/* Puan rozeti */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-neutral-600">
            <span className="inline-flex items-center gap-2 font-semibold text-neutral-900">
              <StarRow count={5} />
              <span>{REVIEW_STATS.rating.toFixed(1)} / 5.0</span>
            </span>
            <span className="hidden h-4 w-px bg-neutral-300 sm:inline-block" />
            <span className="inline-flex items-center gap-1.5">
              <GoogleG className="h-3.5 w-3.5" />
              {t('countLabel', { count: REVIEW_STATS.count })}
            </span>
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 md:text-lg">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Yorum kartları */}
        <div className="mt-14 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.article
              key={i}
              {...withDelay(fadeInUp, 0.1 + i * 0.08)}
              className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_15px_40px_-10px_rgba(212,175,55,0.2)]"
            >
              {/* Quote ikonu */}
              <Quote className="absolute right-6 top-6 h-8 w-8 text-accent/15 transition-colors duration-500 group-hover:text-accent/25" />

              {/* Üst: yıldızlar + etiket */}
              <div className="flex items-center justify-between gap-3">
                <StarRow count={review.stars} />
                {review.tag && (
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-medium text-primary-700">
                    {review.tag}
                  </span>
                )}
              </div>

              {/* Yorum metni */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700">
                {review.text}
              </p>

              {/* Öne çıkan rozeti */}
              {review.highlights && (
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent-dark">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  {review.highlights}
                </p>
              )}

              {/* Alt: isim + Google + tarih */}
              <div className="mt-5 flex items-center gap-3 border-t border-neutral-100 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-900 text-xs font-semibold text-white">
                  {review.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900">
                    {review.name}
                  </p>
                  <p className="inline-flex items-center gap-1 text-xs text-neutral-500">
                    <GoogleG className="h-3 w-3" />
                    {t('onGoogle')} · {review.date}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}

          {/* CTA kartı — tüm yorumları gör */}
          <motion.a
            {...withDelay(fadeInUp, 0.1 + REVIEWS.length * 0.08)}
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:border-accent hover:bg-accent/10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-500 group-hover:scale-110">
              <GoogleG className="h-7 w-7" />
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-neutral-900">
                {REVIEW_STATS.rating.toFixed(1)}{' '}
                <span className="text-accent-dark">/ 5.0</span>
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                {t('ctaCount', { count: REVIEW_STATS.count })}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-900 transition-colors group-hover:text-accent-dark">
              {t('cta')}
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </motion.a>
        </div>
      </Container>
    </section>
  );
}
