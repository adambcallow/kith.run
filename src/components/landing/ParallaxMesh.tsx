"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lightweight client wrapper that tracks mouse position on desktop
 * and exposes CSS custom properties for parallax offsets.
 *
 * --mx / --my range: -1 to 1 (normalised from viewport centre)
 *
 * Touch devices are ignored. All visual work happens in CSS via
 * calc() against these properties, so this adds near-zero JS cost.
 */
export default function ParallaxMesh({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch-primary devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.06);
      currentY = lerp(currentY, targetY, 0.06);

      if (ref.current) {
        ref.current.style.setProperty("--mx", currentX.toFixed(4));
        ref.current.style.setProperty("--my", currentY.toFixed(4));
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="parallax-root"
      style={
        {
          "--mx": "0",
          "--my": "0",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
