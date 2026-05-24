'use client';

import React from 'react';

const NUM_STARS = 120;
const NUM_BRIGHT_STARS = 15;
const NUM_METEORS = 5;

// Deterministic seed pattern (SSR-safe — no Math.random)
// Uses prime-ish multipliers for pseudo-random spread.
const STAR_SEEDS = Array.from({ length: NUM_STARS }).map((_, i) => {
  const x = (i * 137.508) % 100;
  const y = (i * 73.13 + 7) % 100;
  // Size distribution: most tiny (1px), some medium (2px), few large (3px)
  const sizeRoll = i % 19;
  const size = sizeRoll === 0 ? 3 : sizeRoll < 5 ? 2 : 1;
  // Twinkle duration: 1.8 - 5.5s (variety)
  const duration = 1.8 + ((i * 17) % 38) / 10;
  // Delay so they don't all twinkle in sync — spread over 6s
  const delay = ((i * 11) % 60) / 10;
  // Color: 85% white, 10% warm gold, 5% cool cyan
  const colorRoll = i % 20;
  const color =
    colorRoll === 0
      ? '#FFE9A8' // warm gold
      : colorRoll === 7
        ? '#A8E9FF' // cool cyan
        : '#FFFFFF';

  return { id: i, x, y, size, duration, delay, color };
});

// Bright "named" stars — bigger, brighter, with glow halo
const BRIGHT_STAR_SEEDS = Array.from({ length: NUM_BRIGHT_STARS }).map(
  (_, i) => {
    const x = (i * 191.3 + 13) % 95 + 2.5;
    const y = (i * 67.7 + 23) % 85 + 5;
    const size = 2 + (i % 2);
    const duration = 2.5 + ((i * 7) % 20) / 10;
    const delay = ((i * 13) % 50) / 10;
    return { id: i, x, y, size, duration, delay };
  },
);

// Meteors — diagonal shooting stars
const METEOR_SEEDS = Array.from({ length: NUM_METEORS }).map((_, i) => {
  const top = 3 + i * 18; // distributed vertically
  const left = -15 - i * 5;
  const duration = 4 + (i % 3); // 4-6s
  // Long staggered delays so meteors appear occasionally, not constantly
  const delay = 3 + i * 8;
  return { id: i, top, left, duration, delay };
});

export const StarryBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* Subtle nebula glow blobs for depth */}
      <div
        className="absolute left-1/4 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(127,229,245,0.08) 0%, transparent 65%)',
          animation: 'float-drift 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-1/4 top-2/3 h-[35rem] w-[35rem] translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)',
          animation: 'float-drift 22s ease-in-out infinite reverse',
        }}
      />

      {/* Tiny background stars */}
      <div className="absolute inset-0">
        {STAR_SEEDS.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              willChange: 'opacity, transform',
            }}
          />
        ))}
      </div>

      {/* Bright glowing stars */}
      <div className="absolute inset-0">
        {BRIGHT_STAR_SEEDS.map((star) => (
          <span
            key={`bright-${star.id}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size * 4}px ${star.size}px rgba(255,255,255,0.7), 0 0 ${star.size * 8}px ${star.size * 2}px rgba(212,175,55,0.2)`,
              animation: `twinkle-bright ${star.duration}s ease-in-out ${star.delay}s infinite`,
              willChange: 'opacity, transform',
            }}
          />
        ))}
      </div>

      {/* Shooting stars (meteors) */}
      <div className="absolute inset-0">
        {METEOR_SEEDS.map((m) => (
          <span
            key={`meteor-${m.id}`}
            className="absolute h-[2px] w-[150px] rounded-full"
            style={{
              top: `${m.top}%`,
              left: `${m.left}%`,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 40%, rgba(212,175,55,0.7) 80%, transparent 100%)',
              transform: 'rotate(-22deg)',
              animation: `meteor ${m.duration}s linear ${m.delay}s infinite`,
              opacity: 0,
              filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))',
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    </div>
  );
};
