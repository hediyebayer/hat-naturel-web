import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_MAP: Record<Variant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300',
  secondary:
    'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 disabled:bg-secondary-300',
  outline:
    'border border-primary-600 text-primary-700 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'text-primary-700 hover:bg-primary-50 active:bg-primary-100',
};

const SIZE_MAP: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-14 px-7 text-base sm:text-lg',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ' +
  'focus-visible:ring-offset-2';

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkButtonProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        BASE,
        VARIANT_MAP[variant],
        SIZE_MAP[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
      {children}
    </button>
  );
});

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  href,
  children,
  ...rest
}: LinkButtonProps): React.ReactElement {
  return (
    <Link
      href={href}
      className={cn(
        BASE,
        VARIANT_MAP[variant],
        SIZE_MAP[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
