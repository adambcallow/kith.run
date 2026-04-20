import { FeedList } from "@/components/feed/FeedList";

export default function FeedLoading() {
  return (
    <div className="space-y-4">
      {/* Skeleton for the "Post a run" button */}
      <div className="h-12 w-full rounded-pill bg-kith-surface animate-pulse" />

      {/* Skeleton feed */}
      <FeedList sections={[]} currentUserId={undefined} loading />
    </div>
  );
}
