/**
 * PaymentProvider interface + factory.
 * Gerçek VakıfBank entegrasyonunda bu interface'i implemente eden
 * RealVakifBankProvider oluşturulacak; UI ve API route'lar değişmeyecek.
 */

import type { PaymentRecord, InitiateInput, InitiateResult, VerifyInput, VerifyResult } from './types';

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
 * Şu an yalnızca 'mock' desteklenmekte.
 *
 * @example
 *   const provider = getPaymentProvider();
 *   const result = await provider.initiate(input);
 */
export function getPaymentProvider(): PaymentProvider {
  if (_instance) return _instance;

  const providerType = process.env.PAYMENT_PROVIDER ?? 'mock';

  if (providerType === 'mock') {
    // Lazy import — circular dependency riskini önler
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MockVakifBankProvider } = require('./mock-vakifbank-provider') as {
      MockVakifBankProvider: new () => PaymentProvider;
    };
    _instance = new MockVakifBankProvider();
    return _instance;
  }

  // TODO: Gerçek VakıfBank provider
  // if (providerType === 'vakifbank') {
  //   const { RealVakifBankProvider } = require('./real-vakifbank-provider');
  //   _instance = new RealVakifBankProvider();
  //   return _instance;
  // }

  throw new Error(`Bilinmeyen payment provider: "${providerType}". Geçerli değerler: mock`);
}

/** Test ortamında singleton'ı sıfırlamak için */
export function _resetProviderInstance(): void {
  _instance = null;
}
