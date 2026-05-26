'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Video,
  Phone,
  MessageCircle,
  Instagram,
  Sparkles,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Canlı Tur Bölümü — Instagram + WhatsApp Video + Telefon
 * 3 kart eşit boyutta normal, hover'da hepsi lacivert+altın temaya döner.
 */
export function LiveTourSection() {
  const phoneRaw = SITE_CONFIG.contact?.phoneRaw || '+905339175424';
  const whatsappNumber = SITE_CONFIG.whatsapp?.number || '905339175424';
  const phoneDisplay = SITE_CONFIG.contact?.phone || '+90 533 917 54 24';
  const instagramUrl =
    'https://www.instagram.com/hatnaturelsapanca?igsh=Nmhsazc5NHJxY2Z6';
  const instagramHandle = '@hatnaturelsapanca';

  const waMessage = encodeURIComponent(
    'Merhaba 👋 Hat Naturel\'i canlı video ile gezmek istiyorum, müsait bir vakte randevu alabilir miyim?',
  );

  const options = [
    {
      icon: Instagram,
      kicker: 'Sosyal Medya',
      title: 'Instagram',
      subtitle: 'Güncel fotoğraflar ve hikayeler',
      cta: 'Takip Et',
      href: instagramUrl,
      note: instagramHandle,
    },
    {
      icon: Video,
      kicker: 'Canlı Görüntülü',
      title: 'WhatsApp Video',
      subtitle: 'Anlık görüntülü tur deneyimi',
      cta: 'Canlı Bağlan',
      href: `https://wa.me/${whatsappNumber}?text=${waMessage}`,
      note: phoneDisplay,
      badge: 'Tavsiye Edilen',
    },
    {
      icon: Phone,
      kicker: 'Sesli Arama',
      title: 'Telefon',
      subtitle: 'Klasik arama, hep yanınızdayız',
      cta: 'Hemen Ara',
      href: `tel:${phoneRaw}`,
      note: phoneDisplay,
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-dark backdrop-blur-sm">
            <MessageCircle size={13} />
            Canlı Bağlantı
          </span>
          <h2 className="mt-7 font-serif text-4xl leading-[1.15] tracking-tight text-neutral-900 md:text-5xl lg:text-[3.5rem]">
            <span className="font-light italic text-accent-dark">Oteli</span>{' '}
            <span className="font-semibold">Canlı Gez</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed text-neutral-600 md:text-lg">
            Tesisin gerçek halini görmek ister misin? Instagram, WhatsApp video
            veya telefonla bizi ara — anında bağlanalım, sana özel canlı tur
            atalım.
          </p>
        </motion.div>

        {/* 3 Bağlantı kartı — hepsi eşit, hover'da lacivert temaya döner */}
        <div className="mt-16 grid items-stretch gap-6 md:gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((opt, i) => (
            <motion.a
              key={opt.title}
              href={opt.href}
              target={opt.href.startsWith('http') ? '_blank' : undefined}
              rel={
                opt.href.startsWith('http') ? 'noopener noreferrer' : undefined
              }
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.25, 1, 0.5, 1],
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
              }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 text-neutral-900 shadow-[0_15px_35px_-15px_rgba(10,19,48,0.15)] transition-all duration-500 hover:border-accent/40 hover:bg-gradient-to-br hover:from-primary-900 hover:via-primary-800 hover:to-primary-900 hover:text-white hover:shadow-[0_30px_60px_-20px_rgba(10,19,48,0.55)]"
            >
              {/* HOVER'DA LOGO WATERMARK — her kartın içinde, lacivert arka planda görünür */}
              <div className="pointer-events-none absolute inset-x-0 -top-4 z-0 flex justify-center opacity-0 transition-opacity duration-700 group-hover:opacity-[0.18]">
                <div className="relative h-72 w-72">
                  <Image
                    src="/images/brand/logo-transparent.png"
                    alt=""
                    fill
                    sizes="320px"
                    className="object-contain"
                    priority={false}
                  />
                </div>
              </div>

              {/* Hover'da: arka plan altın ışıltılar */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/0 blur-3xl transition-all duration-700 group-hover:bg-accent/20" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/0 blur-3xl transition-all duration-700 group-hover:bg-accent/10" />

              {/* Hover'da üstte altın hairline */}
              <div className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Hover'da altın ring çerçeve */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-accent/0 transition-all duration-500 group-hover:ring-accent/30" />

              {/* Badge */}
              {opt.badge && (
                <span className="absolute right-5 top-5 z-10 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-primary-900 shadow-lg transition-all duration-500 group-hover:shadow-[0_5px_15px_rgba(212,175,55,0.5)]">
                  <Sparkles size={9} strokeWidth={2.5} />
                  {opt.badge}
                </span>
              )}

              {/* Icon */}
              <div className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-accent/10 text-primary-700 ring-1 ring-primary-100 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-amber-600 group-hover:text-primary-900 group-hover:shadow-[0_10px_30px_rgba(212,175,55,0.5)] group-hover:ring-accent/40">
                <opt.icon size={26} strokeWidth={2} />
              </div>

              {/* Kicker */}
              <span className="relative z-10 mt-6 inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-dark/80 transition-colors duration-500 group-hover:text-accent">
                {opt.kicker}
              </span>

              {/* Title — Playfair */}
              <h3 className="relative z-10 mt-2 font-serif text-2xl leading-tight tracking-tight text-neutral-900 transition-colors duration-500 group-hover:text-white md:text-[1.65rem]">
                {opt.title}
              </h3>

              {/* Subtitle */}
              <p className="relative z-10 mt-2 font-sans text-sm leading-relaxed text-neutral-500 transition-colors duration-500 group-hover:text-white/70">
                {opt.subtitle}
              </p>

              {/* Note (handle / phone display) */}
              {opt.note && (
                <p className="relative z-10 mt-5 font-mono text-[13px] font-medium tracking-tight text-neutral-700 transition-colors duration-500 group-hover:text-accent-light">
                  {opt.note}
                </p>
              )}

              {/* Spacer */}
              <div className="relative z-10 flex-grow" />

              {/* CTA — hover'da altın'a döner */}
              <div className="relative z-10 mt-7 inline-flex items-center justify-between gap-2 rounded-full border border-primary-900/15 bg-white px-6 py-3.5 font-sans text-[13px] font-semibold uppercase tracking-[0.15em] text-primary-900 transition-all duration-500 group-hover:gap-4 group-hover:border-accent group-hover:bg-accent group-hover:text-primary-900 group-hover:shadow-[0_8px_20px_rgba(212,175,55,0.4)]">
                <span>{opt.cta}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
