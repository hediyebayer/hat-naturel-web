'use client';

import Image from 'next/image';
import { useMemo } from 'react';

/**
 * Anasayfa Sanal Tur bölümü — Bungalov otel temalı arka plan.
 * - Aerial bungalov fotoğrafı (zoom-in slow Ken Burns efekti)
 * - Lacivert overlay gradient (premium derinlik)
 * - Vignette (kenar koyulaşma)
 * - Subtle altın particle (10 nokta)
 * - Aurora glow blob (altın + lacivert)
 */
export function VirtualTourBackground() {
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
      {/* Layer 1: BUNGALOV AERIAL — Ken Burns slow zoom */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          animation: 'tour-bg-zoom 24s ease-in-out infinite alternate',
        }}
      >
        <Image
          src="/images/hero/aerial-night.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={85}
          priority={false}
          className="object-cover"
          style={{
            objectPosition: 'center 40%',
          }}
        />
      </div>

      {/* Layer 2: Premium karanlık gradient overlay (lacivert → koyu) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(10,19,48,0.92) 0%, rgba(10,19,48,0.78) 30%, rgba(10,19,48,0.55) 60%, rgba(10,19,48,0.85) 100%)',
        }}
      />

      {/* Layer 3: Altın aurora glow blob (üst sol) */}
      <div
        className="absolute -left-32 top-0 h-[36rem] w-[36rem] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'aurora-drift 22s ease-in-out infinite alternate',
        }}
      />

      {/* Layer 4: Lacivert aurora glow (sağ alt) */}
      <div
        className="absolute -right-24 bottom-0 h-[32rem] w-[32rem] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(29,51,112,0.4) 0%, transparent 60%)',
          filter: 'blur(70px)',
          animation: 'aurora-drift 28s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Layer 5: Subtle altın particles (yıldız tozu) */}
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

      {/* Layer 6: Vignette — kenar koyulaşma */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(10,19,48,0.7) 100%)',
        }}
      />

      {/* Layer 7: Üst alt linear fade (section blend) */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary-900 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary-900 to-transparent" />
    </div>
  );
}
