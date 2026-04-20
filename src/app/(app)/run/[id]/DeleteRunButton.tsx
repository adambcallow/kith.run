"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteRunButton({ runId }: { runId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset confirming state after 3 seconds
  useEffect(() => {
    if (confirming) {
      timeoutRef.current = setTimeout(() => setConfirming(false), 3000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [confirming]);

  async function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setDeleting(true);
    const { error } = await supabase.from("runs").delete().eq("id", runId);

    if (error) {
      setDeleting(false);
      setConfirming(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={deleting}
      className={`inline-flex items-center justify-center gap-1.5 rounded-pill px-4 py-2 text-sm font-body font-medium transition-all duration-200 active:scale-[0.97] ${
        confirming
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-kith-surface text-red-500 hover:bg-red-50"
      } ${deleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      {deleting ? (
        <>
          <span
            className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          Cancelling...
        </>
      ) : confirming ? (
        "Tap again to confirm"
      ) : (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Cancel run
        </>
      )}
    </button>
  );
}
