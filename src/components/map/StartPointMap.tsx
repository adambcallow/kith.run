"use client";

import { useMemo } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import { LeafletMap } from "./LeafletMap";

interface StartPointMapProps {
  lat: number;
  lng: number;
  className?: string;
  interactive?: boolean;
}

/* ── Branded orange pin marker ── */
function createPinIcon(): L.DivIcon {
  const html = `
    <div class="kith-pin-marker">
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="#F95E2E"/>
        <circle cx="14" cy="13" r="5" fill="white"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: "kith-pin-marker-wrapper",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

export function StartPointMap({
  lat,
  lng,
  className,
  interactive = false,
}: StartPointMapProps) {
  const icon = useMemo(() => createPinIcon(), []);

  const mapClassName = interactive
    ? className ?? "w-full h-[300px] rounded-card overflow-hidden"
    : className ?? "w-full h-48 rounded-card overflow-hidden";

  return (
    <LeafletMap
      center={[lat, lng]}
      zoom={14}
      className={mapClassName}
      interactive={interactive}
      scrollWheelZoom={interactive}
      dragging={interactive}
    >
      <Marker position={[lat, lng]} icon={icon} />
    </LeafletMap>
  );
}
