"use client";

import { useState } from "react";
import { clsx } from "clsx";
import {
  ALL_BADGES,
  computeBadges,
  getBadgeProgress,
  type Badge,
  type UserBadgeStats,
} from "@/lib/badges";

interface BadgeGridProps {
  stats: UserBadgeStats;
  earnedOnly?: boolean;
}

export function BadgeGrid({ stats, earnedOnly = false }: BadgeGridProps) {
  const earned = computeBadges(stats);
  const earnedIds = new Set(earned.map((b) => b.id));

  const badgesToShow = earnedOnly
    ? ALL_BADGES.filter((b) => earnedIds.has(b.id))
    : ALL_BADGES;

  if (earnedOnly && earned.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider">
          Badges
        </h2>
        <div className="bg-kith-surface rounded-card p-6 text-center">
          <p className="font-body text-sm text-kith-muted">
            No badges earned yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider">
          Badges
        </h2>
        {!earnedOnly && (
          <span className="font-body text-xs font-semibold text-kith-orange">
            {earned.length}/{ALL_BADGES.length}
          </span>
        )}
      </div>

      <div
        className={clsx(
          "grid gap-3",
          earnedOnly ? "grid-cols-4 sm:grid-cols-5" : "grid-cols-3 sm:grid-cols-4"
        )}
      >
        {badgesToShow.map((badge) => (
          <BadgeTile
            key={badge.id}
            badge={badge}
            earned={earnedIds.has(badge.id)}
            stats={stats}
            compact={earnedOnly}
          />
        ))}
      </div>

      {!earnedOnly && (
        <p className="font-body text-[10px] text-kith-muted text-center">
          Tap a badge to see what it means
        </p>
      )}
    </div>
  );
}

interface BadgeTileProps {
  badge: Badge;
  earned: boolean;
  stats: UserBadgeStats;
  compact?: boolean;
}

function BadgeTile({ badge, earned, stats, compact = false }: BadgeTileProps) {
  const [flipped, setFlipped] = useState(false);

  const progress = getBadgeProgress(badge, stats);
  const progressRatio = Math.min(progress / badge.threshold, 1);

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="bg-kith-orange/10 border border-kith-orange/20 rounded-card cursor-pointer active:scale-95 transition-all duration-200 overflow-hidden"
      >
        {!flipped ? (
          <div className="flex flex-col items-center gap-1 p-2">
            <span className="text-xl leading-none select-none" role="img" aria-label={badge.name}>
              {badge.emoji}
            </span>
            <span className="font-body text-[10px] font-medium text-kith-text text-center leading-tight">
              {badge.name}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-2 min-h-[60px]">
            <p className="font-body text-[9px] text-kith-text text-center leading-snug">
              {badge.description}
            </p>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setFlipped(!flipped)}
      className={clsx(
        "rounded-card transition-all duration-200 cursor-pointer active:scale-95 overflow-hidden",
        earned
          ? "bg-kith-orange/10 border border-kith-orange/20"
          : "bg-kith-surface border border-kith-gray-light/40"
      )}
    >
      {!flipped ? (
        /* ── Front face ── */
        <div className="flex flex-col items-center gap-1.5 p-3">
          <span
            className={clsx(
              "text-2xl leading-none select-none transition-transform duration-300",
              !earned && "grayscale opacity-40"
            )}
            role="img"
            aria-label={badge.name}
          >
            {earned ? badge.emoji : "\u{1F512}"}
          </span>

          <span
            className={clsx(
              "font-body text-xs font-medium text-center leading-tight",
              earned ? "text-kith-text" : "text-kith-muted"
            )}
          >
            {badge.name}
          </span>

          {!earned && (
            <div className="w-full space-y-0.5">
              <div className="w-full h-1 rounded-full bg-kith-gray-light/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-kith-orange/50 transition-all duration-500"
                  style={{ width: `${progressRatio * 100}%` }}
                />
              </div>
              <p className="font-body text-[10px] text-kith-muted text-center tabular-nums">
                {typeof stats[badge.statKey] === "boolean"
                  ? badge.description
                  : `${progress}/${badge.threshold}`}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ── Back face (description) ── */
        <div className="flex flex-col items-center justify-center p-3 min-h-[88px]">
          <span className="text-lg leading-none mb-2">
            {earned ? badge.emoji : "\u{1F512}"}
          </span>
          <p
            className={clsx(
              "font-body text-[11px] text-center leading-snug",
              earned ? "text-kith-text" : "text-kith-muted"
            )}
          >
            {badge.description}
          </p>
          {earned && (
            <span className="mt-1.5 font-body text-[9px] text-kith-orange font-medium uppercase tracking-wider">
              Earned
            </span>
          )}
          <span className="mt-1 font-body text-[9px] text-kith-muted">
            Tap to flip back
          </span>
        </div>
      )}
    </button>
  );
}
