import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  VakifBankProvider,
  buildVposXml,
  parseEnrollmentResponseXml,
  parseProvisionResponseXml,
} from '@/lib/payment/vakifbank-provider';
import { storeGet } from '@/lib/payment/store';
import type { InitiateInput } from '@/lib/payment/types';

const futureYY = (new Date().getFullYear() + 5) % 100;
const originalEnv = { ...process.env };
const originalFetch = global.fetch;

const validInitiateInput: InitiateInput = {
  order: {
    roomSlug: 'ucgen-1-1',
    roomName: '1+1 Üçgen Bungalov',
    checkIn: '2027-03-10',
    checkOut: '2027-03-13',
    guests: 2,
    nights: 3,
    totalPrice: 15000,
    depositAmount: 4500,
    depositMode: 'full',
  },
  guest: {
    firstName: 'Ayşe',
    lastName: 'Kaya',
    idType: 'tc',
    idNumber: '12345678901',
    email: 'ayse@example.com',
    phone: '+905001234567',
    address: 'Test Sokağı No:1',
    city: 'İstanbul',
    district: 'Beşiktaş',
  },
  card: {
    pan: '4111111111111111',
    expMonth: 12,
    expYear: futureYY,
    cvv: '123',
    holder: 'AYSE KAYA',
  },
  consents: {
    kvkk: true,
    distance: true,
  },
  depositMode: 'full',
  locale: 'tr',
};

describe('VakifBankProvider helperları', () => {
  beforeEach(() => {
    Reflect.deleteProperty(globalThis, '__hnPaymentStore');
    process.env = {
      ...originalEnv,
      VAKIFBANK_ENV: 'test',
      VAKIFBANK_MERCHANT_ID: '000000056376791',
      VAKIFBANK_TERMINAL_NO: 'V3761339',
      VAKIFBANK_MERCHANT_PASSWORD: 'secret-pass',
      SITE_URL: 'https://example.com',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, '__hnPaymentStore');
  });

  it('Enrollment XML cevabını doğru parse eder', () => {
    const parsed = parseEnrollmentResponseXml(`
      <IPaySecure>
        <Message>
          <VERes>
            <Status>Y</Status>
            <PaReq>PA-REQ-DATA</PaReq>
            <ACSUrl>https://acs.example.com</ACSUrl>
            <TermUrl>https://mpi.example.com/term</TermUrl>
            <MD>md-token</MD>
            <MessageErrorCode>200</MessageErrorCode>
          </VERes>
        </Message>
      </IPaySecure>
    `);

    expect(parsed).toEqual({
      status: 'Y',
      paReq: 'PA-REQ-DATA',
      acsUrl: 'https://acs.example.com',
      termUrl: 'https://mpi.example.com/term',
      md: 'md-token',
      messageErrorCode: '200',
      messageErrorDescription: undefined,
    });
  });

  it('Vpos XML gövdesini beklenen alanlarla üretir', () => {
    const xml = buildVposXml({
      reservationId: 'HN-11111111-1111-1111-1111-111111111111',
      amount: '10.50',
      pan: '4111111111111111',
      expiry: '203012',
      cvv: '123',
      cavv: 'cavv-data',
      eci: '05',
      mpiTransactionId: 'HN-11111111-1111-1111-1111-111111111111',
      orderId: 'HN-11111111-1111-1111-1111-111111111111',
      clientIp: '203.0.113.10',
    });

    expect(xml).toContain('<MerchantId>000000056376791</MerchantId>');
    expect(xml).toContain('<TerminalNo>V3761339</TerminalNo>');
    expect(xml).toContain('<TransactionType>Sale</TransactionType>');
    expect(xml).toContain('<CurrencyAmount>10.50</CurrencyAmount>');
    expect(xml).toContain('<Expiry>203012</Expiry>');
    expect(xml).toContain('<ECI>05</ECI>');
    expect(xml).toContain('<TransactionDeviceSource>0</TransactionDeviceSource>');
  });

  it('provizyon XML cevabını parse eder', () => {
    const parsed = parseProvisionResponseXml(`
      <VposResponse>
        <ResultCode>0000</ResultCode>
        <ResultDetail>Approved</ResultDetail>
        <AuthCode>123456</AuthCode>
        <Rrn>654321</Rrn>
        <TransactionId>tx-1</TransactionId>
      </VposResponse>
    `);

    expect(parsed).toEqual({
      resultCode: '0000',
      resultDetail: 'Approved',
      authCode: '123456',
      rrn: '654321',
      transactionId: 'tx-1',
      currencyAmount: undefined,
    });
  });
});

