"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface FriendRequestActionsProps {
  friendshipId: string;
}

export function FriendRequestActions({ friendshipId }: FriendRequestActionsProps) {
  const [resolved, setResolved] = useState<"accepted" | "declined" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<"accept" | "decline" | null>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleAccept() {
    setActiveAction("accept");
    try {
      const { error } = await supabase
        .from("friendships")
        .update({ status: "accepted" })
        .eq("id", friendshipId);
      if (error) throw error;
      setResolved("accepted");
      startTransition(() => router.refresh());
    } catch {
      setActiveAction(null);
    }
  }

  async function handleDecline() {
    setActiveAction("decline");
    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);
      if (error) throw error;
      setResolved("declined");
      startTransition(() => router.refresh());
    } catch {
      setActiveAction(null);
    }
  }

  if (resolved === "accepted") {
    return (
      <span className="font-body text-xs text-green-600 font-medium">
        Accepted
      </span>
    );
  }

  if (resolved === "declined") {
    return (
      <span className="font-body text-xs text-kith-muted">
        Declined
      </span>
    );
  }

  const isLoading = activeAction !== null;

  return (
    <div className="flex gap-2">
      <Button
        variant="primary"
        className="text-xs px-3 py-1.5"
        onClick={handleAccept}
        disabled={isLoading || isPending}
        loading={activeAction === "accept"}
      >
        Accept
      </Button>
      <Button
        variant="ghost"
        className="text-xs px-3 py-1.5 text-kith-muted"
        onClick={handleDecline}
        disabled={isLoading || isPending}
        loading={activeAction === "decline"}
      >
        Decline
      </Button>
    </div>
  );
}
