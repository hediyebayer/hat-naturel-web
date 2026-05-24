'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Waves, ArrowRight } from 'lucide-react';
import { CATEGORIES, getRoomsByCategory, type Room } from '@/lib/data/rooms';
import { RoomCard } from '@/components/rooms/room-card';

interface CategorySectionProps {
  locale: string;
}

/**
 * Kategorileri YAN YANA gösterir (4 sütun premium kart).
 * Her kart o kategorinin ilk odasının görselini önizleme olarak gösterir.
 * Tıklanınca kategori detayına (smooth scroll) veya doğrudan ilk odaya gider.
 */
export function CategorySection({ locale }: CategorySectionProps) {
  return (
    <>
      {/* Üst kısım: 4 kategori yan yana */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                href={`#${category.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-md transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]"
              >
                {/* Görsel */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={previewImage}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07091a] via-[#07091a]/40 to-transparent" />

                  {/* Top-right badges */}
                  <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      {category.totalCount} Adet
                    </span>
                    {category.hasPool && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#7FE5F5]/40 bg-[#7FE5F5]/15 px-2.5 py-1 text-[10px] font-semibold text-[#7FE5F5] shadow-[0_0_12px_rgba(127,229,245,0.3)] backdrop-blur-md">
                        <Waves className="h-2.5 w-2.5" />
                        Havuzlu
                      </span>
                    )}
                  </div>
                </div>

                {/* İçerik */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-serif text-lg font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-accent">
                      {category.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      {category.subtitle}
                    </p>
                  </div>

                  {/* CTA satırı */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      Detayları Gör
                    </span>
                    <ArrowRight className="h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Hover'da LED altın çerçeve glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3)]" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Alt kısım: Her kategori detaylı (anchor target) */}
      <div className="mt-32 space-y-24">
        {CATEGORIES.map((category) => {
          const rooms = getRoomsByCategory(category.id);
          if (rooms.length === 0) return null;

          return (
            <motion.div
              key={`detail-${category.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="scroll-mt-32"
              id={category.id}
            >
              {/* Kategori detay başlığı */}
              <div className="mb-10 flex flex-col gap-4 border-l-2 border-accent pl-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="relative inline-block font-serif text-2xl uppercase tracking-widest text-white md:text-3xl">
                      {category.title}
                      <span className="absolute -bottom-2 left-0 h-px w-full bg-gradient-to-r from-accent via-accent/40 to-transparent" />
                    </h3>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/75 backdrop-blur-sm">
                      {category.totalCount} Adet
                    </span>
                    {category.hasPool && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7FE5F5]/30 bg-[#7FE5F5]/10 px-3 py-1 text-xs font-semibold text-[#7FE5F5] shadow-[0_0_10px_rgba(127,229,245,0.2)]">
                        <Waves className="h-3 w-3" />
                        Yaz Havuzlu
                      </span>
                    )}
                  </div>
                  <p className="mt-5 max-w-2xl text-white/65 leading-relaxed font-sans tracking-[0.02em]">
                    {category.subtitle}
                  </p>
                </div>
              </div>

              {/* Bu kategoriye ait odalar — yan yana 2 sütun */}
              <DetailRoomGrid rooms={rooms} locale={locale} />
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function DetailRoomGrid({
  rooms,
  locale,
}: {
  rooms: Room[];
  locale: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {rooms.map((room, i) => (
        <RoomCard key={room.slug} room={room} locale={locale} index={i} />
      ))}
    </div>
  );
}
