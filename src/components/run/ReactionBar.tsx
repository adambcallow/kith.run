"use client";

import { useState } from "react";
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
  const supabase = createClient();

  const grouped = REACTION_EMOJIS.map((emoji) => {
    const matching = localReactions.filter((r) => r.emoji === emoji);
    const userReacted = matching.some((r) => r.user_id === currentUserId);
    return { emoji, count: matching.length, userReacted };
  });

  async function toggleReaction(emoji: string, userReacted: boolean) {
    if (!currentUserId) return;

    if (userReacted) {
      await supabase
        .from("reactions")
        .delete()
        .eq("run_id", runId)
        .eq("user_id", currentUserId)
        .eq("emoji", emoji);
      setLocalReactions((prev) =>
        prev.filter(
          (r) => !(r.user_id === currentUserId && r.emoji === emoji)
        )
      );
    } else {
      const { data } = await supabase
        .from("reactions")
        .insert({ run_id: runId, user_id: currentUserId, emoji })
        .select()
        .single();
      if (data) {
        setLocalReactions((prev) => [...prev, data]);
      }
    }
  }

  return (
    <div
      className="flex items-center gap-1.5 pt-2"
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
            "flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all",
            "hover:bg-kith-surface active:animate-emoji-bounce",
            userReacted
              ? "bg-kith-orange/10 border border-kith-orange/20"
              : "bg-kith-surface"
          )}
        >
          <span>{emoji}</span>
          {count > 0 && (
            <span className="text-xs text-kith-muted">{count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
