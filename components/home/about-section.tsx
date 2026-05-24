'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { TreePine, Waves, Home, Heart } from 'lucide-react';

/**
 * Anasayfa "Hakkımızda / Neden Hat Naturel" bölümü.
 * Copywriter Tarz C: samimi, davetkâr.
 *
 * "Doğanın Yanı Başında Bir Mola"
 */
export function AboutSection() {
  const highlights = [
    {
      icon: TreePine,
      text: 'Sabah uyanınca dışarıda sadece ağaçlar ve kuş sesi var.',
    },
    {
      icon: Waves,
      text: 'Isıtmalı havuz ve sauna ile her mevsim gerçek bir sıfırlama.',
    },
    {
      icon: Home,
      text: 'Mutfak, oturma odası, tam mahremiyet — otel odası değil, eviniz.',
    },
    {
      icon: Heart,
      text: 'Her gelişinizde aynı sıcaklıkla karşılayan bir köşe.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-12 md:pt-32 md:pb-16">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,#0a1330_1px,transparent_0)] [background-size:32px_32px]" />

      {/* Soft accent glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

      <Container size="lg" className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="text-center"
        >
          {/* Kicker */}
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-dark">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Hat Naturel
          </span>

          {/* Başlık */}
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
            <span className="italic font-light text-accent-dark">Doğanın</span>{' '}
            Yanı Başında{' '}
            <span className="block md:inline">Bir Mola</span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-neutral-600 md:text-lg">
            Sapanca&apos;da, ağaçların arasında — şehirden uzak, ruhunuza yakın.
          </p>
        </motion.div>

        {/* Ana paragraf */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="mx-auto mt-14 max-w-3xl"
        >
          <p className="text-center text-lg leading-relaxed text-neutral-700 md:text-xl md:leading-[1.8]">
            Hat Naturel, büyük otellerin gürültüsünden sıkılanlar için
            tasarlandı. Sapanca ormanına yayılmış{' '}
            <strong className="font-semibold text-neutral-900">
              13 müstakil evimizde
            </strong>{' '}
            konaklayan her misafirimiz kendine ait bir dünyaya adım atar:
            üçgen çatıların altında huzurlu bir sabah, ısıtmalı havuzda
            serbest kalan zihin, saunanın sıcaklığında gevşeyen omuzlar.
          </p>
          <p className="mt-6 text-center text-base leading-relaxed text-neutral-600 md:text-lg">
            Bir hafta sonu kaçamağı da olsa, uzun bir mola da — burası her
            gelişinizde sizi o aynı sıcaklıkla karşılar. Çünkü gerçek
            dinlenme, sayısı 13&apos;ü geçmeyen bir yerde başlar.
          </p>
        </motion.div>

        {/* Vurgu satırları — 4 kart */}
        <div className="mt-20 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: 0.4 + i * 0.1,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="group relative rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_15px_40px_-10px_rgba(212,175,55,0.2)]"
            >
              {/* Accent köşe çizgisi */}
              <div className="absolute left-6 top-6 h-6 w-px bg-gradient-to-b from-accent to-transparent" />
              <div className="absolute left-6 top-6 h-px w-6 bg-gradient-to-r from-accent to-transparent" />

              <div className="ml-2 mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent-dark transition-all duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-neutral-700">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mx-auto mt-20 max-w-xl text-center font-serif text-2xl italic leading-snug text-neutral-800 md:text-3xl"
        >
          &ldquo;Sizin köşeniz hazır.{' '}
          <span className="text-accent-dark">
            Bir tarih seçin, gerisini biz halledelim.
          </span>
          &rdquo;
        </motion.p>
      </Container>
    </section>
  );
}
