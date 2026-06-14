# VakıfBank Sanal POS Başvurusu — Site Hazırlık Checklist

**Tesis:** Hat Naturel Resort Sapanca  
**Web:** https://hatnaturel.com.tr  
**Tarih:** _DOLDURULACAK_  
**Hazırlayan:** _DOLDURULACAK_

---

## 1. Şirket & Yasal Bilgiler

- [x] Ticari ünvan footer ve "İletişim" sayfasında görünür: `{COMPANY_LEGAL_NAME}`
- [x] Vergi dairesi & no: `{TAX_OFFICE}` / `{TAX_NO}`
- [x] MERSİS no: `{MERSIS}`
- [x] Açık adres: `Nailiye Mah. Nailiye/4 Sk. No:6/1 Sapanca / Sakarya`
- [x] Telefon & e-posta: `+90 533 917 54 24` / `hatnaturel@gmail.com`
- [x] KEP adresi: `{KEP}`

> ⚠️ `{…}` ile işaretli alanlar `lib/content/legal.ts` dosyasındaki `COMPANY_INFO` sabitinde
> güncellenmesi gereken placeholder'lardır. Banka başvurusu öncesi tümü doldurulmalıdır.

---

## 2. Zorunlu Yasal Sayfalar

- [x] Mesafeli Satış Sözleşmesi → `/tr/mesafeli-satis-sozlesmesi`
- [x] İptal & İade Politikası → `/tr/iptal-iade`
- [x] Gizlilik & KVKK Aydınlatma → `/tr/gizlilik-kvkk`
- [x] Çerez Politikası → `/tr/cerez-politikasi`
- [x] İletişim → `/tr/iletisim`

**Tüm sayfalar tüm sayfaların footer'ından 1 tıkla erişilebilir.**

---

## 3. Ürün / Hizmet

- [x] Hizmet sunumu: konaklama (bungalov/köşk), kategori sayfaları → `/tr/odalar`
- [x] Fiyat görüntüleme: TL (₺), KDV dahil
- [x] Hizmet detayı (kapasite, donanım, fotoğraf, tarihe göre fiyat) → `/tr/odalar/{slug}`, `/tr/rezervasyon`
- [x] Stok/müsaitlik kontrolü: Hatoperasyon API entegrasyonu (fallback mock fiyatlar mevcuttur)

---

## 4. Ödeme Akışı

- [x] Sipariş özeti + onay adımı → `/tr/rezervasyon/odeme`
- [x] KVKK + Mesafeli onay checkbox → zorunlu, işaretlenmeden ödemeye geçilemez
- [x] Kart bilgisi formu (3D Secure) → `/tr/rezervasyon/odeme/kart`
- [x] 3D Secure doğrulama ekranı → `/tr/rezervasyon/odeme/3d-secure`
- [x] Başarı / hata sonuç sayfası → `/tr/rezervasyon/odeme/sonuc`
- [x] Müşteriye otomatik e-posta onayı (Resend)
- [x] İşletmeye rezervasyon bildirimi (Resend)

> **Not:** Şu an UI ve akış kuruludur; **gerçek VPOS entegrasyonu (MPI çağrısı, hash, terminal)
> banka credential teslimi sonrasında 1-2 gün içinde aktive edilecektir.**  
> Provider katmanı arkasında soyutlama mevcut (`lib/payment/provider.ts` →
> `MockVakifBankProvider` → `RealVakifBankProvider` swap).

---

## 5. Güvenlik

- [x] HTTPS (SSL) tüm site üzerinde aktif (Vercel üzerinden otomatik)
- [x] Kart verisi sunucuda saklanmıyor (PAN sadece banka MPI'ye iletilecek; demo modunda
      bellekte tutulan tek bilgi masked PAN + last4 + brand)
- [x] 3D Secure zorunlu akış (tüm işlemler 3DS üzerinden)
- [x] Visa Secure / Mastercard ID Check / Troy / 3D Secure logoları footer'da

---

## 6. Erişilebilirlik

- [x] Site 8 dilde (TR, EN, DE, FR, IT, ES, RU, AR)
- [x] WhatsApp, telefon, e-posta iletişim her sayfada görünür
- [x] Mobil uyumlu (responsive Tailwind CSS)
- [x] ARIA etiketleri, skip-link, klavye navigasyonu

---

## 7. Test Hesabı (Banka Denetçisi İçin)

| Alan | Değer |
|------|-------|
| URL | https://hatnaturel.com.tr/tr/rezervasyon |
| Tarih | Yarın için 3 gece, 2 misafir |
| Oda | 1+1 Üçgen Bungalov (veya müsait olan) |
| **Demo Kart** | `4111 1111 1111 1111` |
| Son Kullanma | `12/30` |
| CVV | `123` |
| Kart Sahibi | `TEST USER` |
| **3D Secure OTP** | Herhangi 6 haneli sayı (örn. `123456`) |
| Beklenen Sonuç | Rezervasyon onay sayfası + referans no |

---

## 8. Gerçek VakıfBank Entegrasyonu İçin Kontrol Listesi

Bu maddelerin tamamlanması, banka credential teslimi sonrasında 1-2 gün içinde yapılacaktır:

- [ ] `.env`'ye doldur: `VAKIFBANK_MERCHANT_ID`, `TERMINAL_ID`, `STORE_KEY`
- [ ] `PAYMENT_PROVIDER=vakifbank` ayarla
- [ ] `lib/payment/real-vakifbank-provider.ts` yaz
  - `initiate()`: MPI Enrollment isteği, hash hesabı (SHA256)
  - `verify()`: MdStatus kontrolü, VPOS provision
- [ ] Callback URL'ler banka paneline eklet:
  - `POST /api/payment/callback/3ds-success`
  - `POST /api/payment/callback/3ds-fail`
- [ ] Test kartlarıyla VakıfBank test ortamında uçtan uca smoke
- [ ] PCI-DSS SAQ A-EP / hosted page kararı (tercih: hosted → SAQ A)
- [ ] `VAKIFBANK_ENV=prod` ile live geçiş
- [ ] `BANK_CHECKLIST.md` güncelle: "Demo" notları kaldır

---

## 9. URL Referans Listesi

| Sayfa | URL |
|-------|-----|
| Anasayfa | `/tr` |
| Odalar | `/tr/odalar` |
| Rezervasyon | `/tr/rezervasyon` |
| Ödeme Adım 1 | `/tr/rezervasyon/odeme` |
| Ödeme Adım 2 | `/tr/rezervasyon/odeme/kart` |
| 3D Secure | `/tr/rezervasyon/odeme/3d-secure?ref=HN-...` |
| Sonuç | `/tr/rezervasyon/odeme/sonuc?status=success&ref=HN-...` |
| Mesafeli Satış | `/tr/mesafeli-satis-sozlesmesi` |
| İptal & İade | `/tr/iptal-iade` |
| KVKK | `/tr/gizlilik-kvkk` |
| Çerez | `/tr/cerez-politikasi` |
| İletişim | `/tr/iletisim` |

---

*Son güncelleme: 14 Haziran 2026*
