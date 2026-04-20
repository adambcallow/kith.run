import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { UserBadgeStats } from "@/lib/badges";

/**
 * Fetch all the stats needed to compute badges for a user.
 * Uses count queries and minimal data fetching for efficiency.
 */
export async function fetchBadgeStats(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<UserBadgeStats> {
  const [
    runsCreatedRes,
    runsJoinedRes,
    crewSizeRes,
    reactionsGivenRes,
    hasGoneLiveRes,
    maxParticipantsRes,
  ] = await Promise.all([
    // Count of runs this user created
    supabase
      .from("runs")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", userId),

    // Count of runs this user joined (as participant)
    supabase
      .from("run_participants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),

    // Count of accepted friendships (user can be on either side)
    supabase
      .from("friendships")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`),

    // Count of reactions this user has given
    supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),

    // Whether user has ever posted a live run
    supabase
      .from("runs")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", userId)
      .eq("is_live", true),

    // Get all run IDs by this user, then count participants per run
    // to find the max. We fetch run IDs first, then count participants.
    supabase
      .from("runs")
      .select("id")
      .eq("creator_id", userId),
  ]);

  // Compute max participants across all runs created by this user.
  // Fetch all participant rows for this user's runs in a single query,
  // then count per run_id in JS to find the max.
  let maxParticipantsOnRun = 0;
  const userRuns = maxParticipantsRes.data;
  if (userRuns && userRuns.length > 0) {
    const runIds = userRuns.map((r) => r.id);
    const { data: participants } = await supabase
      .from("run_participants")
      .select("run_id")
      .in("run_id", runIds);

    if (participants && participants.length > 0) {
      const counts: Record<string, number> = {};
      for (const p of participants) {
        counts[p.run_id] = (counts[p.run_id] ?? 0) + 1;
      }
      for (const runId of Object.keys(counts)) {
        if (counts[runId] > maxParticipantsOnRun) {
          maxParticipantsOnRun = counts[runId];
        }
      }
    }
  }

  const hasGoneLive = (hasGoneLiveRes.count ?? 0) > 0;

  return {
    runsCreated: runsCreatedRes.count ?? 0,
    runsJoined: runsJoinedRes.count ?? 0,
    crewSize: crewSizeRes.count ?? 0,
    reactionsGiven: reactionsGivenRes.count ?? 0,
    hasGoneLive,
    maxParticipantsOnRun,
  };
}
