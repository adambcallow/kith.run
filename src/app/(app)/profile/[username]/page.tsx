import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { BadgeGrid } from "@/components/profile/BadgeGrid";
import { CrewButton } from "@/components/profile/CrewButton";
import { RunCardCompact } from "@/components/run/RunCardCompact";
import { Badge } from "@/components/ui/Badge";
import { fetchBadgeStats } from "@/lib/badges-server";

function formatMemberSince(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (!profile) notFound();

  // Fetch badge stats and basic counts in parallel
  const [
    badgeStats,
    { count: runCount },
    { count: joinedCount },
    { count: crewSize },
    { data: createdRunsForDistance },
    { data: joinedParticipants },
    { data: upcomingRuns },
    { data: clubMemberships },
  ] = await Promise.all([
    fetchBadgeStats(supabase, profile.id),
    supabase
      .from("runs")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", profile.id),
    supabase
      .from("run_participants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id),
    supabase
      .from("friendships")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted")
      .or(`user_a.eq.${profile.id},user_b.eq.${profile.id}`),
    // Distance from created runs
    supabase
      .from("runs")
      .select("distance_km")
      .eq("creator_id", profile.id),
    // Joined run IDs for distance
    supabase
      .from("run_participants")
      .select("run_id")
      .eq("user_id", profile.id),
    // Upcoming runs
    supabase
      .from("runs")
      .select("*")
      .eq("creator_id", profile.id)
      .eq("status", "upcoming")
      .order("scheduled_at", { ascending: true })
      .limit(6),
    // Run clubs
    supabase
      .from("run_club_members")
      .select("club_id, run_clubs!club_id(id, name, logo_url, status)")
      .eq("user_id", profile.id),
  ]);

  // Total distance: created + joined
  const createdDistance = (createdRunsForDistance ?? []).reduce(
    (sum, r) => sum + (r.distance_km ?? 0),
    0
  );
  let joinedDistance = 0;
  if (joinedParticipants && joinedParticipants.length > 0) {
    const runIds = joinedParticipants.map((p) => p.run_id);
    const { data: joinedRunDetails } = await supabase
      .from("runs")
      .select("distance_km")
      .in("id", runIds);
    joinedDistance = (joinedRunDetails ?? []).reduce(
      (sum, r) => sum + (r.distance_km ?? 0),
      0
    );
  }
  const totalDistanceKm =
    Math.round((createdDistance + joinedDistance) * 10) / 10;

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

  // Friendship status
  let friendStatus: "none" | "pending" | "accepted" = "none";
  if (user && user.id !== profile.id) {
    const { data: friendship } = await supabase
      .from("friendships")
      .select("status")
      .or(
        `and(user_a.eq.${user.id},user_b.eq.${profile.id}),and(user_a.eq.${profile.id},user_b.eq.${user.id})`
      )
      .maybeSingle();

    if (friendship) {
      friendStatus = friendship.status as "pending" | "accepted";
    }
  }

  // "Runs together" count: only if viewer is in their crew
  let runsTogether: number | undefined;
  if (user && friendStatus === "accepted") {
    // Find runs where BOTH users are participants (or one created it and the other joined)
    // Strategy: get all run_ids for both users, then count the intersection
    const [{ data: viewerParticipations }, { data: profileParticipations }] =
      await Promise.all([
        supabase
          .from("run_participants")
          .select("run_id")
          .eq("user_id", user.id),
        supabase
          .from("run_participants")
          .select("run_id")
          .eq("user_id", profile.id),
      ]);

    if (viewerParticipations && profileParticipations) {
      const viewerRunIds = new Set(viewerParticipations.map((p) => p.run_id));
      runsTogether = profileParticipations.filter((p) =>
        viewerRunIds.has(p.run_id)
      ).length;
    }
  }

  const crewBadge =
    friendStatus === "accepted" ? (
      <Badge variant="joined" className="!text-xs">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M13.5 4.5L6.5 11.5L2.5 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        In your crew
      </Badge>
    ) : null;

  const displayName = profile.full_name ?? profile.username;

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        runCount={runCount ?? 0}
        joinedCount={joinedCount ?? 0}
        crewSize={crewSize ?? 0}
        badge={crewBadge}
        clubs={clubs}
      />

      {/* Member since */}
      <p className="text-center font-body text-xs text-kith-muted">
        Member since {formatMemberSince(profile.created_at)}
      </p>

      {user && user.id !== profile.id && (
        <div className="flex justify-center">
          <CrewButton
            currentUserId={user.id}
            profileUserId={profile.id}
            status={friendStatus}
          />
        </div>
      )}

      {/* Rich stats */}
      <ProfileStats
        runsPosted={runCount ?? 0}
        runsJoined={joinedCount ?? 0}
        crewSize={crewSize ?? 0}
        totalDistanceKm={totalDistanceKm}
        streakWeeks={0}
        runsTogether={runsTogether}
      />

      {/* Badges -- earned only for other users */}
      <BadgeGrid stats={badgeStats} earnedOnly />

      {/* Upcoming runs */}
      <div className="space-y-3">
        <h2 className="font-body text-xs text-kith-muted uppercase tracking-wider">
          Upcoming runs
        </h2>
        {upcomingRuns && upcomingRuns.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {upcomingRuns.map((run) => (
              <RunCardCompact key={run.id} run={run} />
            ))}
          </div>
        ) : (
          <div className="bg-kith-surface rounded-card p-8 text-center">
            <p className="font-body text-sm text-kith-muted">
              No upcoming runs from {displayName} yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
