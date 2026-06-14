'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export interface ConsentValues {
  kvkk: boolean;
  distance: boolean;
}

interface ConsentsProps {
  value: ConsentValues;
  onChange: (v: ConsentValues) => void;
  error?: string;
}

export function Consents({ value, onChange, error }: ConsentsProps): React.ReactElement {
  const t = useTranslations('payment.consents');

  return (
    <fieldset aria-describedby={error ? 'consents-error' : undefined}>
      <legend className="sr-only">Onay kutucukları</legend>

      <div className="space-y-3">
        {/* KVKK */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={value.kvkk}
            onChange={(e) => onChange({ ...value, kvkk: e.target.checked })}
            aria-invalid={!!error}
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm leading-relaxed text-neutral-700">
            <Link
              href="/tr/gizlilik-kvkk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-800"
              onClick={(e) => e.stopPropagation()}
            >
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum ve kabul ediyorum.
          </span>
        </label>

        {/* Mesafeli Satış */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={value.distance}
            onChange={(e) => onChange({ ...value, distance: e.target.checked })}
            aria-invalid={!!error}
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm leading-relaxed text-neutral-700">
            <Link
              href="/tr/mesafeli-satis-sozlesmesi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-800"
              onClick={(e) => e.stopPropagation()}
            >
              Mesafeli Satış Sözleşmesi
            </Link>
            &apos;ni okudum ve onaylıyorum.
          </span>
        </label>
      </div>

      {error && (
        <p id="consents-error" role="alert" className="mt-2 text-xs text-red-600">
          {t('required')}
        </p>
      )}
    </fieldset>
  );
}
