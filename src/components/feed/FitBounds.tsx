"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export function FitBounds({ bounds }: { bounds: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (bounds.length === 0) return;

    const latLngBounds = L.latLngBounds(
      bounds.map(([lat, lng]) => L.latLng(lat, lng))
    );
    map.fitBounds(latLngBounds, { padding: [50, 50], maxZoom: 14 });
  }, [map, bounds]);

  return null;
}
