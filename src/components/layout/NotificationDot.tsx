interface NotificationDotProps {
  count: number;
}

export function NotificationDot({ count }: NotificationDotProps) {
  return (
    <span className="absolute -top-1 -right-1 bg-kith-orange text-white text-[10px] font-body font-medium min-w-[16px] h-4 rounded-full flex items-center justify-center animate-pop">
      {count > 9 ? "9+" : count}
    </span>
  );
}
