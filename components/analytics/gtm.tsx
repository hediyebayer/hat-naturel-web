import type { ReactElement } from 'react';

/**
 * Google Tag Manager (GTM) entegrasyonu.
 *
 * Reklamçının verdiği standart GTM kurulum kodunun App Router uyumlu hali.
 * - `GtmHead`: `<head>` içine giren gtm.js bootstrap script'i.
 * - `GtmBody`: `<body>` başına giren `<noscript>` iframe fallback (JS kapalı client'ler için).
 *
 * ID `NEXT_PUBLIC_GTM_ID` env değişkeninden okunur.
 *  - `NEXT_PUBLIC_` prefix'i şart: değer build anında hem server hem client bundle'a inline edilir.
 *  - Tanımlı değilse iki component de `null` döner (hiçbir şey render edilmez).
 *
 * Component'ler pure'dur (state/effect yok) → server component olarak çalışır,
 * ekstra JS client'e gitmez.
 *
 * Container içi tag yönetimi (GA4, Meta Pixel, Conversion API vb.)
 * GTM panel'inden yapılır, bu koda dokunmaya gerek yoktur.
 */

// Google Tag Manager container ID'si. Format: GTM-XXXXXXX (harf/rakam).
// NEXT_PUBLIC_GTM_ID env'inden okunur. Format geçerli değilse (defense-in-depth)
// hiçbir şey render edilmez — dangerouslySetInnerHTML'e güvenli olmayan değer gitmez.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const isGtmId = (id: string | undefined): id is string =>
  typeof id === 'string' && /^GTM-[A-Z0-9]{1,20}$/.test(id);
const SAFE_GTM_ID = isGtmId(GTM_ID) ? GTM_ID : null;

export function GtmHead(): ReactElement | null {
  if (!SAFE_GTM_ID) return null;
  return (
    // eslint-disable-next-line @next/next/next-script-for-ga -- GTM resmi snippet'i verbatim (gtm.start timestamp head'de anında yakalanır)
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${SAFE_GTM_ID}');`,
      }}
    />
  );
}

export function GtmBody(): ReactElement | null {
  if (!SAFE_GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${SAFE_GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
