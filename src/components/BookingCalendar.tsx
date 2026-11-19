"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BOOKING_WINDOW, TIME_SLOTS } from "@/config/booking-form";

/**
 * Month grid + time slots for choosing an appointment.
 *
 * Dates are handled as plain "YYYY-MM-DD" strings throughout. Converting to
 * a Date and back via toISOString() would shift the day for anyone west of
 * UTC — a customer in London booking at 11pm would get the following day.
 */

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

interface Props {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function BookingCalendar({ date, time, onDateChange, onTimeChange }: Props) {
  const today = startOfToday();
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [taken, setTaken] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);

  // Which times are already booked on the chosen day
  useEffect(() => {
    if (!date) {
      setTaken([]);
      return;
    }
    let cancelled = false;
    setChecking(true);
    fetch(`/api/availability?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const busy: string[] = data.taken ?? [];
        setTaken(busy);
        // If the slot they'd already picked has since gone, clear it so they
        // can't submit a time that will be refused
        if (time && busy.includes(time)) onTimeChange("");
      })
      .catch(() => {
        // Availability is a convenience — the server checks again on submit
        if (!cancelled) setTaken([]);
      })
      .finally(() => !cancelled && setChecking(false));

    return () => {
      cancelled = true;
    };
    // `time` deliberately omitted: this should re-run when the day changes,
    // not every time they pick a different hour
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const year = view.getFullYear();
  const month = view.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  // getDay() is Sunday-first; the grid is Monday-first
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const earliest = new Date(today);
  earliest.setDate(earliest.getDate() + BOOKING_WINDOW.minDaysAhead);
  const latest = new Date(today);
  latest.setDate(latest.getDate() + BOOKING_WINDOW.maxDaysAhead);

  const isSelectable = (d: number) => {
    const candidate = new Date(year, month, d);
    if (candidate < earliest || candidate > latest) return false;
    return !BOOKING_WINDOW.closedWeekdays.includes(candidate.getDay());
  };

  const canGoBack = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoForward = new Date(year, month + 1, 1) <= latest;

  return (
    <div className="space-y-8">
      {/* Month navigation */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => canGoBack && setView(new Date(year, month - 1, 1))}
            disabled={!canGoBack}
            aria-label="Previous month"
            className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/60 hover:border-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-cinzel text-lg">
            {view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </span>
          <button
            type="button"
            onClick={() => canGoForward && setView(new Date(year, month + 1, 1))}
            disabled={!canGoForward}
            aria-label="Next month"
            className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/60 hover:border-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={i} className="text-center text-[10px] tracking-[0.15em] text-white/25 py-1">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const key = toKey(year, month, d);
            const selectable = isSelectable(d);
            const selected = date === key;
            return (
              <button
                key={key}
                type="button"
                disabled={!selectable}
                onClick={() => onDateChange(key)}
                className={`aspect-square min-h-[40px] text-sm border transition-all ${
                  selected
                    ? "border-gold bg-gold text-black"
                    : selectable
                      ? "border-white/10 text-white hover:border-white/50"
                      : "border-transparent text-white/15 cursor-not-allowed"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots — only once a date is chosen */}
      {date && (
        <div>
          <span className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-4">
            Choose a time
            {checking && <span className="text-white/25 normal-case tracking-normal"> — checking availability…</span>}
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isTaken = taken.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isTaken}
                  title={isTaken ? "Already booked" : undefined}
                  onClick={() => onTimeChange(slot)}
                  className={`py-3 min-h-[44px] text-sm border transition-all ${
                    isTaken
                      ? "border-white/5 text-white/15 line-through cursor-not-allowed"
                      : time === slot
                        ? "border-gold bg-gold text-black"
                        : "border-white/10 text-white hover:border-white/50"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {taken.length > 0 && taken.length < TIME_SLOTS.length && (
            <p className="text-[11px] text-white/30 mt-4">Crossed-out times are already booked.</p>
          )}
          {taken.length >= TIME_SLOTS.length && (
            <p className="text-[11px] text-gold/70 mt-4">
              This day is fully booked — please choose another.
            </p>
          )}
          <p className="text-[11px] text-white/30 mt-2 leading-relaxed">
            Times are provisional. We&apos;ll confirm your appointment by email within 24 hours.
          </p>
        </div>
      )}
    </div>
  );
}
