"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { JoinButton } from "./JoinButton";
import { ReactionBar } from "./ReactionBar";
import { formatPaceRange, formatDistance, formatRelativeRunTime } from "@/lib/utils";
import type { Run, Profile, Reaction } from "@/types/database";
import Link from "next/link";

interface RunCardProps {
  run: Run;
  creator: Profile;
  participantCount: number;
  currentUserId?: string;
  isJoined: boolean;
  reactions?: Reaction[];
}

export function RunCard({
  run,
  creator,
  participantCount,
  currentUserId,
  isJoined,
  reactions,
}: RunCardProps) {
  const isCompleted = run.status === "completed";

  return (
    <Link href={`/run/${run.id}`} className="block">
      <div className="run-card p-4 space-y-3 transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3">
          <Avatar
            src={creator.avatar_url}
            username={creator.username}
            fullName={creator.full_name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="font-body font-medium text-sm text-kith-text truncate">
              {creator.full_name ?? creator.username}
            </p>
            <p className="font-body text-xs text-kith-muted">
              {run.start_place}
            </p>
          </div>
          {run.is_live && <Badge variant="live">Going now</Badge>}
          {!run.is_live && run.visibility === "public" && (
            <Badge variant="public">Public</Badge>
          )}
        </div>

        <p className="font-body text-xs text-kith-muted">
          {formatRelativeRunTime(run.scheduled_at)}
        </p>

        <div className="flex items-center gap-3 text-sm font-body">
          <span className="font-medium text-kith-text">
            {formatDistance(run.distance_km)}
          </span>
          {(run.pace_min_target || run.pace_max_target) && (
            <>
              <span className="text-kith-gray-light">&middot;</span>
              <span className="text-kith-muted">
                {formatPaceRange(run.pace_min_target, run.pace_max_target)}
              </span>
            </>
          )}
        </div>

        {run.note && (
          <p className="font-body text-sm text-kith-text">{run.note}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {participantCount > 0 && (
              <span className="text-xs font-body text-kith-muted">
                +{participantCount} joining
              </span>
            )}
          </div>
          {!isCompleted && currentUserId && (
            <JoinButton
              runId={run.id}
              userId={currentUserId}
              isJoined={isJoined}
            />
          )}
        </div>

        {isCompleted && reactions && (
          <ReactionBar
            runId={run.id}
            reactions={reactions}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </Link>
  );
}
