import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { RunCardCompact } from "@/components/run/RunCardCompact";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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

  const { count: runCount } = await supabase
    .from("runs")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", user.id);

  const { count: joinedCount } = await supabase
    .from("run_participants")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: crewSize } = await supabase
    .from("friendships")
    .select("*", { count: "exact", head: true })
    .eq("status", "accepted")
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

  const { data: upcomingRuns } = await supabase
    .from("runs")
    .select("*")
    .eq("creator_id", user.id)
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

      <div className="flex justify-center">
        <Link href="/profile/edit">
          <Button variant="secondary">Edit profile</Button>
        </Link>
      </div>

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
