/**
 * PaymentProvider interface + factory.
 * Gerçek VakıfBank entegrasyonunda bu interface'i implemente eden
 * VakifBankProvider kullanılır; UI ve API route'lar değişmeden kalır.
 */

import type { PaymentRecord, InitiateInput, InitiateResult, VerifyInput, VerifyResult } from './types';

export type PaymentProviderType = 'mock' | 'vakifbank';

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface PaymentProvider {
  /**
   * Ödeme başlatır.
   * Kart doğrulanmaz; mock'ta her Luhn-geçerli kart kabul edilir.
   * Gerçek entegrasyonda VakıfBank MPI enrollment isteği yapılır.
   */
  initiate(input: InitiateInput): Promise<InitiateResult>;

  /**
   * 3D Secure OTP doğrulaması.
   * Mock'ta 6 haneli sayı → success.
   * Gerçek entegrasyonda VakıfBank MdStatus + VPOS tahsil.
   */
  verify(input: VerifyInput): Promise<VerifyResult>;

  /**
   * Rezervasyon kaydını getirir.
   * Status sayfası için kullanılır.
   */
  getStatus(reservationId: string): Promise<PaymentRecord | null>;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

let _instance: PaymentProvider | null = null;

/**
 * Singleton factory — PAYMENT_PROVIDER env'ine göre provider döndürür.
 *
 * @example
 *   const provider = getPaymentProvider();
 *   const result = await provider.initiate(input);
 */
export function getPaymentProviderType(): PaymentProviderType {
  return process.env.PAYMENT_PROVIDER === 'vakifbank' ? 'vakifbank' : 'mock';
}

export function getPaymentProvider(): PaymentProvider {
  if (_instance) return _instance;

  const providerType = getPaymentProviderType();

  if (providerType === 'mock') {
    // Lazy import — circular dependency riskini önler
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MockVakifBankProvider } = require('./mock-vakifbank-provider') as {
      MockVakifBankProvider: new () => PaymentProvider;
    };
    _instance = new MockVakifBankProvider();
    return _instance;
  }

  if (providerType === 'vakifbank') {
    // Lazy import — runtime'da env'e göre yüklenir
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { VakifBankProvider } = require('./vakifbank-provider') as {
      VakifBankProvider: new () => PaymentProvider;
    };
    _instance = new VakifBankProvider();
    return _instance;
  }

  throw new Error(`Bilinmeyen payment provider: "${providerType}". Geçerli değerler: mock, vakifbank`);
}

/** Test ortamında singleton'ı sıfırlamak için */
export function _resetProviderInstance(): void {
  _instance = null;
}
