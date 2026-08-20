const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const isDev = process.env.NODE_ENV !== 'production';

// Google ölçüm sistemleri için izin verilen kaynaklar.
// GTM (googletagmanager.com) + GA4 (google-analytics.com) ikilisi:
//  - script-src-elem: GTM bootstrap script (gtm.js) + GA4 gtag.js yüklemesi
//  - img-src: GA4 pixel tracking / Measurement Protocol pixel'leri
//  - connect-src: GA4 collect endpoint'leri (event gönderimi)
//  - frame-src: GTM <noscript> iframe fallback'i (ns.html)
//
// Kubilay (reklamcı) talebi: WhatsApp dönüşüm takibi için GTM + GA4 çalışmalı.
// CSP bunları blokladığı için conversion event'leri tetiklenmiyordu.
const GOOGLE_ANALYTICS_SOURCES = {
  script: 'https://www.googletagmanager.com',
  img: 'https://www.google-analytics.com https://www.googletagmanager.com',
  connect:
    'https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com',
  frame: 'https://www.googletagmanager.com',
};

function buildCsp({ payment = false } = {}) {
  const directives = [
    "default-src 'self'",
    // Ödeme sayfasında 'unsafe-eval' kapalı kalır (VPOS güvenliği),
    // ama GTM script'i her sayfada yüklü olduğu için izin verilmeli.
    `script-src 'self' 'unsafe-inline'${payment ? '' : isDev ? " 'unsafe-eval'" : ''} ${GOOGLE_ANALYTICS_SOURCES.script}`,
    // script-src-elem ayrıca belirtiliyor: tarayıcılar script yüklemelerinde
    // script-src yerine script-src-elem'i tercih eder. GTM script'i burada izinli olmazsa bloklanır.
    `script-src-elem 'self' 'unsafe-inline' ${GOOGLE_ANALYTICS_SOURCES.script}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https: ${GOOGLE_ANALYTICS_SOURCES.img}`,
    "font-src 'self' data: https:",
    `connect-src 'self' https: ${GOOGLE_ANALYTICS_SOURCES.connect}`,
    "media-src 'self' blob: https:",
    `frame-src 'self' https://www.google.com https://www.google.com/maps https://maps.google.com ${GOOGLE_ANALYTICS_SOURCES.frame}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    // form-action: 3D Secure akışında ACS formu bankanın domainine POST eder.
    // VakıfBank ACS/gateway domainleri eklenmezse CSP form submit'i engeller
    // → kullanıcı '3D Secure hazırlanıyor' ekranında takılı kalır.
    "form-action 'self' https://*.vakifbank.com.tr https://3dsecure.vakifbank.com.tr https://inbound.apigateway.vakifbank.com.tr https://inbound.apigatewaytest.vakifbank.com.tr",
  ];

  return directives.join('; ');
}

const commonSecurityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()'
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // nodemailer route handler'lar içinde native socket kullanır — bundle etme,
  // Node'un kendi modülünü kullan (build hatalarını önler).
  // (Next 15: eski adı experimental.serverComponentsExternalPackages idi;
  //  otomatik taşınıyordu ama deprecation uyarısı basıyordu — stable key'e geçildi.)
  serverExternalPackages: ['nodemailer'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.hatnaturel.com.tr' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...commonSecurityHeaders,
          {
            key: 'Content-Security-Policy',
            value: buildCsp(),
          },
        ],
      },
      {
        source: '/:locale/rezervasyon/odeme/:path*',
        headers: [
          ...commonSecurityHeaders,
          {
            key: 'Content-Security-Policy',
            value: buildCsp({ payment: true }),
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
