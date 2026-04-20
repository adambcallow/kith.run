"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onMapClick: (lat: number, lng: number) => void;
}

/** Custom orange pin for the location picker */
function createPinIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 24px;
      height: 24px;
      background: #F95E2E;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(249, 94, 46, 0.5), 0 0 0 2px rgba(249, 94, 46, 0.2);
      transition: transform 0.15s ease;
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

/** Recenter the map when coordinates change from the parent */
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [map, lat, lng]);

  return null;
}

/** Handle clicks on the map to move the pin */
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export function LocationPickerMap({ lat, lng, onMapClick }: LocationPickerMapProps) {
  const pinIcon = useRef(createPinIcon());

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      zoomControl={true}
      attributionControl={false}
      scrollWheelZoom={true}
      className="w-full h-40"
      style={{ zIndex: 0, cursor: "crosshair" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Marker position={[lat, lng]} icon={pinIcon.current} />
      <RecenterMap lat={lat} lng={lng} />
      <ClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
}
