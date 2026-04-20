import { clsx } from "clsx";

type BadgeVariant = "public" | "live" | "crew" | "pace";

const variantStyles: Record<BadgeVariant, string> = {
  public: "bg-kith-surface text-kith-muted",
  live: "bg-kith-orange/10 text-kith-orange",
  crew: "bg-kith-black/5 text-kith-black",
  pace: "bg-kith-surface text-kith-text",
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-body font-medium",
        variantStyles[variant],
        className
      )}
    >
      {variant === "live" && (
        <span className="w-2 h-2 rounded-full bg-kith-orange animate-live-pulse" />
      )}
      {children}
    </span>
  );
}
