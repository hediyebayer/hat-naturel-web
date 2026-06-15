/**
 * Paylaşılan framer-motion animasyon preset'leri.
 *
 * Bu objeler doğrudan <motion.*> bileşenlerine spread edilir ve
 * inline kullanımla BİREBİR aynı davranışı üretir (initial/whileInView/
 * viewport/transition). Amaç 20+ component'teki tekrarı tek kaynağa toplamak.
 *
 * Örnek:
 *   <motion.div {...fadeInUp}>...</motion.div>
 *
 * Gecikmeli (stagger) varyant için:
 *   <motion.div {...withDelay(fadeInUp, 0.2)}>...</motion.div>
 */

/** Yumuşak ease-out eğrisi (sitede en sık kullanılan). */
export const EASE_SMOOTH: [number, number, number, number] = [0.25, 1, 0.5, 1];

interface ScrollReveal {
  initial: { opacity: number; y?: number; x?: number };
  whileInView: { opacity: number; y?: number; x?: number };
  viewport: { once: boolean; margin?: string };
  transition: { duration: number; delay?: number; ease?: [number, number, number, number] };
}

/** Aşağıdan yukarı belirme — sitedeki baskın scroll-reveal pattern'i. */
export const fadeInUp: ScrollReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: EASE_SMOOTH },
};

/** Sadece görünürlük (yumuşak fade). */
export const fadeIn: ScrollReveal = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: EASE_SMOOTH },
};

/**
 * Bir preset'i değiştirmeden kopyalayıp transition.delay ekler.
 * Stagger (sıralı belirme) için kullanışlı.
 */
export function withDelay<T extends ScrollReveal>(variant: T, delay: number): T {
  return {
    ...variant,
    transition: { ...variant.transition, delay },
  };
}
