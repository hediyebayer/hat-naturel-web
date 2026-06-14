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
import { getPaymentProvider } from '@/lib/payment/provider';
import { maskPan } from '@/lib/payment/card-utils';

const MAX_BODY_SIZE = 20_000; // 20KB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const text = await request.text();

    if (text.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { ok: false, message: 'İstek gövdesi çok büyük.' },
        { status: 413 },
      );
    }

    const json: unknown = JSON.parse(text);
    const validated = initiatePaymentSchema.parse(json);

    // PAN'ı loglamadan önce maskele
    const maskedForLog = maskPan(validated.card.pan);
    // eslint-disable-next-line no-console
    console.info(
      `[api/payment/initiate] room=${validated.order.roomSlug} masked=${maskedForLog} mode=${validated.depositMode}`,
    );

    const provider = getPaymentProvider();
    const result = await provider.initiate({
      order: validated.order,
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
