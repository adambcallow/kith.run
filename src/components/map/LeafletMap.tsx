"use client";

import { type ReactNode } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── Fix Leaflet's broken default icon paths in bundlers ── */
import L from "leaflet";
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ── Custom zoom buttons using react-leaflet's useMap ── */
function KithZoomControl() {
  const map = useMap();

  return (
    <div className="kith-zoom-controls">
      <button
        className="kith-zoom-btn"
        aria-label="Zoom in"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          map.zoomIn();
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1v12M1 7h12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        className="kith-zoom-btn"
        aria-label="Zoom out"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          map.zoomOut();
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 7h12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

/* ── Props ── */
interface LeafletMapProps {
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
  children?: ReactNode;
  scrollWheelZoom?: boolean;
  dragging?: boolean;
  interactive?: boolean;
}

/* ── Default values ── */
const DUBAI_CENTER: LatLngExpression = [25.2048, 55.2708];
const DEFAULT_ZOOM = 12;

/* CartoDB Positron — clean, muted, modern tiles */
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export function LeafletMap({
  center = DUBAI_CENTER,
  zoom = DEFAULT_ZOOM,
  className = "w-full h-[400px]",
  children,
  scrollWheelZoom = true,
  dragging = true,
  interactive = true,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`kith-map ${className}`}
      scrollWheelZoom={interactive ? scrollWheelZoom : false}
      dragging={interactive ? dragging : false}
      zoomControl={false}
      attributionControl={true}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {interactive && <KithZoomControl />}
      {children}
    </MapContainer>
  );
}
