"use client";

import { useState } from "react";
import { formatPace } from "@/lib/utils";

export interface IntervalSegment {
  distanceKm: number;
  paceSeconds: number;
}

interface IntervalBuilderProps {
  intervals: IntervalSegment[];
  onChange: (intervals: IntervalSegment[]) => void;
  totalDistanceKm: number;
}

function parsePaceInput(value: string): number | null {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const mins = parseInt(match[1], 10);
  const secs = parseInt(match[2], 10);
  if (secs >= 60) return null;
  return mins * 60 + secs;
}

function formatPaceForInput(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function IntervalBuilder({
  intervals,
  onChange,
  totalDistanceKm,
}: IntervalBuilderProps) {
  const [paceInputs, setPaceInputs] = useState<string[]>(
    intervals.map((s) => formatPaceForInput(s.paceSeconds))
  );

  const totalSegmentDistance = intervals.reduce(
    (sum, s) => sum + s.distanceKm,
    0
  );
  const roundedTotal = Math.round(totalSegmentDistance * 10) / 10;
  const distanceMismatch =
    Math.abs(roundedTotal - totalDistanceKm) > 0.05;

  function updateSegment(
    index: number,
    field: "distanceKm" | "paceSeconds",
    value: number
  ) {
    const next = intervals.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onChange(next);
  }

  function addSegment() {
    const defaultPace = intervals.length > 0 ? intervals[intervals.length - 1].paceSeconds : 300;
    onChange([...intervals, { distanceKm: 1, paceSeconds: defaultPace }]);
    setPaceInputs((prev) => [...prev, formatPaceForInput(defaultPace)]);
  }

  function removeSegment(index: number) {
    if (intervals.length <= 1) return;
    onChange(intervals.filter((_, i) => i !== index));
    setPaceInputs((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePaceChange(index: number, value: string) {
    const next = [...paceInputs];
    next[index] = value;
    setPaceInputs(next);

    const parsed = parsePaceInput(value);
    if (parsed !== null && parsed > 0) {
      updateSegment(index, "paceSeconds", parsed);
    }
  }

  function handlePaceBlur(index: number) {
    const parsed = parsePaceInput(paceInputs[index]);
    if (parsed !== null && parsed > 0) {
      const next = [...paceInputs];
      next[index] = formatPaceForInput(parsed);
      setPaceInputs(next);
    } else {
      // Reset to the current value
      const next = [...paceInputs];
      next[index] = formatPaceForInput(intervals[index].paceSeconds);
      setPaceInputs(next);
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-body font-medium text-kith-text">
        Interval splits
      </label>

      <div className="space-y-2">
        {intervals.map((segment, index) => (
          <div
            key={index}
            className="animate-fade-in-up rounded-card bg-kith-surface p-3 flex items-center gap-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Segment label */}
            <span className="text-xs font-body text-kith-muted w-5 shrink-0 tabular-nums">
              {index + 1}.
            </span>

            {/* Distance input */}
            <input
              type="number"
              step={0.5}
              min={0.5}
              value={segment.distanceKm}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                  updateSegment(index, "distanceKm", val);
                }
              }}
              className="w-16 sm:w-20 rounded-input border border-kith-gray-light bg-white py-2 px-3 font-body text-sm text-kith-text text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200"
              aria-label={`Segment ${index + 1} distance`}
            />
            <span className="text-xs font-body text-kith-muted shrink-0">
              km
            </span>

            {/* Pace separator */}
            <span className="text-xs font-body text-kith-muted shrink-0 ml-1">
              at
            </span>

            {/* Pace input */}
            <input
              type="text"
              inputMode="numeric"
              placeholder="5:00"
              value={paceInputs[index] ?? ""}
              onChange={(e) => handlePaceChange(index, e.target.value)}
              onBlur={() => handlePaceBlur(index)}
              className="w-14 sm:w-[4.5rem] rounded-input border border-kith-gray-light bg-white py-2 px-3 font-body text-sm text-kith-text text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200"
              aria-label={`Segment ${index + 1} pace`}
            />
            <span className="text-xs font-body text-kith-muted shrink-0">
              /km
            </span>

            {/* Remove button */}
            {intervals.length > 1 && (
              <button
                type="button"
                onClick={() => removeSegment(index)}
                className="ml-auto w-8 h-8 flex items-center justify-center rounded-full text-kith-muted hover:text-red-500 hover:bg-red-50 transition-colors duration-150 shrink-0"
                aria-label={`Remove segment ${index + 1}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add segment button */}
      <button
        type="button"
        onClick={addSegment}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-input text-sm font-body font-medium text-kith-muted hover:text-kith-text hover:bg-kith-surface transition-colors duration-150"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 2.5V11.5M2.5 7H11.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Add segment
      </button>

      {/* Summary */}
      <div className="flex items-baseline gap-2 pt-1">
        <span className="font-body text-sm font-semibold text-kith-text">
          Total: {roundedTotal} km
        </span>
        {distanceMismatch && (
          <span className="font-body text-xs text-kith-orange">
            (run is {totalDistanceKm} km)
          </span>
        )}
      </div>

      {/* Visual bar chart */}
      {intervals.length > 1 && totalSegmentDistance > 0 && (
        <div className="flex gap-0.5 h-8 rounded-input overflow-hidden">
          {intervals.map((segment, index) => {
            const widthPercent =
              (segment.distanceKm / totalSegmentDistance) * 100;
            // Vary opacity based on pace — faster pace = darker
            const allPaces = intervals.map((s) => s.paceSeconds);
            const minPace = Math.min(...allPaces);
            const maxPace = Math.max(...allPaces);
            const range = maxPace - minPace || 1;
            // Faster (lower seconds) = more opaque
            const opacity =
              0.3 + 0.7 * (1 - (segment.paceSeconds - minPace) / range);

            return (
              <div
                key={index}
                className="relative flex items-center justify-center overflow-hidden transition-all duration-300"
                style={{
                  width: `${Math.max(widthPercent, 8)}%`,
                  backgroundColor: `rgba(249, 94, 46, ${opacity})`,
                  borderRadius:
                    index === 0
                      ? "8px 2px 2px 8px"
                      : index === intervals.length - 1
                        ? "2px 8px 8px 2px"
                        : "2px",
                }}
                title={`${segment.distanceKm} km at ${formatPace(segment.paceSeconds)}/km`}
              >
                <span className="text-[10px] font-body font-medium text-white truncate px-1">
                  {formatPace(segment.paceSeconds)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
