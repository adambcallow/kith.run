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
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed — fall back to copy
        await copyToClipboard();
      }
    } else {
      await copyToClipboard();
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-kith-surface text-sm font-body font-medium text-kith-text hover:bg-kith-gray-light/50 transition-all duration-150 active:scale-95"
    >
      {copied ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            className="text-green-500"
          >
            <path
              d="M5 10L8.5 13.5L15 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            className="text-kith-muted"
          >
            <path
              d="M13 7L17 3M17 3H13M17 3V7M7 13L3 17M3 17H7M3 17V13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
