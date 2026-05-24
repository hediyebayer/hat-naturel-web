import { StaticContentAdapter } from './static-adapter';
import type { ContentAdapter } from './adapter';

let cached: ContentAdapter | null = null;

/**
 * Aktif içerik adapter'ını döndürür. Şimdilik statik.
 * İleride env var (CONTENT_PROVIDER=api) ile API adapter seçilecek.
 */
export function getContentAdapter(): ContentAdapter {
  if (!cached) cached = new StaticContentAdapter();
  return cached;
}

export type { ContentAdapter } from './adapter';
export * from './types';
