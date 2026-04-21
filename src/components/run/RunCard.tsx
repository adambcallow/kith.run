"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { JoinButton } from "./JoinButton";
import { ReactionBar } from "./ReactionBar";
import { formatPaceRange, formatDistance, avatarFallbackColor } from "@/lib/utils";
import { ClientTime } from "@/components/ui/ClientTime";
import type { Run, Profile, Reaction } from "@/types/database";
import Link from "next/link";
import { clsx } from "clsx";
import { memo } from "react";

interface RunCardProps {
  run: Run;
  creator: Profile;
  participantCount: number;
  currentUserId?: string;
  isJoined: boolean;
  reactions?: Reaction[];
  runClub?: { name: string; logo_url: string | null } | null;
}

export const RunCard = memo(function RunCard({
  run,
  creator,
  participantCount,
  currentUserId,
  isJoined,
  reactions,
  runClub,
}: RunCardProps) {
  const isLive = run.is_live;
  const isCompleted = run.status === "completed";

  return (
    <Link href={`/run/${run.id}`} className="block">
      <div
        className={clsx(
          "run-card p-4 space-y-3 transition-shadow duration-200 hover:shadow-card-hover",
          isLive && "border-l-4 border-l-kith-orange bg-kith-orange/[0.02]",
          isCompleted && "opacity-75"
        )}
      >
        {/* Top row: Avatar + creator name + time badge */}
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
            <ClientTime dateStr={run.scheduled_at} className="font-body text-xs text-kith-muted" />
          </div>
          {isLive && <Badge variant="live">Going now</Badge>}
          {!isLive && run.visibility === "public" && (
            <Badge variant="public">Public</Badge>
          )}
        </div>

        {/* Title */}
        {run.title && (
          <p className="font-display font-semibold text-base text-kith-text">
            {run.title}
          </p>
        )}

        {/* Run club badge */}
        {runClub && (
          <div className="inline-flex items-center gap-1 bg-kith-surface rounded-full px-2 py-0.5">
            {runClub.logo_url ? (
              <img
                src={runClub.logo_url}
                alt={runClub.name}
                loading="lazy"
                className="w-3.5 h-3.5 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold text-white"
                style={{ backgroundColor: avatarFallbackColor(runClub.name) }}
              >
                {runClub.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-body font-medium text-kith-text">
              {runClub.name}
            </span>
          </div>
        )}

        {/* Location with pin icon */}
        <div className="flex items-center gap-1.5 text-kith-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-body text-xs truncate">{run.start_place}</span>
        </div>

        {/* Distance and pace — prominent typography */}
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-kith-text">
            {formatDistance(run.distance_km)}
          </span>
          {(run.pace_min_target || run.pace_max_target) && (
            <>
              <span className="text-kith-gray-light text-sm">&middot;</span>
              <span className="font-body text-sm text-kith-muted">
                {formatPaceRange(run.pace_min_target, run.pace_max_target)}
              </span>
            </>
          )}
        </div>

        {/* Note — muted italic */}
        {run.note && (
          <p className="font-body text-sm text-kith-muted italic leading-relaxed border-l-2 border-kith-orange/40 pl-3">
            &ldquo;{run.note}&rdquo;
          </p>
        )}

        {/* Bottom row: participant avatars + join button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            {/* Overlapping avatar stack — placeholder circles */}
            {participantCount === 0 && !isCompleted && (
              <span className="font-body text-xs text-kith-muted">Be the first to join</span>
            )}
            {participantCount > 0 && (
              <div className="flex items-center">
                {Array.from({ length: Math.min(participantCount, 3) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className={clsx(
                        "w-8 h-8 rounded-full bg-kith-surface border-2 border-white flex items-center justify-center",
                        i > 0 && "-ml-2"
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-kith-muted"
                      >
                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 01.41-1.068A6.99 6.99 0 0110 11a6.99 6.99 0 016.126 2.425 1.23 1.23 0 01.41 1.068A1.5 1.5 0 0115.055 16H4.945a1.5 1.5 0 01-1.48-1.507z" />
                      </svg>
                    </div>
                  )
                )}
                {participantCount > 3 && (
                  <span className="text-sm font-body font-medium text-kith-muted ml-1.5">
                    +{participantCount - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          {!isCompleted && currentUserId && (
            <JoinButton
              runId={run.id}
              userId={currentUserId}
              isJoined={isJoined}
              creatorId={run.creator_id}
            />
          )}
        </div>

        {/* Reactions for completed runs */}
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
});
