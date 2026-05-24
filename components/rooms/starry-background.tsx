'use client';

import React from 'react';

const NUM_STARS = 90;
const NUM_METEORS = 4;

// Deterministic star seeds (SSR hydration safe — no Math.random)
const STARRY_SEEDS = Array.from({ length: NUM_STARS }).map((_, i) => {
  // Spread across viewport using prime-ish multipliers for visual randomness
  const x = (i * 137.508) % 100;
  const y = (i * 73.13) % 100;
  // 3 size tiers: most are tiny (1px), some medium (2px), few big (3px)
  const sizeRoll = i % 17;
  const size = sizeRoll === 0 ? 3 : sizeRoll < 4 ? 2 : 1;
  // Twinkle duration variety: 2-6s
  const duration = 2 + ((i * 17) % 4) + (size === 3 ? 1 : 0);
  // Delay so they don't all twinkle in sync
  const delay = ((i * 11) % 50) / 10;
  // ~1 in 12 stars get a glow halo
  const isGlowing = i % 12 === 0;
  // Color hint — most white, a few warm golden, a few cool cyan (atmospheric stars)
  const colorTier = i % 23;
  const color =
    colorTier === 0
      ? '#FFE9A8' // warm gold
      : colorTier === 11
        ? '#A8E9FF' // cool cyan
        : '#FFFFFF'; // pure white (most)

  return { id: i, x, y, size, duration, delay, isGlowing, color };
});

// Shooting stars (meteors) — diagonal traverse, staggered timing
const METEOR_SEEDS = Array.from({ length: NUM_METEORS }).map((_, i) => {
  const top = 5 + i * 20; // 5%, 25%, 45%, 65%
  const left = -10 - i * 8; // start off-screen left
  const duration = 3 + (i % 2); // 3-4s
  const delay = i * 7 + 2; // staggered so they don't appear together
  return { id: i, top, left, duration, delay };
});

export const StarryBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Deep midnight blue gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0B132B_0%,#0A1128_50%,#07091a_100%)]" />

      {/* Subtle nebula glow blobs for depth */}
      <div className="absolute left-1/4 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(127,229,245,0.06)_0%,transparent_70%)]" />
      <div className="absolute right-1/4 top-2/3 h-[35rem] w-[35rem] translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_70%)]" />

      {/* Stars */}
      <div className="absolute inset-0">
        {STARRY_SEEDS.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: star.isGlowing
                ? `0 0 ${star.size * 3}px ${star.size}px ${star.color}80`
                : 'none',
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              opacity: 0.3,
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      {/* Shooting stars (meteors) */}
      <div className="absolute inset-0">
        {METEOR_SEEDS.map((m) => (
          <span
            key={`meteor-${m.id}`}
            className="absolute h-[2px] w-[120px] rounded-full"
            style={{
              top: `${m.top}%`,
              left: `${m.left}%`,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 50%, rgba(212,175,55,0.6) 80%, transparent 100%)',
              transform: 'rotate(-22deg)',
              animation: `meteor ${m.duration}s linear ${m.delay}s infinite`,
              opacity: 0,
              filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))',
            }}
          />
        ))}
      </div>

      {/* Vignette for cinematic depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
};
