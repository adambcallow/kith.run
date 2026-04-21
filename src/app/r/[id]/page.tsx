import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  formatDistance,
  formatPaceRange,
  avatarFallbackColor,
  getInitials,
} from "@/lib/utils";
import type { Profile } from "@/types/database";
import type { Metadata } from "next";
import { ClientTime } from "@/components/ui/ClientTime";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = createServerSupabaseClient();

  const { data: run } = await supabase
    .from("runs")
    .select("*, profiles!creator_id(full_name, username)")
    .eq("id", params.id)
    .single();

  if (!run || run.visibility === "crew") {
    return {
      title: "Run on Kith",
      description: "Find your kith. Plan a run. Show up together.",
    };
  }

  const creator = (run as Record<string, unknown>).profiles as unknown as Pick<
    Profile,
    "full_name" | "username"
  >;
  const name = creator?.full_name ?? creator?.username ?? "Someone";

  return {
    title: `${name}'s ${formatDistance(run.distance_km)} run — Kith`,
    description: `${run.start_place} · ${formatDistance(run.distance_km)}${run.note ? ` — ${run.note.slice(0, 120)}` : ""}`,
    openGraph: {
      title: `${name}'s ${formatDistance(run.distance_km)} run — Kith`,
      description: `${run.start_place} · ${formatDistance(run.distance_km)}`,
      type: "website",
    },
  };
}

export default async function PublicRunPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();

  const { data: run } = await supabase
    .from("runs")
    .select(
      "*, profiles!creator_id(*), run_clubs!run_club_id(name, logo_url, instagram)"
    )
    .eq("id", params.id)
    .single();

  // Run doesn't exist or is crew-only — show unavailable state
  if (!run || run.visibility === "crew") {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Dark header */}
        <header className="bg-[#1B1C1F] px-6 py-8 text-center">
          <p className="font-display font-extrabold text-2xl text-white tracking-tight">
            kith
          </p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F6F7F8] flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#6B7280]"
              >
                <path
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="font-display font-bold text-xl text-[#2D2D2D]">
              This run isn&apos;t available
            </h1>
            <p className="font-body text-[#6B7280] text-sm leading-relaxed">
              It may have been removed or is only visible to the
              creator&apos;s crew.
            </p>
          </div>
        </main>

        {/* CTA */}
        <footer className="px-6 pb-10 pt-4">
          <div className="max-w-md mx-auto text-center space-y-4">
            <a
              href="/signup"
              className="block w-full rounded-[100px] bg-[#F95E2E] px-6 py-3.5 font-display font-bold text-base text-white text-center transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              Get started on Kith
            </a>
            <p className="font-body text-sm text-[#6B7280]">
              Already on Kith?{" "}
              <a
                href="/login"
                className="text-[#F95E2E] font-medium hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  const creator = (run as Record<string, unknown>)
    .profiles as unknown as Profile;

  const runClub = (run as Record<string, unknown>).run_clubs as {
    name: string;
    logo_url: string | null;
    instagram: string | null;
  } | null;

  const displayName = creator.full_name ?? creator.username;
  const initials = getInitials(creator.full_name, creator.username);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Dark header */}
      <header className="bg-[#1B1C1F] px-6 pt-10 pb-8">
        <div className="max-w-md mx-auto">
          <p className="font-display font-extrabold text-2xl text-white tracking-tight mb-8">
            kith
          </p>

          {/* Creator info */}
          <div className="flex items-center gap-3">
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt={displayName}
                className="w-11 h-11 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-white text-sm border-2 border-white/20"
                style={{
                  backgroundColor: avatarFallbackColor(creator.username),
                }}
              >
                {initials}
              </div>
            )}
            <div>
              <p className="font-display font-semibold text-white text-base">
                {displayName}
              </p>
              <p className="font-body text-white/60 text-sm">
                posted a run on Kith
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Run details card */}
      <main className="flex-1 px-6 -mt-4">
        <div className="max-w-md mx-auto space-y-5">
          {/* Main run card */}
          <div className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-black/[0.04] p-5 space-y-5">
            {/* Title */}
            {run.title && (
              <h1 className="font-display font-bold text-lg text-[#2D2D2D]">
                {run.title}
              </h1>
            )}

            {/* Location + time */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0 mt-0.5"
                >
                  <path
                    d="M8 1.5C5.24 1.5 3 3.74 3 6.5C3 10.375 8 14.5 8 14.5C8 14.5 13 10.375 13 6.5C13 3.74 10.76 1.5 8 1.5ZM8 8.5C6.9 8.5 6 7.6 6 6.5C6 5.4 6.9 4.5 8 4.5C9.1 4.5 10 5.4 10 6.5C10 7.6 9.1 8.5 8 8.5Z"
                    fill="#F95E2E"
                  />
                </svg>
                <span className="font-body text-sm font-medium text-[#2D2D2D]">
                  {run.start_place}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 mt-0.5"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 7v5l3 3"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <ClientTime dateStr={run.scheduled_at} className="font-body text-sm text-[#2D2D2D]" />
              </div>
            </div>

            {/* Distance + pace */}
            <div className="flex items-center gap-8 pt-1">
              <div>
                <p className="font-body text-xs text-[#6B7280] uppercase tracking-wider mb-0.5">
                  Distance
                </p>
                <p className="font-display font-bold text-3xl text-[#2D2D2D]">
                  {formatDistance(run.distance_km)}
                </p>
              </div>
              {(run.pace_min_target || run.pace_max_target) && (
                <div>
                  <p className="font-body text-xs text-[#6B7280] uppercase tracking-wider mb-0.5">
                    Pace
                  </p>
                  <p className="font-display font-semibold text-xl text-[#2D2D2D]">
                    {formatPaceRange(run.pace_min_target, run.pace_max_target)}
                  </p>
                </div>
              )}
            </div>

            {/* Note */}
            {run.note && (
              <div className="pt-3 border-t border-black/[0.06]">
                <p className="font-body text-sm text-[#2D2D2D] leading-relaxed">
                  {run.note}
                </p>
              </div>
            )}

            {/* Run club pill */}
            {runClub && (
              <div className="pt-3 border-t border-black/[0.06]">
                <div className="inline-flex items-center gap-2 rounded-[100px] bg-[#F6F7F8] px-3 py-1.5">
                  {runClub.logo_url ? (
                    <img
                      src={runClub.logo_url}
                      alt={runClub.name}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center font-display font-bold text-white text-[10px] shrink-0"
                      style={{
                        backgroundColor: avatarFallbackColor(runClub.name),
                      }}
                    >
                      {runClub.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-body text-xs font-medium text-[#2D2D2D]">
                    {runClub.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTA section */}
          <div className="text-center py-6 space-y-5">
            <div className="space-y-2">
              <h2 className="font-display font-bold text-xl text-[#2D2D2D]">
                Want to join this run?
              </h2>
              <p className="font-body text-sm text-[#6B7280]">
                Sign up for Kith to join runs, find your crew, and never run
                alone.
              </p>
            </div>

            <a
              href="/signup"
              className="block w-full rounded-[100px] bg-[#F95E2E] px-6 py-3.5 font-display font-bold text-base text-white text-center transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              Get started
            </a>

            <p className="font-body text-sm text-[#6B7280]">
              Already on Kith?{" "}
              <a
                href="/login"
                className="text-[#F95E2E] font-medium hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-10 pt-6">
        <div className="max-w-md mx-auto text-center">
          <p className="font-display font-semibold text-sm text-[#6B7280]">
            Your crew is waiting.
          </p>
        </div>
      </footer>
    </div>
  );
}
