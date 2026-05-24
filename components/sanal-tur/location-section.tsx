'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Car, Plane, Bus } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export function LocationSection() {
  const address =
    SITE_CONFIG.contact?.address ||
    'Nailiye Mah. Nailiye/4 Sk. No:6/1 Sapanca / Sakarya';
  const directionsUrl =
    SITE_CONFIG.contact?.mapDirectionsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  const distances = [
    { icon: Car, label: 'Sapanca Merkez', value: '6-7 dk' },
    { icon: Car, label: 'Sapanca Gölü', value: '8 dk' },
    { icon: Plane, label: 'Sabiha Gökçen Havalimanı', value: '~1 sa 15 dk' },
    { icon: Plane, label: 'İstanbul Havalimanı', value: '~1 sa 45 dk' },
    { icon: Bus, label: 'Sakarya Otogarı', value: '~30 dk' },
    { icon: Navigation, label: 'TEM Otoyolu', value: '5 dk' },
  ];

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
            <MapPin size={14} />
            Konum & Ulaşım
          </span>
          <h2 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            <span className="italic font-light text-accent-dark">Sapanca</span>{' '}
            Doğasının Tam Kalbinde
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
            Şehrin gürültüsünden uzak, doğanın sessizliğine yakın — kolayca
            ulaşılan müstakil bir köşe.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          {/* SOL: Adres + Mesafeler */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {/* Adres kartı */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-dark">
                  <MapPin size={22} strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    Adresimiz
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {address}
                  </p>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-primary-900 shadow-[0_6px_18px_rgba(212,175,55,0.3)] transition-all hover:scale-105 hover:bg-accent-light"
                  >
                    <Navigation size={14} />
                    Yol Tarifi Al
                  </a>
                </div>
              </div>
            </div>

            {/* Mesafeler grid */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Clock size={18} className="text-accent-dark" />
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Mesafeler
                </h3>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {distances.map((d, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 px-3 py-2.5 transition-colors hover:bg-accent/5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-accent-dark shadow-sm">
                      <d.icon size={14} />
                    </span>
                    <div className="flex-1">
                      <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                        {d.label}
                      </div>
                      <div className="text-sm font-bold text-neutral-900">
                        {d.value}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* SAĞ: Harita iframe — premium frame */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="group relative"
          >
            <div
              className="absolute -inset-px rounded-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.4) 90deg, transparent 180deg, rgba(212,175,55,0.25) 270deg, transparent 360deg)',
                animation: 'globe-rotate 10s linear infinite',
              }}
            />
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:shadow-[0_30px_80px_-20px_rgba(212,175,55,0.3)]">
              {/* Köşe markerları */}
              <span className="pointer-events-none absolute left-3 top-3 z-20 h-3 w-3 border-l-2 border-t-2 border-accent" />
              <span className="pointer-events-none absolute right-3 top-3 z-20 h-3 w-3 border-r-2 border-t-2 border-accent" />
              <span className="pointer-events-none absolute bottom-3 left-3 z-20 h-3 w-3 border-b-2 border-l-2 border-accent" />
              <span className="pointer-events-none absolute bottom-3 right-3 z-20 h-3 w-3 border-b-2 border-r-2 border-accent" />

              <iframe
                src={SITE_CONFIG.contact?.mapEmbedUrl || ''}
                title="Hat Naturel Resort Sapanca Konum"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-[480px] w-full rounded-xl border-0 md:h-[560px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
