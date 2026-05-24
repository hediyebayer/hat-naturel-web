import { useTranslations } from 'next-intl';
import { MapPin, Phone, Navigation, Video } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ButtonLink } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Anasayfa "Konum" bölümü.
 * Google Maps embed + adres + telefon + yol tarifi butonu.
 */
export function MapSection(): React.ReactElement {
  const t = useTranslations('home');
  return (
    <section className="py-20" aria-labelledby="location-heading">
      <Container>
        <div className="text-center mb-12">
          <Heading id="location-heading" level={2}>
            {t('locationTitle')}
          </Heading>
          <Text variant="lead" muted className="mt-3">
            {t('locationSubtitle')}
          </Text>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Map */}
          <div className="lg:col-span-3 overflow-hidden rounded-2xl shadow-medium">
            <iframe
              src={SITE_CONFIG.contact.mapEmbedUrl}
              title="Hat Naturel Resort konumu — Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-[420px] w-full border-0"
            />
          </div>

          {/* Info card */}
          <aside className="lg:col-span-2 flex flex-col justify-between rounded-2xl bg-neutral-50 p-8 shadow-soft">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-dark">
                  <MapPin size={18} />
                </span>
                <div>
                  <h3 className="font-serif text-lg text-neutral-900">Adres</h3>
                  <Text className="mt-1" muted>
                    {SITE_CONFIG.contact.address}
                  </Text>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-dark">
                  <Phone size={18} />
                </span>
                <div>
                  <h3 className="font-serif text-lg text-neutral-900">Telefon</h3>
                  <a
                    href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                    className="mt-1 inline-block text-neutral-700 hover:text-primary-700"
                  >
                    {SITE_CONFIG.contact.phone}
                  </a>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                    <Video size={12} />
                    Görüntülü arama yapılabilir
                  </span>
                </div>
              </div>
            </div>

            <ButtonLink
              href={SITE_CONFIG.contact.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              className="mt-8"
            >
              <Navigation size={16} />
              Yol Tarifi Al
            </ButtonLink>
          </aside>
        </div>
      </Container>
    </section>
  );
}
