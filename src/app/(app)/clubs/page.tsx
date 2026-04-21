import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ClubCard } from "@/components/clubs/ClubCard";
import type { RunClub } from "@/types/database";

export default async function ClubsPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [clubsRes, membershipsRes, countsRes] = await Promise.all([
    supabase
      .from("run_clubs")
      .select("*")
      .eq("status", "approved")
      .order("name"),
    supabase
      .from("run_club_members")
      .select("club_id")
      .eq("user_id", user.id),
    supabase.from("run_club_members").select("club_id"),
  ]);

  const clubs: RunClub[] = clubsRes.data ?? [];
  const myClubIds = new Set(
    (membershipsRes.data ?? []).map((m) => m.club_id)
  );

  // Build member count map
  const memberCountMap: Record<string, number> = {};
  for (const row of countsRes.data ?? []) {
    memberCountMap[row.club_id] = (memberCountMap[row.club_id] ?? 0) + 1;
  }

  const showSearch = clubs.length >= 5;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display font-extrabold text-xl text-kith-text">
          Run Clubs
        </h1>
        <p className="font-body text-sm text-kith-muted mt-1">
          Find and join your local running community
        </p>
      </div>

      {/* Suggest CTA — featured card */}
      <Link href="/clubs/suggest" className="block group">
        <div className="relative overflow-hidden rounded-card p-5 bg-gradient-to-br from-kith-orange/[0.08] via-kith-orange/[0.04] to-kith-surface border-2 border-kith-orange/25 hover:border-kith-orange/40 hover:shadow-card-hover transition-all duration-200">
          {/* Decorative orange corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-kith-orange/[0.06] rounded-bl-[60px]" />

          <div className="relative flex items-start gap-4">
            <div className="shrink-0 w-11 h-11 rounded-full bg-kith-orange flex items-center justify-center shadow-lg shadow-kith-orange/20 group-hover:scale-105 transition-transform duration-200">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="10" y1="4" x2="10" y2="16" />
                <line x1="4" y1="10" x2="16" y2="10" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm text-kith-text">
                Suggest a club
              </p>
              <p className="font-body text-xs text-kith-muted mt-0.5 leading-relaxed">
                Help us build the running community in your city.
                Know a great run club? Let us know and we&apos;ll add it.
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-kith-orange shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform duration-200"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </Link>

      {/* Search input — only shown when 5+ clubs */}
      {showSearch && (
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-kith-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Search clubs..."
            className="w-full rounded-input border border-kith-gray-light bg-white py-2.5 pl-10 pr-4 font-body text-sm text-kith-text placeholder:text-kith-muted focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200"
          />
        </div>
      )}

      {/* Club list or empty state */}
      {clubs.length === 0 ? (
        <div className="bg-white rounded-card p-8 text-center flex flex-col items-center border border-kith-gray-light shadow-card">
          {/* Illustration: runners silhouette */}
          <div className="mb-5 relative">
            <svg
              width="120"
              height="80"
              viewBox="0 0 120 80"
              fill="none"
              className="animate-gentle-bounce"
            >
              {/* Ground line */}
              <line
                x1="10"
                y1="68"
                x2="110"
                y2="68"
                stroke="#BFCCD9"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />

              {/* Runner 1 (left) */}
              <circle cx="35" cy="28" r="7" fill="#F95E2E" opacity="0.2" />
              <circle cx="35" cy="28" r="5" fill="#F95E2E" opacity="0.4" />
              <path
                d="M35 35v12l-5 12M35 47l5 12M35 42l-7-3M35 42l7-3"
                stroke="#F95E2E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />

              {/* Runner 2 (center) */}
              <circle cx="60" cy="24" r="7" fill="#F95E2E" opacity="0.3" />
              <circle cx="60" cy="24" r="5" fill="#F95E2E" opacity="0.6" />
              <path
                d="M60 31v12l-5 12M60 43l5 12M60 38l-7-3M60 38l7-3"
                stroke="#F95E2E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />

              {/* Runner 3 (right) */}
              <circle cx="85" cy="28" r="7" fill="#F95E2E" opacity="0.2" />
              <circle cx="85" cy="28" r="5" fill="#F95E2E" opacity="0.4" />
              <path
                d="M85 35v12l-5 12M85 47l5 12M85 42l-7-3M85 42l7-3"
                stroke="#F95E2E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />

              {/* Connecting dots (community feel) */}
              <circle cx="47" cy="36" r="1.5" fill="#F95E2E" opacity="0.3" />
              <circle cx="73" cy="36" r="1.5" fill="#F95E2E" opacity="0.3" />
            </svg>
          </div>

          <h2 className="font-display font-extrabold text-lg text-kith-text mb-2">
            Run clubs are coming to Kith
          </h2>
          <p className="font-body text-sm text-kith-muted max-w-[280px] leading-relaxed mb-6">
            Know a great run club? Suggest it and help us build the community.
          </p>

          {/* Primary CTA */}
          <Link
            href="/clubs/suggest"
            className="inline-flex items-center justify-center w-full max-w-[260px] gap-2 px-6 py-3 rounded-pill bg-kith-orange text-white font-body font-semibold text-sm hover:shadow-lg hover:shadow-kith-orange/25 hover:-translate-y-[1px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kith-orange/30"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="10" y1="4" x2="10" y2="16" />
              <line x1="4" y1="10" x2="16" y2="10" />
            </svg>
            Suggest a club
          </Link>

          {/* Secondary text */}
          <p className="font-body text-xs text-kith-muted mt-4">
            We&apos;ll notify you when clubs go live in your area
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {clubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              memberCount={memberCountMap[club.id] ?? 0}
              isJoined={myClubIds.has(club.id)}
              currentUserId={user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
