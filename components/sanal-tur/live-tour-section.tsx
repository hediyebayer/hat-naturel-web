'use client';

import { motion } from 'framer-motion';
import { Video, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Canlı Tur Bölümü — WhatsApp Video Call + FaceTime + Telefon
 * Otelden biri canlı bağlanıp tesisi gezdirsin.
 */
export function LiveTourSection() {
  const phoneRaw = SITE_CONFIG.contact?.phoneRaw || '+905339175424';
  const whatsappNumber = SITE_CONFIG.whatsapp?.number || '905339175424';
  const phoneDisplay = SITE_CONFIG.contact?.phone || '+90 533 917 54 24';

  const waMessage = encodeURIComponent(
    'Merhaba 👋 Hat Naturel\'i canlı video ile gezmek istiyorum, müsait bir vakte randevu alabilir miyim?',
  );

  const options = [
    {
      icon: Video,
      title: 'WhatsApp Video',
      subtitle: 'Anlık görüntülü tur',
      cta: 'WhatsApp\'tan Bağlan',
      href: `https://wa.me/${whatsappNumber}?text=${waMessage}`,
      gradient: 'from-green-500 to-emerald-600',
      glow: 'shadow-[0_15px_40px_-10px_rgba(34,197,94,0.45)]',
      badge: 'Tavsiye Edilen',
    },
    {
      icon: Sparkles,
      title: 'FaceTime',
      subtitle: 'iPhone kullanıcıları için',
      cta: 'FaceTime ile Ara',
      href: `facetime://${phoneRaw}`,
      gradient: 'from-blue-500 to-indigo-600',
      glow: 'shadow-[0_15px_40px_-10px_rgba(59,130,246,0.45)]',
      badge: 'iOS Only',
      note: phoneDisplay,
    },
    {
      icon: Phone,
      title: 'Telefon',
      subtitle: 'Klasik arama, hep yanınızdayız',
      cta: 'Hemen Ara',
      href: `tel:${phoneRaw}`,
      gradient: 'from-accent to-amber-500',
      glow: 'shadow-[0_15px_40px_-10px_rgba(212,175,55,0.45)]',
      note: phoneDisplay,
    },
  ];

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-dark backdrop-blur-sm">
            <MessageCircle size={14} />
            Canlı Bağlantı
          </span>
          <h2 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            <span className="italic font-light text-accent-dark">Oteli</span>{' '}
            Canlı Gez
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
            Tesisin gerçek halini görmek ister misin? WhatsApp video,
            FaceTime veya telefonla bizi ara — anında bağlanalım, sana özel
            canlı tur atalım.
          </p>
        </motion.div>

        {/* 3 Bağlantı kartı */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((opt, i) => (
            <motion.a
              key={opt.title}
              href={opt.href}
              target={opt.href.startsWith('http') ? '_blank' : undefined}
              rel={
                opt.href.startsWith('http') ? 'noopener noreferrer' : undefined
              }
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.25, 1, 0.5, 1],
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-500 hover:border-accent/40 ${opt.glow}`}
            >
              {/* Üst sağ badge */}
              {opt.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  {opt.badge}
                </span>
              )}

              {/* Icon */}
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${opt.gradient} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
              >
                <opt.icon size={24} strokeWidth={2.2} />
              </div>

              <h3 className="mt-5 font-serif text-xl font-bold text-neutral-900">
                {opt.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">{opt.subtitle}</p>

              {opt.note && (
                <p className="mt-3 font-mono text-sm font-semibold text-neutral-800">
                  {opt.note}
                </p>
              )}

              <div
                className={`mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${opt.gradient} px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all group-hover:gap-3 group-hover:shadow-xl`}
              >
                {opt.cta}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

              {/* Hover'da köşe ışıltısı */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/0 blur-2xl transition-all duration-700 group-hover:bg-accent/25" />
            </motion.a>
          ))}
        </div>

        {/* FaceTime not */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs text-neutral-500"
        >
          💡 FaceTime için Apple cihazları ile bizi şu numaradan arayabilirsiniz:{' '}
          <span className="font-mono font-semibold text-neutral-700">
            {phoneDisplay}
          </span>
        </motion.p>
      </div>
    </section>
  );
}
