const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
  },
  images: {
    // Tarayıcı destekliyorsa AVIF, değilse WebP serv edilir.
    // Kaynak JPG/PNG'lere dokunmadan runtime'da modern format üretilir.
    formats: ['image/avif', 'image/webp'],
    // Responsive srcset için yaygın viewport genişlikleri
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560],
    // Küçük UI öğeleri için (ikon, thumb, vs)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.hatnaturel.com.tr' },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
