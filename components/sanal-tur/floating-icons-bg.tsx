'use client';

import React, { useMemo } from 'react';
import {
  Camera,
  MapPin,
  Compass,
  Video,
  Phone,
  Image as ImageIcon,
  Map,
  Navigation,
  Globe,
  Eye,
} from 'lucide-react';

const ICONS = [
  Camera,
  MapPin,
  Compass,
  Video,
  Phone,
  ImageIcon,
  Map,
  Navigation,
  Globe,
  Eye,
];

const NUM_FLOATING = 14;

/**
 * Sanal tur sayfası için beyaz tema arka plan.
 * - Subtle floating ikonlar (yavaş drift + rotate)
 * - Soft accent glow blob'lar
 * - Grid pattern overlay (premium hissi)
 * - SSR-safe deterministic positioning
 */
export function FloatingIconsBg() {
  const floatingIcons = useMemo(() => {
    return Array.from({ length: NUM_FLOATING }).map((_, i) => {
      const Icon = ICONS[i % ICONS.length];
      return {
        id: i,
        Icon,
        left: `${(i * 41) % 95 + 2}%`,
        top: `${(i * 67) % 88 + 5}%`,
        size: 16 + ((i * 3) % 16), // 16-32px
        duration: 12 + ((i * 7) % 18), // 12-30s
        delay: (i * 11) % 10,
        rotateDuration: 20 + ((i * 13) % 25), // 20-45s
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Soft accent glow blobs */}
      <div
        className="absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'aurora-drift 22s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -right-32 top-1/2 h-[32rem] w-[32rem] rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(29,51,112,0.18) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'aurora-drift 28s ease-in-out infinite alternate-reverse',
        }}
      />
      <div
        className="absolute left-1/3 bottom-0 h-[24rem] w-[24rem] rounded-full opacity-25"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'aurora-drift 30s ease-in-out infinite',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(29,51,112,1) 1px, transparent 1px), linear-gradient(90deg, rgba(29,51,112,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating ikonlar — desktop only (mobile'da overload olur) */}
      <div className="absolute inset-0 hidden md:block">
        {floatingIcons.map((item) => {
          const IconComponent = item.Icon;
          return (
            <div
              key={item.id}
              className="absolute opacity-0"
              style={{
                left: item.left,
                top: item.top,
                animation: `icon-drift ${item.duration}s ease-in-out infinite ${item.delay}s, icon-fade ${item.duration}s ease-in-out infinite ${item.delay}s`,
              }}
            >
              <div
                style={{
                  animation: `icon-spin ${item.rotateDuration}s linear infinite`,
                }}
              >
                <IconComponent
                  size={item.size}
                  className="text-accent/40"
                  strokeWidth={1.2}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Vignette — köşeler hafif gri (derinlik) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.04)_100%)]" />
    </div>
  );
}
