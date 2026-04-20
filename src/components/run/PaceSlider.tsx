"use client";

import { useState, useMemo } from "react";
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

  const trackStyle = useMemo(() => {
    const range = max - min;
    const leftPercent = ((localMin - min) / range) * 100;
    const rightPercent = ((localMax - min) / range) * 100;
    return {
      background: `linear-gradient(to right, #BFCCD9 ${leftPercent}%, #F95E2E ${leftPercent}%, #F95E2E ${rightPercent}%, #BFCCD9 ${rightPercent}%)`,
    };
  }, [localMin, localMax, min, max]);

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
      <div className="flex items-baseline justify-between">
        <span className="font-body text-sm text-kith-text font-medium">Pace</span>
        <span className="font-display text-base font-semibold text-kith-text">
          {formatPace(localMin)} – {formatPace(localMax)}
          <span className="text-kith-muted font-body text-xs font-normal ml-0.5">/km</span>
        </span>
      </div>
      <div className="relative h-12">
        {/* Track background with orange fill between thumbs */}
        <div
          className="absolute w-full h-[10px] rounded-full top-1/2 -translate-y-1/2"
          style={trackStyle}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={15}
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-[10px] appearance-none bg-transparent rounded-full top-1/2 -translate-y-1/2 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[2.5px] [&::-webkit-slider-thumb]:border-kith-orange [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-lg [&::-webkit-slider-thumb]:active:scale-110"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={15}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full h-[10px] appearance-none bg-transparent rounded-full top-1/2 -translate-y-1/2 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[2.5px] [&::-webkit-slider-thumb]:border-kith-orange [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-lg [&::-webkit-slider-thumb]:active:scale-110"
        />
      </div>
    </div>
  );
}
