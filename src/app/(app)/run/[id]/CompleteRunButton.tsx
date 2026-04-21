"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const RATING_OPTIONS = [
  { emoji: "\uD83D\uDE13", label: "Tough" },
  { emoji: "\uD83D\uDCAA", label: "Solid" },
  { emoji: "\uD83D\uDE4C", label: "Great" },
  { emoji: "\uD83D\uDD25", label: "Amazing" },
  { emoji: "\uD83E\uDD29", label: "Best ever" },
];

interface CompleteRunButtonProps {
  runId: string;
  isCreator: boolean;
  onComplete?: () => void;
}

export function CompleteRunButton({
  runId,
  isCreator,
  onComplete,
}: CompleteRunButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(index: number) {
    if (submitting) return;
    setSelected(index);
    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const emoji = RATING_OPTIONS[index].emoji;

    try {
      // If creator, mark the run as completed
      if (isCreator) {
        const { error: statusError } = await supabase
          .from("runs")
          .update({ status: "completed" })
          .eq("id", runId);
        if (statusError) throw statusError;
      }

      // Add a reaction with the selected emoji
      const { error: reactionError } = await supabase
        .from("reactions")
        .insert({ run_id: runId, user_id: user.id, emoji });
      if (reactionError) throw reactionError;

      setDone(true);
      onComplete?.();

      setTimeout(() => {
        router.refresh();
      }, 1200);
    } catch {
      setError("Something went wrong. Try again.");
      setSelected(null);
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-card bg-kith-surface p-4 text-center animate-fade-in-up">
        <span
          className="inline-block text-3xl animate-emoji-pop"
          role="img"
          aria-label={RATING_OPTIONS[selected!].label}
        >
          {RATING_OPTIONS[selected!].emoji}
        </span>
        <p className="font-display font-semibold text-base text-kith-text mt-2">
          Run logged!
        </p>
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full rounded-card bg-kith-surface p-4 text-center transition-all duration-200 hover:bg-kith-gray-light/50 active:scale-[0.98]"
      >
        <p className="font-display font-semibold text-base text-kith-text">
          {isCreator ? "How was the run?" : "I did it!"}
        </p>
        <p className="font-body text-xs text-kith-muted mt-0.5">
          Tap to rate and log this run
        </p>
      </button>
    );
  }

  return (
    <div className="rounded-card bg-kith-surface p-4 space-y-3 animate-fade-in-up">
      <p className="font-display font-semibold text-sm text-kith-text text-center">
        {isCreator ? "How was the run?" : "How did it go?"}
      </p>
      <div className="flex items-center justify-center gap-3">
        {RATING_OPTIONS.map((option, index) => (
          <button
            key={option.label}
            type="button"
            onClick={() => handleSelect(index)}
            disabled={submitting}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              submitting && selected !== index ? "opacity-30 scale-90" : ""
            }`}
          >
            <span
              className={`w-12 h-12 flex items-center justify-center rounded-full border-2 text-xl transition-all duration-200 ${
                selected === index
                  ? "border-kith-orange ring-2 ring-kith-orange/30 scale-110"
                  : "border-kith-gray-light hover:border-kith-orange/40 hover:scale-105 active:scale-95"
              }`}
            >
              {option.emoji}
            </span>
            <span className="font-body text-[10px] text-kith-muted">
              {option.label}
            </span>
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 font-body text-center">{error}</p>}
    </div>
  );
}
