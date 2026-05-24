'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

interface LanguageSwitcherProps {
  currentLocale: string;
  className?: string;
}

/**
 * Mevcut path'in locale prefix'ini değiştirip aynı sayfaya yönlendirir.
 * Örn: /tr/odalar → /en/odalar
 */
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
}: LanguageSwitcherProps): React.ReactElement {
  const pathname = usePathname();

  return (
    <div
      className={cn('flex items-center gap-1 text-sm font-medium', className)}
      role="group"
      aria-label="Dil seçimi"
    >
      {locales.map((loc, idx) => (
        <span key={loc} className="flex items-center">
          {idx > 0 && <span className="mx-1 text-neutral-400">/</span>}
          <Link
            href={buildLocalizedPath(pathname, loc)}
            aria-current={loc === currentLocale ? 'page' : undefined}
            className={cn(
              'transition-colors',
              loc === currentLocale
                ? 'text-primary-700 font-semibold'
                : 'text-neutral-600 hover:text-primary-600',
            )}
          >
            {loc.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
