'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DayPicker, type DateRange } from 'react-day-picker';
import { tr } from 'date-fns/locale';
import { format, differenceInCalendarDays, addDays, isBefore, startOfDay } from 'date-fns';
import { CalendarDays, Users, Search } from 'lucide-react';
import 'react-day-picker/dist/style.css';
import { RESERVATION_HREF } from '@/lib/constants';

interface ReservationBarProps {
  locale: string;
}

const MIN_NIGHTS = 1;
const MAX_GUESTS = 7;
const DEFAULT_GUESTS = 2;

/**
 * Ana sayfa rezervasyon barı.
 * Giriş tarihi, çıkış tarihi ve kişi sayısı seçimi.
 * Submit edince /rezervasyon sayfasına query param'larla yönlendirir.
 * (Müsaitlik & fiyat sorgusu sonraki adımda hatoperasyon API'sine bağlanacak)
 */
export function ReservationBar({ locale }: ReservationBarProps): React.ReactElement {
  const router = useRouter();
  const today = startOfDay(new Date());

  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<number>(DEFAULT_GUESTS);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Picker dışına tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nights =
    range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) : 0;

  const isValid = Boolean(range?.from && range?.to && nights >= MIN_NIGHTS);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!isValid || !range?.from || !range?.to) return;
    const params = new URLSearchParams({
      checkIn: format(range.from, 'yyyy-MM-dd'),
      checkOut: format(range.to, 'yyyy-MM-dd'),
      guests: String(guests),
    });
    router.push(`/${locale}${RESERVATION_HREF}?${params.toString()}`);
  }

  function formatDate(date: Date | undefined): string {
    if (!date) return '';
    return format(date, 'd MMM yyyy', { locale: tr });
  }

  return (
    <section
      className="relative z-20 -mt-28 px-3 pb-10 sm:-mt-20 sm:px-4 sm:pb-12 lg:-mt-28"
      aria-label="Rezervasyon Arama"
    >
      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white/95 p-1.5 shadow-2xl ring-1 ring-black/5 backdrop-blur sm:rounded-full sm:p-2"
        >
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-[1fr_1fr_auto_auto] sm:gap-1">
            {/* Tarih seçici (giriş + çıkış birlikte) */}
            <div ref={pickerRef} className="relative col-span-2 sm:col-span-2">
              <button
                type="button"
                onClick={() => setIsDatePickerOpen((v) => !v)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none sm:gap-3 sm:rounded-full sm:px-5 sm:py-2.5"
              >
                <CalendarDays
                  className="h-4 w-4 flex-shrink-0 text-primary-600 sm:h-5 sm:w-5"
                  aria-hidden
                />
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <div>
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-[10px]">
                      Giriş
                    </div>
                    <div className="text-xs font-medium text-neutral-900 sm:text-sm">
                      {range?.from ? formatDate(range.from) : 'Tarih seç'}
                    </div>
                  </div>
                  <div className="border-l border-neutral-200 pl-2">
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-[10px]">
                      Çıkış
                    </div>
                    <div className="text-xs font-medium text-neutral-900 sm:text-sm">
                      {range?.to ? formatDate(range.to) : 'Tarih seç'}
                    </div>
                  </div>
                </div>
              </button>

              {isDatePickerOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-x-auto rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/10 sm:left-auto sm:right-auto sm:w-auto sm:min-w-[640px] sm:overflow-hidden">
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={(r) => {
                      setRange(r);
                      if (r?.from && r?.to) {
                        setIsDatePickerOpen(false);
                      }
                    }}
                    locale={tr}
                    numberOfMonths={typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 2}
                    disabled={(date) => isBefore(date, today)}
                    defaultMonth={range?.from ?? today}
                    fromDate={today}
                    classNames={{
                      day_selected: 'rdp-day_selected bg-primary-600 text-white hover:bg-primary-700',
                      day_range_middle: 'rdp-day_range_middle bg-primary-100 text-primary-900',
                      day_range_start: 'rdp-day_range_start bg-primary-600 text-white',
                      day_range_end: 'rdp-day_range_end bg-primary-600 text-white',
                      day_today: 'rdp-day_today font-bold text-primary-600',
                    }}
                  />
                  <div className="flex items-center justify-between border-t border-neutral-100 px-2 pb-1 pt-3">
                    <button
                      type="button"
                      onClick={() => setRange(undefined)}
                      className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
                    >
                      Temizle
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!range?.from) {
                          setRange({ from: today, to: addDays(today, 1) });
                        }
                        setIsDatePickerOpen(false);
                      }}
                      className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
                    >
                      Tamam
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Kişi sayısı */}
            <div className="relative sm:min-w-[160px] sm:border-l sm:border-neutral-200">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-neutral-50 focus-within:bg-neutral-50 sm:gap-3 sm:rounded-full sm:px-5 sm:py-2.5">
                <Users
                  className="h-4 w-4 flex-shrink-0 text-primary-600 sm:h-5 sm:w-5"
                  aria-hidden
                />
                <div className="flex-1">
                  <label
                    htmlFor="guests"
                    className="block text-[9px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-[10px]"
                  >
                    Kişi
                  </label>
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="block w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-0 sm:text-sm"
                  >
                    {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n} kişi
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:rounded-full sm:px-7 sm:py-3 sm:text-sm"
            >
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
              <span className="sm:hidden">Sorgula</span>
              <span className="hidden sm:inline">Müsaitlik Sorgula</span>
            </button>
          </div>

          {nights > 0 && (
            <div className="mt-1.5 px-3 text-[11px] text-neutral-500 sm:mt-2 sm:px-5 sm:text-xs">
              {nights} gece konaklama
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
