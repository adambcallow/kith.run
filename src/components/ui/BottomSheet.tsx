"use client";

import { useEffect, useRef } from "react";
import { clsx } from "clsx";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={clsx(
          "absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] px-6 pt-4 pb-8",
          "animate-[slideUp_200ms_ease-out]",
          "max-h-[85vh] overflow-y-auto"
        )}
      >
        <div className="w-10 h-1 bg-kith-gray-light rounded-full mx-auto mb-4" />
        {children}
      </div>
    </div>
  );
}
