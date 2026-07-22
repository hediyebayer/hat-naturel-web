# Review — feat/baglan-qr-landing (PR #11, commit a6c475b)

> Tarih: 2026-07-21 · Reviewer: reviewer (GLM-5.1 high)
> Scope: `app/[locale]/baglan/page.tsx`, `components/baglan/connect-landing.tsx`, `messages/{tr,en,de,ru,ar,fr,es,it}.json` (baglan namespace)
> Talimat gereği **sadece okuma + analiz**; kod değiştirilmedi, fix'ler raporlandı.

---

## Plan Adherence

- ✅ Hedef met: QR landing sayfası ekle (server component + client framer-motion component + 8 dil).
- ✅ 3 buton (Web Sitesi / Instagram / WhatsApp) mevcut, sıralama doğru.
- ✅ `buildWhatsAppUrl()` ve `SITE_CONFIG` (url, socialMedia.instagram, contact.addressShort) doğru kullanılıyor — **hardcoded URL yok**.
- ✅ Marka dili `components/iletisim/social-card.tsx` ile uyumlu: lacivert gradient (`from-primary-900 via-primary-800 to-primary-900`), altın accent, glassmorphism (`bg-white/5 backdrop-blur-sm`), shine sweep, nefes alan corner glows. Tasarım tutarlılığı **sağlandı**.
- ✅ Mobile-first `min-h-dvh`, `px-4`, `max-w-sm`.

---

## Findings & Actions

### 🔴 Critical
Yok. Güvenlik (auth/injection) açığı, logic bug, data-integrity sorunu tespit edilmedi.

### 🟠 High
Yok (ship'i blokeleyecek seviyede bulgu yok).

### 🟡 Medium

1. **Metadata lokalize değil (hardcoded TR title)** — `app/[locale]/baglan/page.tsx:10`
   `export const metadata` statik ve `title: 'Bağlan | Hat Naturel Sapanca'` Türkçe sabit. 8 dilli bir sitede `/en/baglan`, `/ar/baglan`, `/de/baglan` ziyaretçisi QR tarayınca browser sekme başlığı Türkçe "Bağlan" görüyor. Diğer tüm sayfalar (`iletisim`, `rezervasyon`, `cerez-politikasi`, `home`) `generateMetadata` + `getTranslations` kullanıyor; bu sayfa projedeki **tek statik metadata örneği** → tutarlılık bozukluğu.
   - **Önerilen fix**: `generateMetadata({ params })` async fonksiyona çevir, `meta.baglan` namespace ekle (title/description), veya en azından `baglan` namespace'ine bir `pageTitle` key'i koyup onu kullan. Örnek:
     ```ts
     export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
       const { locale } = await params;
       const t = await getTranslations({ locale, namespace: 'baglan' });
       return { title: { absolute: `${t('kicker')} | Hat Naturel Sapanca` }, robots: { index: false, follow: false } };
     }
     ```

2. **Title template double-brand** — `app/[locale]/baglan/page.tsx:10`
   Layout `[locale]/layout.tsx` template'i `%s | Hat Naturel Resort` (`meta.brand`). Mevcut string title `'Bağlan | Hat Naturel Sapanca'` → render → **"Bağlan | Hat Naturel Sapanca | Hat Naturel Resort"** (marka iki kere). (Not: bu anti-pattern `cerez-politikasi`'da da var, proje geneli; ama yeni kodda tekrarlanmasın.)
   - **Önerilen fix**: `title: { absolute: 'Bağlan | Hat Naturel Sapanca' }` (template'i bypass) veya sadece `title: 'Bağlan'` (template brand'i eklesin).

