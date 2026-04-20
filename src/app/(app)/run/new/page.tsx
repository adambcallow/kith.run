"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LocationPicker } from "@/components/map/LocationPicker";
import { PaceSlider } from "@/components/run/PaceSlider";

export default function NewRunPage() {
  const router = useRouter();
  const supabase = createClient();

  const [location, setLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [paceMin, setPaceMin] = useState(300);
  const [paceMax, setPaceMax] = useState(360);
  const [note, setNote] = useState("");
  const [visibility, setVisibility] = useState<"crew" | "public">("crew");
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location) {
      setError("Pick a start location");
      return;
    }
    setError("");
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

    const { error: insertError } = await supabase.from("runs").insert({
      creator_id: user.id,
      start_lat: location.lat,
      start_lng: location.lng,
      start_place: location.name,
      scheduled_at: scheduledAt,
      distance_km: parseFloat(distance),
      pace_min_target: paceMin,
      pace_max_target: paceMax,
      note: note.trim() || null,
      visibility,
      is_live: isLive,
      expires_at: expiresAt,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl text-kith-text">
        Post a run
      </h1>

      {/* Going now toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          className={`relative w-11 h-6 rounded-full transition-colors ${
            isLive ? "bg-kith-orange" : "bg-kith-gray-light"
          }`}
          onClick={() => setIsLive(!isLive)}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              isLive ? "translate-x-5" : ""
            }`}
          />
        </div>
        <span className="font-body text-sm font-medium text-kith-text">
          Going now
        </span>
      </label>

      <form onSubmit={handleSubmit} className="space-y-5">
        <LocationPicker onSelect={setLocation} />

        {!isLive && (
          <Input
            label="Date & time"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required={!isLive}
          />
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-body font-medium text-kith-text">
            Distance (km)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-input border border-kith-gray-light flex items-center justify-center text-lg font-body text-kith-text"
              onClick={() =>
                setDistance(String(Math.max(0, (parseFloat(distance) || 0) - 0.5)))
              }
            >
              -
            </button>
            <Input
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="0"
              type="number"
              step="0.5"
              min="0"
              required
              className="text-center"
            />
            <button
              type="button"
              className="w-10 h-10 rounded-input border border-kith-gray-light flex items-center justify-center text-lg font-body text-kith-text"
              onClick={() =>
                setDistance(String((parseFloat(distance) || 0) + 0.5))
              }
            >
              +
            </button>
          </div>
        </div>

        <PaceSlider
          minValue={paceMin}
          maxValue={paceMax}
          onChange={(min, max) => {
            setPaceMin(min);
            setPaceMax(max);
          }}
        />

        <Input
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder='Coffee at %Arabica after'
        />

        {/* Visibility */}
        <div className="space-y-1.5">
          <label className="text-sm font-body font-medium text-kith-text">
            Visibility
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVisibility("crew")}
              className={`flex-1 py-2 rounded-pill text-sm font-body font-medium transition-colors ${
                visibility === "crew"
                  ? "bg-kith-black text-white"
                  : "bg-kith-surface text-kith-muted"
              }`}
            >
              Crew only
            </button>
            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={`flex-1 py-2 rounded-pill text-sm font-body font-medium transition-colors ${
                visibility === "public"
                  ? "bg-kith-black text-white"
                  : "bg-kith-surface text-kith-muted"
              }`}
            >
              Public
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-body">{error}</p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Posting..." : "Post run"}
        </Button>
      </form>
    </div>
  );
}
