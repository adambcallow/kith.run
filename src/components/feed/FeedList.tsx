"use client";

import { RunCard } from "@/components/run/RunCard";
import type { Run, Profile, Reaction } from "@/types/database";

interface FeedRun {
  run: Run;
  creator: Profile;
  participantCount: number;
  isJoined: boolean;
  reactions: Reaction[];
}

interface FeedListProps {
  runs: FeedRun[];
  currentUserId?: string;
}

export function FeedList({ runs, currentUserId }: FeedListProps) {
  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 bg-kith-surface rounded-full flex items-center justify-center">
          <span className="text-2xl">&#x1F3C3;</span>
        </div>
        <p className="font-body text-sm text-kith-muted text-center">
          No runs yet — be the first to post one.
        </p>
      </div>
    );
  }

  const liveRuns = runs.filter((r) => r.run.is_live);
  const upcomingRuns = runs.filter(
    (r) => !r.run.is_live && r.run.status === "upcoming"
  );
  const completedRuns = runs.filter((r) => r.run.status === "completed");

  return (
    <div className="space-y-3">
      {liveRuns.length > 0 && (
        <div className="space-y-3">
          {liveRuns.map((item) => (
            <RunCard
              key={item.run.id}
              {...item}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {upcomingRuns.length > 0 && (
        <div className="space-y-3">
          {upcomingRuns.map((item) => (
            <RunCard
              key={item.run.id}
              {...item}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {completedRuns.length > 0 && (
        <div className="space-y-3">
          <p className="font-body text-xs text-kith-muted uppercase tracking-wider pt-4">
            Completed
          </p>
          {completedRuns.map((item) => (
            <RunCard
              key={item.run.id}
              {...item}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
