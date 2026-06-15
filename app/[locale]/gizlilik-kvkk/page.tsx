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
    title: 'Gizlilik & KVKK Aydınlatma Metni — Hat Naturel Resort',
    description:
      'Hat Naturel Resort Sapanca 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.',
    robots: { index: false, follow: true },
  };
}

export default async function GizlilikKvkkPage(props: Props): Promise<React.ReactElement> {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'legal.privacy' });

  return (
    <main className="min-h-screen pt-24 pb-20">
      <Container size="md">
        {/* Başlık */}
        <div className="mb-10 border-b border-neutral-200 pb-6">
          <Heading level={1} className="mb-2">
            {t('title')}
          </Heading>
          <Text variant="small" muted>
            6698 Sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) Madde 10 uyarınca
            hazırlanmıştır.
          </Text>
          <Text variant="small" muted className="mt-1">
            {t('lastUpdated', { date: LAST_UPDATED })}
          </Text>
        </div>

        <div className="space-y-10">
          {/* 1 — Veri Sorumlusu */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              1. Veri Sorumlusu
            </Heading>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <Text>
                <strong>{COMPANY_INFO.legalName}</strong>
                <br />
                Adres: {COMPANY_INFO.address}
                <br />
                Telefon: {COMPANY_INFO.phone}
                <br />
                E-posta: {COMPANY_INFO.email}
                <br />
                KEP: {COMPANY_INFO.kep}
                <br />
                Vergi Dairesi / No: {COMPANY_INFO.taxOffice} / {COMPANY_INFO.taxNo}
                <br />
                MERSİS No: {COMPANY_INFO.mersis}
              </Text>
            </div>
          </section>

          {/* 2 — İşlenen Kişisel Veri Kategorileri */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              2. İşlenen Kişisel Veri Kategorileri
            </Heading>
            <div className="overflow-hidden rounded-lg border border-neutral-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Kategori</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                      Veri Türleri
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="px-4 py-3 font-medium text-neutral-700">Kimlik</td>
                    <td className="px-4 py-3 text-neutral-600">
                      Ad, soyad, T.C. kimlik / pasaport numarası
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-neutral-700">İletişim</td>
                    <td className="px-4 py-3 text-neutral-600">
                      E-posta adresi, telefon numarası, adres (şehir, ilçe)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-neutral-700">İşlem</td>
                    <td className="px-4 py-3 text-neutral-600">
                      Rezervasyon tarihleri, oda tipi, misafir sayısı, ödeme tutarı
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-neutral-700">
                      Ödeme (masked)
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      Kart son 4 hanesi, kart markası, kart sahibi adı. Tam PAN saklanmaz.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-neutral-700">Teknik</td>
                    <td className="px-4 py-3 text-neutral-600">
                      Dil tercihi (localStorage/cookie), IP adresi (sunucu logları)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3 — İşleme Amaçları */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              3. Kişisel Verilerin İşlenme Amaçları
            </Heading>
            <ul className="space-y-2 text-base leading-7 text-neutral-800">
              <li>Konaklama rezervasyonunun alınması ve yönetilmesi</li>
              <li>Ödeme işleminin gerçekleştirilmesi (sanal POS)</li>
              <li>Yasal zorunluluk kapsamında emniyet müdürlüğüne kimlik bildirimi</li>
              <li>Rezervasyon onayı ve bilgilendirme e-postası gönderimi</li>
              <li>Müşteri hizmetleri ve iletişim yönetimi</li>
              <li>Yasal uyumluluk (vergi, muhasebe, tüketici şikayeti)</li>
            </ul>
          </section>

          {/* 4 — Hukuki Sebep */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              4. Kişisel Veri İşlemenin Hukuki Sebebi
            </Heading>
            <Text>
              Kişisel verileriniz KVKK Madde 5 kapsamında aşağıdaki hukuki sebeplere dayalı olarak
              işlenmektedir:
            </Text>
            <ul className="mt-3 space-y-2 text-base leading-7 text-neutral-800">
              <li>
                <strong>M.5/2-c:</strong> Bir sözleşmenin kurulması veya ifasıyla doğrudan
                ilgili olması (konaklama sözleşmesi)
              </li>
              <li>
                <strong>M.5/2-ç:</strong> Veri sorumlusunun hukuki yükümlülüğünü yerine
                getirebilmesi için zorunlu olması (emniyet bildirimi, vergi)
              </li>
              <li>
                <strong>M.5/2-f:</strong> İlgili kişinin temel hak ve özgürlüklerine zarar
                vermemek kaydıyla veri sorumlusunun meşru menfaatleri (müşteri hizmetleri)
              </li>
            </ul>
          </section>

          {/* 5 — Aktarım */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              5. Kişisel Verilerin Aktarımı
            </Heading>
            <Text>
              Kişisel verileriniz aşağıdaki alıcı gruplarıyla ve belirtilen amaçlarla paylaşılabilir:
            </Text>
            <div className="mt-3 overflow-hidden rounded-lg border border-neutral-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Alıcı</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Amaç</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="px-4 py-3 text-neutral-700">VakıfBank (VPOS)</td>
                    <td className="px-4 py-3 text-neutral-600">Ödeme işlemi</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-neutral-700">Resend (e-posta)</td>
                    <td className="px-4 py-3 text-neutral-600">Onay ve bildirim e-postası</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-neutral-700">
                      Emniyet Müdürlüğü
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      Konaklama kaydı (yasal zorunluluk)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-neutral-700">Vergi Dairesi</td>
                    <td className="px-4 py-3 text-neutral-600">
                      Muhasebe ve vergi beyannamesi (yasal zorunluluk)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Text variant="small" muted className="mt-3">
              Yukarıda belirtilenler dışında kişisel verileriniz üçüncü taraflara satılmaz,
              kiralanmaz veya ticari amaçla paylaşılmaz.
            </Text>
          </section>

          {/* 6 — Saklama Süresi */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              6. Saklama Süresi
            </Heading>
            <Text>
              Kişisel verileriniz, işleme amacının ortadan kalkması ve yasal saklama sürelerinin
              sona ermesiyle birlikte silinir veya anonim hale getirilir:
            </Text>
            <ul className="mt-3 space-y-2 text-base leading-7 text-neutral-800">
              <li>
                <strong>Konaklama ve ödeme kayıtları:</strong> 10 yıl (Türk Ticaret Kanunu Madde
                82)
              </li>
              <li>
                <strong>Emniyet bildirimi kayıtları:</strong> İlgili mevzuat kapsamında
              </li>
              <li>
                <strong>İletişim talepleri:</strong> 2 yıl
              </li>
            </ul>
          </section>

          {/* 7 — İlgili Kişi Hakları */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              7. İlgili Kişinin Hakları (KVKK Madde 11)
            </Heading>
            <Text>
              Kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:
            </Text>
            <ul className="mt-3 space-y-2 text-base leading-7 text-neutral-800">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve bu amaca uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmiş ise düzeltilmesini isteme</li>
              <li>
                KVKK Madde 7&apos;de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini
                isteme
              </li>
              <li>
                Düzeltme, silme veya yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini
                isteme
              </li>
              <li>
                İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi
                suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme
              </li>
              <li>
                Kişisel verilerin kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın
                giderilmesini talep etme
              </li>
            </ul>
          </section>

          {/* 8 — Başvuru */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              8. Başvuru Yolu
            </Heading>
            <Text>
              Haklarınıza ilişkin başvurularınızı aşağıdaki kanallardan iletebilirsiniz:
            </Text>
            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <Text>
                <strong>E-posta:</strong>{' '}
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary-700 underline">
                  {COMPANY_INFO.email}
                </a>
                <br />
                <strong>KEP:</strong> {COMPANY_INFO.kep}
                <br />
                <strong>Posta:</strong> {COMPANY_INFO.address}
              </Text>
            </div>
            <Text variant="small" muted className="mt-3">
              Başvurularınız KVKK Madde 13 gereği 30 gün içinde yanıtlanacaktır. Başvurunuzda
              kimliğinizi ispatlayıcı belge eklemeniz gerekmektedir.
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
