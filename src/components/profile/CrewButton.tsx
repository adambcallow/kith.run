"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
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
    await supabase.from("friendships").insert({
      user_a: currentUserId,
      user_b: profileUserId,
      status: "pending",
    });
    setStatus("pending");
    startTransition(() => router.refresh());
  }

  if (status === "accepted") {
    return (
      <Button variant="secondary" disabled>
        Crew
      </Button>
    );
  }

  if (status === "pending") {
    return (
      <Button variant="secondary" disabled>
        Pending
      </Button>
    );
  }

  return (
    <Button onClick={handleAdd} disabled={isPending}>
      Add to crew
    </Button>
  );
}
