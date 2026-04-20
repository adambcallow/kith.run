import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { CrewButton } from "@/components/profile/CrewButton";
import { RunCardCompact } from "@/components/run/RunCardCompact";

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

  const { count: runCount } = await supabase
    .from("runs")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", profile.id);

  const { count: joinedCount } = await supabase
    .from("run_participants")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const { count: crewSize } = await supabase
    .from("friendships")
    .select("*", { count: "exact", head: true })
    .eq("status", "accepted")
    .or(`user_a.eq.${profile.id},user_b.eq.${profile.id}`);

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

  const { data: upcomingRuns } = await supabase
    .from("runs")
    .select("*")
    .eq("creator_id", profile.id)
    .eq("status", "upcoming")
    .order("scheduled_at", { ascending: true })
    .limit(6);

  return (
    <div className="space-y-8">
      <ProfileHeader
        profile={profile}
        runCount={runCount ?? 0}
        joinedCount={joinedCount ?? 0}
        crewSize={crewSize ?? 0}
      />

      {user && user.id !== profile.id && (
        <div className="flex justify-center">
          <CrewButton
            currentUserId={user.id}
            profileUserId={profile.id}
            status={friendStatus}
          />
        </div>
      )}

      {upcomingRuns && upcomingRuns.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display font-bold text-sm text-kith-text">
            Upcoming runs
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {upcomingRuns.map((run) => (
              <RunCardCompact key={run.id} run={run} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
