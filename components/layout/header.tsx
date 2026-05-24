'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { NAVIGATION, RESERVATION_HREF } from '@/lib/constants';
import { ButtonLink } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenu } from './mobile-menu';
import { cn } from '@/lib/utils/cn';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps): React.ReactElement {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500',
        scrolled
          ? 'bg-primary-900/85 shadow-medium backdrop-blur-xl py-2'
          : 'bg-gradient-to-b from-primary-900/60 via-primary-900/30 to-transparent py-4',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo — premium glow + glassmorphism + cinematic reveal */}
        <Link
          href={`/${locale}`}
          aria-label="Hat Naturel Sapanca Bungalov — Anasayfa"
          className="group relative flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-primary-900 rounded-2xl"
        >
          {/* Logo — cinematic reveal + dönüş + hover parlama */}
          <motion.span
            initial={{ scale: 0.92, opacity: 0, filter: 'blur(8px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative inline-block transition-all duration-500 drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
            style={{ perspective: '1000px' }}
          >
            {/* Periodik 360 dönüş — parlamayı da içeride tutan wrapper */}
            <motion.span
              className="relative block overflow-hidden motion-reduce:!transform-none"
              animate={{ rotateY: [0, 360] }}
              transition={{
                duration: 1.8,
                ease: [0.65, 0, 0.35, 1],
                repeat: Infinity,
                repeatDelay: 6,
              }}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'visible' }}
            >
              <Image
                src="/images/brand/logo-header.png"
                alt="Hat Naturel Sapanca Bungalov"
                width={600}
                height={437}
                priority
                className={cn(
                  'block w-auto transition-all duration-500',
                  scrolled ? 'h-14 sm:h-16' : 'h-20 sm:h-24',
                )}
              />

              {/* Hover parlama — SADECE logo içinde, beyaz ışıltı */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 transition-transform duration-1000 ease-out group-hover:translate-x-full"
              />
            </motion.span>
          </motion.span>
        </Link>

        {/* Desktop nav — animated underline */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Ana navigasyon"
        >
          {NAVIGATION.map(({ key, href }) => {
            const fullHref = `/${locale}${href === '/' ? '' : href}`;
            const isActive =
              href === '/'
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname.startsWith(fullHref);
            return (
              <Link
                key={key}
                href={fullHref}
                aria-current={isActive ? 'page' : undefined}
                className="group relative px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                <span className="relative z-10">{t(key)}</span>
                <span
                  aria-hidden
                  className={cn(
                    'absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-accent transition-all duration-300',
                    isActive ? 'w-8' : 'w-0 group-hover:w-8',
                  )}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-bg"
                      className="absolute inset-0 -z-0 rounded-full bg-white/10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} className="hidden sm:flex" />
          <ButtonLink
            href={`/${locale}${RESERVATION_HREF}`}
            size="sm"
            className="hidden md:inline-flex !bg-white !text-primary-900 hover:!bg-accent hover:!text-primary-900"
          >
            {tCommon('reservation')}
          </ButtonLink>
          <button
            type="button"
            aria-label="Menüyü aç"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 text-white hover:bg-white/10 lg:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        locale={locale}
      />
    </header>
  );
}
