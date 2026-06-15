'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

interface ReservationErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Segment-level error boundary for /[locale]/rezervasyon.
 *
 * Catches any unhandled throw from the reservation server component
 * (e.g. an unexpected exception in getAvailability) so users never
 * see a bare Next.js 500 page.
 */
export default function ReservationError({
  error,
  reset,
}: ReservationErrorProps): React.ReactElement {
  const t = useTranslations('reservationPage.errorBoundary');
  const locale = useLocale();

  useEffect(() => {
    console.error(
      '[ReservationPage] Unhandled error:',
      error.message,
      error.digest ?? '',
    );
  }, [error]);

  return (
    <div className="bg-neutral-50 pb-20 pt-28" role="alert" aria-live="polite">
      <Container size="sm">
        <div className="flex flex-col items-center rounded-2xl bg-white p-10 text-center ring-1 ring-neutral-200">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
            <AlertTriangle
              className="h-7 w-7 text-red-500"
              aria-hidden="true"
            />
          </div>

          <Heading level={2} className="mt-2">
            {t('title')}
          </Heading>
          <Text muted className="mx-auto mt-3 max-w-md">
            {t('description')}
          </Text>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {t('retry')}
            </button>
            <Link
              href={`/${locale}/iletisim`}
              className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
            >
              {t('contact')}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
