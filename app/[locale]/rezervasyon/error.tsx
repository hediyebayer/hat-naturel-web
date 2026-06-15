'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

/**
 * Rezervasyon akışı hata sınırı (error boundary).
 * next-intl uyumlu: common namespace'ten yerelleştirilmiş metin kullanır.
 */
export default function ReservationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  const t = useTranslations('common');

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[rezervasyon] boundary:', error);
  }, [error]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="font-serif text-2xl text-neutral-900">{t('error')}</h1>
      <Button onClick={reset} variant="primary">
        {t('tryAgain')}
      </Button>
    </Container>
  );
}
