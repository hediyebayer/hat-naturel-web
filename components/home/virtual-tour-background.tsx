import React, { useMemo } from 'react';

export function VirtualTourBackground() {
  const particles = useMemo(() => {
    // SSR safe deterministic random
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${(i * 13) % 100}%`,
      top: `${(i * 17) % 100}%`,
      size: ((i * 7) % 3) + 1,
      delay: (i * 11) % 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-primary-900 pointer-events-none">
      {/* Layer 1: Aurora Gradient Mesh */}
      <div 
        className="absolute inset-0 opacity-20 will-change-transform"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.4) 0%, transparent 60%)',
          animation: 'aurora-drift 25s ease-in-out infinite alternate',
          transformOrigin: 'center center',
          filter: 'blur(60px)',
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-25%'
        }}
      />
      <div 
        className="absolute inset-0 opacity-15 will-change-transform"
        style={{
          background: 'radial-gradient(circle at 30% 70%, rgba(22,38,89,0.8) 0%, transparent 50%)',
          animation: 'aurora-drift 30s ease-in-out infinite alternate-reverse',
          transformOrigin: 'center center',
          filter: 'blur(50px)',
          width: '120%',
          height: '120%',
          top: '-10%',
          left: '-10%'
        }}
      />

      {/* Layer 2: Orbit rings / Compass rose */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ animation: 'orbit-rotate 40s linear infinite' }}>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#d4af37" strokeWidth="0.1" strokeDasharray="1 3" />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ animation: 'orbit-rotate 60s linear infinite reverse' }}>
          <circle cx="50" cy="50" r="35" fill="none" stroke="#d4af37" strokeWidth="0.15" strokeDasharray="4 2" />
          {/* subtle compass ticks */}
          <path d="M50 10 L50 15 M50 90 L50 85 M10 50 L15 50 M90 50 L85 50" stroke="#d4af37" strokeWidth="0.2" />
        </svg>
      </div>

      {/* Layer 3: Floating particles (Hidden on mobile via media query/tailwind) */}
      <div className="absolute inset-0 hidden sm:block">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-accent-light opacity-0"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animation: `twinkle 4s ease-in-out infinite ${p.delay}s, particle-float 10s ease-in-out infinite ${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
