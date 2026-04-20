"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface RemoveCrewButtonProps {
  friendshipId: string;
}

export function RemoveCrewButton({ friendshipId }: RemoveCrewButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const router = useRouter();

  async function handleRemove() {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);
    if (error) {
      setConfirming(false);
      return;
    }
    startTransition(() => router.refresh());
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
        <span className="font-body text-xs text-red-500">Remove?</span>
        <button
          onClick={handleRemove}
          disabled={isPending}
          className="font-body text-xs font-medium text-red-500 hover:text-red-700 min-h-[44px] px-2 disabled:opacity-50"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="font-body text-xs text-kith-muted hover:text-kith-text min-h-[44px] px-2 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setConfirming(true);
      }}
      className="font-body text-xs text-kith-muted hover:text-red-500 transition-colors min-h-[44px] px-2"
    >
      Remove
    </button>
  );
}
