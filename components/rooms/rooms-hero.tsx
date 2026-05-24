'use client';

import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Shield, Users } from 'lucide-react';

export function RoomsHero() {
  // Mouse parallax — aerial image moves subtly with cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 80, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const imageX = useTransform(springX, [-1, 1], [25, -25]);
  const imageY = useTransform(springY, [-1, 1], [15, -15]);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[88vh] items-center justify-center overflow-hidden bg-[#07091a] pt-32 pb-24 text-white md:pt-40 md:pb-32"
    >
      {/* Layer 1: Real aerial night photo with mouse parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ x: imageX, y: imageY, scale: 1.08 }}
      >
        <Image
          src="/images/hero/aerial-night.jpg"
          alt="Hat Naturel Resort - kuş bakışı gece görünümü"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark gradient overlay — make text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07091a]/55 via-[#0B132B]/45 to-[#0B132B]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(7,9,26,0.75)_100%)]" />
      </motion.div>

      {/* Layer 2: (YILDIZLAR KALDIRILDI — kullanıcı isteği) */}

      {/* Layer 3: Hero text content */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* Üst etiket — mahremiyet vurgusu */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.15)]"
        >
          <Shield className="h-3.5 w-3.5" />
          Müstakil · Mahrem · Aileye Uygun
        </motion.span>

        {/* ANA BAŞLIK — Mahremiyet + Aileye Uygun vurgulu */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
          className="mt-10 font-serif text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
        >
          <span className="italic font-light text-white/85 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
            Tam Mahremiyet,
          </span>
          <span className="mt-3 block bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text font-bold text-transparent drop-shadow-[0_4px_30px_rgba(212,175,55,0.3)]">
            Aileye Uygun Kaçamak
          </span>
        </motion.h1>

        {/* Açıklama subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-10 max-w-2xl font-sans text-base text-white/85 tracking-[0.02em] md:text-lg leading-relaxed"
        >
          Komşunuz yok, gürültü yok — Sapanca&apos;da müstakil bungalov ve
          köşkler, ailecek huzurlu bir tatil için tasarlandı.
        </motion.p>

        {/* Mahremiyet vurgu chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mx-auto mt-10 flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: Shield, text: 'Müstakil Giriş' },
            { icon: Users, text: 'Aileye Uygun' },
            { icon: Shield, text: 'Komşusuz Mahremiyet' },
          ].map((chip, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md"
            >
              <chip.icon className="h-3 w-3 text-accent" />
              {chip.text}
            </span>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute -bottom-24 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-[10px] uppercase tracking-[0.3em]">Keşfet</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-8 w-[1px] bg-gradient-to-b from-accent/60 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
