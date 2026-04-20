"use client";

import { RunCard } from "@/components/run/RunCard";
import Link from "next/link";
import type { Run, Profile, Reaction } from "@/types/database";

export interface FeedRun {
  run: Run;
  creator: Profile;
  participantCount: number;
  isJoined: boolean;
  reactions: Reaction[];
}

export interface FeedSection {
  label: string;
  runs: FeedRun[];
}

interface FeedListProps {
  sections: FeedSection[];
  currentUserId?: string;
  loading?: boolean;
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="bg-white border border-kith-gray-light rounded-card shadow-card p-4 space-y-3 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Avatar row */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-kith-surface" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded-full bg-kith-surface" />
          <div className="h-2.5 w-16 rounded-full bg-kith-surface" />
        </div>
        <div className="h-6 w-16 rounded-pill bg-kith-surface" />
      </div>
      {/* Location line */}
      <div className="h-2.5 w-32 rounded-full bg-kith-surface" />
      {/* Distance */}
      <div className="h-5 w-20 rounded-full bg-kith-surface" />
      {/* Bottom row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full bg-kith-surface border-2 border-white" />
          <div className="w-7 h-7 rounded-full bg-kith-surface border-2 border-white" />
        </div>
        <div className="h-9 w-20 rounded-pill bg-kith-surface" />
      </div>
    </div>
  );
}

export function FeedList({ sections, currentUserId, loading }: FeedListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonCard delay={0} />
        <SkeletonCard delay={75} />
        <SkeletonCard delay={150} />
      </div>
    );
  }

  const totalRuns = sections.reduce((sum, s) => sum + s.runs.length, 0);

  if (totalRuns === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5">
        <div className="w-24 h-24 bg-kith-surface rounded-full flex items-center justify-center">
          <span className="text-4xl animate-pulse">&#x1F3C3;</span>
        </div>
        <div className="space-y-2 text-center max-w-[260px]">
          <p className="font-display text-base font-bold text-kith-text">
            It&apos;s quiet out there...
          </p>
          <p className="font-body text-sm text-kith-muted leading-relaxed">
            Post a run and get your crew moving,{" "}
            <Link href="/crew" className="text-kith-orange hover:underline">or invite your crew</Link>.
          </p>
        </div>
      </div>
    );
  }

  // Global card index for staggered animation delay
  let cardIndex = 0;

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.label} className="space-y-3">
          <p className="font-body text-xs text-kith-muted uppercase tracking-wider">
            {section.label}
          </p>
          {section.runs.map((item) => {
            const idx = cardIndex++;
            return (
              <div
                key={item.run.id}
                className="animate-fade-in-up"
                style={{ "--stagger": `${idx * 60}ms` } as React.CSSProperties}
              >
                <RunCard
                  {...item}
                  currentUserId={currentUserId}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
