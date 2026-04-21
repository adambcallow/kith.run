"use client";

import { useMemo } from "react";
import { formatPace } from "@/lib/utils";

interface PaceSliderProps {
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  min?: number;
  max?: number;
}

// Generate pace options in 15-second increments
function generatePaceOptions(min: number, max: number): number[] {
  const options: number[] = [];
  for (let s = min; s <= max; s += 15) {
    options.push(s);
  }
  return options;
}

const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;

export function PaceSlider({
  minValue,
  maxValue,
  onChange,
  min = 180,
  max = 480,
}: PaceSliderProps) {
  const options = useMemo(() => generatePaceOptions(min, max), [min, max]);

  // Visual bar showing the selected range
  const range = max - min;
  const leftPct = ((minValue - min) / range) * 100;
  const rightPct = ((maxValue - min) / range) * 100;

  function handleMinChange(val: number) {
    const clamped = Math.min(val, maxValue - 15);
    onChange(clamped, maxValue);
  }

  function handleMaxChange(val: number) {
    const clamped = Math.max(val, minValue + 15);
    onChange(minValue, clamped);
  }

  return (
    <div className="space-y-3">
      <span className="font-body text-sm text-kith-text font-medium">
        Pace
      </span>

      {/* Select dropdowns */}
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <label className="font-body text-[10px] text-kith-muted uppercase tracking-wider">
            From
          </label>
          <select
            value={minValue}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="w-full appearance-none rounded-input border border-kith-gray-light bg-white py-3 px-4 pr-9 font-display font-bold text-base text-kith-text tabular-nums focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all"
            style={{
              backgroundImage: chevronSvg,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            {options.map((s) => (
              <option key={s} value={s} disabled={s >= maxValue}>
                {formatPace(s)}/km
              </option>
            ))}
          </select>
        </div>

        <span className="font-display font-bold text-lg text-kith-muted mt-5">
          &ndash;
        </span>

        <div className="flex-1 space-y-1">
          <label className="font-body text-[10px] text-kith-muted uppercase tracking-wider">
            To
          </label>
          <select
            value={maxValue}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="w-full appearance-none rounded-input border border-kith-gray-light bg-white py-3 px-4 pr-9 font-display font-bold text-base text-kith-text tabular-nums focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all"
            style={{
              backgroundImage: chevronSvg,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            {options.map((s) => (
              <option key={s} value={s} disabled={s <= minValue}>
                {formatPace(s)}/km
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual range bar */}
      <div className="relative h-2 rounded-full bg-kith-gray-light/40 overflow-hidden">
        <div
          className="absolute h-full rounded-full bg-kith-orange/60 transition-all duration-200"
          style={{
            left: `${leftPct}%`,
            width: `${rightPct - leftPct}%`,
          }}
        />
      </div>

      <p className="font-body text-xs text-kith-muted text-center">
        {formatPace(minValue)} &ndash; {formatPace(maxValue)} per km
      </p>
    </div>
  );
}
