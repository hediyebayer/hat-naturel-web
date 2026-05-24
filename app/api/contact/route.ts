import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { contactSchema } from '@/lib/contact/validation';
import { sendContactEmail } from '@/lib/contact/client';

const MAX_BODY_SIZE = 10_000; // 10KB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Mesaj çok uzun.' },
        { status: 413 },
      );
    }

    const json: unknown = JSON.parse(text);
    const validated = contactSchema.parse(json);

    await sendContactEmail(validated);

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla iletildi.',
    });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Form bilgileri eksik veya hatalı.',
          fieldErrors: e.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    // eslint-disable-next-line no-console
    console.error('[contact] beklenmedik hata:', e);
    return NextResponse.json(
      { success: false, message: 'Mesaj gönderilemedi, lütfen tekrar deneyin.' },
      { status: 500 },
    );
  }
}
