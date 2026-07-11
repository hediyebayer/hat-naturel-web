import { sendHatoperasyonSyncFailureAlert } from '@/lib/payment/emails';
import type { PaymentRecord } from '@/lib/payment/types';
import { createReservation } from '@/lib/reservation/hatoperasyon-client';

const SLUG_TO_FALLBACK_BUNGALOW_ID: Partial<Record<string, string>> = {
  sari: 'SK10',
  mor: 'MOK11',
  bej: 'BK12',
  turkuaz: 'TK13',
  mavi: 'MAK14',
};

export async function syncReservationToHatoperasyon(
  record: PaymentRecord,
  logContext: string,
): Promise<void> {
  const bungalowId = resolveBungalowId(record.order.bungalowId, record.order.roomSlug);

  if (!bungalowId) {
    const error = `Bungalow ID çözümlenemedi (roomSlug=${record.order.roomSlug})`;
    console.error(`[${logContext}] ${error} | ref=${record.reservationId}`);
    await notifyHatoperasyonSyncFailure(record, error);
    return;
  }

  const syncResult = await createReservation({
    bungalowId,
    guestName: `${record.guest.firstName} ${record.guest.lastName}`.trim(),
    guestPhone: record.guest.phone,
    guestEmail: record.guest.email,
    guestCount: record.order.guests,
    checkIn: record.order.checkIn,
    checkOut: record.order.checkOut,
    depositMode: record.order.depositMode,
    paidAmount: record.amountCharged,
    source: 'website',
    externalId: record.reservationId,
  });

  if (syncResult.ok) {
    console.info(
      `[${logContext}] hatoperasyon reservation sync success | ref=${record.reservationId}${syncResult.remoteReservationId ? ` | remote=${syncResult.remoteReservationId}` : ''}`,
    );
    return;
  }

  console.error(
    `[${logContext}] hatoperasyon reservation sync failed | ref=${record.reservationId} | error=${syncResult.error}`,
  );
  await notifyHatoperasyonSyncFailure(record, syncResult.error, bungalowId, logContext);
}

function resolveBungalowId(
  storedBungalowId: string | undefined,
  roomSlug: string,
): string | undefined {
  if (storedBungalowId && storedBungalowId.trim().length > 0) {
    return storedBungalowId;
  }

  return SLUG_TO_FALLBACK_BUNGALOW_ID[roomSlug];
}

async function notifyHatoperasyonSyncFailure(
  record: PaymentRecord,
  error: string,
  bungalowId?: string,
  logContext = 'payment/hatoperasyon-sync',
): Promise<void> {
  try {
    await sendHatoperasyonSyncFailureAlert({
      reservationId: record.reservationId,
      guestName: `${record.guest.firstName} ${record.guest.lastName}`.trim(),
      guestPhone: record.guest.phone,
      guestEmail: record.guest.email,
      roomName: record.order.roomName,
      roomSlug: record.order.roomSlug,
      bungalowId: bungalowId ?? record.order.bungalowId,
      checkIn: record.order.checkIn,
      checkOut: record.order.checkOut,
      guestCount: record.order.guests,
      paidAmount: record.amountCharged,
      depositMode: record.order.depositMode,
      error,
    });
  } catch (alertError: unknown) {
    console.error(`[${logContext}] hatoperasyon sync failure alert gönderim hatası:`, alertError);
  }
}
