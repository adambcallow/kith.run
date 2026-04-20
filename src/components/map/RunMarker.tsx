"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Run } from "@/types/database";

interface RunMarkerProps {
  run: Run;
  creatorName: string;
  isLive?: boolean;
  onClick?: () => void;
}

function formatDistance(km: number): string {
  return km % 1 === 0 ? `${km} km` : `${km.toFixed(1)} km`;
}

function formatRunTime(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60_000);

  if (diffMins < 0) {
    const agoMins = Math.abs(diffMins);
    if (agoMins < 60) return `${agoMins}m ago`;
    const hrs = Math.floor(agoMins / 60);
    return `${hrs}h ago`;
  }
  if (diffMins < 60) return `in ${diffMins}m`;
  if (diffMins < 1440) {
    const hrs = Math.floor(diffMins / 60);
    return `in ${hrs}h`;
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/* ── Create a Leaflet DivIcon for custom styled markers ── */
function createRunIcon(isLive: boolean, isCompleted: boolean): L.DivIcon {
  const dotColor = isCompleted
    ? "#8A8F99"
    : "#F95E2E";

  const pulseRing = isLive
    ? `<span class="kith-marker-pulse"></span>`
    : "";

  const html = `
    <div class="kith-run-marker ${isLive ? "kith-run-marker--live" : ""} ${isCompleted ? "kith-run-marker--completed" : ""}">
      ${pulseRing}
      <span class="kith-run-marker-dot" style="background:${dotColor}"></span>
    </div>
  `;

  return L.divIcon({
    html,
    className: "kith-run-marker-wrapper",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

export function RunMarker({
  run,
  creatorName,
  isLive = false,
  onClick,
}: RunMarkerProps) {
  const isCompleted = run.status === "completed";

  const icon = useMemo(
    () => createRunIcon(isLive, isCompleted),
    [isLive, isCompleted]
  );

  return (
    <Marker
      position={[run.start_lat, run.start_lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(),
      }}
    >
      <Popup>
        <div className="kith-popup-content">
          <p className="kith-popup-creator">{creatorName}</p>
          <div className="kith-popup-details">
            <span className="kith-popup-distance">
              {formatDistance(run.distance_km)}
            </span>
            <span className="kith-popup-separator">&middot;</span>
            <span className="kith-popup-time">
              {formatRunTime(run.scheduled_at)}
            </span>
          </div>
          {run.start_place && (
            <p className="kith-popup-place">{run.start_place}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
