import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { BadgeGrid } from "@/components/profile/BadgeGrid";
import { RunTabs } from "./RunTabs";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { SignOutButton } from "./SignOutButton";
import { fetchBadgeStats } from "@/lib/badges-server";

function formatMemberSince(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/**
 * Compute a weekly running streak from the last 8 weeks.
 * Returns the number of consecutive weeks (ending at current or previous week)
 * that have at least one run.
 */
function computeWeekStreak(runDates: string[]): number {
  if (runDates.length === 0) return 0;

  function getWeekStart(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
  }

  const weeksWithRuns = new Set<string>();
  for (const dateStr of runDates) {
    weeksWithRuns.add(getWeekStart(new Date(dateStr)));
  }

  const now = new Date();
  let streak = 0;
  const checkDate = new Date(now);

  for (let i = 0; i < 8; i++) {
    const weekStart = getWeekStart(checkDate);
    if (weeksWithRuns.has(weekStart)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 7);
    } else if (i === 0) {
      // Current week has no run yet -- check from previous week
      checkDate.setDate(checkDate.getDate() - 7);
      continue;
    } else {
      break;
    }
  }

  return streak;
}

export default async function MyProfilePage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Fetch badge stats, counts, distance, streak, and runs in parallel
  const [
    badgeStats,
    { count: runCount },
    { count: joinedCount },
    { count: crewSize },
    { data: createdRunsForDistance },
    { data: joinedParticipants },
    { data: recentRunDates },
    { data: upcomingRuns },
    { data: completedRuns },
    { data: clubMemberships },
  ] = await Promise.all([
    fetchBadgeStats(supabase, user.id),
    supabase
      .from("runs")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", user.id),
    supabase
      .from("run_participants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("friendships")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted")
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`),
    // Distance from completed runs only (not upcoming/future)
    supabase
      .from("runs")
      .select("distance_km")
      .eq("creator_id", user.id)
      .eq("status", "completed"),
    // Joined completed runs with distance
    supabase
      .from("run_participants")
      .select("run_id, runs!run_id(distance_km, status)")
      .eq("user_id", user.id),
    // Last 8 weeks of runs for streak
    supabase
      .from("runs")
      .select("scheduled_at")
      .eq("creator_id", user.id)
      .gte(
        "scheduled_at",
        new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString()
      )
      .order("scheduled_at", { ascending: false }),
    // Upcoming runs
    supabase
      .from("runs")
      .select("*")
      .eq("creator_id", user.id)
      .eq("status", "upcoming")
      .order("scheduled_at", { ascending: true })
      .limit(6),
    // Completed runs
    supabase
      .from("runs")
      .select("*")
      .eq("creator_id", user.id)
      .eq("status", "completed")
      .order("scheduled_at", { ascending: false })
      .limit(10),
    // Run clubs
    supabase
      .from("run_club_members")
      .select("club_id, run_clubs!club_id(id, name, logo_url, status)")
      .eq("user_id", user.id),
  ]);

  // Total distance: created + joined (no extra query — data already joined)
  const createdDistance = (createdRunsForDistance ?? []).reduce(
    (sum, r) => sum + (r.distance_km ?? 0),
    0
  );
  const joinedDistance = (joinedParticipants ?? []).reduce(
    (sum, p) => {
      const run = (p as Record<string, unknown>).runs as { distance_km: number; status: string } | null;
      if (!run || run.status !== "completed") return sum;
      return sum + (run.distance_km ?? 0);
    },
    0
  );
  const totalDistanceKm =
    Math.round((createdDistance + joinedDistance) * 10) / 10;

  // Streak
  const streakWeeks = computeWeekStreak(
    (recentRunDates ?? []).map((r) => r.scheduled_at)
  );

  // Clubs — only approved ones
  const clubs = (clubMemberships ?? [])
    .map((m) => {
      const club = (m as Record<string, unknown>).run_clubs as {
        id: string;
        name: string;
        logo_url: string | null;
        status: string;
      } | null;
      return club;
    })
    .filter(
      (club): club is { id: string; name: string; logo_url: string | null; status: string } =>
        club !== null && club.status === "approved"
    );

  const isAdmin = user.email === "hello@adamcallow.com";

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        runCount={runCount ?? 0}
        joinedCount={joinedCount ?? 0}
        crewSize={crewSize ?? 0}
        clubs={clubs}
      />

      {/* Member since */}
      <p className="text-center font-body text-xs text-kith-muted">
        Member since {formatMemberSince(profile.created_at)}
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link href="/profile/edit">
          <Button variant="secondary">Edit profile</Button>
        </Link>
        <SignOutButton />
        {isAdmin && (
          <Link
            href="/admin"
            className="bg-kith-surface text-kith-text text-sm font-body font-medium rounded-pill px-4 py-2.5 min-h-[44px] border border-kith-gray-light hover:bg-kith-gray-light/50 transition-colors inline-flex items-center"
          >
            Admin
          </Link>
        )}
      </div>

      {/* Rich stats */}
      <ProfileStats
        runsPosted={runCount ?? 0}
        runsJoined={joinedCount ?? 0}
        crewSize={crewSize ?? 0}
        totalDistanceKm={totalDistanceKm}
        streakWeeks={streakWeeks}
      />

      {/* Badges */}
      <BadgeGrid stats={badgeStats} />

      {/* Tabbed runs */}
      <RunTabs
        upcomingRuns={upcomingRuns ?? []}
        completedRuns={completedRuns ?? []}
        isOwnProfile
      />
    </div>
  );
}
