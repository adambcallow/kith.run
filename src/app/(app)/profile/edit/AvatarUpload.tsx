"use client";

import { useRef, useState, useCallback } from "react";
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
const MAX_DIMENSION = 800; // Resize to max 800x800
const JPEG_QUALITY = 0.85;

/**
 * Compress and resize an image file using Canvas.
 * Returns a Blob ready for upload.
 */
function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if either dimension exceeds MAX_DIMENSION
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

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
  const hasPhoto = !!displayUrl;

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        // Compress and resize before uploading
        const compressed = await compressImage(file);

        const supabase = createClient();
        // Single stable path per user — upsert replaces the old file automatically
        const filePath = `${userId}/avatar.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, compressed, {
            cacheControl: "31536000", // 1 year — cache-bust via query param
            upsert: true,
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        // Append timestamp to bust browser/CDN cache after re-upload
        const cacheBustedUrl = `${publicUrl}?v=${Date.now()}`;
        setPreviewUrl(cacheBustedUrl);
        onUpload(cacheBustedUrl);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : String(err);
        // Surface actionable messages for common issues
        if (msg.includes("Bucket not found")) {
          setError("Storage not configured. Ask the admin to create an 'avatars' bucket.");
        } else if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("403") || msg.includes("not allowed")) {
          setError("Storage permissions not set up. Ask the admin to add upload policies.");
        } else if (msg.includes("Payload too large") || msg.includes("413")) {
          setError("Image is too large even after compression. Try a smaller photo.");
        } else {
          setError("Upload failed. Please try again.");
        }
        setPreviewUrl(null);
        console.error("Avatar upload error:", msg);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [userId, onUpload]
  );

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Tappable avatar area */}
      <button
        type="button"
        onClick={openFilePicker}
        className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-kith-orange/30 focus-visible:ring-offset-2 rounded-full"
        disabled={uploading}
        aria-label={hasPhoto ? "Change profile photo" : "Add profile photo"}
      >
        <Avatar
          src={displayUrl}
          username={username}
          fullName={fullName}
          size="xl"
          className={uploading ? "opacity-60" : ""}
        />

        {/* Overlay — always visible on mobile, hover on desktop */}
        <span
          className={`
            absolute inset-0 flex items-center justify-center rounded-full
            transition-all duration-200
            ${uploading
              ? "bg-black/40"
              : hasPhoto
                ? "bg-black/20 sm:bg-black/0 sm:group-hover:bg-black/30"
                : "bg-black/30"
            }
          `}
        >
          {uploading ? (
            <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-white border-t-transparent" />
          ) : (
            <span className="flex flex-col items-center gap-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-7 h-7 text-white drop-shadow-md transition-opacity duration-200 ${
                  hasPhoto
                    ? "opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
                    : "opacity-100"
                }`}
              >
                <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                <path
                  fillRule="evenodd"
                  d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.2.32.548.521.926.564a13.61 13.61 0 011.587.2c1.28.222 2.178 1.36 2.178 2.66v8.298a2.75 2.75 0 01-2.75 2.75H4.25A2.75 2.75 0 011.5 17.5V9.202c0-1.3.898-2.438 2.178-2.66a13.6 13.6 0 011.587-.2c.378-.043.726-.244.926-.564l.821-1.317a2.75 2.75 0 012.332-1.39zM12 7.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z"
                  clipRule="evenodd"
                />
              </svg>
              {!hasPhoto && (
                <span className="text-white text-[10px] font-body font-medium drop-shadow-md">
                  Add photo
                </span>
              )}
            </span>
          )}
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Action text */}
      <button
        type="button"
        onClick={openFilePicker}
        disabled={uploading}
        className="font-body text-sm font-medium text-kith-orange hover:text-kith-orange/80 transition-colors disabled:opacity-50 min-h-[44px] px-4 flex items-center gap-1.5"
      >
        {uploading ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-kith-orange border-t-transparent" />
            Uploading...
          </>
        ) : hasPhoto ? (
          "Change photo"
        ) : (
          "Choose from library"
        )}
      </button>

      {error && (
        <p className="text-xs text-red-500 font-body text-center px-4">
          {error}
        </p>
      )}
    </div>
  );
}
