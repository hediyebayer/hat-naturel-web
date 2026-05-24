import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind class'larını birleştirir ve çakışan utility'leri merge eder.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
