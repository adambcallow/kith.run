"use client";

import { useState } from "react";

interface ShareData {
  title: string;
  text: string;
  url: string;
}

export function RunDetailActions({ shareData }: { shareData: ShareData }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        // Only pass title + url to avoid messy concatenation on some platforms
        await navigator.share({
          title: shareData.title,
          url: shareData.url,
        });
        return;
      } catch {
        // User cancelled — fall through to clipboard
      }
    }

    // Fallback: copy just the clean URL
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", shareData.url);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-kith-surface hover:bg-kith-gray-light/60 transition-all duration-150 active:scale-90"
      aria-label="Share run"
    >
      {copied ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-kith-text"
        >
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      )}
    </button>
  );
}
