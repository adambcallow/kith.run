"use client";

import { clsx } from "clsx";

type FeedView = "list" | "map";

interface FeedViewToggleProps {
  view: FeedView;
  onToggle: (view: FeedView) => void;
}

export function FeedViewToggle({ view, onToggle }: FeedViewToggleProps) {
  return (
    <div className="inline-flex items-center bg-kith-surface rounded-pill p-1 gap-0.5">
      <button
        onClick={() => onToggle("list")}
        aria-label="List view"
        className={clsx(
          "flex items-center justify-center w-9 h-9 rounded-pill transition-all duration-200",
          view === "list"
            ? "bg-kith-black text-white shadow-sm"
            : "bg-transparent text-kith-muted hover:text-kith-text"
        )}
      >
        {/* List icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
      <button
        onClick={() => onToggle("map")}
        aria-label="Map view"
        className={clsx(
          "flex items-center justify-center w-9 h-9 rounded-pill transition-all duration-200",
          view === "map"
            ? "bg-kith-black text-white shadow-sm"
            : "bg-transparent text-kith-muted hover:text-kith-text"
        )}
      >
        {/* Map icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      </button>
    </div>
  );
}
