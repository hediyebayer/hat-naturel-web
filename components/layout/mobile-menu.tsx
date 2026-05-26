'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { NAVIGATION, RESERVATION_HREF } from '@/lib/constants';
import { ButtonLink } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { cn } from '@/lib/utils/cn';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export function MobileMenu({
  isOpen,
  onClose,
  locale,
}: MobileMenuProps): React.ReactElement {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');

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

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] lg:hidden',
        'transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop — tam opak siyah, alttaki sayfayı göstermez */}
      <div
        className="absolute inset-0 bg-neutral-900"
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
        className={cn(
          'absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col',
          'bg-white shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <Image
            src="/images/brand/logo-header.png"
            alt="Hat Naturel Sapanca Bungalov"
            width={600}
            height={437}
            className="h-14 w-auto"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
          {NAVIGATION.map(({ key, href }) => (
            <Link
              key={key}
              href={`/${locale}${href === '/' ? '' : href}`}
              onClick={onClose}
              className="group relative flex items-center rounded-lg px-4 py-3 text-base font-medium text-neutral-800 transition-all duration-200 hover:bg-primary-50 hover:pl-6 hover:text-primary-700"
            >
              <span
                aria-hidden
                className="absolute left-2 h-1 w-1 -translate-x-2 rounded-full bg-accent opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
              />
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="border-t border-neutral-200 px-6 py-5 space-y-4">
          <ButtonLink
            href={`/${locale}${RESERVATION_HREF}`}
            fullWidth
            onClick={onClose}
          >
            {tCommon('reservation')}
          </ButtonLink>
          <div className="flex justify-center">
            <LanguageSwitcher currentLocale={locale} variant="dark" />
          </div>
        </div>
      </aside>
    </div>
  );
}
