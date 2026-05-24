import type { Metadata } from 'next';
import {
  unstable_setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import {
  MapPin,
  Phone,
  Mail,
  Video,
  Instagram,
  Facebook,
  Clock,
  MessageCircle,
  ArrowRight,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
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
      {/* ─── HERO ─── */}
      <section
        className="relative isolate overflow-hidden bg-primary-900 pb-24 pt-32 text-white sm:pb-32 sm:pt-36"
        aria-label={t('title')}
      >
        {/* Katman 1: lacivert gradient base */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, #07091a 0%, #0a1330 50%, #1a2a5e 100%)',
          }}
        />
        {/* Katman 2: dot pattern */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:32px_32px]"
        />
        {/* Katman 3: gold radial glow */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.15),transparent_60%)]"
        />
        {/* Katman 4: vinyet */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,9,26,0.6)_100%)]"
        />

        <Container className="relative z-10 text-center">
          {/* Gold pulse badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Hat Naturel · Sapanca
          </span>

          {/* Başlık — 2 satır rooms-hero stili */}
          <h1 className="mt-10 font-serif text-4xl leading-[1.2] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:text-6xl lg:text-[5.5rem]">
            <span className="block pb-2 font-light">{t('title')}</span>
            <span className="mt-2 block pb-2 font-medium italic text-white/95">
              {t('heroLeadShort')}
            </span>
          </h1>

          <p className="mx-auto mt-10 max-w-2xl font-sans text-base text-white/85 leading-relaxed md:text-lg">
            {t('heroLead')}
          </p>

          {/* Hızlı yanıt rozeti */}
          <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm text-white/90 backdrop-blur-md ring-1 ring-white/15">
            <Zap size={14} className="text-accent" />
            <span>{t('quickResponse')}</span>
          </div>
        </Container>
      </section>

      {/* ─── FORM + İLETİŞİM KARTLARI ─── */}
      <section className="relative bg-gradient-to-b from-white via-neutral-50 to-white py-20 md:py-28">
        {/* Decorative top divider */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent"
        />

        <Container>
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
            {/* ── SOL: WhatsApp CTA + Form ── */}
            <div className="lg:col-span-3 space-y-8">
              {/* WhatsApp premium kart */}
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-6 text-white shadow-[0_10px_40px_-10px_rgba(37,211,102,0.5)] transition-all duration-300 hover:shadow-[0_15px_50px_-10px_rgba(37,211,102,0.7)] hover:-translate-y-0.5"
              >
                {/* Animated background shine */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 transition-transform duration-1000 ease-out group-hover:translate-x-full"
                />
                {/* Pulse ring */}
                <span
                  aria-hidden
                  className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                />

                <div className="relative flex items-center gap-4">
                  <span className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
                    <MessageCircle size={26} strokeWidth={1.8} />
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
                    </span>
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                      {t('whatsappTitle')}
                    </p>
                    <p className="mt-1 font-serif text-2xl font-light">
                      {t('whatsappCta')}
                    </p>
                    <p className="mt-1 text-sm text-white/90">
                      {t('whatsappLead')}
                    </p>
                  </div>
                </div>

                <span
                  aria-hidden
                  className="relative hidden flex-shrink-0 items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-medium ring-1 ring-white/20 transition-colors group-hover:bg-white/25 sm:inline-flex"
                >
                  {SITE_CONFIG.whatsapp.displayNumber}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>

              {/* Ya da ayıracı — gold accent */}
              <div className="flex items-center gap-4" role="separator">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-300" />
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-accent/5 text-[10px] font-semibold uppercase tracking-wider text-accent-dark">
                  {t('orDivider')}
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-300" />
              </div>

              {/* Form kartı */}
              <div>
                <div className="flex items-center gap-3">
                  <Send size={18} className="text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-700">
                    {t('reachUs')}
                  </span>
                </div>
                <Heading level={2} className="mt-3 !text-3xl">
                  {t('reachUsLead')}
                </Heading>

                {/* Form wrapper — gradient border + corner sparkles */}
                <div className="relative mt-8">
                  {/* Gradient border layer */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/30 via-primary-200/40 to-accent/30 p-[1px]">
                    <div className="h-full w-full rounded-3xl bg-white" />
                  </div>

                  {/* Decorative corner accents */}
                  <Sparkles
                    size={16}
                    className="absolute -left-2 -top-2 text-accent drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                    aria-hidden
                  />
                  <Sparkles
                    size={12}
                    className="absolute -bottom-1 -right-1 text-accent/60"
                    aria-hidden
                  />

                  {/* Form content */}
                  <div className="relative rounded-3xl bg-white p-6 shadow-[0_20px_60px_-20px_rgba(10,19,48,0.15)] sm:p-10">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>

            {/* ── SAĞ: İletişim kartları ── */}
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
                lines={['7/24 Resepsiyon', 'Check-in 14:30 • Check-out 11:30']}
              />

              {/* Sosyal medya premium kartı */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-6 text-white shadow-[0_10px_40px_-15px_rgba(10,19,48,0.5)]">
                {/* Decorative gold corner glow */}
                <span
                  aria-hidden
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl"
                />

                <div className="relative">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-light">
                    {t('followUs')}
                  </p>
                  <p className="mt-2 font-serif text-lg text-white/95">
                    @hatnaturelsapanca
                  </p>

                  <div className="mt-4 flex gap-3">
                    <SocialButton
                      href={SITE_CONFIG.socialMedia.instagram}
                      label="Instagram"
                      icon={<Instagram size={18} />}
                    />
                    <SocialButton
                      href={SITE_CONFIG.socialMedia.facebook}
                      label="Facebook"
                      icon={<Facebook size={18} />}
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ─── MAP ─── */}
      <MapSection />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContactCard — LED corner glow + lacivert ikon arkaplanı + hover lift
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
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_15px_40px_-15px_rgba(10,19,48,0.2)]">
      {/* LED corner glow — hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-accent/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-4">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-900 to-primary-700 text-accent shadow-sm ring-1 ring-primary-800/30 transition-transform duration-300 group-hover:scale-105">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-base font-semibold text-neutral-900">
            {title}
          </h3>
          {primary && (
            <a
              href={primary.href}
              className="mt-1 block break-words text-neutral-700 transition-colors hover:text-primary-700"
            >
              {primary.label}
            </a>
          )}
          {lines?.map((line, i) => (
            <p key={i} className="mt-1 text-sm leading-relaxed text-neutral-600">
              {line}
            </p>
          ))}
          {badge && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-dark ring-1 ring-accent/20">
              {badge.icon}
              {badge.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SocialButton — premium sosyal medya butonu
// ─────────────────────────────────────────────────────────────────────────────

function SocialButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}): React.ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-primary-900 hover:ring-accent"
    >
      <span className="transition-transform duration-300 group-hover:rotate-12">
        {icon}
      </span>
    </a>
  );
}
