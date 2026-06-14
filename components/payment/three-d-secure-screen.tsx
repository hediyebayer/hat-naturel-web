'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/reservation/availability';

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 180;

interface ThreeDSecureScreenProps {
  reservationId: string;
  amount: number;
  merchantName: string;
  maskedPhone: string;
  locale: string;
}

export function ThreeDSecureScreen({
  reservationId,
  amount,
  merchantName,
  maskedPhone,
  locale,
}: ThreeDSecureScreenProps): React.ReactElement {
  const t = useTranslations('payment.threeDS');
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [expired, setExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(OTP_LENGTH).fill(null));

  // Geri sayım
  useEffect(() => {
    if (expired) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [expired]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleResend = useCallback(() => {
    setExpired(false);
    setTimeLeft(COUNTDOWN_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError(null);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      // Handle paste
      if (value.length > 1) {
        const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
        const newOtp = Array(OTP_LENGTH).fill('');
        digits.split('').forEach((d, i) => { newOtp[i] = d; });
        setOtp(newOtp);
        const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
        setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
        return;
      }

      const digit = value.replace(/\D/g, '').slice(-1);
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const otpComplete = otp.every(Boolean) && otp.join('').length === OTP_LENGTH;
  const otpValue = otp.join('');

  const handleApprove = useCallback(async () => {
    if (!otpComplete || expired) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, otp: otpValue }),
      });

      const json = (await response.json()) as
        | { ok: true; status: 'success'; reservationId: string }
        | { ok: false; status: 'failed'; reason: string };

      if (json.ok && json.status === 'success') {
        router.push(
          `/${locale}/rezervasyon/odeme/sonuc?status=success&ref=${reservationId}`,
        );
      } else {
        router.push(
          `/${locale}/rezervasyon/odeme/sonuc?status=fail&ref=${reservationId}&reason=${
            (json as { ok: false; reason: string }).reason ?? 'invalid_otp'
          }`,
        );
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }, [otpComplete, expired, reservationId, otpValue, locale, router]);

  const handleCancel = useCallback(() => {
    router.push(
      `/${locale}/rezervasyon/odeme/sonuc?status=fail&ref=${reservationId}&reason=cancelled`,
    );
  }, [locale, reservationId, router]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-neutral-200">
      {/* DEMO filigranı */}
      <div
        className="pointer-events-none absolute right-4 top-4 select-none font-bold text-2xl text-red-300/70 rotate-12 z-10"
        aria-hidden="true"
      >
        DEMO
      </div>

      {/* Banka header */}
      <div className="bg-primary-700 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-accent" />
          <div>
            <p className="text-sm font-semibold tracking-wide">VakıfBank 3D Secure</p>
            <p className="text-xs text-primary-200/80">Güvenli Ödeme Doğrulaması</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {/* İşlem bilgisi */}
        <div className="mb-6 space-y-2 rounded-lg bg-neutral-50 p-4 text-sm ring-1 ring-neutral-100">
          <div className="flex justify-between">
            <span className="text-neutral-500">{t('merchant')}</span>
            <span className="font-medium text-neutral-800">{merchantName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">{t('amount')}</span>
            <span className="font-semibold text-primary-700">{formatPrice(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">{t('phoneMasked')}</span>
            <span className="font-medium text-neutral-800 tracking-wide">{maskedPhone}</span>
          </div>
        </div>

        {/* Talimat */}
        <p className="mb-6 text-center text-sm text-neutral-700 leading-relaxed">
          {t('intro')}
        </p>

        {/* OTP inputları */}
        <div
          role="group"
          aria-label="6 haneli doğrulama kodu"
          className="mb-4 flex justify-center gap-2 sm:gap-3"
        >
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={(e) => {
                e.preventDefault();
                handleOtpChange(idx, e.clipboardData.getData('text'));
              }}
              aria-label={`${idx + 1}. rakam`}
              disabled={expired || isLoading}
              className={cn(
                'h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-0 text-center text-lg font-bold tabular-nums text-neutral-900',
                'ring-1 ring-neutral-300 transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary-600',
                digit && 'bg-primary-50 ring-primary-400',
                !digit && 'bg-neutral-50',
                (expired || isLoading) && 'cursor-not-allowed opacity-60',
              )}
            />
          ))}
        </div>

        {/* Geri sayım / süre doldu */}
        <div className="mb-6 text-center">
          {!expired ? (
            <p
              className={cn(
                'text-sm font-medium tabular-nums',
                timeLeft <= 30 ? 'text-red-600' : 'text-neutral-500',
              )}
            >
              {t('expiresIn', { seconds: formatTime(timeLeft) })}
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-red-600">{t('expired')}</p>
              <button
                type="button"
                onClick={handleResend}
                className="text-sm font-medium text-primary-600 underline underline-offset-2 hover:text-primary-800"
              >
                {t('resend')}
              </button>
            </div>
          )}
        </div>

        {/* Hata */}
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200"
          >
            <AlertTriangle size={15} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Demo notu */}
        <div className="mb-5 rounded-lg bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-700 ring-1 ring-amber-200">
          <strong>DEMO:</strong> {t('demoNotice')}
        </div>

        {/* Butonlar */}
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            type="button"
            fullWidth
            size="md"
            onClick={handleApprove}
            disabled={!otpComplete || expired || isLoading}
            loading={isLoading}
          >
            {t('approve')}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
            size="md"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
}
