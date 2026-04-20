"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AvatarUpload } from "./AvatarUpload";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

const BIO_MAX = 160;

const PB_DISTANCES = [
  { label: "5K", value: "5k" },
  { label: "10K", value: "10k" },
  { label: "Half Marathon", value: "half" },
  { label: "Marathon", value: "marathon" },
] as const;

function parsePbMinutes(str: string): number | null {
  const parts = str.split(":").map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}

function formatPbTime(totalSeconds: number): string {
  if (totalSeconds >= 3600) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // PB state — stored as JSON in the bio metadata or pace_min/pace_max
  // We'll use pace_min to store PB seconds, pace_max to encode the distance
  // Distance encoding: 5k=5000, 10k=10000, half=21097, marathon=42195
  const [pbDistance, setPbDistance] = useState<string>("5k");
  const [pbTime, setPbTime] = useState("");

  // Strava profile URL
  const [stravaUrl, setStravaUrl] = useState("");

  const [generalError, setGeneralError] = useState<string | null>(null);

  const distanceToCode: Record<string, number> = {
    "5k": 5000,
    "10k": 10000,
    half: 21097,
    marathon: 42195,
  };

  const codeToDistance: Record<number, string> = {
    5000: "5k",
    10000: "10k",
    21097: "half",
    42195: "marathon",
  };

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, bio, pace_min, pace_max, strava_id")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setUsername(profile.username ?? "");
        setBio(profile.bio ?? "");
        setAvatarUrl(profile.avatar_url ?? null);
        setStravaUrl(profile.strava_id ?? "");

        // Decode PB from pace_min (seconds) and pace_max (distance code)
        if (profile.pace_min && profile.pace_max) {
          const dist = codeToDistance[profile.pace_max];
          if (dist) {
            setPbDistance(dist);
            setPbTime(formatPbTime(profile.pace_min));
          }
        }
      }

      setLoading(false);
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError(null);

    setSaving(true);

    // Encode PB
    const pbSeconds = pbTime ? parsePbMinutes(pbTime) : null;
    const pbDistCode = distanceToCode[pbDistance] ?? null;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl,
        pace_min: pbSeconds,
        pace_max: pbDistCode,
        strava_id: stravaUrl.trim() || null,
      })
      .eq("id", userId!);

    setSaving(false);

    if (error) {
      setGeneralError("Something went wrong. Please try again.");
      return;
    }

    setSaved(true);
    setTimeout(() => {
      router.push("/profile");
    }, 800);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-kith-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="pb-12 pt-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/profile"
          className="flex items-center justify-center w-11 h-11 -ml-2 rounded-full hover:bg-kith-surface transition-colors"
          aria-label="Back to profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-kith-text"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="font-display text-xl font-bold text-kith-text">
          Edit profile
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar */}
        <section className="flex justify-center">
          {userId && (
            <AvatarUpload
              currentUrl={avatarUrl}
              username={username}
              fullName={fullName}
              userId={userId}
              onUpload={(url) => setAvatarUrl(url)}
            />
          )}
        </section>

        {/* Basic info */}
        <section className="space-y-6">
          <Input
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />

          {/* Username is locked at signup — shown read-only */}
          <div className="space-y-1.5">
            <label className="text-sm font-body font-medium text-kith-text">
              Username
            </label>
            <div className="flex items-center gap-2 rounded-input border border-kith-gray-light bg-kith-surface py-3 px-4">
              <span className="font-body text-base text-kith-muted select-none">@</span>
              <span className="font-body text-base text-kith-text">{username}</span>
            </div>
            <p className="text-xs font-body text-kith-muted">
              Your username was set when you signed up and can&apos;t be changed.
            </p>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="bio"
              className="text-sm font-body font-medium text-kith-text"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= BIO_MAX) setBio(e.target.value);
              }}
              placeholder="A few words about you..."
              rows={3}
              maxLength={BIO_MAX}
              className="w-full rounded-input border border-kith-gray-light bg-white py-3 px-4 font-body text-base text-kith-text placeholder:text-kith-muted focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200 resize-none leading-relaxed"
            />
            <div className="flex justify-end">
              <span
                className={`font-body text-xs transition-colors ${
                  bio.length >= BIO_MAX
                    ? "text-red-500"
                    : bio.length >= BIO_MAX - 20
                    ? "text-kith-orange"
                    : "text-kith-muted"
                }`}
              >
                {bio.length}/{BIO_MAX}
              </span>
            </div>
          </div>
        </section>

        {/* Personal Best */}
        <section className="bg-kith-surface rounded-card p-5 space-y-4">
          <div>
            <h2 className="font-display font-bold text-sm text-kith-text">
              Personal best
            </h2>
            <p className="font-body text-xs text-kith-muted mt-0.5">
              Pick a distance and enter your PB
            </p>
          </div>

          {/* Distance selector */}
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

          {/* PB time input */}
          <Input
            label={`Your ${PB_DISTANCES.find((d) => d.value === pbDistance)?.label} time`}
            value={pbTime}
            onChange={(e) => setPbTime(e.target.value)}
            placeholder={pbDistance === "5k" || pbDistance === "10k" ? "MM:SS" : "H:MM:SS"}
          />
        </section>

        {/* Strava */}
        <section className="bg-kith-surface rounded-card p-5 space-y-3">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116z" fill="#FC4C02" />
              <path d="M10.233 13.828L7.2 7.757 4.168 13.828H7.2l3.033 0zM7.2 0L0 14.396h4.168L7.2 7.757l3.033 6.639h4.168L7.2 0z" fill="#FC4C02" />
            </svg>
            <div>
              <h2 className="font-display font-bold text-sm text-kith-text">
                Strava
              </h2>
              <p className="font-body text-xs text-kith-muted">
                Paste your Strava profile link so your crew can follow you
              </p>
            </div>
          </div>
          <Input
            value={stravaUrl}
            onChange={(e) => setStravaUrl(e.target.value)}
            placeholder="https://www.strava.com/athletes/..."
          />
        </section>

        {/* Error */}
        {generalError && <ErrorAlert message={generalError} />}

        {/* Save */}
        <Button
          type="submit"
          fullWidth
          loading={saving}
          disabled={saving}
          className="!mt-10"
        >
          {saved ? "Saved!" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
