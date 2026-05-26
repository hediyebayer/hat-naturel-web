'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface HeroPhotoCarouselProps {
  /** Tüm galeri fotoğraflarının yolları */
  images: string[];
}

const ROTATE_INTERVAL_MS = 5000; // Her 5 saniyede 1 gruba geç
const FADE_DURATION_MS = 1500; // Cross-fade süresi
const GROUP_SIZE = 3; // 3 yan yana göster

/**
 * Galeri hero — 3 yan yana fotoğraf, sürekli cross-fade ile dönen carousel.
 * - Tüm gallery image'lardan 3'lü gruplar oluşturur (shuffle)
 * - 5 saniyede 1 yeni gruba geçer (cross-fade)
 * - Her resimde altın L marker köşeler korunur
 * - Ortadaki kart asimetrik (-mt + büyük aspect)
 */
export function HeroPhotoCarousel({ images }: HeroPhotoCarouselProps): React.ReactElement {
  // Resimleri 3'lü gruplara böl (ilk grup deterministic, kalanlar shuffle değil sıralı)
  const groups: string[][] = [];
  for (let i = 0; i < images.length; i += GROUP_SIZE) {
    const group = images.slice(i, i + GROUP_SIZE);
    if (group.length === GROUP_SIZE) groups.push(group);
  }

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (groups.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % groups.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [groups.length]);

  // İlk grup yoksa (galeri boş), null
  if (groups.length === 0) return <></>;

  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Sabit yükseklik — grupların hepsi aynı slot'ta cross-fade */}
      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {/* İskelet — boyutu belirler (yer tutucu, görünmez) */}
        <div className="aspect-[3/4] md:aspect-[3/4]" aria-hidden />
        <div className="aspect-[4/5] md:-mt-6 md:mb-6" aria-hidden />
        <div className="aspect-[3/4] md:aspect-[3/4]" aria-hidden />

        {/* Tüm gruplar — opacity ile cross-fade */}
        {groups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="absolute inset-0 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
            style={{
              opacity: activeIdx === gIdx ? 1 : 0,
              transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
              willChange: 'opacity',
              transform: 'translateZ(0)',
            }}
            aria-hidden={activeIdx !== gIdx}
          >
            {group.map((src, i) => (
              <div
                key={`${gIdx}-${i}`}
                className={`group relative overflow-hidden rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] ${
                  i === 1
                    ? 'aspect-[4/5] md:-mt-6 md:mb-6'
                    : 'aspect-[3/4]'
                }`}
              >
                {/* Altın ring (çerçeve) */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-20 rounded-2xl ring-1 ring-accent/30"
                />

                {/* Resim */}
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority={gIdx === 0}
                />

                {/* Alt gradient overlay */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-primary-900/60 to-transparent opacity-70"
                />

                {/* Köşe altın L marker'lar */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-3 z-20 h-4 w-4 border-l-2 border-t-2 border-accent/80"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-3 z-20 h-4 w-4 border-r-2 border-t-2 border-accent/80"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 left-3 z-20 h-4 w-4 border-b-2 border-l-2 border-accent/80"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 right-3 z-20 h-4 w-4 border-b-2 border-r-2 border-accent/80"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Indicator dots — hangi grupta olduğumuzu göster (alt orta) */}
      {groups.length > 1 && (
        <div className="absolute -bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {groups.map((_, idx) => (
            <span
              key={idx}
              className="block h-1 rounded-full transition-all duration-500"
              style={{
                width: activeIdx === idx ? '20px' : '6px',
                background:
                  activeIdx === idx
                    ? 'rgba(212,175,55,0.9)'
                    : 'rgba(255,255,255,0.3)',
                boxShadow:
                  activeIdx === idx
                    ? '0 0 8px rgba(212,175,55,0.6)'
                    : 'none',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
