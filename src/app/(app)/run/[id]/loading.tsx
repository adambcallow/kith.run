export default function RunDetailLoading() {
  return (
    <div className="pb-8 -mx-4 sm:-mx-0 animate-pulse">
      {/* Back nav */}
      <div className="flex items-center justify-between px-4 sm:px-0 pt-2 pb-3">
        <div className="h-5 w-12 rounded bg-kith-surface" />
        <div className="h-8 w-8 rounded-full bg-kith-surface" />
      </div>

      {/* Map placeholder */}
      <div className="w-full h-64 sm:h-80 sm:rounded-card bg-kith-surface" />

      <div className="px-4 sm:px-0 mt-4 space-y-6">
        {/* Creator info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-kith-surface" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-kith-surface" />
            <div className="h-3 w-20 rounded bg-kith-surface" />
          </div>
          <div className="h-6 w-16 rounded-pill bg-kith-surface" />
        </div>

        {/* Title */}
        <div className="h-5 w-48 rounded bg-kith-surface" />

        {/* Details card */}
        <div className="rounded-card bg-kith-surface p-4 space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-kith-surface" />
            <div className="h-4 w-32 rounded bg-kith-surface" />
          </div>
          <div className="flex items-center gap-6">
            <div className="h-8 w-16 rounded bg-kith-surface" />
            <div className="h-6 w-24 rounded bg-kith-surface" />
          </div>
        </div>

        {/* Participants */}
        <div className="space-y-3">
          <div className="h-3 w-24 rounded bg-kith-surface" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-kith-surface" />
                <div className="h-3 w-16 rounded bg-kith-surface" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
