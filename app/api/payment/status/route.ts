/**
 * GET /api/payment/status?ref=HN-...
 *
 * Response:
 *   200 { ok: true, record: { ... } }
 *   400 { ok: false, message: 'missing_ref' }
 *   404 { ok: false, message: 'not_found' }
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getPaymentProvider } from '@/lib/payment/provider';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const ref = request.nextUrl.searchParams.get('ref');

    if (!ref) {
      return NextResponse.json(
        { ok: false, message: 'missing_ref' },
        { status: 400 },
      );
    }

    const provider = getPaymentProvider();
    const record = await provider.getStatus(ref);

    if (!record) {
      return NextResponse.json(
        { ok: false, message: 'not_found' },
        { status: 404 },
      );
    }

    // Güvenli yanıt — sadece UI'ın ihtiyacı olanlar
    return NextResponse.json({
      ok: true,
      record: {
        reservationId: record.reservationId,
        status: record.status,
        amountCharged: record.amountCharged,
        currency: record.currency,
        paidAt: record.paidAt?.toISOString() ?? null,
        maskedPan: record.card.maskedPan,
        last4: record.card.last4,
        brand: record.card.brand,
        failReason: record.failReason ?? null,
        order: record.order,
        guest: {
          firstName: record.guest.firstName,
          lastName: record.guest.lastName,
          email: record.guest.email,
        },
      },
    });
  } catch (e: unknown) {
    // eslint-disable-next-line no-console
    console.error('[api/payment/status] beklenmedik hata:', e);
    return NextResponse.json(
      { ok: false, message: 'Durum sorgulanamadı.' },
      { status: 500 },
    );
  }
}
