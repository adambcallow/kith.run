import Link from "next/link";

interface LiveRunBannerProps {
  runId: string;
  creatorName: string;
  place: string;
}

export function LiveRunBanner({ runId, creatorName, place }: LiveRunBannerProps) {
  return (
    <Link href={`/run/${runId}`}>
      <div className="bg-kith-orange/5 border border-kith-orange/20 rounded-card p-3 flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-kith-orange animate-live-pulse shrink-0" />
        <p className="font-body text-sm text-kith-text">
          <span className="font-medium">{creatorName}</span> is going now from{" "}
          <span className="font-medium">{place}</span>
        </p>
      </div>
    </Link>
  );
}
