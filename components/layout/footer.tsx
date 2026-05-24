import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { NAVIGATION, SITE_CONFIG } from '@/lib/constants';
import { Container } from '@/components/ui/container';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps): React.ReactElement {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const tContact = useTranslations('contact');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-primary-900 text-primary-100/80">
      <Container size="xl" className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} aria-label="Hat Naturel Sapanca Bungalov">
              <Image
                src="/images/brand/logo-sm.jpg"
                alt="Hat Naturel Sapanca Bungalov"
                width={300}
                height={250}
                className="h-20 w-auto rounded-md"
              />
            </Link>
            <p className="mt-4 text-sm leading-6 text-neutral-400">
              {tFooter('tagline')}
            </p>
          </div>

          {/* Sitemap */}
          <nav aria-label="Site haritası">
            <h3 className="font-serif text-lg text-white">{tFooter('sitemap')}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {NAVIGATION.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}${href === '/' ? '' : href}`}
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg text-white">{tFooter('contact')}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary-400" />
                <span className="text-neutral-400">{SITE_CONFIG.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0 text-primary-400" />
                <a
                  href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                  className="text-neutral-400 hover:text-white"
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0 text-primary-400" />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="text-neutral-400 hover:text-white"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-serif text-lg text-white">
              {tContact('followUs')}
            </h3>
            <div className="mt-4 flex gap-3">
              <a
                href={SITE_CONFIG.socialMedia.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-neutral-800 p-2.5 text-neutral-300 transition-colors hover:bg-primary-600 hover:text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href={SITE_CONFIG.socialMedia.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-neutral-800 p-2.5 text-neutral-300 transition-colors hover:bg-primary-600 hover:text-white"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-700/40 pt-6 text-center text-xs text-primary-200/60">
          {tFooter('copyright', { year })}
        </div>
      </Container>
    </footer>
  );
}
