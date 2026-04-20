"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import type { FeedRun } from "@/components/feed/FeedList";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatPaceRange, formatDistance, formatRelativeRunTime } from "@/lib/utils";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Component to auto-fit bounds (dynamically imported to avoid SSR)
const FitBounds = dynamic(
  () => import("./FitBounds").then((m) => m.FitBounds),
  { ssr: false }
);

interface FeedMapViewProps {
  runs: FeedRun[];
}

// Default center: Dubai
const DUBAI_CENTER: [number, number] = [25.2048, 55.2708];
const DEFAULT_ZOOM = 12;

function createMarkerIcon(isLive: boolean, isCompleted: boolean) {
  if (typeof window === "undefined") return undefined;

  if (isLive) {
    return new L.DivIcon({
      className: "",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
      html: `
        <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(249,94,46,0.25);animation:kith-map-pulse 2s ease-in-out infinite;"></div>
          <div style="width:16px;height:16px;border-radius:50%;background:#F95E2E;border:2.5px solid white;box-shadow:0 2px 8px rgba(249,94,46,0.4);position:relative;z-index:1;"></div>
        </div>
      `,
    });
  }

  if (isCompleted) {
    return new L.DivIcon({
      className: "",
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -9],
      html: `
        <div style="width:14px;height:14px;display:flex;align-items:center;justify-content:center;">
          <div style="width:8px;height:8px;border-radius:50%;background:#BFCCD9;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.1);"></div>
        </div>
      `,
    });
  }

  // Upcoming — standard orange dot
  return new L.DivIcon({
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
    html: `
      <div style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
        <div style="width:12px;height:12px;border-radius:50%;background:#F95E2E;border:2.5px solid white;box-shadow:0 2px 6px rgba(249,94,46,0.3);"></div>
      </div>
    `,
  });
}

function PopupCard({ item }: { item: FeedRun }) {
  const { run, creator } = item;
  const isLive = run.is_live;

  return (
    <div className="w-[240px] -mx-[6px] -my-[6px]">
      <div className="bg-white rounded-[14px] shadow-card overflow-hidden">
        {/* Creator row */}
        <div className="flex items-center gap-2.5 px-3.5 pt-3.5 pb-2">
          <Avatar
            src={creator.avatar_url}
            username={creator.username}
            fullName={creator.full_name}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="font-body font-medium text-xs text-kith-text truncate">
              {creator.full_name ?? creator.username}
            </p>
            <p className="font-body text-[10px] text-kith-muted leading-tight">
              {formatRelativeRunTime(run.scheduled_at)}
            </p>
          </div>
          {isLive && <Badge variant="live" className="text-[10px] px-2 py-0.5">Live</Badge>}
        </div>

        {/* Run details */}
        <div className="px-3.5 pb-2 space-y-1.5">
          {/* Location */}
          <div className="flex items-center gap-1 text-kith-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-body text-[10px] truncate">{run.start_place}</span>
          </div>

          {/* Distance + pace */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-sm font-bold text-kith-text">
              {formatDistance(run.distance_km)}
            </span>
            {(run.pace_min_target || run.pace_max_target) && (
              <>
                <span className="text-kith-gray-light text-[10px]">&middot;</span>
                <span className="font-body text-[10px] text-kith-muted">
                  {formatPaceRange(run.pace_min_target, run.pace_max_target)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* View button */}
        <div className="px-3.5 pb-3.5 pt-1">
          <Link
            href={`/run/${run.id}`}
            className="block w-full text-center bg-kith-orange text-white font-body font-medium text-xs rounded-pill py-2 transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FeedMapView({ runs }: FeedMapViewProps) {
  // Separate runs by status for z-ordering (live on top)
  const { liveRuns, upcomingRuns, completedRuns, bounds } = useMemo(() => {
    const live: FeedRun[] = [];
    const upcoming: FeedRun[] = [];
    const completed: FeedRun[] = [];
    const coords: [number, number][] = [];

    for (const item of runs) {
      const { run } = item;
      if (run.start_lat && run.start_lng) {
        coords.push([run.start_lat, run.start_lng]);
      }
      if (run.is_live) live.push(item);
      else if (run.status === "completed") completed.push(item);
      else upcoming.push(item);
    }

    return {
      liveRuns: live,
      upcomingRuns: upcoming,
      completedRuns: completed,
      bounds: coords,
    };
  }, [runs]);

  // Create icons on client only
  const icons = useMemo(() => {
    if (typeof window === "undefined") return null;
    return {
      live: createMarkerIcon(true, false),
      upcoming: createMarkerIcon(false, false),
      completed: createMarkerIcon(false, true),
    };
  }, []);

  const center = bounds.length > 0 ? undefined : DUBAI_CENTER;
  const zoom = bounds.length > 0 ? undefined : DEFAULT_ZOOM;

  // Flatten all runs for the map (completed rendered first so they sit behind)
  const allMapRuns = useMemo(
    () => [
      ...completedRuns.map((r) => ({ item: r, type: "completed" as const })),
      ...upcomingRuns.map((r) => ({ item: r, type: "upcoming" as const })),
      ...liveRuns.map((r) => ({ item: r, type: "live" as const })),
    ],
    [completedRuns, upcomingRuns, liveRuns]
  );

  return (
    <div
      className="relative w-full rounded-card overflow-hidden border border-kith-gray-light/50"
      style={{ height: "calc(100vh - 160px)" }}
    >
      {/* Pulse animation for live markers — injected once */}
      <style>{`
        @keyframes kith-map-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(2); opacity: 0; }
        }
        /* Override Leaflet popup styles for branded cards */
        .kith-map-popup .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
        }
        .kith-map-popup .leaflet-popup-content {
          margin: 0;
          line-height: normal;
        }
        .kith-map-popup .leaflet-popup-tip-container {
          display: none;
        }
        .kith-map-popup .leaflet-popup-close-button {
          display: none;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={zoom ?? DEFAULT_ZOOM}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-0"
        style={{ background: "#F6F7F8" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {bounds.length > 0 && <FitBounds bounds={bounds} />}

        {icons &&
          allMapRuns.map(({ item, type }) => {
            const { run } = item;
            if (!run.start_lat || !run.start_lng) return null;

            return (
              <Marker
                key={run.id}
                position={[run.start_lat, run.start_lng]}
                icon={icons[type]}
                zIndexOffset={type === "live" ? 1000 : type === "upcoming" ? 500 : 0}
              >
                <Popup className="kith-map-popup" maxWidth={260} minWidth={240}>
                  <PopupCard item={item} />
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Map legend — bottom-left */}
      {(liveRuns.length > 0 || completedRuns.length > 0) && (
        <div className="absolute bottom-3 left-3 z-[500] bg-white/95 backdrop-blur-sm rounded-[10px] px-3 py-2 shadow-card flex items-center gap-3">
          {liveRuns.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-kith-orange animate-live-pulse" />
              <span className="font-body text-[10px] text-kith-muted">Live</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-kith-orange" />
            <span className="font-body text-[10px] text-kith-muted">Upcoming</span>
          </div>
          {completedRuns.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-kith-gray-light" />
              <span className="font-body text-[10px] text-kith-muted">Done</span>
            </div>
          )}
        </div>
      )}

      {/* Run count badge — top-left */}
      <div className="absolute top-3 left-3 z-[500] bg-white/95 backdrop-blur-sm rounded-pill px-3 py-1.5 shadow-card">
        <span className="font-body text-xs font-medium text-kith-text">
          {runs.length} {runs.length === 1 ? "run" : "runs"} nearby
        </span>
      </div>
    </div>
  );
}
