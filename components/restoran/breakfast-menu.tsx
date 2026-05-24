'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Infinity as InfinityIcon } from 'lucide-react';

/**
 * Kahvaltı menüsü — 12 tabak.
 *
 * Her tabak: emoji + isim + altın LED corner glow hover.
 * Stagger entry: viewport'a girince sırayla beliriyor (delay i * 0.06).
 * Hover: scale + altın border + emoji wiggle.
 */
const ITEMS: ReadonlyArray<{ key: string; emoji: string }> = [
  { key: 'potato', emoji: '🍟' },
  { key: 'borek', emoji: '🥟' },
  { key: 'omelet', emoji: '🍳' },
  { key: 'cheese', emoji: '🧀' },
  { key: 'olive', emoji: '🫒' },
  { key: 'sliced', emoji: '🥒' },
  { key: 'honey', emoji: '🍯' },
  { key: 'butter', emoji: '🧈' },
  { key: 'chocolate', emoji: '🍫' },
  { key: 'hazelnut', emoji: '🌰' },
  { key: 'jam', emoji: '🍓' },
  { key: 'tea', emoji: '🫖' },
];

export function BreakfastMenu(): React.ReactElement {
  const t = useTranslations('restaurant');

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {ITEMS.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:border-accent/40 hover:shadow-[0_15px_40px_-15px_rgba(212,175,55,0.4)]"
        >
          {/* LED corner glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          />

          <div className="relative">
            {/* Emoji — büyük + hover'da wiggle */}
            <motion.span
              className="block text-5xl select-none"
              whileHover={{
                rotate: [0, -10, 10, -5, 5, 0],
                scale: 1.15,
              }}
              transition={{ duration: 0.5 }}
              aria-hidden
            >
              {item.emoji}
            </motion.span>

            {/* İsim */}
            <p className="mt-3 font-serif text-sm font-medium text-neutral-900 md:text-base">
              {t(`menu.${item.key}`)}
            </p>

            {/* Çay için özel sınırsız işareti */}
            {item.key === 'tea' && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-dark">
                <InfinityIcon size={10} />
                {t('unlimited')}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Sınırsız çay highlight kartı (lacivert section içinde).
 * Animasyonlu çaydanlık + buhar efekti.
 */
export function TeaHighlight(): React.ReactElement {
  const t = useTranslations('restaurant');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-3xl"
    >
      {/* Gold radial glow background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent_70%)]"
      />

      <div className="relative text-center">
        {/* Çaydanlık emoji + buhar */}
        <div className="relative inline-block">
          <motion.span
            className="block text-8xl"
            animate={{
              y: [0, -4, 0],
              rotate: [0, -2, 2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden
          >
            🫖
          </motion.span>

          {/* Buhar — 3 nokta yukarı çıkar */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-white/40 blur-sm"
              animate={{
                y: [-10, -60],
                x: [0, i === 0 ? -10 : i === 2 ? 10 : 0],
                opacity: [0, 0.7, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        <h3 className="mt-8 font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
          <span className="block">{t('teaTitle')}</span>
          <span className="mt-2 block italic font-medium text-accent">
            {t('teaTitleItalic')}
          </span>
        </h3>

        <p className="mx-auto mt-6 max-w-xl text-base text-white/85 md:text-lg">
          {t('teaLead')}
        </p>

        {/* Stat row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <StatPill icon={<InfinityIcon size={16} />} label={t('teaStat1')} />
          <StatPill emoji="🍵" label={t('teaStat2')} />
        </div>
      </div>
    </motion.div>
  );
}

function StatPill({
  icon,
  emoji,
  label,
}: {
  icon?: React.ReactNode;
  emoji?: string;
  label: string;
}): React.ReactElement {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:ring-accent/40">
      {icon && <span className="text-accent">{icon}</span>}
      {emoji && <span className="text-lg">{emoji}</span>}
      {label}
    </span>
  );
}
