'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AMENITY_META, type Amenity } from '@/lib/data/rooms';

interface AmenityListProps {
  amenities: Amenity[];
}

const IconMap = Icons as unknown as Record<string, LucideIcon>;

/**
 * Amenity'leri 4 mantıksal gruba ayır + her grubun başlığı + emoji vurgusu.
 * Hediye'nin verdiği yapıya göre:
 *  - 🏊 Havuz & Spa (özel havuz, jakuzi, sauna, şezlong, çift salıncak)
 *  - 🏠 Bungalov İçi (klima, wifi, TV, mutfak, şömine, dolap...)
 *  - 🍖 Dış Alan & Çevre (mangal, ateş çukuru, veranda, bahçe...)
 *  - 🌿 Tesis İçi Ortak (kafe, otopark, oyun parkı, şelale, doğa, göl manzarası)
 */
const AMENITY_GROUPS: Array<{
  titleKey: string;
  emoji: string;
  bgGradient: string;
  iconColor: string;
  amenities: Amenity[];
}> = [
  {
    titleKey: 'amenityGroupPoolSpa',
    emoji: '🏊',
    bgGradient: 'from-cyan-50 to-blue-50',
    iconColor: 'text-cyan-700',
    amenities: ['pool', 'heatedPool', 'coolingPool', 'jacuzzi', 'sauna', 'sunbed', 'doubleSwing'],
  },
  {
    titleKey: 'amenityGroup1',
    emoji: '🏠',
    bgGradient: 'from-amber-50 to-orange-50',
    iconColor: 'text-amber-700',
    amenities: [
      'ac', 'wifi', 'streamingTv', 'smartTv', 'kitchen', 'fridge',
      'fireplace', 'hairDryer', 'wardrobe', 'towels', 'toiletries',
    ],
  },
  {
    titleKey: 'amenityGroup2',
    emoji: '🌳',
    bgGradient: 'from-emerald-50 to-green-50',
    iconColor: 'text-emerald-700',
    amenities: ['bbq', 'firePit', 'privateVeranda', 'gardenFurniture', 'swing'],
  },
  {
    titleKey: 'amenityGroup3',
    emoji: '🌿',
    bgGradient: 'from-violet-50 to-purple-50',
    iconColor: 'text-violet-700',
    amenities: ['cafe', 'parking', 'playground', 'waterfall', 'naturalArea', 'lakeView'],
  },
  {
    titleKey: 'amenityGroup4',
    emoji: '🛡️',
    bgGradient: 'from-neutral-50 to-stone-50',
    iconColor: 'text-neutral-700',
    amenities: ['waterTank', 'fireExtinguisher', 'security', 'generator'],
  },
];

export function AmenityList({ amenities }: AmenityListProps) {
  const t = useTranslations('rooms');
  const tLabels = useTranslations('amenities');

  // Her grup için sadece bu odada bulunan amenity'leri filtrele
  const groupedAmenities = AMENITY_GROUPS.map((group) => ({
    ...group,
    items: group.amenities.filter((a) => amenities.includes(a)),
  })).filter((g) => g.items.length > 0);

  const hasNoPets = amenities.includes('noPets');

  return (
    <div className="space-y-8">
      {groupedAmenities.map((group, groupIdx) => (
        <motion.div
          key={group.titleKey}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: groupIdx * 0.1 }}
          className={`relative rounded-2xl border border-neutral-200 bg-gradient-to-br ${group.bgGradient} p-6 shadow-sm`}
        >
          {/* Group header */}
          <div className="mb-5 flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 3 + groupIdx * 0.5,
              }}
              className="inline-block text-2xl"
            >
              {group.emoji}
            </motion.span>
            <h4 className={`font-serif text-lg font-bold tracking-tight ${group.iconColor}`}>
              {t(group.titleKey)}
            </h4>
            <span className="ml-auto rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
              {group.items.length}
            </span>
          </div>

          {/* Amenity grid */}
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {group.items.map((key, i) => {
              const meta = AMENITY_META[key];
              const Icon = IconMap[meta.icon] ?? Icons.Check;
              return (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group flex items-center gap-2.5 rounded-xl border border-white/80 bg-white/60 px-3 py-2.5 backdrop-blur-sm transition-all hover:border-white hover:bg-white hover:shadow-md"
                >
                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 ${group.iconColor} transition-all group-hover:scale-110`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium leading-tight text-neutral-800">
                    {tLabels(key)}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      ))}

      {/* No Pets uyarısı — özel kart */}
      {hasNoPets && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-2xl"
          >
            🐾
          </motion.span>
          <span className="font-medium">
            {t('amenityNoPets')}
          </span>
        </motion.div>
      )}

      {/* Konum bilgisi (sabit, tüm odalar için) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-4"
      >
        <motion.span
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-0.5 text-xl"
        >
          📍
        </motion.span>
        <p className="text-sm leading-relaxed text-neutral-700">
          <strong className="font-semibold text-neutral-900">{t('amenityLocationLabel')}</strong>{' '}
          {t('amenityLocationText', {
            minutes: t('amenityLocationMinutes'),
            lakeView: t('amenityLocationLakeView'),
          })}
        </p>
      </motion.div>
    </div>
  );
}
