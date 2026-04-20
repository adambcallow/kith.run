"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(
  () =>
    import("@/components/map/LocationPickerMap").then((m) => ({
      default: m.LocationPickerMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-40 bg-kith-surface rounded-card animate-pulse" />
    ),
  }
);

interface LocationPickerProps {
  onSelect: (place: { name: string; lat: number; lng: number }) => void;
  defaultValue?: string;
  defaultLat?: number;
  defaultLng?: number;
  error?: string;
}

export function LocationPicker({
  onSelect,
  defaultValue,
  defaultLat,
  defaultLng,
  error,
}: LocationPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [selected, setSelected] = useState(!!defaultValue);
  const [pinLat, setPinLat] = useState(defaultLat ?? 25.2048);
  const [pinLng, setPinLng] = useState(defaultLng ?? 55.2708);
  const [placesReady, setPlacesReady] = useState(false);

  // Load Google Maps script on demand and wait for Places to be available
  useEffect(() => {
    if (window.google?.maps?.places) {
      setPlacesReady(true);
      return;
    }

    // Inject the script if not already present
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      document.head.appendChild(script);
    }

    // Poll for Google Maps loading (script is async)
    const interval = setInterval(() => {
      if (window.google?.maps?.places) {
        setPlacesReady(true);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Initialize Places Autocomplete when ready
  useEffect(() => {
    if (!placesReady || !inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["establishment", "geocode"],
        fields: ["name", "geometry", "formatted_address"],
        componentRestrictions: { country: "ae" },
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        const name = place.name ?? place.formatted_address ?? "";
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setValue(name);
        setPinLat(lat);
        setPinLng(lng);
        setSelected(true);
        onSelect({ name, lat, lng });
      }
    });
  }, [placesReady, onSelect]);

  // When user nudges the pin on the map
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      setPinLat(lat);
      setPinLng(lng);
      onSelect({
        name: value.trim() || "Pinned location",
        lat,
        lng,
      });
    },
    [onSelect, value]
  );

  // Reset to search mode
  const handleReset = () => {
    setSelected(false);
    autocompleteRef.current = null; // Will re-init on next render
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Selected state — show the chosen location + map
  if (selected && value) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-body font-medium text-kith-text">
          Start location
        </label>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 w-full rounded-input border border-kith-gray-light bg-white py-3 px-4 text-left transition-all duration-200 hover:border-kith-orange/40"
        >
          <span className="text-base shrink-0" aria-hidden="true">
            {"\uD83D\uDCCD"}
          </span>
          <span className="font-body text-sm text-kith-text truncate flex-1">
            {value}
          </span>
          <span className="text-xs text-kith-muted font-body shrink-0">
            Change
          </span>
        </button>

        <div className="rounded-card overflow-hidden border border-kith-gray-light/50">
          <LocationPickerMap
            lat={pinLat}
            lng={pinLng}
            onMapClick={handleMapClick}
          />
        </div>
        <p className="text-xs text-kith-muted font-body">
          Tap the map to fine-tune the start point
        </p>
      </div>
    );
  }

  // Search state — autocomplete input
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="location-input"
        className="text-sm font-body font-medium text-kith-text"
      >
        Start location
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-kith-muted pointer-events-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <input
          ref={inputRef}
          id="location-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            placesReady
              ? "Search for a coffee shop, park, meeting point..."
              : "Loading places..."
          }
          autoComplete="off"
          className={`w-full rounded-input border bg-white py-3 pl-10 pr-4 font-body text-base text-kith-text placeholder:text-kith-muted focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200 ${
            error
              ? "border-red-400 focus:ring-red-300/30 focus:border-red-400"
              : "border-kith-gray-light"
          }`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 font-body">{error}</p>
      )}
      {!placesReady && (
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-kith-orange border-t-transparent" />
          <p className="text-xs text-kith-muted font-body">
            Loading location search...
          </p>
        </div>
      )}
    </div>
  );
}
