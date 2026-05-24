import type { Metadata } from 'next';
import {
  unstable_setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { MapPin, Phone, Mail, Video, Instagram, Facebook, Clock, MessageCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ContactForm } from '@/components/forms/contact-form';
import { MapSection } from '@/components/home/map-section';
import { SITE_CONFIG } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'contact',
  });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'contact',
  });

  return (
    <>
      {/* Hero — lacivert */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 pb-24 pt-40 text-white sm:pb-32 sm:pt-48"
        aria-label={t('title')}
      >
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:3px_3px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.12),transparent_60%)]" />
        <Container className="relative z-10 text-center">
          <span className="mx-auto block h-px w-16 bg-accent" aria-hidden />
          <span className="mt-4 inline-block text-xs uppercase tracking-[0.3em] text-accent-light">
            Hat Naturel Sapanca
          </span>
          <Heading
            level={1}
            className="!text-white mt-4 mx-auto max-w-3xl"
          >
            {t('title')}
          </Heading>
          <Text variant="lead" className="mt-5 mx-auto max-w-2xl !text-primary-100">
            {t('heroLead')}
          </Text>
        </Container>
      </section>

      {/* Form + Bilgi kartları */}
      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Sol: WhatsApp CTA + Form (3 kolon) */}
            <div className="lg:col-span-3 space-y-8">
              {/* WhatsApp hızlı iletişim kartı */}
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-6 text-white shadow-soft transition-shadow hover:shadow-medium"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                    <MessageCircle size={24} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/80">
                      {t('whatsappTitle')}
                    </p>
                    <p className="mt-0.5 font-serif text-xl">{t('whatsappCta')}</p>
                    <p className="mt-0.5 text-sm text-white/90">
                      {t('whatsappLead')}
                    </p>
                  </div>
                </div>
                <span
                  aria-hidden
                  className="hidden flex-shrink-0 rounded-full bg-white/15 px-4 py-2 text-sm font-medium transition-colors group-hover:bg-white/25 sm:inline-flex"
                >
                  {SITE_CONFIG.whatsapp.displayNumber}
                </span>
              </a>

              {/* ya da ayıracı */}
              <div className="flex items-center gap-4" role="separator">
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs uppercase tracking-widest text-neutral-500">
                  {t('orDivider')}
                </span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              <div>
                <Heading level={2} className="!text-3xl">
                  {t('reachUs')}
                </Heading>
                <Text muted className="mt-3">
                  {t('reachUsLead')}
                </Text>
                <div className="mt-8 rounded-2xl bg-white p-6 shadow-soft sm:p-8">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Sağ: İletişim kartları (2 kolon) */}
            <aside className="lg:col-span-2 space-y-4">
              <ContactCard
                icon={<MapPin size={20} />}
                title={t('addressLabel')}
                lines={[SITE_CONFIG.contact.address]}
              />
              <ContactCard
                icon={<Phone size={20} />}
                title={t('phoneLabel')}
                primary={{
                  label: SITE_CONFIG.contact.phone,
                  href: `tel:${SITE_CONFIG.contact.phoneRaw}`,
                }}
                badge={{
                  icon: <Video size={12} />,
                  text: t('videoCallShort'),
                }}
              />
              <ContactCard
                icon={<Mail size={20} />}
                title={t('emailLabel')}
                primary={{
                  label: SITE_CONFIG.contact.email,
                  href: `mailto:${SITE_CONFIG.contact.email}`,
                }}
              />
              <ContactCard
                icon={<Clock size={20} />}
                title={t('hoursLabel')}
                lines={['7/24 Resepsiyon', 'Check-in 14:00 • Check-out 12:00']}
              />
              {/* Sosyal medya */}
              <div className="rounded-2xl bg-primary-900 p-6 text-white">
                <p className="text-sm font-medium text-primary-100">
                  {t('followUs')}
                </p>
                <div className="mt-3 flex gap-3">
                  <a
                    href={SITE_CONFIG.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="rounded-full bg-primary-800 p-2.5 text-primary-100 transition-colors hover:bg-accent hover:text-primary-900"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href={SITE_CONFIG.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="rounded-full bg-primary-800 p-2.5 text-primary-100 transition-colors hover:bg-accent hover:text-primary-900"
                  >
                    <Facebook size={18} />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Map */}
      <MapSection />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// İletişim bilgi kartı — küçük yardımcı component
// ─────────────────────────────────────────────────────────────────────────────

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  lines?: string[];
  primary?: { label: string; href: string };
  badge?: { icon: React.ReactNode; text: string };
}

function ContactCard({
  icon,
  title,
  lines,
  primary,
  badge,
}: ContactCardProps): React.ReactElement {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-soft transition-shadow hover:shadow-medium">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-dark">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-base text-neutral-900">{title}</h3>
          {primary && (
            <a
              href={primary.href}
              className="mt-1 block break-words text-neutral-700 hover:text-primary-700"
            >
              {primary.label}
            </a>
          )}
          {lines?.map((line, i) => (
            <p key={i} className="mt-1 text-sm text-neutral-600">
              {line}
            </p>
          ))}
          {badge && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
              {badge.icon}
              {badge.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
