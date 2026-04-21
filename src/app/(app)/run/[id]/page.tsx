import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { JoinButton } from "@/components/run/JoinButton";
import { ReactionBar } from "@/components/run/ReactionBar";
import {
  formatPace,
  formatPaceRange,
  formatDistance,
  formatRelativeRunTime,
} from "@/lib/utils";
import { RunDetailActions } from "./RunDetailActions";
import { DeleteRunButton } from "./DeleteRunButton";
import { CompleteRunButton } from "./CompleteRunButton";

const RouteMap = dynamic(
  () =>
    import("@/components/map/RouteMap").then((m) => ({
      default: m.RouteMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-56 bg-kith-surface rounded-card animate-pulse" />
    ),
  }
);

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

  const creator = (run as Record<string, unknown>)
    .profiles as unknown as import("@/types/database").Profile;

  const { data: participants } = await supabase
    .from("run_participants")
    .select("*, profiles!user_id(*)")
    .eq("run_id", run.id);

  const { data: reactions } = await supabase
    .from("reactions")
    .select("*")
    .eq("run_id", run.id);

  const isJoined =
    participants?.some((p) => p.user_id === user?.id) ?? false;
  const isCompleted = run.status === "completed";
  const isCreator = user?.id === run.creator_id;
  const runTimePassed = new Date(run.scheduled_at) < new Date();
  const canComplete =
    run.status === "upcoming" && runTimePassed && (isCreator || isJoined);

  // Parse interval data from route_geojson with safe validation
  const rawRoute = run.route_geojson as Record<string, unknown> | null;
  const hasIntervals =
    rawRoute !== null &&
    typeof rawRoute === "object" &&
    rawRoute.type === "intervals" &&
    Array.isArray(rawRoute.segments) &&
    rawRoute.segments.length > 0 &&
    rawRoute.segments.every(
      (s: unknown) =>
        typeof s === "object" &&
        s !== null &&
        typeof (s as Record<string, unknown>).distanceKm === "number" &&
        typeof (s as Record<string, unknown>).paceSeconds === "number"
    );
  const intervalSegments = hasIntervals
    ? (rawRoute!.segments as { distanceKm: number; paceSeconds: number }[])
    : [];

  const shareData = {
    title: `${creator.full_name ?? creator.username}'s ${formatDistance(run.distance_km)} run`,
    text: `${run.start_place} \u00B7 ${formatRelativeRunTime(run.scheduled_at)}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://kith.run"}/run/${run.id}`,
  };

  return (
    <div className="pb-8 -mx-4 sm:-mx-0">
      {/* Back navigation + share */}
      <div className="flex items-center justify-between px-4 sm:px-0 pt-2 pb-3">
        <a
          href="/feed"
          className="inline-flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] -ml-2 px-3 rounded-full text-sm font-body text-kith-muted hover:text-kith-text active:bg-kith-surface transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Feed
        </a>
        <RunDetailActions shareData={shareData} />
      </div>

      {/* Full-width map — prominent so runners can find the start */}
      <RouteMap
        lat={run.start_lat}
        lng={run.start_lng}
        routeGeojson={run.route_geojson}
        className="w-full h-64 sm:h-80 sm:rounded-card overflow-hidden"
      />

      {/* Open in Maps */}
      <div className="px-4 sm:px-0 mt-3 flex justify-end">
        <a
          href={`https://maps.google.com/?q=${run.start_lat},${run.start_lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-kith-surface px-4 py-2 text-sm font-body font-medium text-kith-text transition-all duration-200 hover:bg-kith-gray-light hover:shadow-sm active:scale-[0.97]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M8 1.5C5.24 1.5 3 3.74 3 6.5C3 10.375 8 14.5 8 14.5C8 14.5 13 10.375 13 6.5C13 3.74 10.76 1.5 8 1.5ZM8 8.5C6.9 8.5 6 7.6 6 6.5C6 5.4 6.9 4.5 8 4.5C9.1 4.5 10 5.4 10 6.5C10 7.6 9.1 8.5 8 8.5Z"
              fill="#F95E2E"
            />
          </svg>
          Open in Maps
        </a>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-0 mt-4 space-y-6">
        {/* Creator info */}
        <div className="flex items-center gap-3">
          <Avatar
            src={creator.avatar_url}
            username={creator.username}
            fullName={creator.full_name}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-base text-kith-text truncate">
              {creator.full_name ?? creator.username}
            </p>
            <p className="font-body text-sm text-kith-muted">
              @{creator.username}
            </p>
          </div>
          {run.is_live && <Badge variant="live">Going now</Badge>}
          <Badge variant={run.visibility === "crew" ? "crew" : "public"}>
            {run.visibility === "crew" ? "Crew" : "Public"}
          </Badge>
        </div>

        {/* Run title */}
        {run.title && (
          <h2 className="font-display font-bold text-lg text-kith-text">
            {run.title}
          </h2>
        )}

        {/* Edit / Cancel buttons — only for the creator on non-completed runs */}
        {user?.id === run.creator_id && !isCompleted && (
          <div className="flex items-center gap-2">
            <a
              href={`/run/${run.id}/edit`}
              className="inline-flex items-center justify-center gap-1.5 rounded-pill px-4 py-2 text-sm font-body font-medium bg-kith-surface text-kith-text hover:bg-kith-gray-light/50 transition-all duration-200 active:scale-[0.97]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M10.08 1.92a1.5 1.5 0 0 1 2.12 0l.38.38a1.5 1.5 0 0 1 0 2.12L5.5 11.5 2 12.5l1-3.5 7.08-7.08Z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </a>
            <DeleteRunButton runId={run.id} />
          </div>
        )}

        {/* Run details card */}
        <div className="rounded-card bg-kith-surface p-4 space-y-4">
          {/* Location + time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base shrink-0" aria-hidden="true">
                {"\uD83D\uDCCD"}
              </span>
              <span className="font-body text-sm font-medium text-kith-text">
                {run.start_place}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base shrink-0" aria-hidden="true">
                {"\uD83D\uDD52"}
              </span>
              <span className="font-body text-sm text-kith-text">
                {formatRelativeRunTime(run.scheduled_at)}
              </span>
            </div>
          </div>

          {/* Distance and pace */}
          <div className="flex items-center gap-6">
            <div>
              <p className="font-body text-xs text-kith-muted uppercase tracking-wider mb-0.5">
                Distance
              </p>
              <p className="font-display font-bold text-2xl text-kith-text">
                {formatDistance(run.distance_km)}
              </p>
            </div>
            {(run.pace_min_target || run.pace_max_target) && (
              <div>
                <p className="font-body text-xs text-kith-muted uppercase tracking-wider mb-0.5">
                  Pace
                </p>
                <p className="font-display font-semibold text-lg text-kith-text">
                  {formatPaceRange(
                    run.pace_min_target,
                    run.pace_max_target
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Note */}
          {run.note && (
            <div className="pt-2 border-t border-kith-gray-light/50">
              <p className="font-body text-sm text-kith-text leading-relaxed">
                {run.note}
              </p>
            </div>
          )}
        </div>

        {/* Interval splits */}
        {hasIntervals && (
          <div className="rounded-card bg-kith-surface p-4 space-y-3">
            <p className="font-body text-xs text-kith-muted uppercase tracking-wider">
              Training plan
            </p>

            {/* Visual bar chart */}
            {(() => {
              const totalDist = intervalSegments.reduce(
                (s, seg) => s + seg.distanceKm,
                0
              );
              const allPaces = intervalSegments.map((s) => s.paceSeconds);
              const minPace = Math.min(...allPaces);
              const maxPace = Math.max(...allPaces);
              const range = maxPace - minPace || 1;

              return (
                <div className="flex gap-0.5 h-10 rounded-input overflow-hidden">
                  {intervalSegments.map((segment, index) => {
                    const widthPercent =
                      (segment.distanceKm / totalDist) * 100;
                    const opacity =
                      0.3 +
                      0.7 * (1 - (segment.paceSeconds - minPace) / range);

                    return (
                      <div
                        key={index}
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{
                          width: `${Math.max(widthPercent, 8)}%`,
                          backgroundColor: `rgba(249, 94, 46, ${opacity})`,
                          borderRadius:
                            index === 0
                              ? "8px 2px 2px 8px"
                              : index === intervalSegments.length - 1
                                ? "2px 8px 8px 2px"
                                : "2px",
                        }}
                      >
                        <span className="text-[10px] font-body font-medium text-white truncate px-1">
                          {segment.distanceKm}km
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Segment list */}
            <div className="space-y-2">
              {intervalSegments.map((segment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs font-body text-kith-muted w-4 shrink-0 tabular-nums">
                    {index + 1}.
                  </span>
                  <span className="font-display font-semibold text-sm text-kith-text tabular-nums">
                    {segment.distanceKm} km
                  </span>
                  <span className="font-body text-xs text-kith-muted">at</span>
                  <span className="font-body text-sm font-medium text-kith-text tabular-nums">
                    {formatPace(segment.paceSeconds)}/km
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-kith-gray-light/50">
              <span className="font-body text-xs text-kith-muted">
                Total:{" "}
                {Math.round(
                  intervalSegments.reduce((s, seg) => s + seg.distanceKm, 0) * 10
                ) / 10}{" "}
                km
              </span>
            </div>
          </div>
        )}

        {/* Participants */}
        {participants && participants.length > 0 && (
          <div className="space-y-3">
            <p className="font-body text-xs text-kith-muted uppercase tracking-wider">
              {participants.length}{" "}
              {participants.length === 1 ? "runner" : "runners"} joining
            </p>
            <div className="flex flex-wrap gap-3">
              {participants.map((p, index) => {
                const profile = (p as Record<string, unknown>)
                  .profiles as unknown as import("@/types/database").Profile;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-2"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <Avatar
                      src={profile?.avatar_url}
                      username={profile?.username ?? ""}
                      fullName={profile?.full_name}
                      size="md"
                      className="border-2 border-white shadow-sm"
                    />
                    <span className="font-body text-sm text-kith-text">
                      {profile?.full_name ?? profile?.username ?? "Runner"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {participants && participants.length === 0 && !isCompleted && (
          <div className="text-center py-4">
            <p className="font-body text-sm text-kith-muted">
              No one has joined yet. Be the first!
            </p>
          </div>
        )}

        {/* Complete / rate the run */}
        {canComplete && user && (
          <CompleteRunButton
            runId={run.id}
            isCreator={!!isCreator}
          />
        )}

        {/* Completed run — reaction bar */}
        {isCompleted && reactions && (
          <div className="rounded-card bg-kith-surface p-4 space-y-3">
            <div className="text-center">
              <p className="font-display font-semibold text-base text-kith-text">
                {"\uD83C\uDFC1"} Run complete
              </p>
              <p className="font-body text-sm text-kith-muted mt-0.5">
                How was it?
              </p>
            </div>
            <div className="flex justify-center">
              <ReactionBar
                runId={run.id}
                reactions={reactions}
                currentUserId={user?.id}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sticky join button at bottom */}
      {!isCompleted && user && (
        <div className="sticky bottom-0 left-0 right-0 z-30 px-4 sm:px-0 py-3 bg-white/95 backdrop-blur-sm border-t border-kith-gray-light/30 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <JoinButton
            runId={run.id}
            userId={user.id}
            isJoined={isJoined}
            creatorId={run.creator_id}
          />
        </div>
      )}
    </div>
  );
}
