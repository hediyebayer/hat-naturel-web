import { describe, it, expect } from 'vitest';
import {
  luhnCheck,
  detectBrand,
  maskPan,
  getLast4,
  formatPan,
  formatExp,
  parseExp,
  isExpired,
} from '@/lib/payment/card-utils';

// ---------------------------------------------------------------------------
// luhnCheck
// ---------------------------------------------------------------------------

describe('luhnCheck()', () => {
  it('4111111111111111 geçerli (Luhn ✓)', () => {
    expect(luhnCheck('4111111111111111')).toBe(true);
  });

  it('boşluklu 4111 1111 1111 1111 geçerli', () => {
    expect(luhnCheck('4111 1111 1111 1111')).toBe(true);
  });

  it('4111111111111112 geçersiz (Luhn ✗)', () => {
    expect(luhnCheck('4111111111111112')).toBe(false);
  });

  it('5500005555555559 geçerli (Mastercard)', () => {
    expect(luhnCheck('5500005555555559')).toBe(true);
  });

  it('boş string geçersiz', () => {
    expect(luhnCheck('')).toBe(false);
  });

  it('kısa numara geçersiz', () => {
    expect(luhnCheck('1234')).toBe(false);
  });

  it('9792038801000004 geçerli (Troy BIN + Luhn-valid check digit)', () => {
    // 9792038801000004: Troy prefix + hesaplanan check digit = 4 (Luhn ✓)
    expect(luhnCheck('9792038801000004')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// detectBrand
// ---------------------------------------------------------------------------

describe('detectBrand()', () => {
  it('4 ile başlayan → visa', () => {
    expect(detectBrand('4111111111111111')).toBe('visa');
  });

  it('4000 ile başlayan → visa', () => {
    expect(detectBrand('4000000000000002')).toBe('visa');
  });

  it('51 ile başlayan → mastercard', () => {
    expect(detectBrand('5100000000000000')).toBe('mastercard');
  });

  it('55 ile başlayan → mastercard', () => {
    expect(detectBrand('5500005555555559')).toBe('mastercard');
  });

  it('2221 ile başlayan → mastercard (yeni BIN)', () => {
    expect(detectBrand('2221000000000009')).toBe('mastercard');
  });

  it('9792 ile başlayan → troy', () => {
    expect(detectBrand('9792038801000004')).toBe('troy');
  });

  it('34 ile başlayan → amex', () => {
    expect(detectBrand('341111111111111')).toBe('amex');
  });

  it('37 ile başlayan → amex', () => {
    expect(detectBrand('371449635398431')).toBe('amex');
  });

  it('bilinmeyen → unknown', () => {
    expect(detectBrand('6011000990139424')).toBe('unknown');
  });

  it('boş string → unknown', () => {
    expect(detectBrand('')).toBe('unknown');
  });
});

// ---------------------------------------------------------------------------
// maskPan
// ---------------------------------------------------------------------------

describe('maskPan()', () => {
  it('16 haneli → 6 + * + 4 formatı', () => {
    expect(maskPan('4111111111111111')).toBe('411111******1111');
  });

  it('boşluklu PAN çalışır', () => {
    expect(maskPan('4111 1111 1111 1111')).toBe('411111******1111');
  });

  it('Amex 15 hane → 6 + * + 4', () => {
    expect(maskPan('371449635398431')).toBe('371449*****8431');
  });
});

// ---------------------------------------------------------------------------
// getLast4
// ---------------------------------------------------------------------------

describe('getLast4()', () => {
  it('son 4 hane döner', () => {
    expect(getLast4('4111111111111111')).toBe('1111');
  });

  it('boşluklu PAN çalışır', () => {
    expect(getLast4('4111 1111 1111 1234')).toBe('1234');
  });
});

// ---------------------------------------------------------------------------
// formatPan
// ---------------------------------------------------------------------------

describe('formatPan()', () => {
  it('16 haneyi 4+4+4+4 formatlar', () => {
    expect(formatPan('4111111111111111')).toBe('4111 1111 1111 1111');
  });

  it('fazla hane 19 ile kırpar', () => {
    const result = formatPan('4111111111111111999');
    expect(result.replace(/\s/g, '').length).toBeLessThanOrEqual(19);
  });
});

// ---------------------------------------------------------------------------
// formatExp
// ---------------------------------------------------------------------------

describe('formatExp()', () => {
  it('ay ve yılı MM/YY formatlar', () => {
    expect(formatExp(3, 2028)).toBe('03/28');
  });

  it('2 haneli yıl olursa da çalışır', () => {
    expect(formatExp(12, 30)).toBe('12/30');
  });
});

// ---------------------------------------------------------------------------
// parseExp
// ---------------------------------------------------------------------------

describe('parseExp()', () => {
  it('geçerli "12/30" parse edilir', () => {
    expect(parseExp('12/30')).toEqual({ month: 12, year: 2030 });
  });

  it('geçersiz format null döner', () => {
    expect(parseExp('1230')).toBeNull();
  });

  it('ay 13 ise null döner', () => {
    expect(parseExp('13/30')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// isExpired
// ---------------------------------------------------------------------------

describe('isExpired()', () => {
  it('geçmiş yıl → expired', () => {
    expect(isExpired(12, 2020)).toBe(true);
  });

  it('gelecek yıl → not expired', () => {
    expect(isExpired(1, 2035)).toBe(false);
  });

  it('aynı yıl geçmiş ay → expired', () => {
    const now = new Date();
    const year = now.getFullYear();
    const lastMonth = now.getMonth(); // 0-indexed, bu ay = getMonth()+1
    if (lastMonth >= 1) {
      expect(isExpired(lastMonth, year)).toBe(true);
    }
  });
});
