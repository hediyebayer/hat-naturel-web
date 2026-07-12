/**
 * Misafir Yorumları — Google Business Profile'dan seçilmiş, manuel olarak
 * eklenmiş gerçek yorumlar.
 *
 * Kurallar:
 *  - Yorum metinleri HER ZAMAN Türkçe orijinal halinde (gerçek yorum, çeviri yok).
 *  - İsimler gizli: ilk isim + soyad baş harfi + nokta (KVKK/GDPR uyumu).
 *  - Bu liste elle güncellenir; Google Places API entegrasyonu yoktur.
 *
 * Kaynak: Google Maps — Hat Naturel Resort Sapanca
 * (place_id: ChIJWfjSbG-lzBQRdAJU6FDx57w)
 */

export interface Review {
  /** Gizli isim: 'Ad S.' formatında. */
  name: string;
  /** Yıldız puanı (1-5). */
  stars: number;
  /** Göreceli tarih, Türkçe (orijinal Google metni). */
  date: string;
  /** Konaklama tipi / etiket (örn: 'Aile', 'Çift'). */
  tag?: string;
  /** Google 'öne çıkanlar' rozet metni (örn: 'Muhteşem manzara'). */
  highlights?: string;
  /** Yorum metni (orijinal Türkçe). */
  text: string;
}

export const REVIEWS: Review[] = [
  {
    name: 'Mustafa C.',
    stars: 5,
    date: '11 ay önce',
    tag: 'Aile',
    highlights: 'Muhteşem manzara',
    text: 'Öncelikle Hat Naturel Resort işletme sahibi Ali Bey\u2019e Sapanca\u2019ya göl manzaralı güzel bir işletme kazandırdığı, çalışanlarına temiz, düzenli ve özverili çalışmalarından dolayı çok teşekkür ediyorum. Bu benim ailemle ikinci gelişim, inşallah önümüzdeki yıllarda da gelmeye devam edeceğim, herkese tavsiye ederim.',
  },
  {
    name: 'Akın Y.',
    stars: 5,
    date: '1 yıl önce',
    tag: 'Çift',
    highlights: 'Lüks · Muhteşem manzara · Romantik',
    text: 'Şehrin tepesinde, geniş ve en güzel manzaraya sahip bu tesisi mutlaka herkesin görüp o tatil keyfini yaşamasını şiddetle tavsiye ediyorum. Dolu dolu iki gece konakladık, bir bungalovda olması gereken her şeyin fazlası mevcuttu, eksik hiçbir şey yoktu. İlk geceden sonra öyle alıştık ki hiç dönmek istemedik, kendi evimizmiş gibi hissettik. Sıcak, çok temiz, hijyenik ve aileye uygun bir işletme.',
  },
  {
    name: 'Büşra U.',
    stars: 5,
    date: '3 ay önce',
    tag: 'Arkadaşlar',
    text: 'Hafta sonu tatili için arkadaşlarımızla gittiğimiz; sıcak, samimi ve son derece ilgili personeli ile kafa dinlemelik, huzur dolu, temiz bir konaklama merkezi. Herkese tavsiye ediyorum, gönül rahatlığı ile gidebilirsiniz.',
  },
  {
    name: 'Ali T.',
    stars: 5,
    date: '3 ay önce',
    tag: 'Hafta sonu kaçamağı',
    text: 'Fiyat performans ve konfor açısından plus bir kaliteye sahip. Hafta sonu kaçamak için geldik ve süper keyifli bir hafta sonu geçirdik. Hem sıcak havuz, hem jakuzi hem de sauna büyük lüks bence. Ailenizle vakit geçirebileceğiniz güzel bir işletme, şiddetle tavsiye ederim.',
  },
  {
    name: 'Gamze O.',
    stars: 5,
    date: '4 gün önce',
    tag: 'Aile',
    highlights: 'Muhteşem manzara',
    text: 'Doğanın içinde sessiz, sakin, muhteşem manzarasıyla bizi mest etti. Çalışan personel çok ilgili, güler yüzleriyle bizi evimizde gibi hissettirdiler. Kahvaltısı efsane \u2014 manzaraya karşı tertemiz restoranda serpme kahvaltı yaptık. Sadece kahvaltı ve manzara için bile gelinebilir. Fiyat da oldukça makul, tam bir fiyat-performans.',
  },
];

/** Google Business Profile özet istatistikleri (elle güncellenir). */
export const REVIEW_STATS = {
  /** Ortalama puan (Google'dan). */
  rating: 4.8,
  /** Toplam yorum sayısı (Google'dan). */
  count: 487,
} as const;

/** Google Maps place linki (tüm yorumları gör). */
export const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/?q=place_id:ChIJWfjSbG-lzBQRdAJU6FDx57w';
