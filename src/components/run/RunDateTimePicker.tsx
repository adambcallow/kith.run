"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface RunDateTimePickerProps {
  value: string;
  onChange: (isoString: string) => void;
  error?: string;
}

const HOURS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const MINUTES = [0, 15, 30, 45];

function formatHour12(h: number): string {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

function formatMinute(m: number): string {
  return m.toString().padStart(2, "0");
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

function getDayLabel(date: Date, today: Date): string {
  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, addDays(today, 1))) return "Tomorrow";
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}

function getFullDayName(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "long" });
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "long" });
}

export function RunDateTimePicker({
  value,
  onChange,
  error,
}: RunDateTimePickerProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => addDays(today, i));
  }, [today]);

  // Parse incoming value or set defaults
  const parsed = useMemo(() => {
    if (!value) return null;
    try {
      // Handle both ISO strings and datetime-local format (YYYY-MM-DDTHH:mm)
      const d = new Date(value);
      if (isNaN(d.getTime())) return null;
      return d;
    } catch {
      return null;
    }
  }, [value]);

  const [selectedDay, setSelectedDay] = useState<Date>(() => {
    if (parsed) {
      const d = new Date(parsed);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return today;
  });

  const [hour, setHour] = useState<number>(() => {
    if (parsed) return parsed.getHours();
    return 7;
  });

  const [minute, setMinute] = useState<number>(() => {
    if (parsed) {
      // Snap to nearest 15-minute increment
      const m = parsed.getMinutes();
      const snapped = MINUTES.reduce((prev, curr) =>
        Math.abs(curr - m) < Math.abs(prev - m) ? curr : prev
      );
      return snapped;
    }
    return 0;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync internal state when value prop changes externally
  useEffect(() => {
    if (!parsed) return;
    const d = new Date(parsed);
    d.setHours(0, 0, 0, 0);
    setSelectedDay(d);
    setHour(parsed.getHours());
    const m = parsed.getMinutes();
    const snapped = MINUTES.reduce((prev, curr) =>
      Math.abs(curr - m) < Math.abs(prev - m) ? curr : prev
    );
    setMinute(snapped);
  }, [parsed]);

  // Emit combined ISO string whenever day/hour/minute changes
  function emitChange(day: Date, h: number, m: number) {
    const combined = new Date(day);
    combined.setHours(h, m, 0, 0);
    // Emit in datetime-local format (YYYY-MM-DDTHH:mm) for compatibility
    const year = combined.getFullYear();
    const month = (combined.getMonth() + 1).toString().padStart(2, "0");
    const date = combined.getDate().toString().padStart(2, "0");
    const hours = combined.getHours().toString().padStart(2, "0");
    const mins = combined.getMinutes().toString().padStart(2, "0");
    onChange(`${year}-${month}-${date}T${hours}:${mins}`);
  }

  function handleDaySelect(day: Date) {
    setSelectedDay(day);
    emitChange(day, hour, minute);
  }

  function handleHourChange(h: number) {
    setHour(h);
    emitChange(selectedDay, h, minute);
  }

  function handleMinuteChange(m: number) {
    setMinute(m);
    emitChange(selectedDay, hour, m);
  }

  // Summary text
  const ampm = hour < 12 ? "AM" : "PM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const summaryText = `${getFullDayName(selectedDay)} ${selectedDay.getDate()} ${getMonthName(selectedDay)} at ${hour12}:${formatMinute(minute)} ${ampm}`;

  return (
    <div className="space-y-4">
      <label className="text-sm font-body font-medium text-kith-text block">
        Date & time
      </label>

      {/* Day chips */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide"
      >
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDay);
          const label = getDayLabel(day, today);
          const dateNum = day.getDate();

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDaySelect(day)}
              className={`min-w-[72px] py-2.5 px-3 rounded-pill text-center shrink-0 transition-all duration-150 active:scale-95 ${
                isSelected
                  ? "bg-kith-black text-white"
                  : "bg-white border border-kith-gray-light text-kith-text hover:border-kith-black/30"
              }`}
            >
              <span className="block text-xs font-body font-medium leading-tight">
                {label}
              </span>
              <span className="block text-base font-display font-bold leading-tight mt-0.5">
                {dateNum}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time selects */}
      <div className="flex items-center gap-2">
        {/* Hour select */}
        <div className="relative flex-1">
          <select
            value={hour}
            onChange={(e) => handleHourChange(Number(e.target.value))}
            className="w-full appearance-none rounded-input border border-kith-gray-light bg-white py-3 px-4 font-body text-base text-kith-text pr-8 focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {formatHour12(h)}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-kith-muted"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className="font-body text-xl text-kith-muted select-none">:</span>

        {/* Minute select */}
        <div className="relative flex-1">
          <select
            value={minute}
            onChange={(e) => handleMinuteChange(Number(e.target.value))}
            className="w-full appearance-none rounded-input border border-kith-gray-light bg-white py-3 px-4 font-body text-base text-kith-text pr-8 focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200"
          >
            {MINUTES.map((m) => (
              <option key={m} value={m}>
                {formatMinute(m)}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-kith-muted"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Summary line */}
      <p className="text-sm font-body text-kith-muted">{summaryText}</p>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 font-body">{error}</p>
      )}
    </div>
  );
}
