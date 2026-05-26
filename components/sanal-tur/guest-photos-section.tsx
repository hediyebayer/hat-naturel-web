'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Camera, Heart, Upload, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Sizden Gelen Fotoğraflar bölümü.
 * Şimdilik:
 *  - 6 placeholder kart (Hediye gerçek fotoğrafları yükleyince değişir)
 *  - "Fotoğraf paylaşmak ister misiniz?" CTA → WhatsApp'a yönlendir
 *
 * Tüm metinler `sanalTur` namespace'inden gelir.
 */
export function GuestPhotosSection() {
  const t = useTranslations('sanalTur');

  const whatsappNumber = SITE_CONFIG.whatsapp?.number || '905339175424';
  const waMessage = encodeURIComponent(t('guestShareMessage'));
  const submitUrl = `https://wa.me/${whatsappNumber}?text=${waMessage}`;

  // Placeholder kart sayısı (gerçek fotoğraflar gelene kadar)
  const placeholders = Array.from({ length: 6 });

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-dark backdrop-blur-sm">
            <Camera size={14} />
            {t('guestBadge')}
          </span>
          <h2 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            <span className="italic font-light text-accent-dark">
              {t('guestTitleItalic')}
            </span>{' '}
            {t('guestTitleAfter')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
            {t('guestSubtitle')}
          </p>
        </motion.div>

        {/* Placeholder Grid — Hediye gerçek fotoğrafları yükleyince değişir */}
        <div className="mt-12 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
          {placeholders.map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-dashed border-neutral-300 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 transition-all duration-500 hover:border-accent/50 hover:shadow-[0_15px_40px_-15px_rgba(212,175,55,0.3)]"
            >
              {/* Subtle pattern bg */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)',
                }}
              />

              {/* Yakında placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 2 + i * 0.3,
                  }}
                  className="text-4xl"
                >
                  {['📸', '🌿', '🏡', '✨', '☕', '🌅'][i]}
                </motion.div>
                <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 backdrop-blur-sm">
                  {t('guestComingSoon')}
                </span>
                <p className="text-xs text-neutral-400">
                  {t('guestPlaceholder')}
                </p>
              </div>

              {/* Corner pin */}
              <div className="absolute right-3 top-3">
                <Heart
                  size={14}
                  className="text-neutral-300 transition-colors group-hover:text-accent"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA: Fotoğraf Paylaş */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14"
        >
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/5 via-white to-accent/5 p-8 md:p-12">
            {/* Decorative glow */}
            <div
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(29,51,112,0.15) 0%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />

            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex items-center gap-2 text-accent-dark">
                  <Sparkles size={16} />
                  <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                    {t('guestShareKicker')}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
                  {t('guestShareTitle')}{' '}
                  <span className="italic font-light text-accent-dark">
                    {t('guestShareTitleItalic')}
                  </span>
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
                  {t('guestShareDescription')}
                </p>
              </div>

              <a
                href={submitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-accent px-7 py-4 text-sm font-bold text-primary-900 shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-all hover:scale-105 hover:bg-accent-light hover:shadow-[0_15px_40px_rgba(212,175,55,0.6)]"
              >
                <Upload
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
                {t('guestShareCta')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
