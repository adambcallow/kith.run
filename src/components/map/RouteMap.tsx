"use client";

import { useEffect, useRef } from "react";

interface RouteMapProps {
  lat: number;
  lng: number;
  routeGeojson?: Record<string, unknown> | null;
  className?: string;
}

export function RouteMap({ lat, lng, routeGeojson, className }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    });

    new google.maps.Marker({
      position: { lat, lng },
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#F95E2E",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      },
    });

    if (routeGeojson) {
      map.data.addGeoJson(routeGeojson);
      map.data.setStyle({
        strokeColor: "#F95E2E",
        strokeWeight: 3,
      });
    }

    mapInstanceRef.current = map;
  }, [lat, lng, routeGeojson]);

  return (
    <div
      ref={mapRef}
      className={className ?? "w-full h-48 rounded-card overflow-hidden"}
    />
  );
}
