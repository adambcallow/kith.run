import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { JoinButton } from "@/components/run/JoinButton";
import { ReactionBar } from "@/components/run/ReactionBar";
import { RouteMap } from "@/components/map/RouteMap";
import { formatPaceRange, formatDistance, formatRelativeRunTime } from "@/lib/utils";

export default async function RunDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: run } = await supabase
    .from("runs")
    .select("*, profiles!creator_id(*)")
    .eq("id", params.id)
    .single();

  if (!run) notFound();

  const creator = (run as Record<string, unknown>).profiles as unknown as import("@/types/database").Profile;

  const { data: participants } = await supabase
    .from("run_participants")
    .select("*, profiles!user_id(*)")
    .eq("run_id", run.id);

  const { data: reactions } = await supabase
    .from("reactions")
    .select("*")
    .eq("run_id", run.id);

  const isJoined = participants?.some((p) => p.user_id === user?.id) ?? false;
  const isCompleted = run.status === "completed";

  return (
    <div className="space-y-6">
      <RouteMap
        lat={run.start_lat}
        lng={run.start_lng}
        routeGeojson={run.route_geojson}
        className="w-full h-56 rounded-card overflow-hidden"
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={creator.avatar_url}
            username={creator.username}
            fullName={creator.full_name}
            size="lg"
          />
          <div>
            <p className="font-body font-medium text-kith-text">
              {creator.full_name ?? creator.username}
            </p>
            <p className="font-body text-sm text-kith-muted">
              @{creator.username}
            </p>
          </div>
          {run.is_live && <Badge variant="live">Going now</Badge>}
        </div>

        <div className="space-y-2">
          <p className="font-body text-sm text-kith-muted">
            {run.start_place} &middot;{" "}
            {formatRelativeRunTime(run.scheduled_at)}
          </p>
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-kith-text">
              {formatDistance(run.distance_km)}
            </span>
            {(run.pace_min_target || run.pace_max_target) && (
              <Badge variant="pace">
                {formatPaceRange(run.pace_min_target, run.pace_max_target)}
              </Badge>
            )}
          </div>
          {run.note && (
            <p className="font-body text-sm text-kith-text">{run.note}</p>
          )}
        </div>

        {/* Participants */}
        {participants && participants.length > 0 && (
          <div className="space-y-2">
            <p className="font-body text-xs text-kith-muted uppercase tracking-wider">
              {participants.length} joining
            </p>
            <div className="flex -space-x-2">
              {participants.map((p) => {
                const profile = (p as Record<string, unknown>).profiles as unknown as import("@/types/database").Profile;
                return (
                  <Avatar
                    key={p.id}
                    src={profile?.avatar_url}
                    username={profile?.username ?? ""}
                    fullName={profile?.full_name}
                    size="md"
                    className="border-2 border-white"
                  />
                );
              })}
            </div>
          </div>
        )}

        {!isCompleted && user && (
          <JoinButton
            runId={run.id}
            userId={user.id}
            isJoined={isJoined}
          />
        )}

        {isCompleted && reactions && (
          <ReactionBar
            runId={run.id}
            reactions={reactions}
            currentUserId={user?.id}
          />
        )}
      </div>
    </div>
  );
}
