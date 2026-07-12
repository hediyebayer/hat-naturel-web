'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export type DepositMode = 'full' | 'deposit';

interface DepositSelectorProps {
  /** Sayfanın server tarafında hesaplanmış mevcut seçim. */
  value: DepositMode;
}

/**
 * Kapora / tam ödeme seçici.
 *
 * Ödeme sayfası bir Server Component olduğu için bu component seçim
 * değiştiğinde URL'deki `?deposit=` query parametresini `router.replace`
 * ile günceller. Böylece server tarafı yeniden render olur ve sağdaki
 * OrderSummary (tutar kırılımı) anında güncellenir. Geçmiş (history)
 * kirlenmesin diye `push` yerine `replace` kullanılır.
 */
export function DepositSelector({ value }: DepositSelectorProps): React.ReactElement {
  const tLabel = useTranslations('payment.guest');
  const tOptions = useTranslations('payment.summary');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(mode: DepositMode) {
    if (mode === value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('deposit', mode);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mb-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-neutral-200">
      <p className="mb-3 text-sm font-semibold text-neutral-700">{tLabel('depositLabel')}</p>
      <div className="space-y-2" role="radiogroup" aria-label={tLabel('depositLabel')}>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-neutral-50">
          <input
            type="radio"
            name="depositModeDisplay"
            value="full"
            checked={value === 'full'}
            onChange={() => handleChange('full')}
            className="mt-0.5 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-700">
            <strong>{tOptions('fullPayment')}</strong>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-neutral-50">
          <input
            type="radio"
            name="depositModeDisplay"
            value="deposit"
            checked={value === 'deposit'}
            onChange={() => handleChange('deposit')}
            className="mt-0.5 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-700">
            <strong>{tOptions('depositOption')}</strong>
          </span>
        </label>
      </div>
    </div>
  );
}
