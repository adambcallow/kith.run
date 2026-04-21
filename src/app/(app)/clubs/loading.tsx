export default function ClubsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page header */}
      <div>
        <div className="h-6 w-28 rounded bg-kith-surface" />
        <div className="h-4 w-64 rounded bg-kith-surface mt-2" />
      </div>

      {/* Suggest CTA */}
      <div className="h-24 rounded-card bg-kith-surface border-2 border-kith-surface" />

      {/* Club cards */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-card bg-white border border-kith-gray-light p-4 space-y-3"
          >
            {/* Top row */}
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-kith-surface shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-kith-surface" />
                <div className="h-3 w-20 rounded bg-kith-surface" />
              </div>
            </div>
            {/* Avatars row */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="w-7 h-7 rounded-full bg-kith-surface border-2 border-white"
                  style={{ marginLeft: j > 0 ? "-8px" : "0" }}
                />
              ))}
              <div className="h-3 w-16 rounded bg-kith-surface ml-2" />
            </div>
            {/* Button */}
            <div className="h-10 rounded-pill bg-kith-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
