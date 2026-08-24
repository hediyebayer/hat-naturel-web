import { createHash } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  VakifBankProvider,
  buildVakifBankCallbackHash,
  buildVposXml,
  deriveEncryptionKey,
  parseCardEncryptionKey,
  parseEnrollmentResponseXml,
  parseProvisionResponseXml,
  verifyVakifBankCallbackHash,
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
      NODE_ENV: 'test',
      VAKIFBANK_ENV: 'test',
      VAKIFBANK_MERCHANT_ID: '000000056376791',
      VAKIFBANK_TERMINAL_NO: 'V3761339',
      VAKIFBANK_MERCHANT_PASSWORD: 'secret-pass',
      VAKIFBANK_STORE_KEY: 'store-key-123',
      VAKIFBANK_CALLBACK_HASH_REQUIRED: 'true',
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
      amount: '10.5',
      pan: '4111111111111111',
      expiry: '203012',
      cvv: '123',
      cavv: 'cavv-data',
      eci: '05',
      mpiTransactionId: 'HN-11111111-1111-1111-1111-111111111111',
      orderId: 'HN-11111111-1111-1111-1111-111111111111',
      clientIp: '203.0.113.10',
      holder: 'AYSE KAYA',
    });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<VposRequest>');
    expect(xml).toContain('<MerchantId>000000056376791</MerchantId>');
    expect(xml).toContain('<TerminalNo>V3761339</TerminalNo>');
    expect(xml).toContain('<TransactionType>Sale</TransactionType>');
    expect(xml).toContain('<CurrencyAmount>10.50</CurrencyAmount>');
    expect(xml).toContain('<ECI>05</ECI>');
    expect(xml).toContain('<CAVV>cavv-data</CAVV>');
    expect(xml).toContain('<MpiTransactionId>HN-11111111-1111-1111-1111-111111111111</MpiTransactionId>');
    expect(xml).toContain('<TransactionDeviceSource>0</TransactionDeviceSource>');
    expect(xml).toContain('<CardHoldersName>AYSE KAYA</CardHoldersName>');
    expect(xml).toContain('<Pan>4111111111111111</Pan>');
    expect(xml).toContain('<Expiry>203012</Expiry>');
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

  it('callback HashData doğrulamasını geçerli imzada kabul eder', () => {
    // VakıfBank/PayFlex 3DS callback'inin gerçekte gönderdiği alanlar (İnnova MPI).
    const fields = {
      MerchantId: '000000056376791',
      Xid: 'g23linxf3k0ipqf4xbe2',
      PurchAmount: '15000.00',
      PurchCurrency: '949',
      SessionInfo: 'HN-11111111-1111-1111-1111-111111111111',
      Status: 'Y',
      Eci: '05',
      Cavv: 'cavv-data',
    };
    // Default field-set'lerden biri: ['Xid', 'PurchAmount', 'SessionInfo', 'Status']
    const fieldSet = ['Xid', 'PurchAmount', 'SessionInfo', 'Status'] as const;
    const hash = buildVakifBankCallbackHash(fields, 'store-key-123', fieldSet);

    expect(hash).toBeTruthy();
    const result = verifyVakifBankCallbackHash({
      ...fields,
      Hash: hash!,
    });

    expect(result).toMatchObject({
      ok: true,
      required: true,
      mode: 'verified',
      matchedFieldSet: fieldSet,
    });
  });

  it('callback HashData doğrulamasını geçersiz imzada reddeder', () => {
    const result = verifyVakifBankCallbackHash({
      MerchantId: '000000056376791',
      Xid: 'g23linxf3k0ipqf4xbe2',
      PurchAmount: '15000.00',
      PurchCurrency: '949',
      SessionInfo: 'HN-11111111-1111-1111-1111-111111111111',
      Status: 'Y',
      Eci: '05',
      Cavv: 'cavv-data',
      Hash: 'invalid-hash',
    });

    expect(result).toMatchObject({
      ok: false,
      required: true,
      reason: 'hash_mismatch',
    });
  });

  it('CARD_ENCRYPTION_KEY varsa explicit base64 key kullanır', () => {
    const explicitKey = Buffer.alloc(32, 7).toString('base64');
    process.env.CARD_ENCRYPTION_KEY = explicitKey;

    expect(deriveEncryptionKey()).toEqual(Buffer.alloc(32, 7));
  });

  it('CARD_ENCRYPTION_KEY hex formatını parse eder', () => {
    const explicitKey = Buffer.alloc(32, 9).toString('hex');

    expect(parseCardEncryptionKey(explicitKey)).toEqual(Buffer.alloc(32, 9));
  });

  it('CARD_ENCRYPTION_KEY yoksa legacy türetmeye fallback eder', () => {
    delete process.env.CARD_ENCRYPTION_KEY;

    const expected = getLegacyKey();

    expect(deriveEncryptionKey()).toEqual(expected);
  });
});

