export default function CrewLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-28 rounded bg-kith-surface" />

      {/* Search */}
      <div className="h-12 rounded-input bg-kith-surface" />

      {/* Invite card */}
      <div className="h-20 rounded-card bg-kith-surface" />

      {/* Crew members */}
      <div className="space-y-3">
        <div className="h-4 w-24 rounded bg-kith-surface" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-card bg-kith-surface" />
        ))}
      </div>
    </div>
  );
}
