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
import { getClientIp, getRateLimiter } from '@/lib/security/rate-limit';

const STATUS_RATE_LIMIT = { limit: 10, windowMs: 60_000 };

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    const rateLimit = getRateLimiter().consume(
      `payment:status:${ip}`,
      STATUS_RATE_LIMIT,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, message: 'Çok fazla durum sorgusu. Lütfen tekrar deneyin.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

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

    return NextResponse.json({
      ok: true,
      record: {
        status: record.status,
        amountCharged: record.amountCharged,
        last4: record.card.last4,
        brand: record.card.brand,
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