3. **Düşük kontrastlı footer metni (a11y / WCAG AA)** — `components/baglan/connect-landing.tsx:150-152`
   `text-white/30` (footer "Hat Naturel Sapanca") ve `text-white/20` (`SITE_CONFIG.contact.addressShort` = "Sapanca, Sakarya"). `primary-900` (#0a1330) üzerinde:
   - white@20% → ~1.6:1 kontrast
   - white@30% → ~2.1:1 kontrast
   WCAG AA normal text için **4.5:1** ister. Adres bilgilendirici metin, dekoratif değil. (Karşılaştırma: referans `social-card.tsx` `text-white/95` ve `text-accent-light` kullanıyor — çok daha okunaklı.)
   - **Önerilen fix**: `text-white/60` (~5.4:1 ✅) veya en az `text-white/50`.

### 🔵 Low

4. **RTL (Arapça) — fiziksel `ml-auto`** — `connect-landing.tsx:68`
   `<html dir="rtl">` (layout'ta `ar` için set ediliyor) altında ok "→" span'i `ml-auto` fiziksel sola itiyor; RTL'de satır aynalanmıyor, ok sağda kalıyor. `group-hover:translate-x-1` de fiziksel. (Not: `amenity-list.tsx` de aynı pattern'i kullanıyor → proje geneli konvansiyon, ama i18n landing özellikle Arapça hedefliyor.)
   - **Önerilen fix**: `ml-auto` → `ms-auto` (logical), `translate-x-1` → RTL-aware veya küçük tut.

5. **Dekoratif "→" oku `aria-hidden` değil** — `connect-landing.tsx:67-69`
   Screen reader "rightwards arrow" diye okuyabilir. Dekoratif karakter.
   - **Önerilen fix**: arrow span'ine `aria-hidden` ekle.

6. **External link "yeni sekmede açılır" bildirimi yok** — `connect-landing.tsx` LinkButton
   `target="_blank"` + `rel="noopener noreferrer"` ✅ güvenlik tarafı doğru. Ama screen reader kullanıcısına yeni sekme açılacağı söylenmiyor. (Görünür text label olduğu için `aria-label` ZORUNLU değil — bu iyi; sadece yeni-sekme ipucu eklenebilir.)
   - **Önerilen fix**: label sonuna visually-hidden " (yeni sekmede açılır)" ekle.

7. **`prefers-reduced-motion` handling yok** — `connect-landing.tsx`
   2 corner glow sonsuz `repeat: Infinity` animasyon + shine sweep. `useReducedMotion` hook ile bastırılabilir. (social-card.tsx'te de yok → proje geneli.)

8. **8 messages dosyasında trailing newline yok** — tüm `messages/*.json`
   Diff `"\ No newline at end of file"` gösteriyor. POSIX/git convention bozukluğu, fonksiyonel etki yok.
   - **Önerilen fix**: dosya sonuna boş satır (`prettier --write messages/*.json` tek seferde toplar).

9. **`robots.ts` `/baglan` disallow değil** — `app/robots.ts`
   Sayfa `robots:{index:false,follow:false}` meta ile korumalı ✅, sitemap'te de yok ✅. Belt-and-suspenders olarak `disallow: ['/baglan']` eklenebilir ama **zorunlu değil**.

### ✅ Doğrulanan (issue yok)
- **TypeScript**: `npm run typecheck` (tsc --noEmit) → **PASS**, sıfır hata. `React.ReactNode` global olarak erişilebilir (social-card.tsx ile aynı pattern, tsconfig `jsx: preserve` + `@types/react`).
- **ESLint**: `npm run lint` → **No warnings or errors**.
- **Güvenlik**: 3 external link'in hepsinde `target="_blank" rel="noopener noreferrer"` → tab-nabbing koruması ✅.
- **Hardcoded URL**: yok. `SITE_CONFIG.url`, `SITE_CONFIG.socialMedia.instagram`, `SITE_CONFIG.contact.addressShort`, `buildWhatsAppUrl()` — hepsi helper'dan.
- **i18n key bütünlüğü**: 8 dilin hepsinde **aynı 7 key** (`kicker, title, subtitle, web, instagram, whatsapp, footer`) — `node -e` ile doğrulandı, JSON parse ✅.
- **Touch target**: buton `py-5` (40px) + `h-12` ikon (48px) → ~88px yükseklik, 44px barajının çok üstünde ✅. 375px'te `w-full max-w-sm` → dokunulabilir.
- **Renkler**: `accent`, `accent-light`, `accent-dark`, `primary-500/800/900` — tailwind.config.ts'te tanımlı, geçerli class'lar.
- **robots noindex**: doğru (`index:false, follow:false`), sitemap'te listelenmiyor.
- **framer-motion stagger**: container `staggerChildren:0.1` plain `<div>` üzerinden motion.a çocuklara context yoluyla yayılıyor — animasyon çalışır.
- **`Infinity` keyword**: framer-motion `repeat` için doğru kullanım.
- **`setRequestLocale(locale)`**: next-intl static rendering için doğru çağrılmış.

---

## Files I Modified
- Yok (talimat: salt okuma + analiz, fix'leri raporla).

## Tests Run
- `npm run typecheck` → ✅ PASS (sıfır hata)
- `npm run lint` → ✅ PASS (No ESLint warnings or errors)
- `node -e` JSON parse × 8 dil → ✅ tüm baglan namespace'leri geçerli, key setleri özdeş
- Uzun çalışan test (vitest) koşturulmadı (bu PR test kapsamı dışında, sadece yeni sayfa).

## Verdict
- ⚠️ **READY WITH NOTES** — Ship'e engel CRITICAL/HIGH yok; typecheck + lint temiz, güvenlik (noopener) ve i18n key bütünlüğü sağlam.
  Follow-up olarak Medium #1 (lokalize metadata) + #3 (kontrast) PR'ında düzeltilebilir; ikisi de ~10 satırlık değişiklik. Low maddeler backlog'a atılabilir.
