"use client";

interface PbTimePickerProps {
  value: number | null;
  onChange: (seconds: number) => void;
  showHours: boolean;
}

export function PbTimePicker({ value, onChange, showHours }: PbTimePickerProps) {
  const totalSeconds = value ?? 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  function handleChange(part: "hours" | "minutes" | "seconds", val: number) {
    const h = part === "hours" ? val : hours;
    const m = part === "minutes" ? val : minutes;
    const s = part === "seconds" ? val : seconds;
    onChange((showHours ? h : 0) * 3600 + m * 60 + s);
  }

  const selectClass =
    "w-[72px] rounded-input border border-kith-gray-light bg-white py-3 px-2 font-display font-bold text-lg text-kith-text text-center tabular-nums appearance-none focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200 bg-[length:12px_12px] bg-[position:right_8px_center] bg-no-repeat";

  // Inline SVG chevron as a data URI for the custom dropdown arrow
  const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E")`;

  return (
    <div className="flex items-center gap-2">
      {showHours && (
        <>
          <div className="flex flex-col items-center">
            <select
              value={hours}
              onChange={(e) => handleChange("hours", Number(e.target.value))}
              className={selectClass}
              style={{ backgroundImage: chevronBg }}
              aria-label="Hours"
            >
              {Array.from({ length: 7 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-kith-muted font-body mt-1">
              hrs
            </span>
          </div>
          <span className="font-display font-bold text-xl text-kith-muted pb-4">
            :
          </span>
        </>
      )}

      <div className="flex flex-col items-center">
        <select
          value={minutes}
          onChange={(e) => handleChange("minutes", Number(e.target.value))}
          className={selectClass}
          style={{ backgroundImage: chevronBg }}
          aria-label="Minutes"
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {String(i).padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="text-[10px] text-kith-muted font-body mt-1">min</span>
      </div>

      <span className="font-display font-bold text-xl text-kith-muted pb-4">
        :
      </span>

      <div className="flex flex-col items-center">
        <select
          value={seconds}
          onChange={(e) => handleChange("seconds", Number(e.target.value))}
          className={selectClass}
          style={{ backgroundImage: chevronBg }}
          aria-label="Seconds"
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {String(i).padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="text-[10px] text-kith-muted font-body mt-1">sec</span>
      </div>
    </div>
  );
}