function getLegacyKey(): Buffer {
  return createHash('sha256')
    .update('secret-pass|000000056376791|V3761339')
    .digest();
}

describe('VakifBankProvider', () => {
  beforeEach(() => {
    Reflect.deleteProperty(globalThis, '__hnPaymentStore');
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      VAKIFBANK_ENV: 'test',
      VAKIFBANK_MERCHANT_ID: '000000056376791',
      VAKIFBANK_TERMINAL_NO: 'V3761339',
      VAKIFBANK_MERCHANT_PASSWORD: 'secret-pass',
      VAKIFBANK_STORE_KEY: 'store-key-123',
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
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
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
    });
    global.fetch = fetchMock as typeof fetch;

    const provider = new VakifBankProvider();
    const result = await provider.initiate(validInitiateInput);
    const record = storeGet(result.reservationId);
    const enrollmentRequest = fetchMock.mock.calls[0];
    const enrollmentBody = new URLSearchParams(String(enrollmentRequest?.[1]?.body));

    expect(result.redirectUrl).toBe(`/${validInitiateInput.locale}/rezervasyon/odeme/3d-secure?ref=${result.reservationId}`);
    expect(record).toMatchObject({
      reservationId: result.reservationId,
      status: 'awaiting_3ds',
      acsUrl: 'https://acs.example.com',
      paReq: 'PA-REQ-DATA',
      md: 'md-token',
      termUrl: 'https://mpi.example.com/term',
    });
    expect(enrollmentBody.get('PurchaseAmount')).toBe('15000.00');
    expect(enrollmentBody.get('SuccessUrl')).toBe('https://example.com/api/payment/callback');
    expect(enrollmentBody.get('FailureUrl')).toBe('https://example.com/api/payment/callback');
    expect(record?.encryptedCard).toBeDefined();
    const serializedRecord = JSON.stringify(record);
    expect(serializedRecord).not.toContain(validInitiateInput.card.pan);
    expect(serializedRecord).not.toContain(`\"pan\":\"${validInitiateInput.card.pan}\"`);
    expect(serializedRecord).not.toContain(`\"cvv\":\"${validInitiateInput.card.cvv}\"`);
  });

  it('callback provizyonu başarılıysa kaydı success yapar ve hassas kart verisini temizler', async () => {
    const fetchMock = vi
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
      });
    global.fetch = fetchMock as typeof fetch;

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

    const provisionRequest = fetchMock.mock.calls[1]?.[1];
    const provisionXml = String(provisionRequest?.body ?? '');
    const record = storeGet(initiated.reservationId);

    expect(provisionRequest?.headers).toMatchObject({
      'Content-Type': 'text/xml; charset=utf-8',
    });
    expect(provisionXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(provisionXml).toContain('<CurrencyAmount>15000.00</CurrencyAmount>');
    expect(provisionXml).toContain(`<MpiTransactionId>${initiated.reservationId}</MpiTransactionId>`);
    expect(provisionXml).toContain('<CardHoldersName>AYSE KAYA</CardHoldersName>');

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

  it('verbose debug loglarında cavv tail veya raw callback dump basmaz', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const fetchMock = vi
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
      });
    global.fetch = fetchMock as typeof fetch;

    const provider = new VakifBankProvider();
    const initiated = await provider.initiate(validInitiateInput);

    await provider.finalizeCallback({
      reservationId: initiated.reservationId,
      status: 'Y',
      cavv: 'cavv-data',
      eci: '05',
      mpiTransactionId: initiated.reservationId,
      clientIp: '203.0.113.10',
    });

    const combinedLogs = infoSpy.mock.calls.flat().join(' ');
    expect(combinedLogs).not.toContain('cavvTail');
    expect(combinedLogs).not.toContain('callback-raw');
    expect(combinedLogs).not.toContain('/tmp/last-3ds-callback.json');
  });
});
