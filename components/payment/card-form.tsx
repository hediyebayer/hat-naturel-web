'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, CreditCard, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import {
  formatPan,
  detectBrand,
  parseExp,
} from '@/lib/payment/card-utils';
import { cardInfoSchema, type CardInfoInput } from '@/lib/payment/schemas';
import type { OrderSummary, GuestInfo, DepositMode } from '@/lib/payment/types';

const INPUT_BASE =
  'w-full rounded-xl border-0 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 ' +
  'ring-1 ring-neutral-300 placeholder:text-neutral-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 ' +
  'aria-[invalid=true]:ring-red-400';

interface CardFormProps {
  locale: string;
  order: OrderSummary;
}

// Brand icon component
function BrandIcon({ brand }: { brand: ReturnType<typeof detectBrand> }): React.ReactElement {
  const labels: Record<string, string> = {
    visa: 'VISA',
    mastercard: 'MC',
    troy: 'TROY',
    amex: 'AMEX',
    unknown: '',
  };
  const label = labels[brand] ?? '';

  if (!label) {
    return <CreditCard size={20} className="text-neutral-400" />;
  }

  const colors: Record<string, string> = {
    visa: 'text-blue-700 font-bold',
    mastercard: 'text-red-600 font-bold',
    troy: 'text-[#E10019] font-bold',
    amex: 'text-blue-600 font-bold',
  };

  return (
    <span className={cn('text-xs font-bold tracking-wider', colors[brand] ?? '')}>
      {label}
    </span>
  );
}

