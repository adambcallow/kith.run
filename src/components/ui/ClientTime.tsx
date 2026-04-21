"use client";

import { useState, useEffect } from "react";
import { formatRelativeRunTime } from "@/lib/utils";

/**
 * Renders a formatted time string on the client side only.
 * This avoids the timezone mismatch where the server (UTC) renders
 * a different time than the user's browser (local timezone).
 */
export function ClientTime({ dateStr, className }: { dateStr: string; className?: string }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    setFormatted(formatRelativeRunTime(dateStr));
  }, [dateStr]);

  if (!formatted) {
    // Minimal placeholder during SSR / first render
    return <span className={className}>&nbsp;</span>;
  }

  return <span className={className}>{formatted}</span>;
}
