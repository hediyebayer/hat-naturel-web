import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { COMPANY_INFO, LAST_UPDATED } from '@/lib/content/legal';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(_: Props): Promise<Metadata> {
  return {
    title: 'Çerez Politikası — Hat Naturel Resort',
    description: 'Hat Naturel Resort Sapanca çerez (cookie) kullanım politikası.',
    robots: { index: false, follow: true },
  };
}

export default async function CerezPolitikasiPage(props: Props): Promise<React.ReactElement> {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'legal.cookies' });

  return (
    <main className="min-h-screen pt-24 pb-20">
      <Container size="md">
        {/* Başlık */}
        <div className="mb-10 border-b border-neutral-200 pb-6">
          <Heading level={1} className="mb-2">
            {t('title')}
          </Heading>
          <Text variant="small" muted>
            {t('lastUpdated', { date: LAST_UPDATED })}
          </Text>
        </div>

        <div className="space-y-10">
          {/* 1 — Çerez Nedir? */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              1. Çerez (Cookie) Nedir?
            </Heading>
            <Text>
              Çerezler, tarayıcınız aracılığıyla cihazınızda saklanan küçük metin dosyalarıdır. Web
              sitemizi ziyaret ettiğinizde bazı çerezler otomatik olarak yerleştirilebilir. Bu
              sayfada hangi çerezleri kullandığımızı ve neden kullandığımızı açıklıyoruz.
            </Text>
          </section>

          {/* 2 — Kullandığımız Çerezler */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              2. Kullandığımız Çerezler
            </Heading>

            <div className="overflow-hidden rounded-lg border border-neutral-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                      Çerez Adı
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Tür</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Amaç</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Süre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-700">
                      NEXT_LOCALE
                    </td>
                    <td className="px-4 py-3 text-neutral-600">Teknik / Zorunlu</td>
                    <td className="px-4 py-3 text-neutral-600">
                      Kullanıcının seçtiği dil tercihini (tr, en, de …) saklar.
                      Sayfa yenilendiğinde dil tekrar sorulmaz.
                    </td>
                    <td className="px-4 py-3 text-neutral-600">1 yıl</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-700">
                      __session / __Secure-*
                    </td>
                    <td className="px-4 py-3 text-neutral-600">Teknik / Oturum</td>
                    <td className="px-4 py-3 text-neutral-600">
                      Next.js App Router dahili oturum yönetimi. Herhangi bir kişisel veri
                      içermez.
                    </td>
                    <td className="px-4 py-3 text-neutral-600">Oturum</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3 — Kullanılmayanlar */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              3. Kullanmadığımız Çerezler
            </Heading>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <Text className="font-medium text-green-800">
                ✅ Bu sitede üçüncü taraf (3rd-party) çerezler, reklam/takip çerezleri veya
                analitik çerezler (Google Analytics, Facebook Pixel vb.) kullanılmamaktadır.
              </Text>
            </div>
            <Text className="mt-3" muted>
              Sitenin performansı yalnızca sunucu tarafı log analiziyle (IP, sayfa yolu, yanıt
              süresi) değerlendirilmektedir; bu veriler tarayıcı çerezi aracılığıyla toplanmaz.
            </Text>
          </section>

          {/* 4 — Çerezleri Kontrol Etme */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              4. Çerezleri Kontrol Etme ve Silme
            </Heading>
            <Text>
              Tarayıcınızın çerez ayarlarını değiştirerek çerezleri engelleyebilir veya
              silebilirsiniz. Ancak teknik çerezlerin devre dışı bırakılması siteyi kullanmanızı
              olumsuz etkileyebilir (ör. dil tercihiniz korunmaz).
            </Text>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li>
                <strong>Chrome:</strong> Ayarlar &rarr; Gizlilik ve güvenlik &rarr; Çerezler ve
                diğer site verileri
              </li>
              <li>
                <strong>Firefox:</strong> Ayarlar &rarr; Gizlilik ve Güvenlik &rarr; Çerezler ve
                Site Verileri
              </li>
              <li>
                <strong>Safari:</strong> Tercihler &rarr; Gizlilik &rarr; Web sitesi verilerini
                yönet
              </li>
              <li>
                <strong>Edge:</strong> Ayarlar &rarr; Gizlilik, arama ve hizmetler &rarr; Çerezler
              </li>
            </ul>
          </section>

          {/* 5 — İletişim */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              5. İletişim
            </Heading>
            <Text>
              Çerez politikamız hakkında sorularınız için:{' '}
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary-700 underline">
                {COMPANY_INFO.email}
              </a>
            </Text>
          </section>
        </div>

        {/* Son güncelleme */}
        <div className="mt-10 border-t border-neutral-100 pt-6">
          <Text variant="small" muted className="text-center">
            {t('lastUpdated', { date: LAST_UPDATED })} &nbsp;|&nbsp; {COMPANY_INFO.legalName}
          </Text>
        </div>
      </Container>
    </main>
  );
}
