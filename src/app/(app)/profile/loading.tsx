export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-[120px] h-[120px] rounded-full bg-kith-surface" />
        <div className="h-5 w-32 rounded bg-kith-surface" />
        <div className="h-4 w-20 rounded bg-kith-surface" />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <div className="h-11 w-28 rounded-pill bg-kith-surface" />
        <div className="h-11 w-28 rounded-pill bg-kith-surface" />
      </div>

      {/* Stats */}
      <div className="h-24 rounded-card bg-kith-surface" />

      {/* Badges */}
      <div className="space-y-3">
        <div className="h-4 w-16 rounded bg-kith-surface" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-card bg-kith-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
