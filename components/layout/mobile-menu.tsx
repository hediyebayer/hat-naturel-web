'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NAVIGATION, RESERVATION_HREF, SITE_CONFIG } from '@/lib/constants';
import { ButtonLink } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { cn } from '@/lib/utils/cn';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

const navItemVariants = {
  hidden: { opacity: 0, x: 32 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.08 + i * 0.04,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
  exit: { opacity: 0, x: 24, transition: { duration: 0.2 } },
};

export function MobileMenu({
  isOpen,
  onClose,
  locale,
}: MobileMenuProps): React.ReactElement | null {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    };
  }, [isOpen, onClose]);

  const isActiveLink = useCallback(
    (href: string) => {
      const fullHref = `/${locale}${href === '/' ? '' : href}`;
      return href === '/'
        ? pathname === `/${locale}` || pathname === `/${locale}/`
        : pathname.startsWith(fullHref);
    },
    [locale, pathname],
  );

  if (!mounted) return null;

  const menu = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          aria-hidden={!isOpen}
        >
          {/* Backdrop — koyu overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobil menü"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-2xl"
          >
            {/* ─── Header: Logo + Kapat ─── */}
            <div className="relative overflow-hidden bg-primary-900 px-5 pb-5 pt-6">
              {/* Dekoratif dağ/dalga arka plan */}
              <div aria-hidden className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-primary-800/40" />
              <div aria-hidden className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-primary-800/30" />

              <div className="relative flex items-start justify-between">
                <Image
                  src="/images/brand/logo-header.png"
                  alt="Hat Naturel Sapanca Bungalov"
                  width={600}
                  height={437}
                  className="h-20 w-auto drop-shadow-lg"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={tCommon('closeMenu')}
                  className="rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Hoş geldin yazısı */}
              <p className="relative mt-3 text-xs font-light tracking-wide text-white/50">
                Sapanca&#39;da Doğayla İç İçe
              </p>
            </div>

            {/* ─── Navigation ─── */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-0.5">
                {NAVIGATION.map(({ key, href }, i) => {
                  const isActive = isActiveLink(href);
                  return (
                    <motion.li
                      key={key}
                      custom={i}
                      variants={navItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        href={`/${locale}${href === '/' ? '' : href}`}
                        onClick={onClose}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200',
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900',
                        )}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <span
                            aria-hidden
                            className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary-600"
                          />
                        )}
                        <span>{t(key)}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* ─── Footer: CTA + Dil + İletişim ─── */}
            <div className="border-t border-neutral-100 bg-neutral-50/50 px-5 py-5 space-y-4">
              <ButtonLink
                href={`/${locale}${RESERVATION_HREF}`}
                fullWidth
                onClick={onClose}
                className="justify-center"
              >
                {tCommon('reservation')}
              </ButtonLink>

              <div className="flex items-center justify-between">
                <LanguageSwitcher currentLocale={locale} variant="dark" />

                <a
                  href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                  className="text-xs text-neutral-400 transition-colors hover:text-primary-600"
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(menu, document.body);
}
