'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Waves, Flame, ArrowRight, Users, Bed, Bath } from 'lucide-react';
import { ROOMS, type Room } from '@/lib/data/rooms';

interface RoomGridDisplayProps {
  locale: string;
}

/**
 * Tüm odaları/kategorileri tek bir grid'de gösterir.
 * - Üçgen 2+1 → tek kart (count: 3 badge)
 * - Üçgen 1+1 → tek kart (count: 6 badge)
 * - Bej, Turkuaz, Sarı, Mor → ayrı ayrı 4 kart
 *
 * Toplam 6 kart. grid-cols: mobile 1, sm 2, lg 3.
 *
 * Her kartta köşelerden LED ışık efekti (hover'da yoğunlaşır).
 */
export function RoomGridDisplay({ locale }: RoomGridDisplayProps) {
  // ROOMS sırasını manuel kontrol et: önce üçgenler, sonra köşkler (havuzlu/havuzsuz)
  const displayOrder = [
    'ucgen-2-1',
    'ucgen-1-1',
    'sari',
    'mor',
    'bej',
    'turkuaz',
  ];
  const orderedRooms = displayOrder
    .map((slug) => ROOMS.find((r) => r.slug === slug))
    .filter(Boolean) as Room[];

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {orderedRooms.map((room, i) => (
        <RoomDisplayCard
          key={room.slug}
          room={room}
          locale={locale}
          index={i}
        />
      ))}
    </div>
  );
}

function RoomDisplayCard({
  room,
  locale,
  index,
}: {
  room: Room;
  locale: string;
  index: number;
}) {
  const hasHeatedPool = room.amenities.includes('heatedPool');
  const hasSauna = room.amenities.includes('sauna');
  const hasSummerPool = room.amenities.includes('pool');
  const count = room.count ?? 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.25, 1, 0.5, 1],
      }}
      className="group relative"
    >
      {/* LED corner glow lights — 4 köşeden ışık */}
      <div className="led-corner-glow led-corner-glow--tl" />
      <div className="led-corner-glow led-corner-glow--tr" />
      <div className="led-corner-glow led-corner-glow--bl" />
      <div className="led-corner-glow led-corner-glow--br" />

      <Link
        href={`/${locale}/odalar/${room.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_25px_60px_-15px_rgba(212,175,55,0.3)]"
      >
        {/* Görsel */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Gradient — hover'da güçlenen */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          {/* Top-right amenity badges (havuz/sauna) */}
          <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
            {count > 1 && (
              <span className="inline-flex items-center rounded-full border border-white/30 bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {count} Adet
              </span>
            )}
            {hasHeatedPool && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/60 bg-gradient-to-r from-cyan-500 to-blue-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.6)] backdrop-blur-md">
                <Waves className="h-2.5 w-2.5" />
                Isıtmalı Havuz
              </span>
            )}
            {hasSauna && (
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/60 bg-gradient-to-r from-orange-500 to-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-[0_0_15px_rgba(251,146,60,0.6)] backdrop-blur-md">
                <Flame className="h-2.5 w-2.5" />
                Sauna
              </span>
            )}
            {hasSummerPool && !hasHeatedPool && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/50 bg-cyan-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-[0_0_12px_rgba(127,229,245,0.5)] backdrop-blur-md">
                <Waves className="h-2.5 w-2.5" />
                Yaz Havuzlu
              </span>
            )}
          </div>

          {/* Bottom-left room name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-serif text-xl font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-2xl">
              {room.name}
            </h3>
            <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-white/80 drop-shadow">
              {room.tagline}
            </p>
          </div>
        </div>

        {/* İçerik */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <p className="text-sm leading-relaxed text-neutral-600 line-clamp-3">
              {room.description}
            </p>

            {/* Specs row — kompakt ikonlu */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-medium text-neutral-500">
              <span className="inline-flex items-center gap-1">
                <span className="text-neutral-700 font-semibold">{room.specs.area} m²</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {room.specs.guests}+{room.specs.extraGuests} Kişi
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="inline-flex items-center gap-1">
                <Bed className="h-3 w-3" />
                {room.specs.bedrooms} Yatak Odası
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="inline-flex items-center gap-1">
                <Bath className="h-3 w-3" />
                {room.specs.bathrooms} Banyo
              </span>
            </div>
          </div>

          {/* CTA satırı */}
          <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-dark">
              Detayları Gör
            </span>
            <ArrowRight className="h-4 w-4 text-accent-dark transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
