"use client";

import { useCallback, useEffect, useRef } from "react";
import { clsx } from "clsx";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  // Focus management: focus first focusable element on open, restore focus on close
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      // Wait for the sheet to render before focusing
      requestAnimationFrame(() => {
        if (sheetRef.current) {
          const focusable = sheetRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable) {
            focusable.focus();
          } else {
            sheetRef.current.focus();
          }
        }
      });
    } else {
      // Restore focus to previously focused element when sheet closes
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        className={clsx(
          "absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] px-6 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]",
          "animate-slide-up",
          "max-h-[85vh] overflow-y-auto"
        )}
      >
        <div className="w-10 h-1 bg-kith-gray-light rounded-full mx-auto mb-4" />
        {children}
      </div>
    </div>
  );
}
