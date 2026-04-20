"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[profile error boundary]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="rounded-card bg-kith-surface p-8 w-full max-w-sm space-y-5">
        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-xl text-kith-text">
            This profile couldn't be loaded
          </h1>
          <p className="font-body text-sm text-kith-muted leading-relaxed">
            Something went wrong loading this profile. Try again or head back to
            your feed.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={reset} className="btn-primary w-full">
            Try again
          </button>
          <Link
            href="/feed"
            className="btn-ghost w-full inline-flex items-center justify-center"
          >
            Back to feed
          </Link>
        </div>
      </div>
    </div>
  );
}
