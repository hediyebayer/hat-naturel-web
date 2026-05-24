'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, BedDouble, Bath, Users, Maximize2 } from 'lucide-react';
import type { Room } from '@/lib/data/rooms';
import { cn } from '@/lib/utils/cn';

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
      className="group relative h-full"
    >
      <Link
        href={`/${locale}/odalar/${room.slug}`}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 rounded-3xl"
      >
        <div className="relative h-full overflow-hidden rounded-3xl bg-white shadow-soft transition-shadow duration-500 hover:shadow-strong">
          {/* IMAGE */}
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
            <Image
              src={room.images[0]}
              alt={room.name}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              priority={index < 3}
            />
            {/* gradient overlay */}
            <div
              className={cn(
                'pointer-events-none absolute inset-0 bg-gradient-to-t opacity-90',
                'from-neutral-900/80 via-neutral-900/10 to-transparent',
              )}
            />
            {/* themed accent glow */}
            <div
              className={cn(
                'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-700 group-hover:opacity-100',
                room.accentColor,
              )}
            />

            {/* TOP BADGES */}
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {room.featured && (
                <span className="rounded-full bg-accent/95 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur">
                  ⭐ Öne Çıkan
                </span>
              )}
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-800 shadow-md backdrop-blur">
                {room.specs.bedrooms === 1 ? '1+1' : '2+1'}
              </span>
            </div>

            {/* TOP-RIGHT arrow */}
            <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-neutral-800 opacity-0 shadow-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 translate-y-2">
              <ArrowUpRight className="h-5 w-5" />
            </div>

            {/* BOTTOM TITLE */}
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="font-serif text-2xl font-semibold leading-tight drop-shadow-md">
                {room.name}
              </h3>
              <p className="mt-1 text-sm text-white/85 line-clamp-1">
                {room.tagline}
              </p>
            </div>
          </div>

          {/* BODY */}
          <div className="space-y-4 p-6">
            <p className="text-sm leading-relaxed text-neutral-600 line-clamp-2">
              {room.description}
            </p>

            {/* SPECS */}
            <ul className="grid grid-cols-4 gap-2 border-t border-neutral-100 pt-4 text-center text-xs text-neutral-600">
              <SpecChip icon={<Maximize2 className="h-4 w-4" />} value={`${room.specs.area}m²`} />
              <SpecChip icon={<Users className="h-4 w-4" />} value={`${room.specs.guests}+${room.specs.extraGuests}`} />
              <SpecChip icon={<BedDouble className="h-4 w-4" />} value={`${room.specs.bedrooms}`} />
              <SpecChip icon={<Bath className="h-4 w-4" />} value={`${room.specs.bathrooms}`} />
            </ul>

            {/* CTA */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-primary-700 transition-colors group-hover:text-primary-900">
                Detayları Gör
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-700 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:translate-x-1">
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
    <li className="flex flex-col items-center gap-1 text-neutral-700">
      <span className="text-primary-600">{icon}</span>
      <span className="font-semibold">{value}</span>
    </li>
  );
}
