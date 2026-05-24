'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Send } from 'lucide-react';
import { contactSchema, type ContactSchemaInput } from '@/lib/contact/validation';
import { Input } from './input';
import { Textarea } from './textarea';
import { Button } from '@/components/ui/button';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Zod hata key'ini ('minLength:2', 'invalidEmail') i18n mesajına çevir.
 */
function translateError(
  errorKey: string | undefined,
  t: ReturnType<typeof useTranslations>,
): string | undefined {
  if (!errorKey) return undefined;
  if (errorKey.startsWith('minLength:')) {
    const min = errorKey.split(':')[1];
    return t('minLength', { min });
  }
  if (errorKey === 'invalidEmail') return t('invalidEmail');
  if (errorKey === 'invalidPhone') return t('invalidPhone');
  return t('required');
}

export function ContactForm(): React.ReactElement {
  const t = useTranslations('contact');
  const tErrors = useTranslations('errors');
  const [status, setStatus] = useState<Status>('idle');
  const [serverMsg, setServerMsg] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactSchemaInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactSchemaInput): Promise<void> => {
    setStatus('submitting');
    setServerMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { success: boolean; message?: string };
      if (!res.ok || !json.success) {
        setStatus('error');
        setServerMsg(json.message ?? t('error'));
        return;
      }
      setStatus('success');
      setServerMsg(t('success'));
      reset();
    } catch {
      setStatus('error');
      setServerMsg(t('error'));
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-2xl bg-primary-50 p-8 text-center"
      >
        <CheckCircle2
          size={48}
          className="mx-auto text-primary-600"
          aria-hidden
        />
        <h3 className="mt-4 font-serif text-2xl text-primary-900">
          {t('success')}
        </h3>
        <p className="mt-2 text-neutral-700">{t('successHint')}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => {
            setStatus('idle');
            setServerMsg('');
          }}
        >
          {t('newMessage')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={t('name')}
          required
          autoComplete="name"
          {...register('name')}
          error={translateError(errors.name?.message, tErrors)}
        />
        <Input
          label={t('email')}
          type="email"
          required
          autoComplete="email"
          {...register('email')}
          error={translateError(errors.email?.message, tErrors)}
        />
      </div>
      <Input
        label={t('phone')}
        type="tel"
        required
        autoComplete="tel"
        placeholder="+90 ..."
        {...register('phone')}
        error={translateError(errors.phone?.message, tErrors)}
      />
      <Textarea
        label={t('message')}
        required
        rows={6}
        placeholder={t('messagePlaceholder')}
        {...register('message')}
        error={translateError(errors.message?.message, tErrors)}
      />

      {status === 'error' && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverMsg}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        loading={status === 'submitting'}
        disabled={status === 'submitting'}
        fullWidth
      >
        {status === 'submitting' ? (
          t('submitting')
        ) : (
          <>
            <Send size={18} />
            {t('submit')}
          </>
        )}
      </Button>
    </form>
  );
}
