"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LiveRunBannerProps {
  runId: string;
  creatorName: string;
  place: string;
  scheduledAt?: string;
}

function formatTimeAgo(scheduledAt: string): string {
  const diff = Date.now() - new Date(scheduledAt).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

export function LiveRunBanner({
  runId,
  creatorName,
  place,
  scheduledAt,
}: LiveRunBannerProps) {
  const [timeAgo, setTimeAgo] = useState(
    scheduledAt ? formatTimeAgo(scheduledAt) : null
  );

  // Update the time-ago string every 30 seconds
  useEffect(() => {
    if (!scheduledAt) return;
    const timer = setInterval(() => {
      setTimeAgo(formatTimeAgo(scheduledAt));
    }, 30_000);
    return () => clearInterval(timer);
  }, [scheduledAt]);

  return (
    <Link href={`/run/${runId}`} className="block">
      <div className="relative overflow-hidden bg-white border border-kith-gray-light border-l-4 border-l-kith-orange rounded-card p-4 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-all duration-200">
        {/* Pulsing dot */}
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kith-orange opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-kith-orange" />
        </span>

        <div className="flex-1 min-w-0">
          <p className="font-body text-sm font-medium text-kith-text">
            {creatorName} is going now from {place}
          </p>
          {timeAgo && (
            <p className="font-body text-xs text-kith-muted mt-0.5">
              Started {timeAgo}
            </p>
          )}
        </div>

        {/* Arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-kith-muted shrink-0"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </Link>
  );
}
