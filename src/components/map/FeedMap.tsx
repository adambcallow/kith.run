"use client";

import { useRouter } from "next/navigation";
import { LeafletMap } from "./LeafletMap";
import { RunMarker } from "./RunMarker";
import type { Run } from "@/types/database";
import type { LatLngExpression } from "leaflet";

interface FeedMapRun {
  run: Run;
  creatorName: string;
}

interface FeedMapProps {
  runs: FeedMapRun[];
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
}

/* Dubai default */
const DUBAI_CENTER: LatLngExpression = [25.2048, 55.2708];

export function FeedMap({
  runs,
  center = DUBAI_CENTER,
  zoom = 12,
  className = "w-full h-[50vh] rounded-card overflow-hidden",
}: FeedMapProps) {
  const router = useRouter();

  return (
    <LeafletMap center={center} zoom={zoom} className={className}>
      {runs.map(({ run, creatorName }) => (
        <RunMarker
          key={run.id}
          run={run}
          creatorName={creatorName}
          isLive={run.is_live}
          onClick={() => router.push(`/run/${run.id}`)}
        />
      ))}
    </LeafletMap>
  );
}
