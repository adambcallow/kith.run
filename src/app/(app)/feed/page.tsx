import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FeedList } from "@/components/feed/FeedList";
import { LiveRunBanner } from "@/components/feed/LiveRunBanner";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function FeedPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: runs } = await supabase
    .from("runs")
    .select("*, profiles!creator_id(*)")
    .or(`visibility.eq.public,creator_id.eq.${user!.id}`)
    .order("scheduled_at", { ascending: true });

  const feedRuns = await Promise.all(
    (runs ?? []).map(async (run) => {
      const { count } = await supabase
        .from("run_participants")
        .select("*", { count: "exact", head: true })
        .eq("run_id", run.id);

      const { data: participation } = await supabase
        .from("run_participants")
        .select("id")
        .eq("run_id", run.id)
        .eq("user_id", user!.id)
        .maybeSingle();

      const { data: reactions } = await supabase
        .from("reactions")
        .select("*")
        .eq("run_id", run.id);

      return {
        run,
        creator: (run as Record<string, unknown>).profiles as unknown as import("@/types/database").Profile,
        participantCount: count ?? 0,
        isJoined: !!participation,
        reactions: reactions ?? [],
      };
    })
  );

  const liveRun = feedRuns.find((r) => r.run.is_live);

  return (
    <div className="space-y-4">
      <Link href="/run/new">
        <Button fullWidth>Post a run</Button>
      </Link>

      {liveRun && (
        <LiveRunBanner
          runId={liveRun.run.id}
          creatorName={liveRun.creator.full_name ?? liveRun.creator.username}
          place={liveRun.run.start_place}
        />
      )}

      <FeedList runs={feedRuns} currentUserId={user?.id} />
    </div>
  );
}
