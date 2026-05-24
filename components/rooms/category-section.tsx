'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Waves, ArrowRight } from 'lucide-react';
import { CATEGORIES, getRoomsByCategory } from '@/lib/data/rooms';

interface CategorySectionProps {
  locale: string;
}

/**
 * Kategorileri TEK SIRA YAN YANA gösterir.
 * 4 kart yan yana (sm: 2col, lg: 4col).
 * Her kart tıklanınca o kategorinin ilk odasına gider.
 */
export function CategorySection({ locale }: CategorySectionProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {CATEGORIES.map((category, i) => {
        const rooms = getRoomsByCategory(category.id);
        const previewImage = rooms[0]?.images[0];
        const firstRoomSlug = rooms[0]?.slug;
        if (!previewImage || !firstRoomSlug) return null;

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            <Link
              href={`/${locale}/odalar/${firstRoomSlug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_20px_50px_-10px_rgba(212,175,55,0.25)]"
            >
              {/* Görsel */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={previewImage}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Hover'da koyu gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

                {/* Top-right badges */}
                <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
                  <span className="inline-flex items-center rounded-full border border-white/30 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    {category.totalCount} Adet
                  </span>
                  {category.hasPool ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/60 bg-cyan-500/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-[0_0_12px_rgba(127,229,245,0.5)] backdrop-blur-md">
                      <Waves className="h-2.5 w-2.5" />
                      Havuzlu
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-white/30 bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-md">
                      Havuzsuz
                    </span>
                  )}
                </div>
              </div>

              {/* İçerik (light tema) */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="font-serif text-lg font-semibold leading-snug text-neutral-900 transition-colors duration-300 group-hover:text-accent-dark">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    {category.subtitle}
                  </p>
                </div>

                {/* CTA satırı */}
                <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    Detayları Gör
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent-dark transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
