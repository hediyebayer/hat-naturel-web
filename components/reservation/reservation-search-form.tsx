'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { DayPicker, type DateRange } from 'react-day-picker';
import { tr, enUS, de, ru, ar, fr, es, it, type Locale as DateLocale } from 'date-fns/locale';

const DATE_FNS_LOCALES: Record<string, DateLocale> = { tr, en: enUS, de, ru, ar, fr, es, it };
import {
  format,
  parseISO,
  differenceInCalendarDays,
  isBefore,
  startOfDay,
  isValid,
} from 'date-fns';
import { CalendarDays, Users, Search } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface ReservationSearchFormProps {
  locale: string;
  defaultCheckIn?: string;  // yyyy-MM-dd
  defaultCheckOut?: string; // yyyy-MM-dd
  defaultGuests?: number;
}

const MAX_GUESTS = 7;

/**
 * Rezervasyon sayfasının üstündeki arama formu.
 * Bardakine benzer ama varsayılan değerler URL'den okunarak doldurulur.
 */
export function ReservationSearchForm({
  locale,
  defaultCheckIn,
  defaultCheckOut,
  defaultGuests = 2,
}: ReservationSearchFormProps): React.ReactElement {
  const router = useRouter();
  const today = startOfDay(new Date());

  const activeLocale = useLocale();
  const dateFnsLocale = DATE_FNS_LOCALES[activeLocale] ?? enUS;
  const t = useTranslations('reservation');
  const tReservation = t;

  const parseInitialDate = (s: string | undefined): Date | undefined => {
    if (!s) return undefined;
    const d = parseISO(s);
    return isValid(d) ? d : undefined;
  };

  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = parseInitialDate(defaultCheckIn);
    const to = parseInitialDate(defaultCheckOut);
    return from && to ? { from, to } : undefined;
  });
  const [guests, setGuests] = useState<number>(defaultGuests);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nights =
    range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) : 0;
  const isValidRange = nights >= 1;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!isValidRange || !range?.from || !range?.to) return;
    const params = new URLSearchParams({
      checkIn: format(range.from, 'yyyy-MM-dd'),
      checkOut: format(range.to, 'yyyy-MM-dd'),
      guests: String(guests),
    });
    router.push(`/${locale}/rezervasyon?${params.toString()}`);
  }

  function formatDate(date: Date | undefined): string {
    if (!date) return '';
    return format(date, 'd MMM yyyy', { locale: dateFnsLocale });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-3 shadow-md ring-1 ring-neutral-200 sm:p-4"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] sm:gap-3">
        <div ref={pickerRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left transition hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <CalendarDays
              className="h-5 w-5 flex-shrink-0 text-primary-600"
              aria-hidden
            />
            <div className="grid flex-1 grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  {t('checkInShort')}
                </div>
                <div className="text-sm font-medium text-neutral-900">
                  {range?.from ? formatDate(range.from) : t('pickDate')}
                </div>
              </div>
              <div className="border-l border-neutral-200 pl-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  {t('checkOutShort')}
                </div>
                <div className="text-sm font-medium text-neutral-900">
                  {range?.to ? formatDate(range.to) : t('pickDate')}
                </div>
              </div>
            </div>
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/10 sm:left-auto sm:right-auto sm:min-w-[640px]">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={(r) => {
                  setRange(r);
                  if (r?.from && r?.to) setIsOpen(false);
                }}
                locale={dateFnsLocale}
                numberOfMonths={2}
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
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 sm:min-w-[160px]">
          <Users
            className="h-5 w-5 flex-shrink-0 text-primary-600"
            aria-hidden
          />
          <div className="flex-1">
            <label
              htmlFor="search-guests"
              className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500"
            >
              {t('guestsLabel')}
            </label>
            <select
              id="search-guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="block w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-0"
            >
              {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {t('guestsSuffix')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValidRange}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search className="h-4 w-4" aria-hidden />
          {tReservation('updateBtn')}
        </button>
      </div>
    </form>
  );
}
