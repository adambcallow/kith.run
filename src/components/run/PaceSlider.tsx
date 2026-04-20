"use client";

import { useState } from "react";
import { formatPace } from "@/lib/utils";

interface PaceSliderProps {
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  min?: number;
  max?: number;
}

export function PaceSlider({
  minValue,
  maxValue,
  onChange,
  min = 180,
  max = 480,
}: PaceSliderProps) {
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  function handleMinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.min(Number(e.target.value), localMax - 15);
    setLocalMin(val);
    onChange(val, localMax);
  }

  function handleMaxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.max(Number(e.target.value), localMin + 15);
    setLocalMax(val);
    onChange(localMin, val);
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between font-body text-sm">
        <span className="text-kith-text font-medium">Pace</span>
        <span className="text-kith-muted">
          {formatPace(localMin)} – {formatPace(localMax)}/km
        </span>
      </div>
      <div className="relative h-6">
        <input
          type="range"
          min={min}
          max={max}
          step={15}
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-1.5 appearance-none bg-kith-gray-light rounded-full top-1/2 -translate-y-1/2 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-kith-orange [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={15}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full h-1.5 appearance-none bg-transparent rounded-full top-1/2 -translate-y-1/2 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-kith-orange [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}
