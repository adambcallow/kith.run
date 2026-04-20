"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/Avatar";
import { CrewButton } from "@/components/profile/CrewButton";

type FriendStatus = "none" | "pending" | "accepted";

interface SearchResult {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface UserSearchProps {
  currentUserId: string;
}

export function UserSearch({ currentUserId }: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [statuses, setStatuses] = useState<Record<string, FriendStatus>>({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setStatuses({});
      setShowResults(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        // Search profiles
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .or(
            `username.ilike.%${query}%,full_name.ilike.%${query}%`
          )
          .neq("id", currentUserId)
          .limit(8);

        const found = (profiles ?? []) as SearchResult[];
        setResults(found);
        setShowResults(found.length > 0 || query.trim().length > 0);

        // Fetch friendship statuses for results
        if (found.length > 0) {
          const ids = found.map((p) => p.id);
          const { data: friendships } = await supabase
            .from("friendships")
            .select("user_a, user_b, status")
            .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`);

          const statusMap: Record<string, FriendStatus> = {};
          for (const id of ids) {
            const match = (friendships ?? []).find(
              (f) =>
                (f.user_a === currentUserId && f.user_b === id) ||
                (f.user_b === currentUserId && f.user_a === id)
            );
            if (match) {
              statusMap[id] = match.status as FriendStatus;
            } else {
              statusMap[id] = "none";
            }
          }
          setStatuses(statusMap);
        }
      } catch {
        // Silently handle errors
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, currentUserId, supabase]);

  return (
    <div ref={containerRef} className="relative">
      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-kith-muted pointer-events-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setShowResults(true);
          }}
          placeholder="Search by name or username..."
          autoComplete="off"
          className="w-full rounded-input border border-kith-gray-light bg-white py-3 pl-10 pr-4 font-body text-base text-kith-text placeholder:text-kith-muted focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-kith-orange border-t-transparent" />
          </span>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-white rounded-card border border-kith-gray-light shadow-card overflow-hidden">
          {results.length === 0 && !loading ? (
            <div className="p-4 text-center">
              <p className="font-body text-sm text-kith-muted">
                No runners found
              </p>
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto">
              {results.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center gap-3 p-3 hover:bg-kith-surface transition"
                >
                  <Link
                    href={`/profile/${profile.username}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                    onClick={() => setShowResults(false)}
                  >
                    <Avatar
                      src={profile.avatar_url}
                      username={profile.username}
                      fullName={profile.full_name}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-kith-text truncate">
                        {profile.full_name ?? profile.username}
                      </p>
                      <p className="font-body text-xs text-kith-muted">
                        @{profile.username}
                      </p>
                    </div>
                  </Link>
                  <CrewButton
                    currentUserId={currentUserId}
                    profileUserId={profile.id}
                    status={statuses[profile.id] ?? "none"}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
