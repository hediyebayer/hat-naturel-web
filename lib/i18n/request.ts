import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale, FALLBACK_LOCALE, type Locale } from './config';

/**
 * 8 dilin hepsi için mesaj dosyası mevcut:
 * - tr, en, de, ru, ar, fr, es, it
 *
 * İki katmanlı fallback stratejisi:
 *  1) Dosya seviyesi: locale dosyası yüklenemezse → EN dosyası.
 *  2) Anahtar seviyesi: belirli bir anahtar locale dosyasında eksikse →
 *     getMessageFallback EN değerini bulmaya çalışır; yoksa namespace.key formunu
 *     gösterir (sessiz "[missing]" yerine geliştirici görsün).
 */

// EN mesajları fallback için tek seferlik (modül scope) yüklenir.
let enMessagesCache: Record<string, unknown> | undefined;
async function getEnMessages(): Promise<Record<string, unknown>> {
  if (!enMessagesCache) {
    enMessagesCache = (await import(`@/messages/${FALLBACK_LOCALE}.json`))
      .default as Record<string, unknown>;
  }
  return enMessagesCache;
}

function resolveByPath(
  obj: Record<string, unknown> | unknown,
  path: string,
): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as object)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl v4: callback artık `locale` yerine `requestLocale` (Promise) alır.
  // requested locale undefined olabilir (örn. statik render öncesi) → defaultLocale'e düş.
  const requested = await requestLocale;
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  // Geçersiz (locale listesinde olmayan) bir segment geldiyse 404.
  if (requested !== undefined && !locales.includes(requested as Locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    // Dosya yoksa veya parse hatası varsa EN fallback
    messages = (await import(`@/messages/${FALLBACK_LOCALE}.json`)).default;
  }

  // EN'i önceden yükle ki sync getMessageFallback'te kullanılabilsin.
  const enMessages = await getEnMessages();

  return {
    locale,
    messages,
    /**
     * Eksik veya hatalı anahtarlarda:
     *   1) EN sözlüğünden değerle değiştir, varsa
     *   2) yoksa "namespace.key" formunu döndür (sessiz boş yerine görünür)
     * Bu, dev ortamında missing key'leri yakalamayı kolaylaştırır;
     * prod'da ise kullanıcıya boş string yerine en azından İngilizce
     * yedek metin sunar.
     */
    getMessageFallback: ({ namespace, key }: { namespace?: string; key: string }) => {
      const path = namespace ? `${namespace}.${key}` : key;
      const enValue = resolveByPath(enMessages, path);
      if (enValue !== undefined) return enValue;
      return path;
    },
    /**
     * Hata yutma — eksik anahtarlar konsola düşsün ama uygulama çökmesin.
     * next-intl varsayılan davranışı bir IntlError fırlatır; production'da
     * onu sessizce yutup fallback'i devreye alıyoruz.
     */
    onError: () => {
      // no-op: getMessageFallback fallback'i sağlıyor.
    },
  };
});
