"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/notifications";
import { AvatarUpload } from "@/app/(app)/profile/edit/AvatarUpload";
import { Avatar } from "@/components/ui/Avatar";

/* ── Constants ── */
const TOTAL_STEPS = 5;

const PB_DISTANCES = [
  { label: "5K", value: "5k", code: 5000, placeholder: "MM:SS" },
  { label: "10K", value: "10k", code: 10000, placeholder: "MM:SS" },
  { label: "Half", value: "half", code: 21097, placeholder: "H:MM:SS" },
  { label: "Marathon", value: "marathon", code: 42195, placeholder: "H:MM:SS" },
] as const;

const PB_DISTANCE_LABELS: Record<number, string> = {
  5000: "5K",
  10000: "10K",
  21097: "Half Marathon",
  42195: "Marathon",
};

/* ── Helpers ── */
function parsePbTime(str: string): number | null {
  const parts = str.split(":").map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (
    parts.length === 3 &&
    !isNaN(parts[0]) &&
    !isNaN(parts[1]) &&
    !isNaN(parts[2])
  ) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════
   Onboarding flow — /welcome
   Full-screen, multi-step, no app chrome.
   ═══════════════════════════════════════════════════════════ */
export default function WelcomePage() {
  const router = useRouter();
  const supabase = createClient();

  /* ── User state ── */
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── Step state ── */
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  /* ── Pace / PB state ── */
  const [showPaceInput, setShowPaceInput] = useState(false);
  const [pbDistance, setPbDistance] = useState<string>("5k");
  const [pbTime, setPbTime] = useState("");
  const [pbSaved, setPbSaved] = useState(false);

  /* ── Share state ── */
  const [copied, setCopied] = useState(false);

  /* ── Invite auto-connect state ── */
  const [inviterName, setInviterName] = useState<string | null>(null);

  /* ── Load user on mount ── */
  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

      const meta = user.user_metadata ?? {};
      setFullName(meta.full_name ?? "");
      setUsername(meta.username ?? "");

      // Check for existing profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, username, pace_min, pace_max")
        .eq("id", user.id)
        .single();

      if (profile) {
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        if (profile.full_name) setFullName(profile.full_name);
        if (profile.username) setUsername(profile.username);
      }

      // Auto-connect with the person who invited this user
      const invitedBy = meta.invited_by as string | undefined;
      if (invitedBy && invitedBy !== user.id) {
        // Check if a friendship already exists to avoid duplicates
        const { data: existing } = await supabase
          .from("friendships")
          .select("id")
          .or(
            `and(user_a.eq.${user.id},user_b.eq.${invitedBy}),and(user_a.eq.${invitedBy},user_b.eq.${user.id})`
          )
          .maybeSingle();

        if (!existing) {
          // Create an accepted friendship — the invite IS the acceptance
          await supabase.from("friendships").insert({
            user_a: user.id,
            user_b: invitedBy,
            status: "accepted",
          });

          // Notify the inviter
          createNotification({
            recipientId: invitedBy,
            type: "friend_request",
            payload: { user_id: user.id },
          });
        }

        // Fetch inviter name for the welcome message
        const { data: inviterProfile } = await supabase
          .from("profiles")
          .select("full_name, username")
          .eq("id", invitedBy)
          .maybeSingle();

        if (inviterProfile) {
          setInviterName(
            inviterProfile.full_name
              ? inviterProfile.full_name.split(" ")[0]
              : inviterProfile.username
          );
        }
      }

      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Step navigation with transition ── */
  const goTo = useCallback(
    (target: number) => {
      if (animating || target === step) return;
      setAnimating(true);
      // Brief exit
      setTimeout(() => {
        setStep(target);
        // Allow enter animation
        setTimeout(() => setAnimating(false), 50);
      }, 180);
    },
    [step, animating]
  );

  const next = useCallback(() => {
    if (step < TOTAL_STEPS) goTo(step + 1);
  }, [goTo, step]);

  /* ── Save PB ── */
  const savePb = useCallback(async () => {
    if (!userId || !pbTime) {
      next();
      return;
    }

    const seconds = parsePbTime(pbTime);
    if (!seconds) {
      next();
      return;
    }

    const distCode =
      PB_DISTANCES.find((d) => d.value === pbDistance)?.code ?? 5000;

    await supabase
      .from("profiles")
      .update({ pace_min: seconds, pace_max: distCode })
      .eq("id", userId);

    setPbSaved(true);
    next();
  }, [userId, pbTime, pbDistance, supabase, next]);

  /* ── Share invite ── */
  const inviteLink =
    typeof window !== "undefined" && userId
      ? `${window.location.origin}/invite/${userId}`
      : "";

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Kith",
          text: "I'm using Kith to plan runs with friends. Join my crew!",
          url: inviteLink,
        });
      } catch {
        // User cancelled share dialog
      }
    } else {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [inviteLink]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [inviteLink]);

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-kith-orange border-t-transparent" />
      </div>
    );
  }

  /* ── Derived ── */
  const firstName = fullName ? fullName.split(" ")[0] : username;
  const selectedDist = PB_DISTANCES.find((d) => d.value === pbDistance);

  /* ── Transition class ── */
  const stepTransition = animating
    ? "opacity-0 translate-y-3 scale-[0.98]"
    : "opacity-100 translate-y-0 scale-100";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
      {/* ── Ambient background blobs ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(249,94,46,0.06) 0%, transparent 70%)",
          animation: "meshFloat 18s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(249,94,46,0.04) 0%, transparent 70%)",
          animation: "meshFloat 18s ease-in-out infinite 6s",
        }}
      />

      {/* ── Progress bar ── */}
      <div className="relative z-10 shrink-0 px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-2">
        <div className="flex items-center gap-1.5 max-w-md mx-auto">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(246,247,248,1)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: i + 1 <= step ? "100%" : "0%",
                  background:
                    i + 1 <= step
                      ? "linear-gradient(90deg, #F95E2E, #FF7A50)"
                      : "transparent",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <div
          className={`w-full max-w-md transition-all duration-300 ease-out ${stepTransition}`}
        >
          {/* ═══════════════════════════════════════
              Step 1 — Welcome
              ═══════════════════════════════════════ */}
          {step === 1 && (
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Logo mark */}
              <div
                className="flex items-center justify-center w-20 h-20 rounded-[24px] bg-kith-black shadow-lg"
                style={{
                  animation: "fadeUp 0.6s ease-out both",
                }}
              >
                <span className="font-display font-extrabold text-3xl text-white tracking-tight">
                  k
                </span>
              </div>

              <div className="space-y-3">
                <h1
                  className="font-display font-extrabold text-3xl sm:text-4xl text-kith-black tracking-tight"
                  style={{
                    animation: "fadeUp 0.6s ease-out both",
                    animationDelay: "100ms",
                  }}
                >
                  Welcome, {firstName}!
                </h1>
                <p
                  className="font-body text-lg text-kith-muted leading-relaxed max-w-[280px] mx-auto"
                  style={{
                    animation: "fadeUp 0.6s ease-out both",
                    animationDelay: "200ms",
                  }}
                >
                  Let&apos;s get you set up in under a minute.
                </p>
                {inviterName && (
                  <p
                    className="font-body text-sm text-kith-orange font-medium max-w-[280px] mx-auto"
                    style={{
                      animation: "fadeUp 0.6s ease-out both",
                      animationDelay: "280ms",
                    }}
                  >
                    You&apos;ve been added to {inviterName}&apos;s crew!
                  </p>
                )}
              </div>

              <button
                onClick={next}
                className="btn-primary w-full max-w-[280px] text-base hover:shadow-lg hover:shadow-kith-orange/25 hover:-translate-y-[1px]"
                style={{
                  animation: "fadeUp 0.6s ease-out both",
                  animationDelay: "350ms",
                }}
              >
                Let&apos;s go
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════
              Step 2 — Avatar
              ═══════════════════════════════════════ */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-3">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-kith-black tracking-tight">
                  Add a photo
                </h2>
                <p className="font-body text-base text-kith-muted max-w-[280px] mx-auto">
                  Help your crew recognise you on the trail.
                </p>
              </div>

              {/* Avatar upload area */}
              <div className="py-2">
                {userId && (
                  <AvatarUpload
                    currentUrl={avatarUrl}
                    username={username}
                    fullName={fullName}
                    userId={userId}
                    onUpload={(url) => {
                      setAvatarUrl(url);
                      // Persist to profile
                      supabase
                        .from("profiles")
                        .update({ avatar_url: url })
                        .eq("id", userId);
                    }}
                  />
                )}
              </div>

              <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
                <button
                  onClick={next}
                  className="btn-primary w-full text-base hover:shadow-lg hover:shadow-kith-orange/25 hover:-translate-y-[1px]"
                >
                  Next
                </button>
                <button
                  onClick={next}
                  className="font-body text-sm text-kith-muted hover:text-kith-text transition-colors py-2"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
              Step 3 — Pace / PB
              ═══════════════════════════════════════ */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-3">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-kith-black tracking-tight">
                  What&apos;s your pace?
                </h2>
                <p className="font-body text-base text-kith-muted max-w-[280px] mx-auto">
                  Share a personal best so runners know what to expect.
                </p>
              </div>

              {!showPaceInput ? (
                /* ── Two big choice buttons ── */
                <div className="flex flex-col gap-3 w-full max-w-[320px]">
                  <button
                    onClick={() => setShowPaceInput(true)}
                    className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 rounded-card border-2 border-kith-black bg-white text-kith-black font-body font-medium text-base transition-all duration-200 hover:bg-kith-surface hover:-translate-y-[1px] hover:shadow-md active:scale-[0.98]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-kith-orange"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    I know my pace
                  </button>

                  <button
                    onClick={next}
                    className="group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-card border-[1.5px] border-kith-gray-light bg-white text-kith-muted font-body font-medium text-base transition-all duration-200 hover:bg-kith-surface hover:border-kith-text/20 active:scale-[0.98]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                    I&apos;ll skip this
                  </button>
                </div>
              ) : (
                /* ── PB entry form ── */
                <div className="w-full max-w-[340px] space-y-5">
                  {/* Distance pills */}
                  <div className="flex gap-2">
                    {PB_DISTANCES.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setPbDistance(d.value)}
                        className={`flex-1 py-2.5 rounded-pill text-sm font-body font-medium transition-all duration-200 ${
                          pbDistance === d.value
                            ? "bg-kith-black text-white shadow-sm"
                            : "bg-white text-kith-muted border border-kith-gray-light hover:border-kith-text/20"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  {/* Time input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-body font-medium text-kith-text">
                      Your {selectedDist?.label} time
                    </label>
                    <input
                      type="text"
                      value={pbTime}
                      onChange={(e) => setPbTime(e.target.value)}
                      placeholder={selectedDist?.placeholder ?? "MM:SS"}
                      className="w-full rounded-input border border-kith-gray-light bg-white py-3 px-4 font-body text-base text-kith-text placeholder:text-kith-muted focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200 text-center text-lg tracking-wider"
                      inputMode="numeric"
                      autoFocus
                    />
                  </div>

                  <div className="flex flex-col items-center gap-3 pt-2">
                    <button
                      onClick={savePb}
                      className="btn-primary w-full text-base hover:shadow-lg hover:shadow-kith-orange/25 hover:-translate-y-[1px]"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => {
                        setShowPaceInput(false);
                        next();
                      }}
                      className="font-body text-sm text-kith-muted hover:text-kith-text transition-colors py-2"
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════
              Step 4 — Invite / Share
              ═══════════════════════════════════════ */}
          {step === 4 && (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="space-y-3">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-kith-black tracking-tight">
                  Running is better together
                </h2>
                <p className="font-body text-base text-kith-muted max-w-[300px] mx-auto leading-relaxed">
                  Kith is more fun with friends. Invite your running crew and
                  start planning runs together.
                </p>
              </div>

              {/* ── Invite card with animated gradient border ── */}
              <div className="w-full max-w-[360px]">
                <div
                  className="relative rounded-[20px] p-[2px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #F95E2E, #FF7A50, #FFB088, #F95E2E)",
                    backgroundSize: "300% 300%",
                    animation: "gradientShift 6s linear infinite",
                  }}
                >
                  <div className="rounded-[18px] bg-white px-5 py-6 space-y-5">
                    {/* Crew preview avatars */}
                    <div className="flex items-center justify-center">
                      <div className="flex -space-x-3">
                        <div className="relative z-30">
                          <Avatar
                            src={avatarUrl}
                            username={username}
                            fullName={fullName}
                            size="md"
                            ring
                          />
                        </div>
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full bg-kith-surface border-2 border-white flex items-center justify-center"
                            style={{ zIndex: 20 - i }}
                          >
                            {i < 2 ? (
                              <span className="text-xs font-display font-bold text-kith-muted/60">
                                ?
                              </span>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 text-kith-muted/60"
                              >
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="font-body text-sm text-kith-text leading-relaxed">
                      When your friends join, you&apos;ll see their runs in your
                      feed and can plan runs together.
                    </p>

                    {/* Invite link bar */}
                    <div className="flex items-center gap-2 bg-kith-surface rounded-input px-3 py-2.5">
                      <span className="flex-1 font-body text-xs text-kith-muted truncate select-all">
                        {inviteLink}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="shrink-0 font-body text-xs font-medium text-kith-orange hover:text-kith-orange/80 transition-colors"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    {/* Share CTA */}
                    <button
                      onClick={handleShare}
                      className="btn-primary w-full text-base flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-kith-orange/25 hover:-translate-y-[1px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .799l6.733 3.365a2.5 2.5 0 11-.671 1.341l-6.733-3.365a2.5 2.5 0 110-3.482l6.733-3.366A2.52 2.52 0 0113 4.5z" />
                      </svg>
                      Share with friends
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={next}
                className="font-body text-sm text-kith-muted hover:text-kith-text transition-colors py-2"
              >
                I&apos;ll do this later
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════
              Step 5 — All set!
              ═══════════════════════════════════════ */}
          {step === 5 && (
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Celebration burst */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  animation: "fadeUp 0.5s ease-out both",
                }}
              >
                {/* Radiating pulse rings */}
                <div
                  className="absolute w-32 h-32 rounded-full border-2 border-kith-orange/10"
                  style={{
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <div
                  className="absolute w-44 h-44 rounded-full border border-kith-orange/5"
                  style={{
                    animation: "pulse 2s ease-in-out infinite 0.5s",
                  }}
                />

                {/* Checkmark circle */}
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full shadow-lg shadow-kith-orange/25"
                  style={{
                    background: "linear-gradient(135deg, #F95E2E, #FF7A50)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-10 h-10"
                    style={{
                      strokeDasharray: 20,
                      strokeDashoffset: 20,
                      animation: "checkDraw 0.6s ease-out 0.3s forwards",
                    }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              <div
                className="space-y-3"
                style={{
                  animation: "fadeUp 0.6s ease-out both",
                  animationDelay: "200ms",
                }}
              >
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-kith-black tracking-tight">
                  You&apos;re all set!
                </h2>
                <p className="font-body text-base text-kith-muted max-w-[260px] mx-auto">
                  Time to hit the road with your crew.
                </p>
              </div>

              {/* Profile summary card */}
              <div
                className="w-full max-w-[300px] bg-kith-surface rounded-card p-5 space-y-4"
                style={{
                  animation: "fadeUp 0.6s ease-out both",
                  animationDelay: "350ms",
                }}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={avatarUrl}
                    username={username}
                    fullName={fullName}
                    size="lg"
                  />
                  <div className="text-left min-w-0">
                    <p className="font-display font-bold text-sm text-kith-text truncate">
                      {fullName || username}
                    </p>
                    <p className="font-body text-xs text-kith-muted">
                      @{username}
                    </p>
                  </div>
                </div>

                {pbSaved && pbTime && (
                  <div className="flex items-center gap-2 pt-2 border-t border-kith-gray-light/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-kith-orange shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-body text-sm text-kith-text">
                      {PB_DISTANCE_LABELS[
                        PB_DISTANCES.find((d) => d.value === pbDistance)
                          ?.code ?? 5000
                      ] ?? pbDistance.toUpperCase()}{" "}
                      PB:{" "}
                      <span className="font-medium">{pbTime}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Final CTAs */}
              <div
                className="flex flex-col items-center gap-3 w-full max-w-[280px]"
                style={{
                  animation: "fadeUp 0.6s ease-out both",
                  animationDelay: "500ms",
                }}
              >
                <button
                  onClick={() => router.push("/run/new")}
                  className="btn-primary w-full text-base hover:shadow-lg hover:shadow-kith-orange/25 hover:-translate-y-[1px]"
                >
                  Post your first run
                </button>
                <button
                  onClick={() => router.push("/feed")}
                  className="btn-secondary w-full text-base"
                >
                  Explore the feed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom safe area ── */}
      <div className="shrink-0 h-[max(1.5rem,env(safe-area-inset-bottom))]" />

    </div>
  );
}
