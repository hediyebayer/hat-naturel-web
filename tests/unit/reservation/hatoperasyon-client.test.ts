import { describe, expect, it } from 'vitest';
import {
  mapBungalowToSlug,
  mapBungalowToSlugWithCapacity,
} from '@/lib/reservation/hatoperasyon-client';

describe('reservation/hatoperasyon-client mapping helpers', () => {
  it('sabit köşk kodlarını sluga çevirir', () => {
    expect(mapBungalowToSlug('SK10')).toBe('sari');
    expect(mapBungalowToSlug('MOK11')).toBe('mor');
    expect(mapBungalowToSlug('BK12')).toBe('bej');
    expect(mapBungalowToSlug('TK13')).toBe('turkuaz');
    expect(mapBungalowToSlug('MAK14')).toBe('mavi');
  });

  it('üçgen odalarda kapasitesiz helper varsayılan olarak 1+1 döner (serinleme override hariç)', () => {
    expect(mapBungalowToSlug('B5')).toBe('ucgen-1-1');
    expect(mapBungalowToSlug(' b9 ')).toBe('ucgen-1-1-serinleme');
    expect(mapBungalowToSlug('B1')).toBe('ucgen-1-1-serinleme');
  });

  it('ısıtmasız üçgenler (B1, B9, B2) serinleme sluglarına sabitlenir', () => {
    expect(mapBungalowToSlug('B1')).toBe('ucgen-1-1-serinleme');
    expect(mapBungalowToSlug('B9')).toBe('ucgen-1-1-serinleme');
    expect(mapBungalowToSlug('B2')).toBe('ucgen-2-1-serinleme');
  });

  it('kapasiteye göre üçgen 1+1 ve 2+1 ayrımı yapar', () => {
    expect(mapBungalowToSlugWithCapacity('B5', 5)).toBe('ucgen-1-1');
    expect(mapBungalowToSlugWithCapacity('B8', 7)).toBe('ucgen-2-1');
  });

  it('serinleme override kapasiteden önce gelir (isim sabit)', () => {
    expect(mapBungalowToSlugWithCapacity('B1', 7)).toBe('ucgen-1-1-serinleme');
    expect(mapBungalowToSlugWithCapacity('B9', 8)).toBe('ucgen-1-1-serinleme');
    expect(mapBungalowToSlugWithCapacity('B2', 7)).toBe('ucgen-2-1-serinleme');
    expect(mapBungalowToSlugWithCapacity('B2', 5)).toBe('ucgen-2-1-serinleme');
  });

  it('üçgen dışı kodlarda kapasite helper da sabit eşleştirmeyi kullanır', () => {
    expect(mapBungalowToSlugWithCapacity('SK10', 7)).toBe('sari');
    expect(mapBungalowToSlugWithCapacity('TK13', 4)).toBe('turkuaz');
  });

  it('bilinmeyen kod için null döner', () => {
    expect(mapBungalowToSlug('XYZ99')).toBeNull();
    expect(mapBungalowToSlugWithCapacity('XYZ99', 2)).toBeNull();
  });
});
