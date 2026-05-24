'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const SLIDES = [
  '/images/virtual-tour-bg/01.jpg',
  '/images/virtual-tour-bg/02.jpg',
  '/images/virtual-tour-bg/03.jpg',
  '/images/virtual-tour-bg/04.jpg',
];

// Her resim ekranda bu kadar saniye kalsın
const SLIDE_DURATION_MS = 7000;
// Cross-fade süresi (uzun fade = daha smooth, takılma hissi yok)
const FADE_DURATION_MS = 2200;

/**
 * Anasayfa Sanal Tur — Bungalov slideshow arka plan
 * - 4 resim sürekli cross-fade
 * - Tüm resimler aynı anda render edilir (lazy değil) → ilk yüklemede biraz gecikme,
 *   sonra geçişler smooth (browser cache + decoded image)
 * - Ken Burns: tüm resimlerde sürekli çalışır (transition-related stutter yok)
 * - GPU compositing: transform + opacity sadece
 */
export function VirtualTourBackground() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(
    () => Array(SLIDES.length).fill(false),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  const handleLoad = (idx: number) => {
    setLoaded((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${(i * 19) % 95 + 2}%`,
        top: `${(i * 31) % 90 + 5}%`,
        size: ((i * 5) % 3) + 1,
        delay: (i * 7) % 6,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-primary-900">
      {/* Layer 1: SLIDESHOW — tüm resimler render edilir, opacity ile cross-fade */}
      {SLIDES.map((src, idx) => {
        const isActive = activeIdx === idx;
        return (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              opacity: isActive && loaded[idx] ? 1 : 0,
              transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
              // GPU compositing — transform & opacity
              transform: 'translateZ(0)',
              willChange: 'opacity',
              // Ken Burns her resim için sürekli çalışsın (transition stutter olmasın)
              animation: 'tour-bg-zoom 22s ease-in-out infinite alternate',
              animationDelay: `${idx * -5.5}s`,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              quality={80}
              priority={idx < 2}
              loading={idx < 2 ? 'eager' : 'lazy'}
              className="object-cover"
              style={{ objectPosition: 'center center' }}
              onLoad={() => handleLoad(idx)}
            />
          </div>
        );
      })}

      {/* Layer 2: Lacivert gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(10,19,48,0.88) 0%, rgba(10,19,48,0.72) 30%, rgba(10,19,48,0.5) 60%, rgba(10,19,48,0.82) 100%)',
        }}
      />

      {/* Layer 3: Altın aurora glow (üst sol) */}
      <div
        className="absolute -left-32 top-0 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'aurora-drift 22s ease-in-out infinite alternate',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Layer 4: Lacivert aurora glow (sağ alt) */}
      <div
        className="absolute -right-24 bottom-0 h-[32rem] w-[32rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(29,51,112,0.4) 0%, transparent 60%)',
          filter: 'blur(70px)',
          animation: 'aurora-drift 28s ease-in-out infinite alternate-reverse',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Layer 5: Altın particle */}
      <div className="absolute inset-0 hidden sm:block">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-accent-light opacity-0"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animation: `twinkle 5s ease-in-out infinite ${p.delay}s, particle-float 12s ease-in-out infinite ${p.delay}s`,
              boxShadow: '0 0 6px rgba(240,216,117,0.7)',
            }}
          />
        ))}
      </div>

      {/* Layer 6: Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(10,19,48,0.7) 100%)',
        }}
      />

      {/* Layer 7: Üst+alt linear fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary-900 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary-900 to-transparent" />

      {/* Slide indicator dots */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <span
            key={idx}
            className="block h-1 rounded-full transition-all duration-700"
            style={{
              width: activeIdx === idx ? '24px' : '8px',
              background:
                activeIdx === idx
                  ? 'rgba(212,175,55,0.9)'
                  : 'rgba(255,255,255,0.3)',
              boxShadow:
                activeIdx === idx ? '0 0 8px rgba(212,175,55,0.6)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
