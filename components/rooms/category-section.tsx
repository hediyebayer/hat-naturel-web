'use client';

import React from 'react';
import { RoomCard } from '@/components/rooms/room-card';
import { CATEGORIES, getRoomsByCategory } from '@/lib/data/rooms';
import { Waves, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategorySectionProps {
  locale: string;
}

export function CategorySection({ locale }: CategorySectionProps) {
  return (
    <div className="space-y-24 relative z-10">
      {CATEGORIES.map((category) => {
        const rooms = getRoomsByCategory(category.id);
        if (rooms.length === 0) return null;

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="scroll-mt-32"
            id={category.id}
          >
            {/* Category Header */}
            <div className="mb-10 flex flex-col gap-4 border-l-2 border-accent pl-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="font-serif text-2xl uppercase tracking-widest text-white md:text-3xl relative inline-block">
                    {category.title}
                    <span className="absolute -bottom-2 left-0 h-[1px] w-full bg-gradient-to-r from-accent to-transparent" />
                  </h3>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                    {category.totalCount} Adet
                  </span>
                  {category.hasPool ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7FE5F5]/20 bg-[#7FE5F5]/10 px-3 py-1 text-xs font-semibold text-[#7FE5F5] shadow-[0_0_10px_rgba(127,229,245,0.2)]">
                      <Waves className="h-3.5 w-3.5" />
                      Yaz Havuzlu
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                      Havuzsuz
                    </span>
                  )}
                </div>
                <p className="mt-5 max-w-2xl text-white/70 leading-relaxed font-sans tracking-[0.02em]">
                  {category.subtitle}
                </p>
                {category.poolNote && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#7FE5F5]/80">
                    <Sparkles className="h-3.5 w-3.5" />
                    {category.poolNote}
                  </p>
                )}
              </div>
            </div>

            {/* Room Cards Grid (2 columns for premium feel) */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              {rooms.map((room, i) => (
                <RoomCard
                  key={room.slug}
                  room={room}
                  locale={locale}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
