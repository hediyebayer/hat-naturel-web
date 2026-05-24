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

## Lisans

Özel mülkiyet. Tüm hakları Hat Naturel Resort'a aittir.
