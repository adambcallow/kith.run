"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RouteMapProps {
  lat: number;
  lng: number;
  routeGeojson?: Record<string, unknown> | null;
  className?: string;
}

/** Custom orange circle marker matching the KITH brand */
function createStartIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 20px;
      height: 20px;
      background: #F95E2E;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(249, 94, 46, 0.45), 0 0 0 2px rgba(249, 94, 46, 0.15);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

/** Enable scroll-zoom only after the user clicks/focuses the map */
function ScrollZoomControl() {
  const map = useMap();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    map.scrollWheelZoom.disable();

    const enable = () => {
      if (!enabled) {
        map.scrollWheelZoom.enable();
        setEnabled(true);
      }
    };

    map.on("click", enable);
    map.on("focus", enable);

    return () => {
      map.off("click", enable);
      map.off("focus", enable);
    };
  }, [map, enabled]);

  return null;
}

/** Fit the map to a GeoJSON bounding box when provided */
function FitBounds({ geojson }: { geojson: Record<string, unknown> }) {
  const map = useMap();

  useEffect(() => {
    try {
      const layer = L.geoJSON(geojson as unknown as GeoJSON.GeoJsonObject);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [32, 32] });
      }
    } catch {
      // If GeoJSON is invalid, do nothing — the map will stay centered on the marker
    }
  }, [map, geojson]);

  return null;
}

export function RouteMap({ lat, lng, routeGeojson, className }: RouteMapProps) {
  const startIcon = useRef(createStartIcon());

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      zoomControl={true}
      attributionControl={false}
      className={className ?? "w-full h-48 rounded-card overflow-hidden"}
      style={{ zIndex: 0 }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      <ScrollZoomControl />

      <Marker position={[lat, lng]} icon={startIcon.current} />

      {routeGeojson && (
        <>
          <GeoJSON
            data={routeGeojson as unknown as GeoJSON.GeoJsonObject}
            style={{
              color: "#F95E2E",
              weight: 3,
              opacity: 0.85,
            }}
          />
          <FitBounds geojson={routeGeojson} />
        </>
      )}
    </MapContainer>
  );
}
