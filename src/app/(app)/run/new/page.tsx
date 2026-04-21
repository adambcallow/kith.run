"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LocationPicker } from "@/components/map/LocationPicker";
import { RunDateTimePicker } from "@/components/run/RunDateTimePicker";
import { PaceSlider } from "@/components/run/PaceSlider";
import {
  IntervalBuilder,
  type IntervalSegment,
} from "@/components/run/IntervalBuilder";
import { formatPace, formatDistance, avatarFallbackColor } from "@/lib/utils";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function NewRunPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("5");
  const [paceMin, setPaceMin] = useState(300);
  const [paceMax, setPaceMax] = useState(360);
  const [note, setNote] = useState("");
  const [visibility, setVisibility] = useState<"crew" | "public">("crew");
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [distanceKey, setDistanceKey] = useState(0);
  const tickDirection = useRef<"up" | "down">("up");
  const [showIntervals, setShowIntervals] = useState(false);
  const [intervals, setIntervals] = useState<IntervalSegment[]>([
    { distanceKm: 1, paceSeconds: 300 },
  ]);
  const [isClubRun, setIsClubRun] = useState(false);
  const [runClubId, setRunClubId] = useState<string | null>(null);
  const [runClubFreeText, setRunClubFreeText] = useState("");
  const [showFreeText, setShowFreeText] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState<
    { id: string; name: string; logo_url: string | null }[]
  >([]);
  const [clubsLoading, setClubsLoading] = useState(false);

  // Fetch joined clubs on mount
  useEffect(() => {
    async function fetchClubs() {
      setClubsLoading(true);
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        setClubsLoading(false);
        return;
      }
      const { data } = await supabase
        .from("run_club_members")
        .select("club_id, run_clubs!club_id(id, name, logo_url)")
        .eq("user_id", authUser.id);

      if (data) {
        const clubs = data
          .map((row) => {
            const club = (row as Record<string, unknown>).run_clubs as {
              id: string;
              name: string;
              logo_url: string | null;
            } | null;
            return club;
          })
          .filter(Boolean) as { id: string; name: string; logo_url: string | null }[];
        setJoinedClubs(clubs);
      }
      setClubsLoading(false);
    }
    fetchClubs();
  }, [supabase]);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!location) errors.location = "Pick a start location";
    if (!isLive && !date) errors.date = "Choose a date and time";
    if (!distance || parseFloat(distance) <= 0)
      errors.distance = "Set a distance";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const scheduledAt = isLive
      ? new Date().toISOString()
      : new Date(date).toISOString();

    const expiresAt = isLive
      ? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      : null;

    const routeGeojson =
      showIntervals && intervals.length > 0
        ? { type: "intervals", segments: intervals }
        : null;

    const { error: insertError } = await supabase.from("runs").insert({
      creator_id: user.id,
      title: title.trim() || null,
      start_lat: location!.lat,
      start_lng: location!.lng,
      start_place: location!.name,
      scheduled_at: scheduledAt,
      distance_km: parseFloat(distance),
      pace_min_target: paceMin,
      pace_max_target: paceMax,
      note: note.trim() || null,
      visibility,
      is_live: isLive,
      expires_at: expiresAt,
      ...(routeGeojson && { route_geojson: routeGeojson }),
      ...(isClubRun && runClubId && { run_club_id: runClubId }),
    });

    if (insertError) {
      setFieldErrors({ form: insertError.message });
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);

    // Brief success state before redirecting
    setTimeout(() => {
      router.push("/feed");
      router.refresh();
    }, 600);
  }

  // Preview data
  const previewTime = useMemo(() => {
    if (isLive) return "Going now";
    if (!date) return "No time set";
    try {
      const d = new Date(date);
      return d.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "No time set";
    }
  }, [date, isLive]);

  return (
    <div className="pt-2 pb-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => router.push("/feed")}
          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-kith-surface active:bg-kith-gray-light/50 transition-colors -ml-1"
          aria-label="Go back"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-kith-text"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="font-display font-bold text-xl text-kith-text">
          Post a run
        </h1>
        <span className="text-xl" aria-hidden="true">
          {"\uD83C\uDFC3"}
        </span>
      </div>

      {/* Going now toggle */}
      <div
        className={`rounded-card p-4 mb-8 transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-kith-orange/30 focus-visible:ring-offset-2 ${
          isLive
            ? "bg-kith-orange/10 border-2 border-kith-orange"
            : "bg-kith-surface border-2 border-transparent"
        }`}
        onClick={() => setIsLive(!isLive)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsLive(!isLive);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-display font-semibold text-sm text-kith-text">
                Going now
              </span>
              {isLive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-kith-orange/20 text-kith-orange text-xs font-body font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-kith-orange animate-live-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <p className="font-body text-xs text-kith-muted">
              Skip the schedule &mdash; go right now
            </p>
          </div>
          <div
            className={`relative w-14 h-8 rounded-full transition-colors duration-250 shrink-0 ${
              isLive ? "bg-kith-orange" : "bg-kith-gray-light"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isLive ? "translate-x-6 scale-110" : "scale-100"
              }`}
              style={{ transitionProperty: "transform" }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Run title"
          placeholder="Saturday morning 10K"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Location */}
        <LocationPicker
          onSelect={(place) => {
            setLocation(place);
            setFieldErrors((prev) => {
              const next = { ...prev };
              delete next.location;
              return next;
            });
          }}
          error={fieldErrors.location}
        />

        {/* Date & time -- hidden when going live */}
        {!isLive && (
          <div className="animate-fade-in-up">
            <RunDateTimePicker
              value={date}
              onChange={(isoString) => {
                setDate(isoString);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.date;
                  return next;
                });
              }}
              error={fieldErrors.date}
            />
          </div>
        )}

        {/* Distance stepper */}
        <div className="space-y-1.5">
          <label className="text-sm font-body font-medium text-kith-text">
            Distance (km)
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-body font-medium transition-all duration-150 active:scale-90 ${
                parseFloat(distance) <= 0
                  ? "bg-kith-surface text-kith-muted cursor-not-allowed"
                  : "bg-kith-surface text-kith-text hover:bg-kith-gray-light/50 active:bg-kith-gray-light"
              }`}
              onClick={() => {
                tickDirection.current = "down";
                setDistanceKey((k) => k + 1);
                setDistance(
                  String(Math.max(0, (parseFloat(distance) || 0) - 0.5))
                );
              }}
              disabled={parseFloat(distance) <= 0}
              aria-label="Decrease distance"
            >
              &minus;
            </button>
            <div className="flex-1 text-center overflow-hidden">
              <span
                key={distanceKey}
                className="inline-block font-display font-bold text-3xl text-kith-text tabular-nums animate-number-tick"
                style={
                  {
                    "--tick-dir":
                      tickDirection.current === "up" ? "-6px" : "6px",
                  } as React.CSSProperties
                }
              >
                {distance || "0"}
              </span>
              <span className="font-body text-sm text-kith-muted ml-1">
                km
              </span>
            </div>
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-kith-surface text-kith-text flex items-center justify-center text-xl font-body font-medium hover:bg-kith-gray-light/50 active:bg-kith-gray-light transition-all duration-150 active:scale-90"
              onClick={() => {
                tickDirection.current = "up";
                setDistanceKey((k) => k + 1);
                setDistance(String((parseFloat(distance) || 0) + 0.5));
              }}
              aria-label="Increase distance"
            >
              +
            </button>
          </div>
          {fieldErrors.distance && (
            <p className="text-xs text-red-500 font-body">
              {fieldErrors.distance}
            </p>
          )}
        </div>

        {/* Pace */}
        {!showIntervals && (
          <PaceSlider
            minValue={paceMin}
            maxValue={paceMax}
            onChange={(min, max) => {
              setPaceMin(min);
              setPaceMax(max);
            }}
          />
        )}

        {showIntervals && (
          <div className="animate-fade-in-up">
            <IntervalBuilder
              intervals={intervals}
              onChange={setIntervals}
              totalDistanceKm={parseFloat(distance) || 0}
            />
          </div>
        )}

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowIntervals((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-sm font-body text-kith-muted hover:text-kith-text transition-colors duration-150"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`transition-transform duration-200 ${showIntervals ? "rotate-45" : ""}`}
          >
            <path
              d="M7 2.5V11.5M2.5 7H11.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {showIntervals
            ? "Use simple pace range instead"
            : "Advanced: Set interval splits"}
        </button>

        {/* Note */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="run-note"
            className="text-sm font-body font-medium text-kith-text"
          >
            Note
          </label>
          <textarea
            id="run-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Coffee after? Chill pace? Let your crew know..."
            rows={3}
            className="w-full rounded-input border border-kith-gray-light bg-white py-3 px-4 font-body text-base text-kith-text leading-relaxed placeholder:text-kith-muted focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200 resize-none"
          />
        </div>

        {/* Visibility -- segmented control with sliding indicator */}
        <div className="space-y-1.5">
          <label className="text-sm font-body font-medium text-kith-text">
            Visibility
          </label>
          <div className="relative flex rounded-pill bg-kith-surface p-1">
            {/* Sliding background indicator */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-pill bg-kith-black shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                left: visibility === "crew" ? "4px" : "calc(50% + 0px)",
              }}
            />
            <button
              type="button"
              onClick={() => setVisibility("crew")}
              className={`relative z-10 flex-1 py-3 min-h-[44px] rounded-pill text-sm font-body font-semibold transition-colors duration-200 ${
                visibility === "crew"
                  ? "text-white"
                  : "text-kith-muted hover:text-kith-text"
              }`}
            >
              Crew only
            </button>
            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={`relative z-10 flex-1 py-3 min-h-[44px] rounded-pill text-sm font-body font-semibold transition-colors duration-200 ${
                visibility === "public"
                  ? "text-white"
                  : "text-kith-muted hover:text-kith-text"
              }`}
            >
              Public
            </button>
          </div>
        </div>

        {/* Run club toggle */}
        <div
          className={`rounded-card p-4 transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-kith-orange/30 focus-visible:ring-offset-2 ${
            isClubRun
              ? "bg-kith-orange/10 border-2 border-kith-orange"
              : "bg-kith-surface border-2 border-transparent"
          }`}
          onClick={() => {
            setIsClubRun(!isClubRun);
            if (isClubRun) {
              setRunClubId(null);
              setRunClubFreeText("");
              setShowFreeText(false);
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsClubRun(!isClubRun);
              if (isClubRun) {
                setRunClubId(null);
                setRunClubFreeText("");
                setShowFreeText(false);
              }
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="font-display font-semibold text-sm text-kith-text">
                Run club run?
              </span>
              <p className="font-body text-xs text-kith-muted mt-0.5">
                Associate this run with a club
              </p>
            </div>
            <div
              className={`relative w-14 h-8 rounded-full transition-colors duration-250 shrink-0 ${
                isClubRun ? "bg-kith-orange" : "bg-kith-gray-light"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isClubRun ? "translate-x-6 scale-110" : "scale-100"
                }`}
                style={{ transitionProperty: "transform" }}
              />
            </div>
          </div>
        </div>

        {/* Club selector -- shown when toggle is on */}
        {isClubRun && (
          <div className="animate-fade-in-up space-y-3" onClick={(e) => e.stopPropagation()}>
            {clubsLoading ? (
              <div className="flex items-center gap-2 py-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-kith-orange border-t-transparent" />
                <span className="font-body text-sm text-kith-muted">Loading your clubs...</span>
              </div>
            ) : joinedClubs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {joinedClubs.map((club) => (
                  <button
                    key={club.id}
                    type="button"
                    onClick={() => {
                      setRunClubId(runClubId === club.id ? null : club.id);
                      setRunClubFreeText("");
                      setShowFreeText(false);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-pill text-sm font-body font-medium transition-all duration-200 active:scale-[0.97] ${
                      runClubId === club.id
                        ? "bg-kith-orange text-white shadow-sm"
                        : "bg-kith-surface text-kith-text hover:bg-kith-gray-light/50"
                    }`}
                  >
                    {club.logo_url ? (
                      <img
                        src={club.logo_url}
                        alt={club.name}
                        loading="lazy"
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ backgroundColor: runClubId === club.id ? "rgba(255,255,255,0.3)" : avatarFallbackColor(club.name) }}
                      >
                        {club.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {club.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-kith-muted">
                You haven&apos;t joined any clubs yet.
              </p>
            )}

            {/* Free-text fallback */}
            {!showFreeText ? (
              <button
                type="button"
                onClick={() => {
                  setShowFreeText(true);
                  setRunClubId(null);
                }}
                className="font-body text-xs text-kith-orange hover:underline"
              >
                Not listed?
              </button>
            ) : (
              <div className="animate-fade-in-up">
                <input
                  type="text"
                  placeholder="Type club name..."
                  value={runClubFreeText}
                  onChange={(e) => {
                    setRunClubFreeText(e.target.value);
                    setRunClubId(null);
                  }}
                  className="w-full rounded-input border border-kith-gray-light bg-white py-2.5 px-4 font-body text-sm text-kith-text placeholder:text-kith-muted focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200"
                />
                <p className="font-body text-[11px] text-kith-muted mt-1">
                  Free-typed clubs won&apos;t be linked yet -- we&apos;ll add them soon
                </p>
              </div>
            )}
          </div>
        )}

        {/* Run preview card */}
        <p className="font-body text-xs text-kith-muted text-center">This is how your crew will see it</p>
        <div className="rounded-card bg-kith-surface border-2 border-dashed border-kith-gray-light p-4 space-y-3">
          <p className="font-body text-xs text-kith-muted uppercase tracking-wider">
            Preview
          </p>
          <div className="space-y-2">
            {title.trim() && (
              <p className="font-display font-semibold text-base text-kith-text">
                {title.trim()}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">
                {"\uD83D\uDCCD"}
              </span>
              <span className="font-body text-sm text-kith-text">
                {location?.name || (
                  <span className="text-kith-muted italic">
                    No location set
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">
                {"\uD83D\uDD52"}
              </span>
              <span className="font-body text-sm text-kith-text">
                {previewTime}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm" aria-hidden="true">
                  {"\uD83C\uDFC3"}
                </span>
                <span className="font-display font-bold text-sm text-kith-text">
                  {distance && parseFloat(distance) > 0
                    ? formatDistance(parseFloat(distance))
                    : "--"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm" aria-hidden="true">
                  {"\u23F1\uFE0F"}
                </span>
                <span className="font-body text-sm text-kith-text">
                  {showIntervals
                    ? `${intervals.length} interval${intervals.length !== 1 ? "s" : ""}`
                    : `${formatPace(paceMin)} \u2013 ${formatPace(paceMax)}/km`}
                </span>
              </div>
            </div>
            {note.trim() && (
              <div className="flex items-start gap-2">
                <span className="text-sm shrink-0" aria-hidden="true">
                  {"\uD83D\uDCAC"}
                </span>
                <span className="font-body text-sm text-kith-muted line-clamp-2">
                  {note}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">
                {visibility === "crew" ? "\uD83D\uDD12" : "\uD83C\uDF0D"}
              </span>
              <span className="font-body text-xs text-kith-muted">
                {visibility === "crew" ? "Crew only" : "Public"}
              </span>
            </div>
            {isClubRun && (runClubId || runClubFreeText.trim()) && (
              <div className="flex items-center gap-2">
                <span className="text-sm" aria-hidden="true">
                  {"\uD83C\uDFE2"}
                </span>
                <span className="font-body text-xs text-kith-muted">
                  {runClubId
                    ? joinedClubs.find((c) => c.id === runClubId)?.name ?? "Club"
                    : runClubFreeText.trim()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Form-level error */}
        {fieldErrors.form && <ErrorAlert message={fieldErrors.form} />}

        <Button
          type="submit"
          fullWidth
          disabled={loading || success}
          loading={loading}
        >
          {success ? (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M15 4.5L7 12.5L3 8.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Posted!
            </>
          ) : loading ? (
            "Posting..."
          ) : (
            "Post run"
          )}
        </Button>
      </form>
    </div>
  );
}
