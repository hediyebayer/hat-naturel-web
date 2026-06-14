# Hat Naturel Resort — Web Sitesi

Sapanca'daki **Hat Naturel Resort** bungalov tesisi için modern, iki dilli (TR/EN) tanıtım ve rezervasyon web sitesi.

## Stack

- **Next.js 14** (App Router, RSC)
- **TypeScript** (strict)
- **Tailwind CSS** + custom design tokens (doğa tonları)
- **next-intl** — i18n (TR/EN)
- **react-hook-form + zod** — form & validation
- **lucide-react** — ikonlar
- **next-mdx-remote** — blog içeriği
- **Vercel** — hosting (preview + production)

## Geliştirme

```bash
npm install
cp .env.local.example .env.local
npm run dev    # http://localhost:3001
```

> NOT: Aynı makinede `hatoperasyon` (port 3000) çalıştığı için bu proje **3001**'de açılır.

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (3001) |
| `npm run build` | Production build |
| `npm run start` | Production sunucu |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript kontrolü |
| `npm run format` | Prettier formatla |
| `npm run test` | Vitest |

## Klasör Yapısı

```
app/
  [locale]/        # /tr/*, /en/* — lokalize sayfalar
  api/             # contact, reservations API route'ları
components/
  layout/          # Header, Footer, MobileMenu, LanguageSwitcher
  ui/              # Button, Card, Container, Heading, Text
  home/ rooms/ gallery/ blog/ reservation/ forms/
lib/
  content/         # ContentAdapter (statik / ileride API)
  i18n/            # next-intl config
  reservations/    # hatoperasyon API client
  contact/         # email gönderim stub
  utils/           # cn(), format helpers
messages/
  tr.json en.json  # çeviriler
styles/
  fonts.ts         # Playfair + Inter (next/font)
```

## İçerik Yönetimi

İçerikler `lib/content/` üzerinden **content adapter pattern** ile sağlanır:

- **Şimdi**: `StaticContentAdapter` — `lib/content/data/*.ts`
- **İleride**: `ApiContentAdapter` — hatoperasyon admin panelinden gelen CMS

Yeni içerik eklerken **adapter interface**'ini bozmadan ekleyin.

## Rezervasyon

Site, rezervasyon talebini `/api/reservations` endpoint'ine gönderir. Bu endpoint:

1. Zod ile validate eder
2. `lib/reservations/client.ts` üzerinden `HATOPERASYON_API_URL`'e POST eder
3. Env yoksa **mock** response döner (geliştirme için)

`hatoperasyon` projesi (Prisma + Postgres) ayrı bir repodadır; bu site **sadece tüketici** konumundadır.

## Tasarım Sistemi

- **Renkler**: `primary` (yeşil), `secondary` (kahve), `neutral` (taş), `accent` (altın)
- **Tipografi**: `font-serif` Playfair Display (başlık), `font-sans` Inter (gövde)
- **Spacing**: Tailwind default + `18, 88, 128` custom
- **Radius**: `xl: 1rem`, `2xl: 1.5rem` (premium, yumuşak)
- **Shadow**: `soft, medium, strong` custom

## Roadmap

- [x] **M1** — Skeleton + i18n + design system + layout
- [ ] **M2** — Anasayfa (hero, about, rooms, gallery, map) + odalar (liste/detay)
- [ ] **M3** — Galeri + blog + restoran + iletişim
- [ ] **M4** — Rezervasyon formu + (mock) backend bağlantısı
- [ ] **M5** — SEO + performans + a11y + Vercel deploy

## Ödeme Akışı (Mock VPOS)

### Lokal Test Adımları

1. `.env.local`'a ekleyin: `PAYMENT_PROVIDER=mock`
2. Rezervasyon sayfasına gidin: `/tr/rezervasyon`
3. Tarih ve kişi sayısı seçin → bir oda kartında **"Rezervasyon Yap"** tıklayın
4. Misafir bilgilerini doldurun, KVKK + Mesafeli onaylarını işaretle
5. Kart formunda demo kart bilgilerini girin:
   - **Kart No:** `4111 1111 1111 1111` (Visa, Luhn-geçerli)
   - **Son Kullanma:** `12/30`
   - **CVV:** `123`
   - **Kart Sahibi:** `TEST USER`
6. 3D Secure ekranında herhangi **6 haneli rakam** girin (örn. `123456`) → başarılı
7. Sonuç sayfasında referans numarası ve onay görünür

### Mock Kuralı
- OTP `^٠١-٩{6}$` (6 haneli rakam) → success
- OTP herhangi başka şey → failed
- Luhn-geçersiz kart no → form gönderimi engellenir

### API Endpoint’leri
| Endpoint | Métod | Açıklama |
|---|---|---|
| `/api/payment/initiate` | POST | Ödeme başlat, reservationId üret |
| `/api/payment/verify` | POST | 3DS OTP doğrula |
| `/api/payment/status?ref=HN-...` | GET | Rezervasyon durumu |

### Banka Denetimi Yol Haritası
1. Mock aklış banka denetçisine gösterilir (demo kart + OTP)
2. VakıfBank credential teslimi sonrası `lib/payment/real-vakifbank-provider.ts` yazılır
3. `PAYMENT_PROVIDER=vakifbank` env set edilir
4. Callback URL&apos;ler banka panelinden whitelist eklenir
5. Test kartlarıyla sank test ortamında doğrulama yapılır
6. Banka `live` onayı sonrası `VAKIFBANK_ENV=prod` geçişi

Detaylı checklist: `docs/BANK_CHECKLIST.md`

## Lisans

Özel mülkiyet. Tüm hakları Hat Naturel Resort'a aittir.
