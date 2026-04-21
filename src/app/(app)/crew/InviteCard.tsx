"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface InviteCardProps {
  userId: string;
}

export function InviteCard({ userId }: InviteCardProps) {
  const [copied, setCopied] = useState(false);

  function getInviteUrl() {
    return `${window.location.origin}/invite/${userId}`;
  }

  async function handleShare() {
    const url = getInviteUrl();

    // Try native share first — pass URL in both url and text fields
    // to ensure it shows on all platforms
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Kith",
          text: `Run with me on Kith! ${url}`,
          url,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: prompt
      window.prompt("Copy your invite link:", url);
    }
  }

  return (
    <div className="bg-kith-surface border border-kith-gray-light rounded-card p-4 space-y-3">
      <p className="font-body text-sm font-medium text-kith-text">
        Invite your crew
      </p>
      <p className="font-body text-xs text-kith-muted">
        Share your link — anyone who signs up through it is automatically added to your crew.
      </p>
      <Button variant="secondary" onClick={handleShare}>
        {copied ? "Link copied!" : "Share invite link"}
      </Button>
    </div>
  );
}
