import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils/cn';

describe('cn()', () => {
  it('birden fazla class string\'ini birleştirir', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('falsy değerleri atlar', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('çakışan tailwind utility\'lerini sonuncuya göre merge eder', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});
