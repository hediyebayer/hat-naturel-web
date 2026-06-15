/**
 * POST /api/payment/initiate
 *
 * Body: initiatePaymentSchema
 * Response:
 *   200 { ok: true, reservationId, redirectUrl, amountCharged }
 *   400 { ok: false, message, fieldErrors? }
 *   500 { ok: false, message }
 *
 * ⚠️ PAN ASLA loglanmaz — yalnızca masked PAN kullanılır.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { initiatePaymentSchema } from '@/lib/payment/schemas';
import { validateOrderPricing } from '@/lib/payment/order';
import { getPaymentProvider } from '@/lib/payment/provider';
import { maskPan } from '@/lib/payment/card-utils';
import { getClientIp, getRateLimiter } from '@/lib/security/rate-limit';

const MAX_BODY_SIZE = 20_000; // 20KB
const INITIATE_RATE_LIMIT = { limit: 5, windowMs: 60_000 };

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const text = await request.text();

    if (text.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { ok: false, message: 'İstek gövdesi çok büyük.' },
        { status: 413 },
      );
    }

    const rateLimit = getRateLimiter().consume(
      `payment:initiate:${getClientIp(request)}`,
      INITIATE_RATE_LIMIT,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Çok fazla ödeme başlatma denemesi. Lütfen bekleyip tekrar deneyin.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const json: unknown = JSON.parse(text);
    const validated = initiatePaymentSchema.parse(json);

    const priceValidation = await validateOrderPricing(validated.order);
    if (!priceValidation.ok || !priceValidation.canonicalOrder) {
      return NextResponse.json(
        {
          ok: false,
          message: priceValidation.reason === 'price_mismatch'
            ? 'Fiyat bilgisi güncellendi. Lütfen rezervasyon özetini yeniden kontrol edin.'
            : 'Seçtiğiniz oda veya tarih bilgisi artık müsait değil.',
        },
        { status: 400 },
      );
    }

    // PAN'ı loglamadan önce maskele
    const maskedForLog = maskPan(validated.card.pan);
    // eslint-disable-next-line no-console
    console.info(
      `[api/payment/initiate] room=${validated.order.roomSlug} masked=${maskedForLog} mode=${validated.depositMode} fallback=${priceValidation.usesFallbackPricing === true}`,
    );

    const provider = getPaymentProvider();
    const result = await provider.initiate({
      order: priceValidation.canonicalOrder,
      guest: validated.guest,
      card: validated.card,
      consents: validated.consents,
      depositMode: validated.depositMode,
      locale: request.headers.get('x-locale') ?? undefined,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Form bilgileri eksik veya hatalı.',
          fieldErrors: e.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (e instanceof SyntaxError) {
      return NextResponse.json(
        { ok: false, message: 'Geçersiz JSON formatı.' },
        { status: 400 },
      );
    }

    // eslint-disable-next-line no-console
    console.error('[api/payment/initiate] beklenmedik hata:', e);
    return NextResponse.json(
      { ok: false, message: 'Ödeme başlatılamadı, lütfen tekrar deneyin.' },
      { status: 500 },
    );
  }
}
