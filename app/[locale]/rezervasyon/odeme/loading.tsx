import { Container } from '@/components/ui/container';

/**
 * Ödeme akışı yükleme sınırı (loading boundary).
 * Locale-agnostik görsel spinner — Suspense fallback olarak çalışır.
 */
export default function PaymentLoading(): JSX.Element {
  return (
    <Container className="flex min-h-[50vh] items-center justify-center py-16">
      <div
        role="status"
        aria-label="loading"
        className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600"
      />
    </Container>
  );
}
