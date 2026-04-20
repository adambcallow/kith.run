"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface JoinButtonProps {
  runId: string;
  userId: string;
  isJoined: boolean;
}

export function JoinButton({ runId, userId, isJoined: initialJoined }: JoinButtonProps) {
  const [joined, setJoined] = useState(initialJoined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (joined) {
      await supabase
        .from("run_participants")
        .delete()
        .eq("run_id", runId)
        .eq("user_id", userId);
      setJoined(false);
    } else {
      await supabase
        .from("run_participants")
        .insert({ run_id: runId, user_id: userId });
      setJoined(true);
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={clsx(
        "rounded-pill px-4 py-1.5 text-sm font-body font-medium transition-all active:scale-95",
        joined
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-kith-orange text-white"
      )}
    >
      {joined ? "You\u2019re in \u2713" : "Join \u2192"}
    </button>
  );
}
