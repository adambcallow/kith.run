interface NotificationDotProps {
  count: number;
}

export function NotificationDot({ count }: NotificationDotProps) {
  return (
    <span className="absolute -top-1.5 -right-1.5 bg-kith-orange text-white text-[10px] font-body font-medium min-w-[18px] h-[18px] rounded-full flex items-center justify-center animate-pop shadow-sm shadow-kith-orange/40 leading-none px-1">
      {count > 9 ? "9+" : count}
    </span>
  );
}
