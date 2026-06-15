/**
 * Payment domain — temel tipler.
 * PAN/CVV asla bu tiplerde saklanmaz. Yalnızca masked PAN, last4 ve brand.
 */

export type PaymentStatus = 'pending' | 'awaiting_3ds' | 'success' | 'failed';

export type CardBrand = 'visa' | 'mastercard' | 'troy' | 'amex' | 'unknown';

export type DepositMode = 'full' | 'deposit';

export type IdType = 'tc' | 'passport';

// ---------------------------------------------------------------------------
// Guest / Order
// ---------------------------------------------------------------------------

export interface GuestInfo {
  firstName: string;
  lastName: string;
  idType: IdType;
  idNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
}

export interface OrderSummary {
  roomSlug: string;
  roomName: string;
  checkIn: string;  // yyyy-MM-dd
  checkOut: string; // yyyy-MM-dd
  guests: number;
  nights: number;
  totalPrice: number;
  depositAmount: number;
  depositMode: DepositMode;
}

// ---------------------------------------------------------------------------
// Card (masked — PAN asla saklanmaz)
// ---------------------------------------------------------------------------

export interface CardInfo {
  /** "411111______1111" formatında masked PAN */
  maskedPan: string;
  last4: string;
  brand: CardBrand;
  holder: string;
  expMonth: number;
  expYear: number;
}

// ---------------------------------------------------------------------------
// Payment Record (store'da tutulan kayıt)
// ---------------------------------------------------------------------------

export interface PaymentRecord {
  reservationId: string;
  status: PaymentStatus;
  guest: GuestInfo;
  order: OrderSummary;
  card: CardInfo;
  amountCharged: number;
  currency: 'TRY';
  createdAt: Date;
  verifyAttempts: number;
  paidAt?: Date;
  failReason?: 'invalid_otp' | 'expired' | 'cancelled';
}

// ---------------------------------------------------------------------------
// Provider input/output
// ---------------------------------------------------------------------------

/** initiate() için raw kart verisi — provider sınırından geçince imha edilir */
export interface RawCardInput {
  pan: string;
  expMonth: number;
  expYear: number;
  cvv: string;
  holder: string;
}

export interface InitiateInput {
  order: OrderSummary;
  guest: GuestInfo;
  card: RawCardInput;
  consents: { kvkk: true; distance: true };
  depositMode: DepositMode;
  /** Redirect URL'deki locale segmenti (default 'tr') */
  locale?: string;
}

export interface VerifyInput {
  reservationId: string;
  otp: string;
}

export interface InitiateResult {
  ok: true;
  reservationId: string;
  redirectUrl: string;
  amountCharged: number;
}

export type VerifyFailReason = 'invalid_otp' | 'expired' | 'cancelled';

export type VerifyResult =
  | { ok: true; status: 'success'; reservationId: string }
  | { ok: false; status: 'failed'; reservationId: string; reason: VerifyFailReason };