export function CardForm({ locale, order }: CardFormProps): React.ReactElement {
  const t = useTranslations('payment.card');
  const tErrors = useTranslations('payment.card.errors');
  const router = useRouter();

  const [showCvv, setShowCvv] = useState(false);
  const [panDisplay, setPanDisplay] = useState('');
  const [expDisplay, setExpDisplay] = useState('');
  const [brand, setBrand] = useState<ReturnType<typeof detectBrand>>('unknown');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CardInfoInput>({
    resolver: zodResolver(cardInfoSchema),
    mode: 'onTouched',
  });

  // PAN input handler
  const handlePanChange = useCallback(
    (raw: string) => {
      const digits = raw.replace(/\D/g, '').slice(0, 16);
      const formatted = formatPan(digits);
      setPanDisplay(formatted);
      setBrand(detectBrand(digits));
      setValue('pan', digits, { shouldValidate: true });
    },
    [setValue],
  );

  // Exp input handler: "MM / YY"
  const handleExpChange = useCallback(
    (raw: string) => {
      const digits = raw.replace(/\D/g, '').slice(0, 4);
      let formatted = digits;
      if (digits.length >= 3) {
        formatted = `${digits.slice(0, 2)} / ${digits.slice(2)}`;
      } else if (digits.length === 2) {
        formatted = `${digits} / `;
      }
      setExpDisplay(formatted);

      const parsed = parseExp(`${digits.slice(0, 2)}/${digits.slice(2)}`);
      if (parsed) {
        setValue('expMonth', parsed.month, { shouldValidate: true });
        setValue('expYear', parsed.year % 100, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const onSubmit = useCallback(
    async (data: CardInfoInput) => {
      setApiError(null);
      setIsSubmitting(true);

      // SessionStorage'dan draft oku
      let guest: GuestInfo | null = null;
      let consents = { kvkk: true as const, distance: true as const };
      let depositMode: DepositMode = 'full';

      try {
        const raw = typeof window !== 'undefined'
          ? sessionStorage.getItem('hn_payment_draft')
          : null;

        if (raw) {
          const draft = JSON.parse(raw) as {
            guest: GuestInfo;
            consents: { kvkk: boolean; distance: boolean };
            depositMode: DepositMode;
            expiresAt: number;
          };
          if (Date.now() > draft.expiresAt) {
            setApiError('Oturum süresi doldu. Lütfen misafir bilgilerini tekrar girin.');
            setIsSubmitting(false);
            return;
          }
          guest = draft.guest;
          depositMode = draft.depositMode ?? order.depositMode;
          consents = draft.consents as { kvkk: true; distance: true };
        }
      } catch {
        // sessionStorage parse error
      }

      if (!guest) {
        setApiError('Misafir bilgileri bulunamadı. Lütfen önceki adımı tekrar tamamlayın.');
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch('/api/payment/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-locale': locale,
          },
          body: JSON.stringify({
            order,
            guest,
            card: {
              pan: data.pan.replace(/\D/g, ''),
              expMonth: data.expMonth,
              expYear: data.expYear,
              cvv: data.cvv,
              holder: data.holder,
            },
            consents,
            depositMode,
          }),
        });

        const json = (await response.json()) as
          | { ok: true; reservationId: string; redirectUrl: string; amountCharged: number }
          | { ok: false; message: string };

        if (!response.ok || !json.ok) {
          setApiError((json as { ok: false; message: string }).message ?? 'Ödeme başlatılamadı.');
          return;
        }

        // PAN'ı sessionStorage'dan temizle (güvenlik)
        if (typeof window !== 'undefined') {
          const raw = sessionStorage.getItem('hn_payment_draft');
          if (raw) {
            try {
              const d = JSON.parse(raw) as Record<string, unknown>;
              delete d['card'];
              sessionStorage.setItem('hn_payment_draft', JSON.stringify(d));
            } catch { /* ignore */ }
          }
        }

        router.push(json.redirectUrl);
      } catch {
        setApiError('Ağ hatası oluştu. Lütfen tekrar deneyin.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [order, locale, router],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* API Hatası */}
      {apiError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl bg-red-50 p-4 ring-1 ring-red-200"
        >
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}

      {/* Kart Üzerindeki İsim */}
      <div>
        <label htmlFor="holder" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('holder')} <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="holder"
          type="text"
          autoComplete="cc-name"
          aria-invalid={!!errors.holder}
          aria-describedby={errors.holder ? 'holder-error' : undefined}
          {...register('holder')}
          onChange={(e) => {
            e.target.value = e.target.value.toUpperCase();
            register('holder').onChange(e);
          }}
          className={cn(INPUT_BASE, 'uppercase tracking-wide')}
          placeholder="KART ÜZERİNDEKİ İSİM"
        />
        {errors.holder && (
          <p id="holder-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.holder.message}
          </p>
        )}
      </div>

      {/* Kart Numarası */}
      <div>
        <label htmlFor="pan" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('number')} <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="pan"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={panDisplay}
            onChange={(e) => handlePanChange(e.target.value)}
            aria-invalid={!!errors.pan}
            aria-describedby={errors.pan ? 'pan-error' : undefined}
            maxLength={19}
            placeholder="0000 0000 0000 0000"
            className={cn(INPUT_BASE, 'pr-12 tracking-widest')}
          />
          {/* Hidden input for RHF */}
          <input type="hidden" {...register('pan')} />
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <BrandIcon brand={brand} />
          </div>
        </div>
        {errors.pan && (
          <p id="pan-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.pan.message === 'invalidPan'
              ? tErrors('invalidPan')
              : errors.pan.message}
          </p>
        )}
      </div>

      {/* Exp + CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t('expiry')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="expiry"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            value={expDisplay}
            onChange={(e) => handleExpChange(e.target.value)}
            aria-invalid={!!errors.expMonth}
            aria-describedby={errors.expMonth ? 'exp-error' : undefined}
            placeholder="AA / YY"
            maxLength={7}
            className={cn(INPUT_BASE, 'tracking-widest')}
          />
          {/* Hidden inputs for RHF */}
          <input type="hidden" {...register('expMonth', { valueAsNumber: true })} />
          <input type="hidden" {...register('expYear', { valueAsNumber: true })} />
          {(errors.expMonth || errors.expYear) && (
            <p id="exp-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.expMonth?.message === 'expired'
                ? tErrors('expired')
                : errors.expMonth?.message ?? errors.expYear?.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cvv" className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t('cvv')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="cvv"
              type={showCvv ? 'text' : 'password'}
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              aria-invalid={!!errors.cvv}
              aria-describedby={errors.cvv ? 'cvv-error' : undefined}
              {...register('cvv')}
              placeholder="•••"
              className={cn(INPUT_BASE, 'pr-10 tracking-widest')}
            />
            <button
              type="button"
              onClick={() => setShowCvv((v) => !v)}
              aria-label={showCvv ? 'CVV gizle' : 'CVV göster'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.cvv && (
            <p id="cvv-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.cvv.message === 'invalidCvv'
                ? tErrors('invalidCvv')
                : errors.cvv.message}
            </p>
          )}
        </div>
      </div>

      {/* 3D Secure badge note */}
      <p className="flex items-center gap-1.5 text-xs text-neutral-500">
        <svg viewBox="0 0 16 16" className="h-4 w-4 flex-shrink-0 text-green-500" fill="currentColor">
          <path d="M8 1L2 4v4c0 3.5 2.5 6.8 6 7.5C11.5 14.8 14 11.5 14 8V4L8 1z" />
        </svg>
        {t('securedBy')}
      </p>

      {/* Submit */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={isSubmitting}
        loading={isSubmitting}
        className="mt-2"
      >
        {isSubmitting ? 'İşleniyor...' : t('submit')}
      </Button>
    </form>
  );
}
