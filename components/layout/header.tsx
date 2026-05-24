'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-white transition-shadow duration-300',
        scrolled
          ? 'shadow-soft border-b border-neutral-200'
          : 'border-b border-neutral-100',
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo — daire içinde amblem + yanda marka adı */}
        <Link
          href={`/${locale}`}
          aria-label="Hat Naturel Sapanca Bungalov — Anasayfa"
          className="group flex items-center gap-3"
        >
          {/* Dairesel amblem */}
          <span className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-primary-200 shadow-soft transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
            <Image
              src="/images/brand/logo-circle.jpg"
              alt="Hat Naturel amblem"
              width={200}
              height={200}
              priority
              className="h-full w-full object-cover"
            />
          </span>
          {/* Marka adı */}
          <span className="hidden flex-col leading-none xs:flex">
            <span className="font-serif text-base font-semibold tracking-wide text-primary-900 sm:text-lg">
              Hat Naturel
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 sm:text-[11px]">
              Sapanca · Bungalov
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Ana navigasyon"
        >
          {NAVIGATION.map(({ key, href }) => (
            <Link
              key={key}
              href={`/${locale}${href === '/' ? '' : href}`}
              className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-primary-700"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} className="hidden sm:flex" />
          <ButtonLink
            href={`/${locale}${RESERVATION_HREF}`}
            size="sm"
            className="hidden md:inline-flex"
          >
            {tCommon('reservation')}
          </ButtonLink>
          <button
            type="button"
            aria-label="Menüyü aç"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden"
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
