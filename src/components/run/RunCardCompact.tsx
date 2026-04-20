import { formatDistance, formatRelativeRunTime } from "@/lib/utils";
import type { Run } from "@/types/database";
import Link from "next/link";

interface RunCardCompactProps {
  run: Run;
}

export function RunCardCompact({ run }: RunCardCompactProps) {
  return (
    <Link href={`/run/${run.id}`} className="block">
      <div className="run-card p-3 space-y-1">
        <p className="font-body text-xs text-kith-muted">
          {formatRelativeRunTime(run.scheduled_at)}
        </p>
        <p className="font-body text-sm font-medium text-kith-text">
          {formatDistance(run.distance_km)} &middot; {run.start_place}
        </p>
      </div>
    </Link>
  );
}
