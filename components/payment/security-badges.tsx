import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const BADGES = [
  { src: '/payment/visa-secure.svg', alt: 'Visa Secure' },
  { src: '/payment/mastercard-id-check.svg', alt: 'Mastercard ID Check' },
  { src: '/payment/troy.svg', alt: 'Troy' },
  { src: '/payment/3d-secure.svg', alt: '3D Secure' },
  { src: '/payment/ssl-badge.svg', alt: 'SSL Secured' },
] as const;

interface SecurityBadgesProps {
  locale: string;
}

export async function SecurityBadges({ locale }: SecurityBadgesProps): Promise<React.ReactElement> {
  const t = await getTranslations({ locale, namespace: 'footer' });

  return (
    <div className="rounded-xl bg-neutral-100 px-4 py-3 text-center">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
        {t('securePayment')}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {BADGES.map(({ src, alt }) => (
          <div
            key={src}
            className="flex h-8 w-auto items-center justify-center overflow-hidden rounded border border-neutral-200 bg-white px-2"
          >
            <Image
              src={src}
              alt={alt}
              width={60}
              height={28}
              className="h-6 w-auto object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
