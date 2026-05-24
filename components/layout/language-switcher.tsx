'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

interface LanguageSwitcherProps {
  currentLocale: string;
  className?: string;
  /** 'light' (koyu zemin) varsayılan, 'dark' (açık zemin için koyu yazı) */
  variant?: 'light' | 'dark';
}

function buildLocalizedPath(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${target}`;
  if (locales.includes(segments[0] as Locale)) {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }
  return '/' + segments.join('/');
}

export function LanguageSwitcher({
  currentLocale,
  className,
  variant = 'light',
}: LanguageSwitcherProps): React.ReactElement {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Dış tıklamada / Escape ile kapat
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = currentLocale as Locale;
  const isLight = variant === 'light';

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
          isLight
            ? 'text-white/90 hover:bg-white/10 hover:text-white'
            : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-700',
        )}
      >
        <Globe size={14} aria-hidden />
        <span className="hidden sm:inline">{localeFlags[current]}</span>
        <span className="uppercase">{current}</span>
        <ChevronDown
          size={14}
          aria-hidden
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>

      {/* Dropdown */}
      <div
        role="listbox"
        aria-label="Dil seçimi"
        className={cn(
          'absolute right-0 top-full z-50 mt-2 w-48 origin-top-right overflow-hidden rounded-2xl bg-white shadow-strong ring-1 ring-neutral-200',
          'transition-all duration-200',
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        <ul className="max-h-80 overflow-y-auto py-1">
          {locales.map((loc) => {
            const isCurrent = loc === current;
            return (
              <li key={loc}>
                <Link
                  href={buildLocalizedPath(pathname, loc)}
                  role="option"
                  aria-selected={isCurrent}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    isCurrent
                      ? 'bg-primary-50 font-semibold text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-700',
                  )}
                >
                  <span className="text-lg" aria-hidden>
                    {localeFlags[loc]}
                  </span>
                  <span className="flex-1">{localeNames[loc]}</span>
                  {isCurrent && (
                    <span className="text-xs uppercase tracking-wider text-primary-500">
                      ✓
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