describe('VakifBankProvider', () => {
  beforeEach(() => {
    Reflect.deleteProperty(globalThis, '__hnPaymentStore');
    process.env = {
      ...originalEnv,
      VAKIFBANK_ENV: 'test',
      VAKIFBANK_MERCHANT_ID: '000000056376791',
      VAKIFBANK_TERMINAL_NO: 'V3761339',
      VAKIFBANK_MERCHANT_PASSWORD: 'secret-pass',
      SITE_URL: 'https://example.com',
      NEXT_PUBLIC_DEPOSIT_RATIO: '0.3',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, '__hnPaymentStore');
  });

  it('initiate enrollment sonrası ACS alanlarını ve şifreli kart kasasını store eder', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => `
        <IPaySecure>
          <Message>
            <VERes>
              <Status>Y</Status>
              <PaReq>PA-REQ-DATA</PaReq>
              <ACSUrl>https://acs.example.com</ACSUrl>
              <TermUrl>https://mpi.example.com/term</TermUrl>
              <MD>md-token</MD>
              <MessageErrorCode>200</MessageErrorCode>
            </VERes>
          </Message>
        </IPaySecure>
      `,
    }) as typeof fetch;

    const provider = new VakifBankProvider();
    const result = await provider.initiate(validInitiateInput);
    const record = storeGet(result.reservationId);

    expect(result.redirectUrl).toBe(`/${validInitiateInput.locale}/rezervasyon/odeme/3d-secure?ref=${result.reservationId}`);
    expect(record).toMatchObject({
      reservationId: result.reservationId,
      status: 'awaiting_3ds',
      acsUrl: 'https://acs.example.com',
      paReq: 'PA-REQ-DATA',
      md: 'md-token',
      termUrl: 'https://mpi.example.com/term',
    });
    expect(record?.encryptedCard).toBeDefined();
    const serializedRecord = JSON.stringify(record);
    expect(serializedRecord).not.toContain(validInitiateInput.card.pan);
    expect(serializedRecord).not.toContain(`\"pan\":\"${validInitiateInput.card.pan}\"`);
    expect(serializedRecord).not.toContain(`\"cvv\":\"${validInitiateInput.card.cvv}\"`);
  });

  it('callback provizyonu başarılıysa kaydı success yapar ve hassas kart verisini temizler', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        text: async () => `
          <IPaySecure>
            <Message>
              <VERes>
                <Status>Y</Status>
                <PaReq>PA-REQ-DATA</PaReq>
                <ACSUrl>https://acs.example.com</ACSUrl>
                <TermUrl>https://mpi.example.com/term</TermUrl>
                <MD>md-token</MD>
                <MessageErrorCode>200</MessageErrorCode>
              </VERes>
            </Message>
          </IPaySecure>
        `,
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => `
          <VposResponse>
            <ResultCode>0000</ResultCode>
            <ResultDetail>Approved</ResultDetail>
            <AuthCode>AUTH1</AuthCode>
            <Rrn>RRN1</Rrn>
            <TransactionId>TX1</TransactionId>
          </VposResponse>
        `,
      }) as typeof fetch;

    const provider = new VakifBankProvider();
    const initiated = await provider.initiate(validInitiateInput);

    const result = await provider.finalizeCallback({
      reservationId: initiated.reservationId,
      status: 'Y',
      cavv: 'cavv-data',
      eci: '05',
      mpiTransactionId: initiated.reservationId,
      clientIp: '203.0.113.10',
    });

    const record = storeGet(initiated.reservationId);

    expect(result).toEqual({
      ok: true,
      status: 'success',
      reservationId: initiated.reservationId,
    });
    expect(record).toMatchObject({
      status: 'success',
      authCode: 'AUTH1',
      rrn: 'RRN1',
      provisionResultCode: '0000',
      provisionTransactionId: 'TX1',
    });
    expect(record?.encryptedCard).toBeUndefined();
  });
});
