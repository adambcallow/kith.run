import { formatDistance, formatRelativeRunTime } from "@/lib/utils";
import type { Run } from "@/types/database";
import Link from "next/link";
import { clsx } from "clsx";

interface RunCardCompactProps {
  run: Run;
}

export function RunCardCompact({ run }: RunCardCompactProps) {
  const isLive = run.is_live;
  const isCompleted = run.status === "completed";

  return (
    <Link href={`/run/${run.id}`} className="block">
      <div
        className={clsx(
          "run-card p-3 space-y-1 transition-shadow duration-200 hover:shadow-card-hover",
          isLive
            ? "border-l-4 border-l-kith-orange"
            : isCompleted
              ? "border-l-4 border-l-kith-gray-light"
              : "border-l-4 border-l-kith-muted"
        )}
      >
        <p className="font-body text-[11px] font-medium text-kith-muted uppercase tracking-wide">
          {formatRelativeRunTime(run.scheduled_at)}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="font-display text-sm font-bold text-kith-text">
            {formatDistance(run.distance_km)}
          </span>
          <span className="text-kith-gray-light text-xs">&middot;</span>
          <span className="font-body text-xs text-kith-muted truncate">
            {run.start_place}
          </span>
        </div>
      </div>
    </Link>
  );
}
