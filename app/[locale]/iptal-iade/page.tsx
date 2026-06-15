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
    title: 'İptal & İade Politikası — Hat Naturel Resort',
    description:
      'Hat Naturel Resort Sapanca iptal ve iade koşulları. Konaklama kuralları ve tarih değişikliği politikası.',
    robots: { index: false, follow: true },
  };
}

export default async function IptalIadePage(props: Props): Promise<React.ReactElement> {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'legal.cancellation' });

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
          {/* 1 — Genel Bilgi */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              1. Genel Bilgi
            </Heading>
            <Text>
              Hat Naturel Resort olarak konaklama rezervasyonlarımız, Mesafeli Sözleşmeler
              Yönetmeliği Madde 15/1-(g) gereği cayma hakkı kapsamı dışında olup aşağıdaki
              politikalar geçerlidir.
            </Text>
          </section>

          {/* 2 — Tarih Değişikliği */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              2. Tarih Değişikliği
            </Heading>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <Text className="font-medium text-green-800">
                ✅ Konaklama giriş tarihinden <strong>7 (yedi) gün</strong> öncesine kadar tarih
                değişikliği talep edebilirsiniz.
              </Text>
            </div>
            <ul className="mt-4 space-y-3 text-base leading-7 text-neutral-800">
              <li>
                Değişiklik talebinizi <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary-700 underline">{COMPANY_INFO.email}</a> adresine veya{' '}
                <a href={`tel:${COMPANY_INFO.phone}`} className="text-primary-700 underline">{COMPANY_INFO.phone}</a> numarasına iletebilirsiniz.
              </li>
              <li>
                Yeni tarih, müsaitlik durumuna göre onaylanır; müsaitlik yoksa alternatif tarih
                önerilir.
              </li>
              <li>
                Her rezervasyon için yalnızca <strong>bir kez</strong> tarih değişikliği yapılabilir.
              </li>
            </ul>
          </section>

          {/* 3 — İptal */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              3. Rezervasyon İptali
            </Heading>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <Text className="font-semibold text-red-700">
                ❌ Rezervasyon iptali ve ücret iadesi yapılmamaktadır.
              </Text>
            </div>
            <Text className="mt-4">
              Aşağıdaki durumlar iade ya da iptal hakkı doğurmaz:
            </Text>
            <ul className="mt-3 space-y-2 text-base leading-7 text-neutral-800">
              <li>Kişisel plan değişikliği veya vazgeçme</li>
              <li>Hava durumu (yağmur, sis, vb.)</li>
              <li>Araç arızası / ulaşım sorunu</li>
              <li>Sağlık durumu (poliçe almak misafirin sorumluluğundadır)</li>
              <li>Giriş tarihine <strong>7 günden az</strong> kalan tarih değişikliği talepleri</li>
            </ul>
          </section>

          {/* 4 — Kimliksiz Giriş */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              4. Kimliksiz / Yetersiz Belgeyle Giriş
            </Heading>
            <Text>
              Tüm misafirlerin (çocuk dahil) geçerli TC kimlik kartı veya pasaportuyla tesis girişi
              yapması zorunludur. Geçerli kimlik belgesinin ibraz edilememesi durumunda konaklamaya
              izin verilmez ve ücret iadesi yapılmaz.
            </Text>
          </section>

          {/* 5 — İade Prosedürü */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              5. İade Prosedürü (İstisna Durumlar)
            </Heading>
            <Text>
              Yukarıdaki politikalar dışında kalan ve tarafımızca kabul edilen istisnai durumlarda
              iade süreci şu şekilde işler:
            </Text>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-7 text-neutral-800">
              <li>
                Yazılı iade talebini{' '}
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary-700 underline">
                  {COMPANY_INFO.email}
                </a>{' '}
                adresine gönderin; rezervasyon referans numaranızı belirtin.
              </li>
              <li>
                Talebiniz 3 iş günü içinde değerlendirilir ve size yazılı olarak bildirilir.
              </li>
              <li>
                Onaylanan iadeler, ödemenin yapıldığı kart/hesaba <strong>7–14 iş günü</strong>{' '}
                içinde yansıtılır. İade süresi bankanıza göre değişebilir.
              </li>
              <li>
                Kısmi iade durumunda (örn. erken çıkış) yalnızca kullanılmayan gecelere ait tutar
                hesaplanır; işlem masrafları düşülür.
              </li>
            </ol>
          </section>

          {/* 6 — İletişim */}
          <section>
            <Heading level={2} visualLevel={4} className="mb-4">
              6. İletişim
            </Heading>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <Text>
                <strong>{COMPANY_INFO.legalName}</strong>
                <br />
                {COMPANY_INFO.address}
                <br />
                Telefon:{' '}
                <a href={`tel:${COMPANY_INFO.phone}`} className="text-primary-700">
                  {COMPANY_INFO.phone}
                </a>
                <br />
                E-posta:{' '}
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary-700">
                  {COMPANY_INFO.email}
                </a>
              </Text>
            </div>
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
