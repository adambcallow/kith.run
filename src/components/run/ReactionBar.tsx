"use client";

import { useState, useCallback } from "react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import type { Reaction } from "@/types/database";

const REACTION_EMOJIS = ["\uD83D\uDD25", "\uD83D\uDCAA", "\uD83D\uDE4C", "\u2764\uFE0F", "\uD83D\uDE05"];

interface ReactionBarProps {
  runId: string;
  reactions: Reaction[];
  currentUserId?: string;
}

export function ReactionBar({ runId, reactions, currentUserId }: ReactionBarProps) {
  const [localReactions, setLocalReactions] = useState(reactions);
  const [poppedEmoji, setPoppedEmoji] = useState<string | null>(null);
  const [countKey, setCountKey] = useState(0);
  const supabase = createClient();

  const grouped = REACTION_EMOJIS.map((emoji) => {
    const matching = localReactions.filter((r) => r.emoji === emoji);
    const userReacted = matching.some((r) => r.user_id === currentUserId);
    return { emoji, count: matching.length, userReacted };
  });

  const triggerEmojiPop = useCallback((emoji: string) => {
    setPoppedEmoji(emoji);
    setCountKey((k) => k + 1);
    setTimeout(() => setPoppedEmoji(null), 300);
  }, []);

  async function toggleReaction(emoji: string, userReacted: boolean) {
    if (!currentUserId) return;

    const previousReactions = localReactions;

    // Optimistic update — respond immediately
    triggerEmojiPop(emoji);

    if (userReacted) {
      setLocalReactions((prev) =>
        prev.filter(
          (r) => !(r.user_id === currentUserId && r.emoji === emoji)
        )
      );
    } else {
      const optimisticReaction = {
        id: `optimistic-${crypto.randomUUID()}`,
        run_id: runId,
        user_id: currentUserId,
        emoji,
        created_at: new Date().toISOString(),
      } as Reaction;
      setLocalReactions((prev) => [...prev, optimisticReaction]);
    }

    try {
      if (userReacted) {
        const { error } = await supabase
          .from("reactions")
          .delete()
          .eq("run_id", runId)
          .eq("user_id", currentUserId)
          .eq("emoji", emoji);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("reactions")
          .insert({ run_id: runId, user_id: currentUserId, emoji })
          .select()
          .single();
        if (error) throw error;
        // Replace optimistic placeholder with real server data
        if (data) {
          setLocalReactions((prev) =>
            prev.map((r) =>
              r.id.startsWith("optimistic-") && r.emoji === emoji ? data : r
            )
          );
        }
      }
    } catch {
      // Revert on failure
      setLocalReactions(previousReactions);
    }
  }

  return (
    <div
      className="flex items-center gap-2 pt-2"
      onClick={(e) => e.preventDefault()}
    >
      {grouped.map(({ emoji, count, userReacted }) => (
        <button
          key={emoji}
          onClick={(e) => {
            e.stopPropagation();
            toggleReaction(emoji, userReacted);
          }}
          className={clsx(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-base transition-all duration-200",
            "hover:scale-105",
            userReacted
              ? "bg-kith-orange/15 border-2 border-kith-orange/30 shadow-sm"
              : "bg-kith-surface border border-transparent text-kith-muted/60 hover:bg-kith-gray-light/30 hover:text-kith-muted"
          )}
        >
          <span
            className={clsx(
              "inline-block transition-all duration-150",
              !userReacted && "grayscale-[30%]",
              poppedEmoji === emoji && "animate-emoji-pop"
            )}
          >
            {emoji}
          </span>
          {count > 0 && (
            <span
              key={`${emoji}-${countKey}`}
              className={clsx(
                "text-xs font-body font-medium tabular-nums animate-count-slide-in",
                userReacted ? "text-kith-orange" : "text-kith-muted"
              )}
            >
              {count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
