'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { AMENITY_META, type Amenity } from '@/lib/data/rooms';

interface AmenityListProps {
  amenities: Amenity[];
}

export function AmenityList({ amenities }: AmenityListProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
      {amenities.map((key, i) => {
        const meta = AMENITY_META[key];
        const Icon = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[meta.icon] ?? Icons.Check;
        return (
          <motion.li
            key={key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/60 px-4 py-3 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:bg-white hover:shadow-soft"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-neutral-800">
              {meta.label}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
