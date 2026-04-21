"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PbTimePicker } from "@/components/profile/PbTimePicker";
import { AvatarUpload } from "./AvatarUpload";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import type { PersonalBest } from "@/types/database";

const BIO_MAX = 160;

const PB_DISTANCES = [
  { label: "5K", value: "5k" },
  { label: "10K", value: "10k" },
  { label: "Half Marathon", value: "half" },
  { label: "Marathon", value: "marathon" },
] as const;

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

  // PB state — one entry per distance, null means no PB set
  const [personalBests, setPersonalBests] = useState<Record<string, number | null>>({
    "5k": null,
    "10k": null,
    half: null,
    marathon: null,
  });

  // Strava profile URL
  const [stravaUrl, setStravaUrl] = useState("");

  // Instagram handle
  const [instagram, setInstagram] = useState("");

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
        .select("username, full_name, avatar_url, bio, pace_min, pace_max, strava_id, instagram, personal_bests")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setUsername(profile.username ?? "");
        setBio(profile.bio ?? "");
        setAvatarUrl(profile.avatar_url ?? null);
        setStravaUrl(profile.strava_id ?? "");
        setInstagram(profile.instagram ?? "");

        // Load personal_bests from jsonb column
        const pbs = (profile.personal_bests as PersonalBest[] | null) ?? [];
        const loaded: Record<string, number | null> = {
          "5k": null,
          "10k": null,
          half: null,
          marathon: null,
        };

        if (pbs.length > 0) {
          for (const pb of pbs) {
            loaded[pb.distance] = pb.seconds;
          }
        } else if (profile.pace_min && profile.pace_max) {
          // Migrate from old pace_min/pace_max fields
          const dist = codeToDistance[profile.pace_max];
          if (dist) {
            loaded[dist] = profile.pace_min;
          }
        }

        setPersonalBests(loaded);
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

    // Build personal_bests array from the record (only non-null entries)
    const pbArray: PersonalBest[] = [];
    for (const d of PB_DISTANCES) {
      const secs = personalBests[d.value];
      if (secs != null && secs > 0) {
        pbArray.push({ distance: d.value as PersonalBest["distance"], seconds: secs });
      }
    }

    // Backward compat: write the fastest PB to pace_min/pace_max
    let backcompatMin: number | null = null;
    let backcompatMax: number | null = null;
    if (pbArray.length > 0) {
      // Pick the first PB by distance order as the "primary" for backward compat
      backcompatMin = pbArray[0].seconds;
      backcompatMax = distanceToCode[pbArray[0].distance] ?? null;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl,
        personal_bests: pbArray,
        pace_min: backcompatMin,
        pace_max: backcompatMax,
        strava_id: stravaUrl.trim() || null,
        instagram: instagram.trim().replace(/^@/, "") || null,
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
              onUpload={(url) => {
                setAvatarUrl(url);
                // Persist immediately so avatar isn't lost if user navigates away
                supabase.from("profiles").update({ avatar_url: url }).eq("id", userId);
              }}
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

        {/* Personal Bests */}
        <section className="bg-kith-surface rounded-card p-5 space-y-4">
          <div>
            <h2 className="font-display font-bold text-sm text-kith-text">
              Personal bests
            </h2>
            <p className="font-body text-xs text-kith-muted mt-0.5">
              Add your PB for each distance
            </p>
          </div>

          {/* Distance list — one row per distance */}
          <div className="space-y-4">
            {PB_DISTANCES.map((d) => {
              const hasValue = personalBests[d.value] != null && personalBests[d.value]! > 0;
              return (
                <div key={d.value} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {hasValue && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 text-kith-orange"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className="font-body text-sm font-medium text-kith-text">
                        {d.label}
                      </span>
                    </div>
                    {hasValue && (
                      <button
                        type="button"
                        onClick={() =>
                          setPersonalBests((prev) => ({ ...prev, [d.value]: null }))
                        }
                        className="flex items-center gap-1 text-xs font-body text-kith-muted hover:text-red-500 transition-colors"
                        aria-label={`Clear ${d.label} PB`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                        Clear
                      </button>
                    )}
                  </div>
                  <PbTimePicker
                    value={personalBests[d.value] ?? null}
                    onChange={(secs) =>
                      setPersonalBests((prev) => ({ ...prev, [d.value]: secs }))
                    }
                    showHours={d.value === "half" || d.value === "marathon"}
                  />
                </div>
              );
            })}
          </div>
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

        {/* Instagram */}
        <section className="bg-kith-surface rounded-card p-5 space-y-3">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="#E1306C" strokeWidth="2" />
              <circle cx="12" cy="12" r="5" stroke="#E1306C" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="#E1306C" />
            </svg>
            <div>
              <h2 className="font-display font-bold text-sm text-kith-text">
                Instagram
              </h2>
              <p className="font-body text-xs text-kith-muted">
                Add your Instagram handle so your crew can find you
              </p>
            </div>
          </div>
          <Input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@yourusername"
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
