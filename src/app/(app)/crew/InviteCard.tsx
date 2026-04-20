"use client";

import { Button } from "@/components/ui/Button";

interface InviteCardProps {
  userId: string;
}

export function InviteCard({ userId }: InviteCardProps) {
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: "Join me on Kith",
        text: "Run with me on Kith!",
        url: `${window.location.origin}/invite/${userId}`,
      });
    }
  }

  return (
    <div className="bg-kith-surface border border-kith-gray-light rounded-card p-4 space-y-3">
      <p className="font-body text-sm font-medium text-kith-text">
        Invite your crew
      </p>
      <p className="font-body text-xs text-kith-muted">
        Share your link and run together.
      </p>
      <Button variant="secondary" onClick={handleShare}>
        Share invite link
      </Button>
    </div>
  );
}
