'use client';

import { useEffect } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import confetti from 'canvas-confetti';

/**
 * Kampanya konfetisi — ana sayfa ilk açılışında patlar.
 *
 * - Session bazlı: sessionStorage guard sayesinde aynı oturumda bir kez
 *   patlar (site içi gezinmede tekrar etmez, yeni ziyarette tekrar eder).
 * - Kampanya bittiğinde CAMPAIGN_ACTIVE'i false yapman yeterli —
 *   component hiç patlatmaz.
 *
 * Koreografi: sol alt → sağ alt → merkez üst (üç dalga, ~2sn toplam)
 */
const CAMPAIGN_ACTIVE = true;

// Marka paleti: gold (accent) + krem + orman yeşili + beyaz.
// Koyu lacivert hero görseli üstünde açık renkler daha çok parlar.
const CAMPAIGN_COLORS = [
  '#d4af37', // accent gold
  '#f0d875', // gold light
  '#f2ede3', // secondary krem
  '#a7d7b8', // forest açık
  '#ffffff', // beyaz parıltı
];

// Aynı oturumda tekrar patlamasın diye sessionStorage anahtarı
const SESSION_KEY = 'hn-campaign-confetti-v1';

function fireCampaignConfetti(): void {
  const shared = {
    colors: CAMPAIGN_COLORS,
    disableForReducedMotion: true,
    zIndex: 90,
  };

  // 1. dalga — sol alt köşeden içeri doğru
  confetti({
    ...shared,
    particleCount: 90,
    spread: 70,
    startVelocity: 45,
    origin: { x: 0.05, y: 0.75 },
    angle: 60,
    scalar: 0.9,
  });

  // 2. dalga — sağ alt köşeden içeri doğru (senkron)
  setTimeout(() => {
    confetti({
      ...shared,
      particleCount: 90,
      spread: 70,
      startVelocity: 45,
      origin: { x: 0.95, y: 0.75 },
      angle: 120,
      scalar: 0.9,
    });
  }, 150);

  // 3. dalga — merkezden yukarı doğru (final vurgusu)
  setTimeout(() => {
    confetti({
      ...shared,
      particleCount: 60,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.45 },
      scalar: 1.1,
      ticks: 220,
    });
  }, 500);
}

/**
 * Görsel çıktısı yok — sadece konfeti efektini tetikler.
 * Ana sayfaya <CampaignConfetti /> olarak eklenir.
 */
export function CampaignConfetti(): null {
  useEffect(() => {
    if (!CAMPAIGN_ACTIVE) return;

    // Aynı oturumda zaten patladıysa tekrar etme
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage engellenmişse (private mode vb.) sessizce devam et
    }

    // Hero'nun stagger fade-in animasyonları otursun diye küçük gecikme
    const timer = setTimeout(fireCampaignConfetti, 800);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
