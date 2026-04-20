"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { avatarFallbackColor } from "@/lib/utils";
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
    <div className="bg-white rounded-card p-4 flex items-center gap-3 border border-kith-gray-light shadow-card">
      {/* Logo / initial */}
      <div className="shrink-0">
        {club.logo_url ? (
          <img
            src={club.logo_url}
            alt={club.name}
            loading="lazy"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-white text-sm"
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
        <p className="font-body text-sm font-medium text-kith-text truncate">
          {club.name}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {club.city && (
            <span className="font-body text-xs text-kith-muted">
              {club.city}
            </span>
          )}
          {club.city && count > 0 && (
            <span className="text-kith-gray-light text-xs select-none">
              &middot;
            </span>
          )}
          <span className="font-body text-xs text-kith-muted">
            {count} {count === 1 ? "runner" : "runners"}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {club.brand && (
            <span className="bg-kith-surface text-kith-muted px-2 py-0.5 rounded-full text-[10px] font-body">
              {club.brand}
            </span>
          )}
          {club.instagram && (
            <a
              href={`https://instagram.com/${club.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-kith-muted hover:text-kith-text transition-colors"
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
            </a>
          )}
        </div>
      </div>

      {/* Join / Leave */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`shrink-0 px-4 py-1.5 rounded-pill text-xs font-body font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kith-orange/30 ${
          joined
            ? "border border-green-500 text-green-600 bg-green-50 hover:bg-green-100"
            : "bg-kith-orange text-white hover:shadow-lg hover:shadow-kith-orange/25 hover:-translate-y-[0.5px]"
        } ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        {joined ? "Joined" : "Join"}
      </button>
    </div>
  );
}
