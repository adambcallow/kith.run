export default function NotificationsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-32 rounded bg-kith-surface" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4 rounded-card bg-kith-surface">
          <div className="w-10 h-10 rounded-full bg-kith-gray-light/30 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-kith-gray-light/30" />
            <div className="h-3 w-1/2 rounded bg-kith-gray-light/30" />
          </div>
        </div>
      ))}
    </div>
  );
}
