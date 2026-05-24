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
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        'transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
        className={cn(
          'absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col',
          'bg-white shadow-strong transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-primary-200 shadow-soft">
              <Image
                src="/images/brand/logo-circle.jpg"
                alt="Hat Naturel amblem"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-sm font-semibold tracking-wide text-primary-900">
                Hat Naturel
              </span>
              <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                Sapanca · Bungalov
              </span>
            </span>
          </div>
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
              className="rounded-lg px-4 py-3 text-base font-medium text-neutral-800 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
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
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </aside>
    </div>
  );
}
