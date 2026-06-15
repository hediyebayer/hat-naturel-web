const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const isDev = process.env.NODE_ENV !== 'production';

function buildCsp({ payment = false } = {}) {
  const directives = [
    "default-src 'self'",
    payment
      ? "script-src 'self' 'unsafe-inline'"
      : `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "media-src 'self' blob: https:",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
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
