interface ProfileStatsProps {
  runsPosted: number;
  runsJoined: number;
  crewSize: number;
  totalDistanceKm: number;
  streakWeeks: number;
  /** Optional: count of runs together with the viewing user */
  runsTogether?: number;
}

export function ProfileStats({
  runsPosted,
  runsJoined,
  crewSize,
  totalDistanceKm,
  streakWeeks,
  runsTogether,
}: ProfileStatsProps) {
  const formattedDistance =
    totalDistanceKm % 1 === 0
      ? totalDistanceKm.toString()
      : totalDistanceKm.toFixed(1);

  return (
    <div className="space-y-3">
      {/* Primary stats row */}
      <div className="bg-kith-surface rounded-card p-4">
        <div className="flex items-center justify-evenly">
          <StatCell value={runsPosted} label="Posted" />
          <Divider />
          <StatCell value={runsJoined} label="Joined" />
          <Divider />
          <StatCell value={crewSize} label="Crew" />
        </div>
      </div>

      {/* Secondary stats: distance, streak, and optionally runs together */}
      <div className="flex gap-3">
        {/* Total distance */}
        <div className="flex-1 bg-kith-surface rounded-card p-4 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-display font-bold text-2xl text-kith-text">
              {formattedDistance}
            </span>
            <span className="font-body text-xs text-kith-muted">km</span>
          </div>
          <p className="font-body text-xs text-kith-muted mt-1">
            Total distance
          </p>
        </div>

        {/* Streak */}
        <div className="flex-1 bg-kith-surface rounded-card p-4 text-center">
          {streakWeeks > 0 ? (
            <>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-kith-orange text-lg leading-none">
                  {"\uD83D\uDD25"}
                </span>
                <span className="font-display font-bold text-2xl text-kith-text">
                  {streakWeeks}
                </span>
                <span className="font-body text-xs text-kith-muted">
                  {streakWeeks === 1 ? "week" : "weeks"}
                </span>
              </div>
              <p className="font-body text-xs text-kith-muted mt-1">
                Weekly streak
              </p>
              <p className="font-body text-[10px] text-kith-muted/60 mt-0.5">
                Ran every week
              </p>
            </>
          ) : (
            <>
              <p className="font-display font-bold text-lg text-kith-muted">
                --
              </p>
              <p className="font-body text-xs text-kith-muted mt-1">
                Weekly streak
              </p>
              <p className="font-body text-[10px] text-kith-muted/60 mt-0.5">
                Post a run each week to start
              </p>
            </>
          )}
        </div>

        {/* Runs together (only shown if provided) */}
        {runsTogether !== undefined && (
          <div className="flex-1 bg-kith-surface rounded-card p-4 text-center">
            <p className="font-display font-bold text-2xl text-kith-text">
              {runsTogether}
            </p>
            <p className="font-body text-xs text-kith-muted mt-1">
              Runs together
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display font-bold text-xl text-kith-text">{value}</p>
      <p className="font-body text-xs text-kith-muted mt-0.5">{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-8 bg-kith-muted/20" />;
}
