import type { Metadata } from 'next';
import {
  unstable_setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
} from '@/lib/seo/schema';
import { MapPin, Phone, Mail, Video, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { ContactForm } from '@/components/forms/contact-form';
import { MapSection } from '@/components/home/map-section';
import { SITE_CONFIG } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

// Yeni animasyonlu bileşenler
import { ContactHero } from '@/components/iletisim/contact-hero';
import { WhatsappCtaCard } from '@/components/iletisim/whatsapp-cta-card';
import { AnimatedContactCard } from '@/components/iletisim/animated-contact-card';
import { AnimatedFormWrapper } from '@/components/iletisim/animated-form-wrapper';
import { SocialCard } from '@/components/iletisim/social-card';
import { FloatingDecorations } from '@/components/iletisim/floating-decorations';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.contact',
  });

  const languages = Object.fromEntries(
    locales.map((loc) => [loc, `/${loc}/iletisim`]),
  );

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/iletisim`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `/${params.locale}/iletisim`,
      type: 'website',
      images: [
        {
          url: '/images/brand/og-default.jpg',
          width: 1200,
          height: 1000,
          alt: 'Hat Naturel Resort Sapanca — iletişim',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/brand/og-default.jpg'],
    },
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
  const navT = await getTranslations({
    locale: params.locale,
    namespace: 'nav',
  });

  // JSON-LD schemas — LocalBusiness + Organization + Breadcrumb
  const localBusinessSchema = generateLocalBusinessSchema(
    params.locale as Locale,
  );
  const orgSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: navT('home'), url: `${SITE_CONFIG.url}/${params.locale}` },
    {
      name: navT('contact'),
      url: `${SITE_CONFIG.url}/${params.locale}/iletisim`,
    },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            localBusinessSchema,
            orgSchema,
            breadcrumbSchema,
          ]),
        }}
      />

      {/* ─── HERO — animasyonlu lacivert + altın particles + orbit rings ─── */}
      <ContactHero
        title={t('title')}
        heroLeadShort={t('heroLeadShort')}
        heroLead={t('heroLead')}
        quickResponse={t('quickResponse')}
      />

      {/* ─── FORM + İLETİŞİM KARTLARI — floating glow background ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-neutral-50 to-white py-20 md:py-28">
        {/* Floating dekoratif arka plan */}
        <FloatingDecorations />

        {/* Decorative top divider */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent"
        />

        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
            {/* ── SOL: WhatsApp CTA + Form ── */}
            <div className="space-y-8 lg:col-span-3">
              {/* WhatsApp animasyonlu CTA */}
              <WhatsappCtaCard
                href={buildWhatsAppUrl()}
                title={t('whatsappTitle')}
                cta={t('whatsappCta')}
                lead={t('whatsappLead')}
                displayNumber={SITE_CONFIG.whatsapp.displayNumber}
              />

              {/* "Ya da" ayıracı — gold accent */}
              <div className="flex items-center gap-4" role="separator">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-300" />
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-accent/5 text-[10px] font-semibold uppercase tracking-wider text-accent-dark">
                  {t('orDivider')}
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-300" />
              </div>

              {/* Form animasyonlu wrapper */}
              <AnimatedFormWrapper
                reachUsKicker={t('reachUs')}
                reachUsLead={t('reachUsLead')}
              >
                <ContactForm />
              </AnimatedFormWrapper>
            </div>

            {/* ── SAĞ: İletişim kartları + sosyal medya ── */}
            <aside className="space-y-4 lg:col-span-2">
              <AnimatedContactCard
                index={0}
                icon={<MapPin size={20} strokeWidth={2} />}
                title={t('addressLabel')}
                lines={[SITE_CONFIG.contact.address]}
              />
              <AnimatedContactCard
                index={1}
                icon={<Phone size={20} strokeWidth={2} />}
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
              <AnimatedContactCard
                index={2}
                icon={<Mail size={20} strokeWidth={2} />}
                title={t('emailLabel')}
                primary={{
                  label: SITE_CONFIG.contact.email,
                  href: `mailto:${SITE_CONFIG.contact.email}`,
                }}
              />
              <AnimatedContactCard
                index={3}
                icon={<Clock size={20} strokeWidth={2} />}
                title={t('hoursLabel')}
                lines={['7/24 Resepsiyon', 'Check-in 14:30 • Check-out 11:30']}
              />

              {/* Sosyal medya kartı — animasyonlu */}
              <SocialCard
                followUsLabel={t('followUs')}
                handle="@hatnaturelsapanca"
                instagramUrl={SITE_CONFIG.socialMedia.instagram}
                facebookUrl={SITE_CONFIG.socialMedia.facebook}
              />
            </aside>
          </div>
        </Container>
      </section>

      {/* ─── MAP ─── */}
      <MapSection />
    </>
  );
}
