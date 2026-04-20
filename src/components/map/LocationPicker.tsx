"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";

interface LocationPickerProps {
  onSelect: (place: {
    name: string;
    lat: number;
    lng: number;
  }) => void;
  defaultValue?: string;
}

export function LocationPicker({ onSelect, defaultValue }: LocationPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["establishment", "geocode"],
        fields: ["name", "geometry", "formatted_address"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        const name = place.name ?? place.formatted_address ?? "";
        setValue(name);
        onSelect({
          name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });
  }, [onSelect]);

  return (
    <div className="space-y-2">
      <Input
        ref={inputRef}
        label="Start location"
        placeholder="Search for a place..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
