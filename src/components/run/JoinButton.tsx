"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/notifications";
import { useRouter } from "next/navigation";

interface JoinButtonProps {
  runId: string;
  userId: string;
  isJoined: boolean;
  creatorId?: string;
}

export function JoinButton({ runId, userId, isJoined: initialJoined, creatorId }: JoinButtonProps) {
  // Don't render the join button for the run creator
  if (creatorId && userId === creatorId) return null;

  const [joined, setJoined] = useState(initialJoined);
  const [isPending, startTransition] = useTransition();
  const [animating, setAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const btnRef = useRef<HTMLButtonElement>(null);

  const triggerSpring = useCallback(() => {
    setAnimating(true);
    // Remove animation class after it completes so it can re-trigger
    setTimeout(() => setAnimating(false), 400);
  }, []);

  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 700);
  }, []);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const wasJoined = joined;

    // Optimistic update — respond immediately
    triggerSpring();
    setJoined(!wasJoined);
    if (!wasJoined) triggerCelebration();

    try {
      if (wasJoined) {
        const { error } = await supabase
          .from("run_participants")
          .delete()
          .eq("run_id", runId)
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("run_participants")
          .insert({ run_id: runId, user_id: userId });
        if (error) throw error;

        if (creatorId && userId !== creatorId) {
          createNotification({
            recipientId: creatorId,
            type: "run_joined",
            payload: { run_id: runId, user_id: userId },
          });
        }
      }

      startTransition(() => {
        router.refresh();
      });
    } catch {
      // Revert on failure
      setJoined(wasJoined);
    }
  }

  return (
    <span className="relative inline-flex items-center justify-center">
      {/* Celebration particles */}
      {showCelebration && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {[
            { x: -14, y: -10, color: "#F95E2E", delay: "0ms" },
            { x: 14,  y: -12, color: "#22C55E", delay: "50ms" },
            { x: -8,  y: -16, color: "#22C55E", delay: "100ms" },
            { x: 10,  y: -8,  color: "#F95E2E", delay: "75ms" },
            { x: 0,   y: -18, color: "#F95E2E", delay: "25ms" },
          ].map((p, i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full animate-join-celebrate"
              style={{
                backgroundColor: p.color,
                left: `calc(50% + ${p.x}px)`,
                top: `calc(50% + ${p.y}px)`,
                animationDelay: p.delay,
              }}
            />
          ))}
        </span>
      )}

      <button
        ref={btnRef}
        onClick={handleToggle}
        disabled={isPending}
        className={clsx(
          "relative rounded-pill px-5 py-2.5 min-h-[44px] text-sm font-body font-semibold transition-all duration-250 ease-out",
          animating && "animate-join-spring",
          joined
            ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            : "bg-kith-orange text-white shadow-sm hover:shadow-md hover:brightness-105 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
          isPending && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          {joined ? (
            <>
              You{"\u2019"}re in
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="inline-block"
                aria-hidden="true"
              >
                <path
                  d="M3 7.5L5.5 10L11 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="20"
                  className={showCelebration || animating ? "animate-check-draw" : ""}
                  style={{ strokeDashoffset: 0 }}
                />
              </svg>
            </>
          ) : (
            "I\u2019m in"
          )}
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {joined ? "You have joined this run" : ""}
      </span>
    </span>
  );
}
