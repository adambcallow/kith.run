"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/notifications";
import { useRouter } from "next/navigation";

type FriendStatus = "none" | "pending" | "accepted";

interface CrewButtonProps {
  currentUserId: string;
  profileUserId: string;
  status: FriendStatus;
}

export function CrewButton({
  currentUserId,
  profileUserId,
  status: initialStatus,
}: CrewButtonProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const router = useRouter();

  async function handleAdd() {
    if (isPending || status !== "none") return;
    const previousStatus = status;

    // Optimistic update
    setStatus("pending");

    try {
      const { error } = await supabase.from("friendships").insert({
        user_a: currentUserId,
        user_b: profileUserId,
        status: "pending",
      });
      if (error) throw error;

      createNotification({
        recipientId: profileUserId,
        type: "friend_request",
        payload: { user_id: currentUserId },
      });

      startTransition(() => router.refresh());
    } catch {
      // Revert on failure
      setStatus(previousStatus);
    }
  }

  if (status === "accepted") {
    return (
      <Button variant="secondary" disabled className="!border-green-500/30 !text-green-600 !bg-green-50 gap-1.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        In your crew
      </Button>
    );
  }

  if (status === "pending") {
    return (
      <Button variant="secondary" disabled className="!text-kith-muted gap-1.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Request sent
      </Button>
    );
  }

  return (
    <Button onClick={handleAdd} disabled={isPending} loading={isPending} className="gap-1.5">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
        <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      Add to crew
    </Button>
  );
}
