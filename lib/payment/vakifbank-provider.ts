/**
 * Gerçek VakıfBank VPOS 7/24 provider implementasyonu.
 *
 * Akış:
 * 1. initiate() → Enrollment çağrısı yapar
 * 2. Status=Y ise ACS alanlarını store'a kaydeder
 * 3. callback route, banka POST'unu alır ve finalizeCallback() çağırır
 * 4. finalizeCallback() → Vposreq provizyonu yapar, başarılıysa kaydı success yapar
 *
 * Güvenlik:
 * - PAN/CVV yalnızca in-memory store'da geçici ve şifreli tutulur
 * - Provizyon sonrası geçici kart verisi derhal temizlenir
 * - Log'larda asla raw PAN/CVV yer almaz
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { PaymentProvider } from './provider';
import type {
  CardBrand,
  CardInfo,
  InitiateInput,
  InitiateResult,
  PaymentRecord,
  VerifyInput,
  VerifyResult,
} from './types';
import { detectBrand, getLast4, maskPan } from './card-utils';
import { getPaymentCallbackUrl } from './site-url';
import { storeGet, storeSet, storeUpdate } from './store';

const VAKIFBANK_CURRENCY_CODE = '949';
const ENROLLMENT_ENDPOINTS = {
  test: 'https://inbound.apigatewaytest.vakifbank.com.tr:8443/threeDGateway/Enrollment',
  prod: 'https://inbound.apigateway.vakifbank.com.tr:8443/threeDGateway/Enrollment',
} as const;
const VPOSREQ_ENDPOINTS = {
  test: 'https://apiportalprep.vakifbank.com.tr:8443/virtualPos/Vposreq',
  prod: 'https://apigw.vakifbank.com.tr:8443/virtualPos/Vposreq',
} as const;

type VakifBankEnv = keyof typeof ENROLLMENT_ENDPOINTS;

type EnrollmentStatus = 'Y' | 'N' | 'E' | string;
type CallbackStatus = 'Y' | 'A' | 'N' | 'E' | 'U' | 'R' | 'I' | 'C' | 'D' | string;

interface EnrollmentResponse {
  status: EnrollmentStatus;
  messageErrorCode?: string;
  messageErrorDescription?: string;
  paReq?: string;
  acsUrl?: string;
  termUrl?: string;
  md?: string;
}

interface ProvisionRequestInput {
  reservationId: string;
  amount: string;
  pan: string;
  expiry: string;
  cvv: string;
  cavv: string;
  eci: string;
  mpiTransactionId: string;
  orderId: string;
  clientIp: string;
}

interface ProvisionResponse {
  resultCode?: string;
  resultDetail?: string;
  authCode?: string;
  rrn?: string;
  transactionId?: string;
  currencyAmount?: string;
}

interface EncryptedCardPayload {
  pan: string;
  cvv: string;
  expMonth: number;
  expYear: number;
  holder: string;
}

interface FinalizeCallbackInput {
  reservationId: string;
  status: CallbackStatus;
  cavv?: string;
  eci?: string;
  mpiTransactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  clientIp: string;
}

function generateReservationId(): string {
  return `HN-${crypto.randomUUID().toUpperCase()}`;
}

function calculateAmountCharged(totalPrice: number, depositMode: 'full' | 'deposit'): number {
  if (depositMode === 'full') return totalPrice;
  const ratio = parseFloat(process.env.NEXT_PUBLIC_DEPOSIT_RATIO ?? '0.3');
  return Math.round(totalPrice * ratio);
}

function getVakifBankEnv(): VakifBankEnv {
  return process.env.VAKIFBANK_ENV === 'prod' ? 'prod' : 'test';
}

function getRequiredEnv(name: 'VAKIFBANK_MERCHANT_ID' | 'VAKIFBANK_TERMINAL_NO' | 'VAKIFBANK_MERCHANT_PASSWORD'): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} env'i tanımlı değil.`);
  }
  return value;
}

function getBrandCode(brand: CardBrand): string {
  switch (brand) {
    case 'visa':
      return '100';
    case 'mastercard':
      return '200';
    case 'troy':
      return '300';
    default:
      throw new Error(`VakıfBank için desteklenmeyen kart markası: ${brand}`);
  }
}

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

function formatEnrollmentExpiry(month: number, year: number): string {
  const yy = year > 99 ? year % 100 : year;
  return `${String(yy).padStart(2, '0')}${String(month).padStart(2, '0')}`;
}

function formatProvisionExpiry(month: number, year: number): string {
  const yyyy = year > 99 ? year : 2000 + year;
  return `${String(yyyy).padStart(4, '0')}${String(month).padStart(2, '0')}`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function getXmlTagValue(xml: string, tagName: string): string | undefined {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match?.[1]?.trim();
}

function buildMaskedCard(input: InitiateInput['card']): CardInfo {
  return {
    maskedPan: maskPan(input.pan),
    last4: getLast4(input.pan),
    brand: detectBrand(input.pan),
    holder: input.holder,
    expMonth: input.expMonth,
    expYear: input.expYear,
  };
}

function deriveEncryptionKey(): Buffer {
  const material = [
    getRequiredEnv('VAKIFBANK_MERCHANT_PASSWORD'),
    getRequiredEnv('VAKIFBANK_MERCHANT_ID'),
    getRequiredEnv('VAKIFBANK_TERMINAL_NO'),
  ].join('|');

  return createHash('sha256').update(material).digest();
}

function encryptCardPayload(payload: EncryptedCardPayload): {
  cipherText: string;
  iv: string;
  authTag: string;
} {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', deriveEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ]);

  return {
    cipherText: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: cipher.getAuthTag().toString('base64'),
  };
}

function decryptCardPayload(record: PaymentRecord): EncryptedCardPayload {
  if (!record.encryptedCard) {
    throw new Error('Geçici kart verisi bulunamadı. İşlem süresi dolmuş olabilir.');
  }

  const decipher = createDecipheriv(
    'aes-256-gcm',
    deriveEncryptionKey(),
    Buffer.from(record.encryptedCard.iv, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(record.encryptedCard.authTag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(record.encryptedCard.cipherText, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('utf8')) as EncryptedCardPayload;
}

export function parseEnrollmentResponseXml(xml: string): EnrollmentResponse {
  return {
    status: getXmlTagValue(xml, 'Status') ?? 'E',
    messageErrorCode: getXmlTagValue(xml, 'MessageErrorCode'),
    messageErrorDescription: getXmlTagValue(xml, 'ErrorMessage') ?? getXmlTagValue(xml, 'MessageErrorDescription'),
    paReq: getXmlTagValue(xml, 'PaReq'),
    acsUrl: getXmlTagValue(xml, 'ACSUrl'),
    termUrl: getXmlTagValue(xml, 'TermUrl'),
    md: getXmlTagValue(xml, 'MD'),
  };
}

export function parseProvisionResponseXml(xml: string): ProvisionResponse {
  return {
    resultCode: getXmlTagValue(xml, 'ResultCode'),
    resultDetail: getXmlTagValue(xml, 'ResultDetail'),
    authCode: getXmlTagValue(xml, 'AuthCode'),
    rrn: getXmlTagValue(xml, 'Rrn'),
    transactionId: getXmlTagValue(xml, 'TransactionId'),
    currencyAmount: getXmlTagValue(xml, 'CurrencyAmount'),
  };
}

export function buildVposXml(input: ProvisionRequestInput): string {
  return [
    '<VposRequest>',
    `<MerchantId>${escapeXml(getRequiredEnv('VAKIFBANK_MERCHANT_ID'))}</MerchantId>`,
    `<Password>${escapeXml(getRequiredEnv('VAKIFBANK_MERCHANT_PASSWORD'))}</Password>`,
    `<TerminalNo>${escapeXml(getRequiredEnv('VAKIFBANK_TERMINAL_NO'))}</TerminalNo>`,
    '<TransactionType>Sale</TransactionType>',
    `<TransactionId>${escapeXml(input.reservationId)}</TransactionId>`,
    `<CurrencyAmount>${escapeXml(input.amount)}</CurrencyAmount>`,
    `<CurrencyCode>${VAKIFBANK_CURRENCY_CODE}</CurrencyCode>`,
    `<Pan>${escapeXml(input.pan)}</Pan>`,
    `<Expiry>${escapeXml(input.expiry)}</Expiry>`,
    `<Cvv>${escapeXml(input.cvv)}</Cvv>`,
    `<ECI>${escapeXml(input.eci)}</ECI>`,
    `<CAVV>${escapeXml(input.cavv)}</CAVV>`,
    `<MpiTransactionId>${escapeXml(input.mpiTransactionId)}</MpiTransactionId>`,
    `<OrderId>${escapeXml(input.orderId)}</OrderId>`,
    `<ClientIp>${escapeXml(input.clientIp)}</ClientIp>`,
    '<TransactionDeviceSource>0</TransactionDeviceSource>',
    '</VposRequest>',
  ].join('');
}

export class VakifBankProvider implements PaymentProvider {
  async initiate(input: InitiateInput): Promise<InitiateResult> {
    const reservationId = generateReservationId();
    const amountCharged = calculateAmountCharged(input.order.totalPrice, input.depositMode);
    const card = buildMaskedCard(input.card);
    const callbackUrl = getPaymentCallbackUrl();
    const enrollmentResponse = await this.callEnrollment({
      reservationId,
      input,
      amountCharged,
      cardBrand: card.brand,
      callbackUrl,
    });

    if (enrollmentResponse.status !== 'Y') {
      throw new Error(
        `Enrollment başarısız: status=${enrollmentResponse.status} code=${enrollmentResponse.messageErrorCode ?? '-'} detail=${enrollmentResponse.messageErrorDescription ?? '-'}`,
      );
    }

    if (!enrollmentResponse.acsUrl || !enrollmentResponse.paReq || !enrollmentResponse.md || !enrollmentResponse.termUrl) {
      throw new Error('Enrollment cevabında ACS alanları eksik.');
    }

    const encryptedCard = encryptCardPayload({
      pan: input.card.pan,
      cvv: input.card.cvv,
      expMonth: input.card.expMonth,
      expYear: input.card.expYear,
      holder: input.card.holder,
    });

    const record: PaymentRecord = {
      reservationId,
      status: 'awaiting_3ds',
      locale: input.locale ?? 'tr',
      guest: input.guest,
      order: {
        ...input.order,
        depositMode: input.depositMode,
      },
      card,
      amountCharged,
      currency: 'TRY',
      createdAt: new Date(),
      verifyAttempts: 0,
      acsUrl: enrollmentResponse.acsUrl,
      paReq: enrollmentResponse.paReq,
      md: enrollmentResponse.md,
      termUrl: enrollmentResponse.termUrl,
      mpiTransactionId: reservationId,
      enrollmentStatus: enrollmentResponse.status,
      enrollmentErrorCode: enrollmentResponse.messageErrorCode,
      enrollmentErrorMessage: enrollmentResponse.messageErrorDescription,
      encryptedCard,
    };

    storeSet(record);

    return {
      ok: true,
      reservationId,
      redirectUrl: `/${record.locale}/rezervasyon/odeme/3d-secure?ref=${reservationId}`,
      amountCharged,
    };
  }

  async verify(input: VerifyInput): Promise<VerifyResult> {
    const record = storeGet(input.reservationId);

    if (!record) {
      return {
        ok: false,
        status: 'failed',
        reservationId: input.reservationId,
        reason: 'expired',
      };
    }

    if (record.status === 'success') {
      return {
        ok: true,
        status: 'success',
        reservationId: input.reservationId,
      };
    }

    if (record.status === 'failed') {
      return {
        ok: false,
        status: 'failed',
        reservationId: input.reservationId,
        reason: record.failReason ?? 'cancelled',
      };
    }

    return {
      ok: false,
      status: 'failed',
      reservationId: input.reservationId,
      reason: 'cancelled',
    };
  }

  async getStatus(reservationId: string): Promise<PaymentRecord | null> {
    return storeGet(reservationId);
  }

  async finalizeCallback(input: FinalizeCallbackInput): Promise<VerifyResult> {
    const record = storeGet(input.reservationId);

    if (!record) {
      return {
        ok: false,
        status: 'failed',
        reservationId: input.reservationId,
        reason: 'expired',
      };
    }

    if (record.status === 'success') {
      return {
        ok: true,
        status: 'success',
        reservationId: input.reservationId,
      };
    }

    const mpiTransactionId = input.mpiTransactionId ?? record.mpiTransactionId ?? record.reservationId;

    storeUpdate(input.reservationId, {
      mpiTransactionId,
      callbackStatus: input.status,
      callbackErrorCode: input.errorCode,
      callbackErrorMessage: input.errorMessage,
      cavv: input.cavv,
      eci: input.eci,
    });

    if (!['Y', 'A'].includes(input.status)) {
      this.clearSensitiveCardData(input.reservationId);
      storeUpdate(input.reservationId, {
        status: 'failed',
        failReason: 'cancelled',
      });
      return {
        ok: false,
        status: 'failed',
        reservationId: input.reservationId,
        reason: 'cancelled',
      };
    }

    if (!input.cavv || !input.eci) {
      this.clearSensitiveCardData(input.reservationId);
      storeUpdate(input.reservationId, {
        status: 'failed',
        failReason: 'cancelled',
      });
      return {
        ok: false,
        status: 'failed',
        reservationId: input.reservationId,
        reason: 'cancelled',
      };
    }

    const sensitiveCard = decryptCardPayload(record);
    const provisionResponse = await this.callVposreq(
      buildVposXml({
        reservationId: record.reservationId,
        amount: formatAmount(record.amountCharged),
        pan: sensitiveCard.pan,
        expiry: formatProvisionExpiry(sensitiveCard.expMonth, sensitiveCard.expYear),
        cvv: sensitiveCard.cvv,
        cavv: input.cavv,
        eci: input.eci,
        mpiTransactionId,
        orderId: record.reservationId,
        clientIp: input.clientIp,
      }),
    );

    this.clearSensitiveCardData(input.reservationId);

    if (provisionResponse.resultCode === '0000') {
      storeUpdate(input.reservationId, {
        status: 'success',
        paidAt: new Date(),
        authCode: provisionResponse.authCode,
        rrn: provisionResponse.rrn,
        provisionTransactionId: provisionResponse.transactionId,
        provisionResultCode: provisionResponse.resultCode,
        provisionResultDetail: provisionResponse.resultDetail,
      });
      return {
        ok: true,
        status: 'success',
        reservationId: input.reservationId,
      };
    }

    storeUpdate(input.reservationId, {
      status: 'failed',
      failReason: 'cancelled',
      provisionResultCode: provisionResponse.resultCode,
      provisionResultDetail: provisionResponse.resultDetail,
      authCode: provisionResponse.authCode,
      rrn: provisionResponse.rrn,
      provisionTransactionId: provisionResponse.transactionId,
    });

    return {
      ok: false,
      status: 'failed',
      reservationId: input.reservationId,
      reason: 'cancelled',
    };
  }

  private async callEnrollment(args: {
    reservationId: string;
    input: InitiateInput;
    amountCharged: number;
    cardBrand: CardBrand;
    callbackUrl: string;
  }): Promise<EnrollmentResponse> {
    const body = new URLSearchParams({
      MerchantId: getRequiredEnv('VAKIFBANK_MERCHANT_ID'),
      MerchantPassword: getRequiredEnv('VAKIFBANK_MERCHANT_PASSWORD'),
      VerifyEnrollmentRequestId: args.reservationId,
      Pan: args.input.card.pan.replace(/\D/g, ''),
      ExpiryDate: formatEnrollmentExpiry(args.input.card.expMonth, args.input.card.expYear),
      PurchaseAmount: formatAmount(args.amountCharged),
      Currency: VAKIFBANK_CURRENCY_CODE,
      BrandName: getBrandCode(args.cardBrand),
      SuccessUrl: args.callbackUrl,
      FailureUrl: args.callbackUrl,
      SessionInfo: args.reservationId,
    });

    // Timeout: banka cevap vermezse sonsuz beklemeyi önle (30s).
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);
    const startedAt = Date.now();

    let response: Response;
    try {
      response = await fetch(ENROLLMENT_ENDPOINTS[getVakifBankEnv()], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      // eslint-disable-next-line no-console
      console.error(
        `[vakifbank/enrollment] fetch HATA | ref=${args.reservationId} | süre=${Date.now() - startedAt}ms | ${msg}`,
      );
      throw new Error(`Enrollment bağlantı hatası: ${msg}`);
    } finally {
      clearTimeout(timeoutId);
    }

    const text = await response.text();
    const parsed = parseEnrollmentResponseXml(text);

    // eslint-disable-next-line no-console
    console.info(
      `[vakifbank/enrollment] cevap | ref=${args.reservationId} | HTTP=${response.status} | süre=${Date.now() - startedAt}ms | Status=${parsed.status} | errCode=${parsed.messageErrorCode ?? '-'} | errMsg=${parsed.messageErrorDescription ?? '-'} | acsUrl=${parsed.acsUrl ? 'VAR' : 'YOK'}`,
    );

    if (!response.ok) {
      throw new Error(`Enrollment HTTP ${response.status}: ${parsed.messageErrorDescription ?? text}`);
    }

    return parsed;
  }

  private async callVposreq(xml: string): Promise<ProvisionResponse> {
    const response = await fetch(VPOSREQ_ENDPOINTS[getVakifBankEnv()], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ prmtstr: xml }).toString(),
      cache: 'no-store',
    });

    const text = await response.text();
    const parsed = parseProvisionResponseXml(text);

    if (!response.ok) {
      throw new Error(`Vposreq HTTP ${response.status}: ${parsed.resultDetail ?? text}`);
    }

    return parsed;
  }

  private clearSensitiveCardData(reservationId: string): void {
    storeUpdate(reservationId, {
      encryptedCard: undefined,
    });
  }
}
