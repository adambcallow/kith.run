"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { RunCardCompact } from "@/components/run/RunCardCompact";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { Run } from "@/types/database";

type Tab = "upcoming" | "completed";

interface RunTabsProps {
  upcomingRuns: Run[];
  completedRuns: Run[];
  /** Whether this is the current user's own profile (shows CTA to create a run) */
  isOwnProfile?: boolean;
  /** Display name for empty states on other profiles */
  displayName?: string;
}

export function RunTabs({
  upcomingRuns,
  completedRuns,
  isOwnProfile = false,
  displayName,
}: RunTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const runs = activeTab === "upcoming" ? upcomingRuns : completedRuns;

  return (
    <div className="space-y-4">
      {/* Segmented control */}
      <div className="flex items-center bg-kith-surface rounded-pill p-1">
        <TabButton
          label="Upcoming"
          active={activeTab === "upcoming"}
          count={upcomingRuns.length}
          onClick={() => setActiveTab("upcoming")}
        />
        <TabButton
          label="Completed"
          active={activeTab === "completed"}
          count={completedRuns.length}
          onClick={() => setActiveTab("completed")}
        />
      </div>

      {/* Content */}
      {runs.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {runs.map((run) => (
            <RunCardCompact key={run.id} run={run} />
          ))}
        </div>
      ) : (
        <EmptyState
          tab={activeTab}
          isOwnProfile={isOwnProfile}
          displayName={displayName}
        />
      )}
    </div>
  );
}

function TabButton({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-pill font-body text-sm font-medium transition-all duration-200",
        active
          ? "bg-kith-black text-white shadow-sm"
          : "text-kith-muted hover:text-kith-text"
      )}
    >
      {label}
      {count > 0 && (
        <span
          className={clsx(
            "font-display text-xs tabular-nums",
            active ? "text-white/70" : "text-kith-muted"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyState({
  tab,
  isOwnProfile,
  displayName,
}: {
  tab: Tab;
  isOwnProfile: boolean;
  displayName?: string;
}) {
  if (tab === "upcoming") {
    return (
      <div className="bg-kith-surface rounded-card p-8 text-center">
        <p className="font-body text-sm text-kith-muted mb-3">
          {isOwnProfile
            ? "No upcoming runs on your calendar."
            : `No upcoming runs from ${displayName ?? "this runner"} yet.`}
        </p>
        {isOwnProfile && (
          <Link href="/run/new">
            <Button variant="secondary" className="text-xs">
              Plan a run
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-kith-surface rounded-card p-8 text-center">
      <p className="font-body text-sm text-kith-muted">
        {isOwnProfile
          ? "Completed runs will show up here. Get out there!"
          : `No completed runs from ${displayName ?? "this runner"} yet.`}
      </p>
    </div>
  );
}
