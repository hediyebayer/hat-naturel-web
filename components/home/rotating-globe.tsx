'use client';

import React from 'react';

/**
 * 3D dönen dünya — SVG ile meridyen + ekvator + tilt
 * - Pure CSS animations (no framer-motion overhead)
 * - Lacivert + altın temaya uyumlu
 * - SSR safe (no random)
 * - Mobile responsive (smaller on mobile)
 */
export function RotatingGlobe() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
      {/* Globe wrapper — earth tilt (23.5° gerçek dünya gibi) */}
      <div
        className="relative h-[700px] w-[700px] opacity-[0.18] md:h-[900px] md:w-[900px]"
        style={{
          transform: 'rotateZ(23.5deg) perspective(1000px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Globe glow halo — dış parıltı */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 40%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'globe-glow-pulse 4s ease-in-out infinite',
          }}
        />

        {/* GLOBE SPHERE — dönen ana SVG */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          style={{
            animation: 'globe-rotate 60s linear infinite',
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Globe surface gradient (lacivert→koyu) */}
            <radialGradient id="globeGradient" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#162659" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#0a1330" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.8" />
            </radialGradient>

            {/* Altın çizgi gradient */}
            <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
              <stop offset="50%" stopColor="#f0d875" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sphere ana yüzey */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="url(#globeGradient)"
            stroke="#d4af37"
            strokeWidth="0.5"
            strokeOpacity="0.6"
          />

          {/* MERIDYENLER — boylam çizgileri (longitude) */}
          {/* Ana ekvator (en kalın) */}
          <ellipse
            cx="100"
            cy="100"
            rx="95"
            ry="95"
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.8"
            strokeOpacity="0.7"
          />

          {/* Boylam çizgileri — ellipses gradually getting narrower (3D etki) */}
          {[95, 80, 60, 35, 10].map((rx, i) => (
            <ellipse
              key={`lng-${i}`}
              cx="100"
              cy="100"
              rx={rx}
              ry="95"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.4"
              strokeOpacity={0.4 - i * 0.05}
            />
          ))}

          {/* PARALELLER — enlem çizgileri (latitude) */}
          {[20, 40, 60, 80].map((y, i) => {
            const rx = Math.sqrt(95 * 95 - (100 - y) * (100 - y));
            return (
              <React.Fragment key={`lat-${i}`}>
                {/* Üst yarımküre */}
                <ellipse
                  cx="100"
                  cy={y}
                  rx={rx}
                  ry={rx * 0.15}
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="0.3"
                  strokeOpacity="0.3"
                />
                {/* Alt yarımküre (simetrik) */}
                <ellipse
                  cx="100"
                  cy={200 - y}
                  rx={rx}
                  ry={rx * 0.15}
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="0.3"
                  strokeOpacity="0.3"
                />
              </React.Fragment>
            );
          })}

          {/* Kutup noktaları (kuzey + güney) */}
          <circle cx="100" cy="5" r="1.5" fill="#f0d875" opacity="0.9" />
          <circle cx="100" cy="195" r="1.5" fill="#f0d875" opacity="0.9" />

          {/* Konum işaretçisi — Sapanca lokasyonu (yaklaşık) */}
          <g style={{ animation: 'globe-pin-pulse 2s ease-in-out infinite' }}>
            <circle cx="115" cy="70" r="2.5" fill="#d4af37" opacity="0.9" />
            <circle
              cx="115"
              cy="70"
              r="5"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.5"
              opacity="0.6"
            />
            <circle
              cx="115"
              cy="70"
              r="8"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.3"
              opacity="0.3"
            />
          </g>
        </svg>

        {/* DIS YORUNGE 1 — slow counter-rotate (uydu yörüngesi gibi) */}
        <svg
          viewBox="0 0 220 220"
          className="absolute inset-0 h-full w-full"
          style={{
            animation: 'globe-rotate 90s linear infinite reverse',
            transform: 'scale(1.08)',
          }}
        >
          <ellipse
            cx="110"
            cy="110"
            rx="108"
            ry="40"
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.3"
            strokeOpacity="0.4"
            strokeDasharray="2 4"
          />
          {/* Uydu noktası */}
          <circle cx="218" cy="110" r="2" fill="#f0d875" opacity="0.8" />
        </svg>

        {/* DIS YORUNGE 2 — perpendicular */}
        <svg
          viewBox="0 0 220 220"
          className="absolute inset-0 h-full w-full"
          style={{
            animation: 'globe-rotate 120s linear infinite',
            transform: 'scale(1.12) rotateZ(45deg)',
          }}
        >
          <ellipse
            cx="110"
            cy="110"
            rx="108"
            ry="30"
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.25"
            strokeOpacity="0.3"
            strokeDasharray="3 6"
          />
        </svg>
      </div>
    </div>
  );
}
