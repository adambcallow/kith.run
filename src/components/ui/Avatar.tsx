"use client";

import { clsx } from "clsx";
import { avatarFallbackColor, getInitials } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<AvatarSize, string> = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-[120px] h-[120px] text-2xl",
};

interface AvatarProps {
  src?: string | null;
  username: string;
  fullName?: string | null;
  size?: AvatarSize;
  showOnline?: boolean;
  ring?: boolean;
  className?: string;
}

export function Avatar({
  src,
  username,
  fullName,
  size = "md",
  showOnline,
  ring,
  className,
}: AvatarProps) {
  const initials = getInitials(fullName ?? null, username);
  const fallbackBg = avatarFallbackColor(username);

  return (
    <div
      className={clsx(
        "relative inline-flex shrink-0",
        ring && "ring-2 ring-white rounded-full",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={fullName ?? username}
          loading="lazy"
          className={clsx("rounded-full object-cover", sizeMap[size])}
        />
      ) : (
        <div
          className={clsx(
            "rounded-full flex items-center justify-center font-display font-semibold text-white",
            sizeMap[size]
          )}
          style={{
            backgroundColor: fallbackBg,
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          {initials}
        </div>
      )}
      {showOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}
