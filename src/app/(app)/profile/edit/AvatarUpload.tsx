"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/Avatar";

interface AvatarUploadProps {
  currentUrl: string | null;
  username: string;
  fullName: string | null;
  userId: string;
  onUpload: (url: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function AvatarUpload({
  currentUrl,
  username,
  fullName,
  userId,
  onUpload,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayUrl = previewUrl ?? currentUrl;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be under 5 MB.");
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setUploading(true);

    try {
      const supabase = createClient();
      const timestamp = Date.now();
      const filePath = `${userId}/${timestamp}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      onUpload(publicUrl);
    } catch (err) {
      setError("Upload failed. Please try again.");
      setPreviewUrl(null);
      console.error(err);
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-kith-orange/30 rounded-full"
        disabled={uploading}
        aria-label="Change profile photo"
      >
        <Avatar
          src={displayUrl}
          username={username}
          fullName={fullName}
          size="xl"
          className="transition-opacity duration-200 group-hover:opacity-80"
        />

        {/* Camera overlay */}
        <span
          className={`
            absolute inset-0 flex items-center justify-center rounded-full
            bg-black/0 group-hover:bg-black/30
            transition-all duration-200
          `}
        >
          {uploading ? (
            <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-white border-t-transparent" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-md"
            >
              <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
              <path
                fillRule="evenodd"
                d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.2.32.548.521.926.564a13.61 13.61 0 011.587.2c1.28.222 2.178 1.36 2.178 2.66v8.298a2.75 2.75 0 01-2.75 2.75H4.25A2.75 2.75 0 011.5 17.5V9.202c0-1.3.898-2.438 2.178-2.66a13.6 13.6 0 011.587-.2c.378-.043.726-.244.926-.564l.821-1.317a2.75 2.75 0 012.332-1.39zM12 7.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="font-body text-sm text-kith-orange hover:text-kith-orange/80 transition-colors disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Change photo"}
      </button>

      {error && (
        <p className="text-xs text-red-500 font-body">{error}</p>
      )}
    </div>
  );
}
