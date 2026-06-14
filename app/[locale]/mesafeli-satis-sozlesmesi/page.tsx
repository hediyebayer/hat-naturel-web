import type { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { COMPANY_INFO, LAST_UPDATED } from '@/lib/content/legal';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Mesafeli Satış Sözleşmesi — Hat Naturel Resort',
    description:
      'Hat Naturel Resort Sapanca mesafeli satış sözleşmesi. 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında hazırlanmıştır.',
    robots: { index: false, follow: true },
  };
}

export default async function MesafeliSatisSozlesmesiPage({ params }: Props): Promise<React.ReactElement> {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'legal.distanceSales' });

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

        <div className="prose prose-neutral max-w-none">
          {/* MADDE 1: TARAFLAR */}
          <section className="mb-8">
            <Heading level={2} visualLevel={4} className="mb-3">
              Madde 1 — Taraflar
            </Heading>
            <div className="overflow-hidden rounded-lg border border-neutral-200">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="w-32 px-4 py-3 text-left font-semibold text-neutral-700" colSpan={2}>
                      Satıcı (İşletmeci)
                    </th>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="w-36 px-4 py-2.5 text-neutral-500">Ünvan</td>
                    <td className="px-4 py-2.5 font-medium text-neutral-800">{COMPANY_INFO.legalName}</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="px-4 py-2.5 text-neutral-500">Adres</td>
                    <td className="px-4 py-2.5 text-neutral-800">{COMPANY_INFO.address}</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="px-4 py-2.5 text-neutral-500">Telefon</td>
                    <td className="px-4 py-2.5 text-neutral-800">{COMPANY_INFO.phone}</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="px-4 py-2.5 text-neutral-500">E-posta</td>
                    <td className="px-4 py-2.5 text-neutral-800">{COMPANY_INFO.email}</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="px-4 py-2.5 text-neutral-500">Web</td>
                    <td className="px-4 py-2.5 text-neutral-800">{COMPANY_INFO.web}</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="px-4 py-2.5 text-neutral-500">Vergi Dairesi / No</td>
                    <td className="px-4 py-2.5 text-neutral-800">
                      {COMPANY_INFO.taxOffice} / {COMPANY_INFO.taxNo}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-neutral-500">MERSİS No</td>
                    <td className="px-4 py-2.5 text-neutral-800">{COMPANY_INFO.mersis}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Text variant="small" muted className="mt-3">
              <strong>Alıcı:</strong> Rezervasyon formunda belirtilen ad, soyad, iletişim ve adres
              bilgilerine sahip kişi.
            </Text>
          </section>

          {/* MADDE 2: KONU */}
          <section className="mb-8">
            <Heading level={2} visualLevel={4} className="mb-3">
              Madde 2 — Sözleşmenin Konusu
            </Heading>
            <Text>
              Bu sözleşme; 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
              Yönetmeliği hükümleri çerçevesinde, Satıcı&apos;nın{' '}
              <strong>{COMPANY_INFO.web}</strong> adresli web sitesi üzerinden sunduğu bungalov/köşk
              konaklama hizmetinin Alıcı tarafından elektronik ortamda satın alınmasına ilişkin
              tarafların hak ve yükümlülüklerini kapsamaktadır.
            </Text>
          </section>

          {/* MADDE 3: ÜRÜN / HİZMET */}
          <section className="mb-8">
            <Heading level={2} visualLevel={4} className="mb-3">
              Madde 3 — Hizmet Bilgileri
            </Heading>
            <Text>
              Satın alınan hizmet; Alıcı&apos;nın rezervasyon sırasında seçtiği bungalov/köşk
              tipine, giriş-çıkış tarihlerine ve misafir sayısına göre belirlenen konaklama
              hizmetidir. Hizmet detayları (oda tipi, tarih, kişi sayısı, toplam tutar) ödeme
              akışı sırasında Alıcı&apos;ya sunulan sipariş özeti ekranında yer almaktadır.
            </Text>
            <Text className="mt-3">
              Tüm fiyatlar Türk Lirası (₺) cinsinden olup KDV dahildir.
            </Text>
          </section>

          {/* MADDE 4: ÖDEME */}
          <section className="mb-8">
            <Heading level={2} visualLevel={4} className="mb-3">
              Madde 4 — Ödeme Koşulları
            </Heading>
            <Text>
              Alıcı, ödeme akışında &ldquo;Tamamını öde&rdquo; veya &ldquo;%30 Kapora&rdquo;
              seçeneğini tercih edebilir:
            </Text>
            <ul className="mt-3 space-y-2 text-base leading-7 text-neutral-800">
              <li>
                <strong>Tamamını öde:</strong> Toplam konaklama bedeli tek seferde tahsil edilir.
              </li>
              <li>
                <strong>%30 Kapora:</strong> Toplam bedelin %30&apos;u online ödeme ile tahsil
                edilir; kalan %70, tesis girişinde nakit veya kart ile ödenir.
              </li>
            </ul>
            <Text className="mt-3">
              Ödemeler VakıfBank Sanal POS altyapısı üzerinden 3D Secure güvencesiyle alınır.
              Kart bilgileri Satıcı&apos;nın sunucularında saklanmaz.
            </Text>
          </section>

          {/* MADDE 5: CAYMA HAKKI */}
          <section className="mb-8">
            <Heading level={2} visualLevel={4} className="mb-3">
              Madde 5 — Cayma Hakkı
            </Heading>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <Text className="font-semibold text-red-700">
                ⚠️ Konaklama hizmetlerinde cayma hakkı bulunmamaktadır.
              </Text>
              <Text variant="small" className="mt-2 text-red-600">
                Mesafeli Sözleşmeler Yönetmeliği Madde 15/1-(g) uyarınca, belirli bir tarihte veya
                dönemde yapılması gereken, konaklama, eşya taşıma, araba kiralama, yiyecek-içecek
                tedariki ve eğlence veya dinlenme amacıyla yapılan sözleşmelerde cayma hakkı
                kullanılamaz.
              </Text>
            </div>
            <Text className="mt-4">
              <strong>Tarih değişikliği:</strong> Giriş tarihinden <strong>7 (yedi) gün</strong>{' '}
              öncesine kadar konaklama tarihinizi değiştirebilirsiniz. Bu süre dolduktan sonra tarih
              değişikliği ve ücret iadesi yapılmamaktadır.
            </Text>
            <Text className="mt-2">
              <strong>İptal:</strong> Her koşulda iptal ve ücret iadesi yapılmamaktadır. Kişisel
              sebepler, hava durumu veya plan değişikliği bu kapsamda geçerli değildir.
            </Text>
          </section>

          {/* MADDE 6: YETKİLİ MAHKEME */}
          <section className="mb-8">
            <Heading level={2} visualLevel={4} className="mb-3">
              Madde 6 — Yetkili Mahkeme ve İcra Dairesi
            </Heading>
            <Text>
              İşbu sözleşmeden doğacak uyuşmazlıklarda, yürürlükteki mevzuatta belirlenen parasal
              sınırlar dahilinde Alıcı&apos;nın yerleşim yerindeki veya Satıcı&apos;nın bulunduğu
              yerdeki{' '}
              <strong>Tüketici Hakem Heyetleri</strong> yetkilidir. Sınırı aşan uyuşmazlıklarda{' '}
              <strong>Sakarya Tüketici Mahkemeleri</strong> ve İcra Daireleri yetkili kılınmıştır.
            </Text>
            <Text className="mt-3">
              Alıcı, bu sözleşmeyi okuyup onaylayarak yukarıdaki tüm koşulları kabul ettiğini beyan
              eder.
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
