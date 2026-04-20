"use client";

import { useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface CancelRequestButtonProps {
  friendshipId: string;
}

export function CancelRequestButton({ friendshipId }: CancelRequestButtonProps) {
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const router = useRouter();

  async function handleCancel() {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);
    if (!error) {
      startTransition(() => router.refresh());
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="font-body text-xs text-kith-muted hover:text-red-500 transition-colors min-h-[44px] px-2 disabled:opacity-50"
    >
      {isPending ? "Cancelling…" : "Cancel"}
    </button>
  );
}
