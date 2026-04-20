"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

/* ── Styled loading placeholder ── */
function MapLoadingPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`bg-kith-surface rounded-card flex items-center justify-center ${className ?? "w-full h-[400px]"}`}
    >
      <div className="flex flex-col items-center gap-3 text-kith-muted">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-40"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
            fill="currentColor"
          />
        </svg>
        <span className="font-body text-xs tracking-wide">Loading map...</span>
      </div>
    </div>
  );
}

/* ── Dynamic imports with SSR disabled ── */

export const DynamicLeafletMap = dynamic(
  () => import("./LeafletMap").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => <MapLoadingPlaceholder />,
  }
);

export const DynamicStartPointMap = dynamic(
  () => import("./StartPointMap").then((mod) => mod.StartPointMap),
  {
    ssr: false,
    loading: () => <MapLoadingPlaceholder className="w-full h-48" />,
  }
);

export const DynamicFeedMap = dynamic(
  () => import("./FeedMap").then((mod) => mod.FeedMap),
  {
    ssr: false,
    loading: () => <MapLoadingPlaceholder className="w-full h-[50vh]" />,
  }
);

/* ── Re-export the RunMarker for convenience (used inside dynamic maps) ── */
export const DynamicRunMarker = dynamic(
  () => import("./RunMarker").then((mod) => mod.RunMarker),
  { ssr: false }
);

/* ── Export type helpers ── */
export type LeafletMapProps = ComponentProps<typeof DynamicLeafletMap>;
export type StartPointMapProps = ComponentProps<typeof DynamicStartPointMap>;
