import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FeedContainer } from "@/components/feed/FeedContainer";
import { LiveRunBanner } from "@/components/feed/LiveRunBanner";
import Link from "next/link";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function FeedPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fortyEightHoursAgo = new Date(
    Date.now() - 48 * 60 * 60 * 1000
  ).toISOString();

  // Fetch all relevant runs in a single query — live, upcoming, or recently completed
  const { data: runs } = await supabase
    .from("runs")
    .select("id, creator_id, title, start_place, start_lat, start_lng, scheduled_at, distance_km, pace_min_target, pace_max_target, note, visibility, is_live, status, expires_at, strava_activity_id, route_geojson, created_at, profiles!creator_id(id, username, full_name, avatar_url)")
    .or(`visibility.eq.public,creator_id.eq.${user!.id}`)
    .or(
      `is_live.eq.true,status.eq.upcoming,and(status.eq.completed,scheduled_at.gte.${fortyEightHoursAgo})`
    )
    .order("scheduled_at", { ascending: true });

  const allRuns = runs ?? [];
  const runIds = allRuns.map((r) => r.id);

  // Bulk-fetch participants and reactions for all run IDs — no N+1
  const [participantsResult, reactionsResult, todayActivityResult] =
    await Promise.all([
      runIds.length > 0
        ? supabase
            .from("run_participants")
            .select("id, run_id, user_id")
            .in("run_id", runIds)
        : Promise.resolve({ data: [] as { id: string; run_id: string; user_id: string }[] }),
      runIds.length > 0
        ? supabase
            .from("reactions")
            .select("*")
            .in("run_id", runIds)
        : Promise.resolve({ data: [] as import("@/types/database").Reaction[] }),
      // Activity summary: how many people joined runs today
      supabase
        .from("run_participants")
        .select("*", { count: "exact", head: true })
        .gte("joined_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);

  const allParticipants = participantsResult.data ?? [];
  const allReactions = reactionsResult.data ?? [];
  const todayJoinCount = todayActivityResult.count ?? 0;

  // Group participants and reactions by run_id in maps for O(1) lookup
  const participantsByRun = new Map<
    string,
    { id: string; run_id: string; user_id: string }[]
  >();
  for (const p of allParticipants) {
    const list = participantsByRun.get(p.run_id) ?? [];
    list.push(p);
    participantsByRun.set(p.run_id, list);
  }

  const reactionsByRun = new Map<string, import("@/types/database").Reaction[]>();
  for (const r of allReactions) {
    const list = reactionsByRun.get(r.run_id) ?? [];
    list.push(r);
    reactionsByRun.set(r.run_id, list);
  }

  // Build feed items by joining in JS
  const feedRuns = allRuns.map((run) => {
    const participants = participantsByRun.get(run.id) ?? [];
    const isJoined = participants.some((p) => p.user_id === user!.id);
    const reactions = reactionsByRun.get(run.id) ?? [];

    return {
      run,
      creator: (run as Record<string, unknown>).profiles as unknown as import("@/types/database").Profile,
      participantCount: participants.length,
      isJoined,
      reactions,
    };
  });

  // Sort into sections: live first, then upcoming, then completed
  const liveRuns = feedRuns.filter((r) => r.run.is_live);
  const upcomingRuns = feedRuns.filter(
    (r) => !r.run.is_live && r.run.status === "upcoming"
  );
  const completedRuns = feedRuns
    .filter((r) => r.run.status === "completed")
    .reverse(); // Most recently completed first

  const sections = [
    ...(liveRuns.length > 0
      ? [{ label: "Going now \u{1F534}" as const, runs: liveRuns }]
      : []),
    ...(upcomingRuns.length > 0
      ? [{ label: "Upcoming" as const, runs: upcomingRuns }]
      : []),
    ...(completedRuns.length > 0
      ? [{ label: "Recently completed" as const, runs: completedRuns }]
      : []),
  ];

  // Find the first live run for the prominent banner
  const liveRun = liveRuns[0] ?? null;

  const profile = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const firstName = profile.data?.full_name?.split(" ")[0] ?? null;
  const greeting = getGreeting();

  return (
    <div className="pt-2 space-y-5">
      {/* Greeting + Post CTA */}
      <div className="space-y-4">
        <div>
          <h1 className="font-display font-bold text-lg text-kith-text">
            {greeting}{firstName ? `, ${firstName}` : ""}
          </h1>
          {todayJoinCount > 0 ? (
            <p className="font-body text-sm text-kith-muted mt-0.5">
              {todayJoinCount} {todayJoinCount === 1 ? "runner" : "runners"} joined runs today
            </p>
          ) : (
            <p className="font-body text-sm text-kith-muted mt-0.5">
              See what your crew is up to
            </p>
          )}
        </div>

        <Link href="/run/new">
          <div className="bg-gradient-to-r from-kith-orange/[0.04] to-kith-surface rounded-card p-4 flex items-center gap-3 border border-kith-gray-light/50 hover:shadow-card-hover transition-shadow cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-kith-orange/10 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F95E2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-kith-text">
                Post a run
              </p>
              <p className="font-body text-xs text-kith-muted">
                Let your crew know when you&apos;re heading out
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-kith-muted shrink-0">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Live run banner */}
      {liveRun && (
        <LiveRunBanner
          runId={liveRun.run.id}
          creatorName={liveRun.creator.full_name ?? liveRun.creator.username}
          place={liveRun.run.start_place}
          scheduledAt={liveRun.run.scheduled_at}
        />
      )}

      <FeedContainer
        sections={sections}
        currentUserId={user?.id}
      />
    </div>
  );
}
