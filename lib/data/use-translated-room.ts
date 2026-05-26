import { useTranslations } from 'next-intl';
import type { Room } from './rooms';

/**
 * Bir oda için locale'e göre çevrilmiş tüm metinleri döner.
 * - name, shortName, tagline: roomNames namespace
 * - description, longDescription: roomDescriptions namespace
 * Server/client her ikisinde çalışır.
 */
export function useTranslatedRoom(room: Room): {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  longDescription: string;
} {
  const tNames = useTranslations('roomNames');
  const tDesc = useTranslations('roomDescriptions');

  return {
    name: tNames(`${room.slug}.name`),
    shortName: tNames(`${room.slug}.shortName`),
    tagline: tNames(`${room.slug}.tagline`),
    description: tDesc(`${room.slug}.description`),
    longDescription: tDesc(`${room.slug}.longDescription`),
  };
}
