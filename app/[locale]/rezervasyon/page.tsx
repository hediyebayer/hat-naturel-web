import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ReservationSearchForm } from '@/components/reservation/reservation-search-form';
import { AvailableRoomCard } from '@/components/reservation/available-room-card';
import { getAvailability } from '@/lib/reservation/availability';

interface ReservationPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export async function generateMetadata(props: ReservationPageProps): Promise<Metadata> {
  const params = await props.params;
  const tMeta = await getTranslations({ locale: params.locale, namespace: 'meta.reservation' });
  return {
    title: tMeta('title'),
    description: tMeta('description'),
    alternates: {
      canonical: `/${params.locale}/rezervasyon`,
    },
    robots: { index: false, follow: true }, // dinamik sonuç sayfası
  };
}

export default async function ReservationPage(props: ReservationPageProps): Promise<React.ReactElement> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: 'reservationPage' });

  const checkIn = searchParams.checkIn ?? '';
  const checkOut = searchParams.checkOut ?? '';
  const guests = Number(searchParams.guests ?? 2);

  // Query verilmemişse arama formuyla boş bir sayfa göster
  const hasQuery = Boolean(checkIn && checkOut);

  const result = hasQuery
    ? await getAvailability({ checkIn, checkOut, guests })
    : null;

  const queryString = new URLSearchParams({
    checkIn,
    checkOut,
    guests: String(guests),
  }).toString();

  const availableCount = result?.rooms.filter((r) => r.isAvailable).length ?? 0;

  return (
    <main className="bg-neutral-50 pb-20 pt-28">
      <Container size="xl">
        {/* Başlık */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            {t('kicker')}
          </span>
          <Heading level={1} className="mt-2">
            {t('title')}
          </Heading>
          <Text muted className="mx-auto mt-3 max-w-2xl">
            {t('subtitle')}
          </Text>
        </div>

        {/* Arama formu */}
        <div className="mx-auto mt-8 max-w-4xl">
          <ReservationSearchForm
            locale={params.locale}
            defaultCheckIn={checkIn}
            defaultCheckOut={checkOut}
            defaultGuests={guests}
          />
        </div>

        {/* Sonuçlar */}
        <div className="mt-10">
          {!hasQuery && (
            <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-neutral-200">
              <Text muted>
                {t('emptyState')}
              </Text>
            </div>
          )}

          {result && !result.isValidQuery && (
            <div className="rounded-2xl bg-red-50 p-6 text-center ring-1 ring-red-200">
              <Text className="text-red-700">
                {result.errorMessage ?? t('queryInvalid')}
              </Text>
            </div>
          )}

          {result?.isValidQuery && (
            <>
              {result.isFallback && (
                <div className="mb-4 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
                  <Text className="text-sm text-amber-800">
                    {t('fallbackWarning')}
                  </Text>
                </div>
              )}
              <div className="mb-6 flex items-center justify-between">
                <Text muted className="text-sm">
                  {t.rich('resultsCount', {
                    nights: result.nights,
                    count: availableCount,
                  })}
                </Text>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {result.rooms.map((roomData) => (
                  <AvailableRoomCard
                    key={roomData.room.slug}
                    data={roomData}
                    locale={params.locale}
                    query={queryString}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
