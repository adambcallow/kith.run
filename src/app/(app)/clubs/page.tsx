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

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl text-kith-text">
        Run Clubs
      </h1>

      {/* Suggest CTA */}
      <Link href="/clubs/suggest" className="block">
        <div className="relative overflow-hidden rounded-card p-4 flex items-center gap-4 bg-gradient-to-r from-kith-orange/10 to-kith-surface border border-kith-orange/20 hover:shadow-card-hover transition-shadow">
          <div className="shrink-0 w-10 h-10 rounded-full bg-kith-orange flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="10" y1="4" x2="10" y2="16" />
              <line x1="4" y1="10" x2="16" y2="10" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm font-medium text-kith-text">
              Suggest a club
            </p>
            <p className="font-body text-xs text-kith-muted">
              Know a great run club? Let us know!
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-kith-muted shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </Link>

      {/* Club list */}
      {clubs.length === 0 ? (
        <div className="bg-kith-surface rounded-card p-8 text-center flex flex-col items-center">
          <svg
            width="64"
            height="40"
            viewBox="0 0 64 40"
            fill="none"
            className="mb-3 text-kith-muted/60"
          >
            <circle cx="32" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M18 36c0-7.732 6.268-14 14-14s14 6.268 14 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M28 14h8"
              stroke="#F95E2E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="2 3"
            />
          </svg>
          <p className="font-body text-sm text-kith-muted mb-1">
            No clubs yet.
          </p>
          <p className="font-body text-xs text-kith-muted">
            Be the first to suggest one!
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
