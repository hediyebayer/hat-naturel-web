'use client';

import React, { useMemo } from 'react';

/**
 * Sanal tur 3D arka plan teması.
 * - Perspective grid (3D zemin hissi)
 * - Floating orbit lines (3 ring, ters dönen)
 * - Aurora gradient mesh (lacivert + altın)
 * - Floating particles
 *
 * Tümü subtle (opacity 0.05-0.2), iframe'den dikkat çalmaz.
 */
export function VirtualTourBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${(i * 13) % 100}%`,
      top: `${(i * 17) % 100}%`,
      size: ((i * 7) % 3) + 1,
      delay: (i * 11) % 5,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-primary-900">
      {/* Layer 1: Aurora gradient mesh (subtle altın + lacivert) */}
      <div
        className="absolute inset-0 opacity-20 will-change-transform"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.4) 0%, transparent 60%)',
          animation: 'aurora-drift 25s ease-in-out infinite alternate',
          filter: 'blur(60px)',
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-25%',
        }}
      />
      <div
        className="absolute inset-0 opacity-15 will-change-transform"
        style={{
          background:
            'radial-gradient(circle at 30% 70%, rgba(22,38,89,0.8) 0%, transparent 50%)',
          animation: 'aurora-drift 30s ease-in-out infinite alternate-reverse',
          filter: 'blur(50px)',
          width: '120%',
          height: '120%',
          top: '-10%',
          left: '-10%',
        }}
      />

      {/* Layer 2: 3D Perspective Grid (zemin) */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          perspective: '600px',
          perspectiveOrigin: 'center 30%',
        }}
      >
        <div
          className="absolute bottom-0 left-1/2 h-[120%] w-[200%] -translate-x-1/2"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: 'rotateX(60deg) translateY(20%)',
            transformOrigin: 'center top',
            maskImage:
              'linear-gradient(to top, black 0%, transparent 80%)',
            WebkitMaskImage:
              'linear-gradient(to top, black 0%, transparent 80%)',
            animation: 'grid-scroll 20s linear infinite',
          }}
        />
      </div>

      {/* Layer 3: 3D Floating Orbit Rings (uzayda dönen halkalar) */}
      <div
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-[0.18]"
        style={{ perspective: '800px' }}
      >
        {/* Ring 1 - yatay (X ekseni rotation) */}
        <div
          className="absolute inset-0 rounded-full border border-accent/40"
          style={{
            transform: 'rotateX(70deg)',
            animation: 'spin-y 40s linear infinite',
            boxShadow: '0 0 30px rgba(212,175,55,0.2)',
          }}
        />
        {/* Ring 2 - 45 derece yatık */}
        <div
          className="absolute inset-4 rounded-full border border-accent/30"
          style={{
            transform: 'rotateX(70deg) rotateZ(45deg)',
            animation: 'spin-y 55s linear infinite reverse',
          }}
        />
        {/* Ring 3 - 90 derece (dik) */}
        <div
          className="absolute inset-8 rounded-full border border-accent/25"
          style={{
            transform: 'rotateX(70deg) rotateZ(90deg)',
            animation: 'spin-y 70s linear infinite',
          }}
        />
        {/* Center pulse dot (Sapanca lokasyon) */}
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{
            animation: 'globe-pin-pulse 2.5s ease-in-out infinite',
            boxShadow: '0 0 20px rgba(212,175,55,0.8)',
          }}
        />
      </div>

      {/* Layer 4: Floating particles (altın toz) — desktop only */}
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
              animation: `twinkle 4s ease-in-out infinite ${p.delay}s, particle-float 10s ease-in-out infinite ${p.delay}s`,
              boxShadow: '0 0 4px rgba(240,216,117,0.6)',
            }}
          />
        ))}
      </div>

      {/* Layer 5: Vignette (köşelerden koyulaşma — derinlik) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,19,48,0.7)_100%)]" />
    </div>
  );
}
