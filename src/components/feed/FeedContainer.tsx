"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { FeedList } from "@/components/feed/FeedList";
import { FeedViewToggle } from "@/components/feed/FeedViewToggle";
import type { FeedSection, FeedRun } from "@/components/feed/FeedList";

const FeedMapView = dynamic(
  () => import("@/components/feed/FeedMapView").then((m) => m.FeedMapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-kith-surface rounded-card animate-pulse" style={{ height: "calc(100vh - 200px)" }} />
    ),
  }
);

type FeedView = "list" | "map";

const STORAGE_KEY = "kith-feed-view";

interface FeedContainerProps {
  sections: FeedSection[];
  currentUserId?: string;
}

function readSavedView(): FeedView {
  if (typeof window === "undefined") return "list";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "list" || stored === "map") return stored;
  } catch {
    // localStorage may be unavailable
  }
  return "list";
}

export function FeedContainer({ sections, currentUserId }: FeedContainerProps) {
  const [view, setView] = useState<FeedView>("list");
  const [mounted, setMounted] = useState(false);

  // Restore preference on mount
  useEffect(() => {
    setView(readSavedView());
    setMounted(true);
  }, []);

  const handleToggle = useCallback((next: FeedView) => {
    setView(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // noop
    }
  }, []);

  // Flatten all runs for the map view
  const allRuns: FeedRun[] = sections.flatMap((s) => s.runs);

  return (
    <div className="space-y-4">
      {/* Toggle row — right-aligned */}
      <div className="flex items-center justify-end">
        <FeedViewToggle view={view} onToggle={handleToggle} />
      </div>

      {/* Views with crossfade */}
      <div className="relative">
        {/* List view */}
        <div
          className="transition-opacity duration-300"
          style={{
            opacity: view === "list" ? 1 : 0,
            pointerEvents: view === "list" ? "auto" : "none",
            position: view === "list" ? "relative" : "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <FeedList
            sections={sections}
            currentUserId={currentUserId}
            loading={false}
          />
        </div>

        {/* Map view — only render once mounted (avoid SSR mismatch) */}
        {mounted && (
          <div
            className="transition-opacity duration-300"
            style={{
              opacity: view === "map" ? 1 : 0,
              pointerEvents: view === "map" ? "auto" : "none",
              position: view === "map" ? "relative" : "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <FeedMapView runs={allRuns} />
          </div>
        )}
      </div>
    </div>
  );
}
