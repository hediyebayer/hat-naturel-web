'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, BedDouble, Bath, Users, Maximize2 } from 'lucide-react';
import type { Room } from '@/lib/data/rooms';

interface RoomCardProps {
  room: Room;
  locale: string;
  index?: number;
}

export function RoomCard({ room, locale, index = 0 }: RoomCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative h-full rounded-3xl"
    >
      <Link
        href={`/${locale}/odalar/${room.slug}`}
        className="block h-full focus-visible:outline-none rounded-3xl"
      >
        {/* Kart container — lacivert body, görsel üstte */}
        <div
          className="relative h-full overflow-hidden rounded-3xl bg-primary-900 border border-primary-800 transition-all duration-[600ms] group-hover:-translate-y-1 group-hover:shadow-strong group-hover:border-accent/50"
          style={{ transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)' }}
        >
          {/* IMAGE */}
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
            <Image
              src={room.images[0]}
              alt={room.name}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
              priority={index < 3}
            />
            {/* Görsel altı gradient — beyaz başlık okunabilirliği */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent" />

            {/* TOP BADGES — sadece 1+1/2+1, lacivert bg + beyaz text */}
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary-900/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md">
                {room.specs.bedrooms === 1 ? '1+1' : '2+1'}
              </span>
            </div>

            {/* TOP-RIGHT arrow */}
            <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white opacity-0 shadow-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 translate-y-2 backdrop-blur-md">
              <ArrowUpRight className="h-5 w-5" />
            </div>

            {/* Görsel üzerine başlık — beyaz */}
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="font-serif text-2xl font-semibold leading-tight drop-shadow-lg text-white transition-colors duration-300">
                {room.name}
              </h3>
              <p className="mt-1 text-sm text-white/85 line-clamp-1 font-sans tracking-wide">
                {room.tagline}
              </p>
            </div>
          </div>

          {/* BODY — lacivert zemin, beyaz text (oda bilgileri) */}
          <div className="space-y-4 p-6">
            <p className="text-sm leading-relaxed text-white/70 line-clamp-2 font-sans">
              {room.description}
            </p>

            {/* SPECS */}
            <ul className="grid grid-cols-4 gap-2 border-t border-white/10 pt-4 text-center text-xs text-white/70">
              <SpecChip icon={<Maximize2 className="h-4 w-4" />} value={`${room.specs.area}m²`} />
              <SpecChip icon={<Users className="h-4 w-4" />} value={`${room.specs.guests}+${room.specs.extraGuests}`} />
              <SpecChip icon={<BedDouble className="h-4 w-4" />} value={`${room.specs.bedrooms}`} />
              <SpecChip icon={<Bath className="h-4 w-4" />} value={`${room.specs.bathrooms}`} />
            </ul>

            {/* CTA */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-accent transition-colors group-hover:text-accent-light">
                Detayları İncele
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-primary-900 group-hover:translate-x-1">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function SpecChip({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <li className="flex flex-col items-center gap-1">
      <span className="text-white">{icon}</span>
      <span className="font-semibold text-white/90">{value}</span>
    </li>
  );
}
