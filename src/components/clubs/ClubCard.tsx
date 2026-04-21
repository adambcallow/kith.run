"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { avatarFallbackColor } from "@/lib/utils";
import { clsx } from "clsx";
import type { RunClub } from "@/types/database";

interface ClubCardProps {
  club: RunClub;
  memberCount: number;
  isJoined: boolean;
  currentUserId: string;
}

export function ClubCard({
  club,
  memberCount,
  isJoined: initialJoined,
  currentUserId,
}: ClubCardProps) {
  const router = useRouter();
  const supabase = createClient();

  const [joined, setJoined] = useState(initialJoined);
  const [count, setCount] = useState(memberCount);
  const [loading, setLoading] = useState(false);

  const initial = club.name.charAt(0).toUpperCase();
  const fallbackBg = avatarFallbackColor(club.slug);

  async function handleToggle() {
    setLoading(true);

    if (joined) {
      // Optimistic
      setJoined(false);
      setCount((c) => Math.max(0, c - 1));

      const { error } = await supabase
        .from("run_club_members")
        .delete()
        .eq("club_id", club.id)
        .eq("user_id", currentUserId);

      if (error) {
        // Revert
        setJoined(true);
        setCount((c) => c + 1);
      }
    } else {
      // Optimistic
      setJoined(true);
      setCount((c) => c + 1);

      const { error } = await supabase
        .from("run_club_members")
        .insert({ club_id: club.id, user_id: currentUserId });

      if (error) {
        // Revert
        setJoined(false);
        setCount((c) => Math.max(0, c - 1));
      }
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-card p-4 border border-kith-gray-light shadow-card space-y-3">
      {/* Top row: Logo + info */}
      <div className="flex items-start gap-3">
        {/* Logo / initial */}
        <div className="shrink-0">
          {club.logo_url ? (
            <img
              src={club.logo_url}
              alt={club.name}
              loading="lazy"
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-white text-sm"
              style={{
                backgroundColor: fallbackBg,
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {initial}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm text-kith-text truncate">
            {club.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            {club.city && (
              <div className="flex items-center gap-1 text-kith-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3 h-3 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-body text-xs">{club.city}</span>
              </div>
            )}
            {club.brand && (
              <span className="bg-kith-surface text-kith-muted px-2 py-0.5 rounded-full text-[10px] font-body font-medium">
                {club.brand}
              </span>
            )}
          </div>
        </div>

        {/* Instagram link */}
        {club.instagram && (
          <a
            href={`https://instagram.com/${club.instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-kith-surface text-kith-muted hover:text-kith-text hover:bg-kith-gray-light/40 transition-colors"
            aria-label={`${club.name} on Instagram`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="font-body text-[11px] font-medium">
              @{club.instagram.replace(/^@/, "")}
            </span>
          </a>
        )}
      </div>

      {/* Member avatars + count row */}
      <div className="flex items-center gap-2">
        {count > 0 ? (
          <div className="flex items-center">
            {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "w-7 h-7 rounded-full bg-kith-surface border-2 border-white flex items-center justify-center",
                  i > 0 && "-ml-2"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-kith-muted"
                >
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 01.41-1.068A6.99 6.99 0 0110 11a6.99 6.99 0 016.126 2.425 1.23 1.23 0 01.41 1.068A1.5 1.5 0 0115.055 16H4.945a1.5 1.5 0 01-1.48-1.507z" />
                </svg>
              </div>
            ))}
            <span className="font-body text-xs text-kith-muted ml-2">
              {count} {count === 1 ? "runner" : "runners"}
            </span>
            {count > 3 && (
              <span className="font-body text-xs text-kith-muted ml-0.5">
                (+{count - 3} more)
              </span>
            )}
          </div>
        ) : (
          <span className="font-body text-xs text-kith-muted">
            Be the first to join this club
          </span>
        )}
      </div>

      {/* Join / Leave button — full width */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={clsx(
          "w-full py-2.5 rounded-pill text-sm font-body font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kith-orange/30",
          joined
            ? "border-2 border-green-500 text-green-600 bg-green-50 hover:bg-green-100"
            : "bg-kith-orange text-white hover:shadow-lg hover:shadow-kith-orange/25 hover:-translate-y-[0.5px]",
          loading ? "opacity-50 pointer-events-none" : ""
        )}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {joined ? "Leaving..." : "Joining..."}
          </span>
        ) : joined ? (
          <span className="inline-flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Joined
          </span>
        ) : (
          "Join Club"
        )}
      </button>
    </div>
  );
}
