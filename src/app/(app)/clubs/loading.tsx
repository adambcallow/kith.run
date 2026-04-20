export default function ClubsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-28 rounded bg-kith-surface" />

      {/* Suggest CTA */}
      <div className="h-20 rounded-card bg-kith-surface" />

      {/* Club cards */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[76px] rounded-card bg-kith-surface" />
        ))}
      </div>
    </div>
  );
}
