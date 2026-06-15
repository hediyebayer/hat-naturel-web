'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Consents, type ConsentValues } from '@/components/payment/consents';
import { guestInfoSchema, type GuestInfoInput } from '@/lib/payment/schemas';

const INPUT_BASE =
  'w-full rounded-xl border-0 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 ' +
  'ring-1 ring-neutral-300 placeholder:text-neutral-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 ' +
  'aria-[invalid=true]:ring-red-400';


interface GuestInfoFormProps {
  locale: string;
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  depositMode: 'full' | 'deposit';
}

export function GuestInfoForm({
  locale,
  roomSlug,
  checkIn,
  checkOut,
  guests,
  depositMode,
}: GuestInfoFormProps): React.ReactElement {
  const t = useTranslations('payment.guest');
  const tConsent = useTranslations('payment.consents');
  const router = useRouter();

  const [consents, setConsents] = useState<ConsentValues>({ kvkk: false, distance: false });
  const [consentsError, setConsentsError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<GuestInfoInput>({
    resolver: zodResolver(guestInfoSchema),
    mode: 'onTouched',
    defaultValues: { idType: 'tc' },
  });

  const idType = watch('idType');

  const onSubmit = useCallback(
    (data: GuestInfoInput) => {
      if (!consents.kvkk || !consents.distance) {
        setConsentsError(tConsent('required'));
        return;
      }
      setConsentsError(undefined);

      // SessionStorage'a yaz (30 dakika TTL)
      const draft = {
        guest: data,
        consents,
        depositMode,
        orderQuery: { room: roomSlug, checkIn, checkOut, guests },
        expiresAt: Date.now() + 30 * 60 * 1000,
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('hn_payment_draft', JSON.stringify(draft));
      }

      const query = new URLSearchParams({
        room: roomSlug,
        checkIn,
        checkOut,
        guests,
        deposit: depositMode,
      });
      router.push(`/${locale}/rezervasyon/odeme/kart?${query.toString()}`);
    },
    [consents, depositMode, roomSlug, checkIn, checkOut, guests, locale, tConsent, router],
  );

  const canSubmit = isValid && consents.kvkk && consents.distance;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Ad / Soyad */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t('firstName')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            {...register('firstName')}
            className={cn(INPUT_BASE)}
            placeholder={t('placeholderFirstName')}
          />
          {errors.firstName && (
            <p id="firstName-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t('lastName')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            {...register('lastName')}
            className={cn(INPUT_BASE)}
            placeholder={t('placeholderLastName')}
          />
          {errors.lastName && (
            <p id="lastName-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Kimlik Tipi + No */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-neutral-700">
              {t('idType')} <span aria-hidden="true" className="text-red-500">*</span>
            </legend>
            <div className="flex gap-4 pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  value="tc"
                  {...register('idType')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                {t('idTc')}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  value="passport"
                  {...register('idType')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                {t('idPassport')}
              </label>
            </div>
          </fieldset>
        </div>

        <div>
          <label htmlFor="idNumber" className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t('idNumber')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="idNumber"
            type="text"
            inputMode={idType === 'tc' ? 'numeric' : 'text'}
            maxLength={idType === 'tc' ? 11 : 20}
            aria-invalid={!!errors.idNumber}
            aria-describedby={errors.idNumber ? 'idNumber-error' : undefined}
            {...register('idNumber')}
            className={cn(INPUT_BASE)}
            placeholder={idType === 'tc' ? '12345678901' : 'A12345678'}
          />
          {errors.idNumber && (
            <p id="idNumber-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.idNumber.message}
            </p>
          )}
        </div>
      </div>

      {/* E-posta / Telefon */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t('email')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
            className={cn(INPUT_BASE)}
            placeholder={t('placeholderEmail')}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t('phone')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            {...register('phone')}
            className={cn(INPUT_BASE)}
            placeholder={t('placeholderPhone')}
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Adres */}
      <div>
        <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('address')} <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          rows={2}
          autoComplete="street-address"
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? 'address-error' : undefined}
          {...register('address')}
          className={cn(INPUT_BASE, 'resize-none')}
          placeholder={t('placeholderAddress')}
        />
        {errors.address && (
          <p id="address-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* Şehir / İlçe */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t('city')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="city"
            type="text"
            autoComplete="address-level2"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'city-error' : undefined}
            {...register('city')}
            className={cn(INPUT_BASE)}
            placeholder={t('placeholderCity')}
          />
          {errors.city && (
            <p id="city-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.city.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="district" className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t('district')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="district"
            type="text"
            aria-invalid={!!errors.district}
            aria-describedby={errors.district ? 'district-error' : undefined}
            {...register('district')}
            className={cn(INPUT_BASE)}
            placeholder={t('placeholderDistrict')}
          />
          {errors.district && (
            <p id="district-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.district.message}
            </p>
          )}
        </div>
      </div>

      {/* Onaylar */}
      <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200">
        <Consents value={consents} onChange={setConsents} error={consentsError} locale={locale} />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={!canSubmit}
        className="mt-2"
      >
        {t('submit')}
      </Button>
    </form>
  );
}
