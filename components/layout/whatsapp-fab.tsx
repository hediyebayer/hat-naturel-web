import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

/**
 * Sağ alt köşede sabit duran WhatsApp Floating Action Button.
 * Her sayfada görünür, hızlı iletişim için.
 */
export function WhatsAppFab(): React.ReactElement {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yaz"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-strong transition-transform hover:scale-110 hover:bg-[#1ebe5b] focus-visible:scale-110 sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
    >
      {/* Pulse ring — dikkat çekici, sade animasyon */}
      <span
        aria-hidden
        className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30"
      />
      <MessageCircle size={28} className="relative" />
    </a>
  );
}
