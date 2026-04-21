"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { RunClub } from "@/types/database";

interface AdminClubActionsProps {
  club: RunClub;
  suggestedByUsername?: string;
  memberCount: number;
  userId: string;
}

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB

export function AdminClubActions({
  club,
  suggestedByUsername,
  memberCount,
  userId,
}: AdminClubActionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(club.name);
  const [editCity, setEditCity] = useState(club.city ?? "");
  const [editDescription, setEditDescription] = useState(
    club.description ?? ""
  );
  const [editBrand, setEditBrand] = useState(club.brand ?? "");
  const [editInstagram, setEditInstagram] = useState(club.instagram ?? "");
  const [editLogoUrl, setEditLogoUrl] = useState(club.logo_url);
  const [uploading, setUploading] = useState(false);

  async function handleApprove() {
    setActiveAction("approve");
    setError(null);
    try {
      const { error: err } = await supabase
        .from("run_clubs")
        .update({
          status: "approved" as const,
          approved_by: userId,
          approved_at: new Date().toISOString(),
        })
        .eq("id", club.id);
      if (err) throw err;
      startTransition(() => router.refresh());
    } catch {
      setError("Failed to approve. Please try again.");
    } finally {
      setActiveAction(null);
    }
  }

  async function handleReject() {
    setActiveAction("reject");
    setError(null);
    try {
      const { error: err } = await supabase
        .from("run_clubs")
        .update({ status: "rejected" as const })
        .eq("id", club.id);
      if (err) throw err;
      startTransition(() => router.refresh());
    } catch {
      setError("Failed to reject. Please try again.");
    } finally {
      setActiveAction(null);
    }
  }

  async function handleReApprove() {
    setActiveAction("reapprove");
    setError(null);
    try {
      const { error: err } = await supabase
        .from("run_clubs")
        .update({
          status: "approved" as const,
          approved_by: userId,
          approved_at: new Date().toISOString(),
        })
        .eq("id", club.id);
      if (err) throw err;
      startTransition(() => router.refresh());
    } catch {
      setError("Failed to re-approve. Please try again.");
    } finally {
      setActiveAction(null);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      setError("Logo must be under 2 MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const filePath = `${club.id}/logo.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("club-logos")
        .upload(filePath, file, {
          cacheControl: "31536000",
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("club-logos").getPublicUrl(filePath);

      const cacheBustedUrl = `${publicUrl}?v=${Date.now()}`;
      setEditLogoUrl(cacheBustedUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Bucket not found")) {
        setError("Create a 'club-logos' public bucket in Supabase Storage.");
      } else if (msg.includes("policy") || msg.includes("403") || msg.includes("not allowed")) {
        setError("Storage policies not configured for club-logos bucket.");
      } else {
        setError("Logo upload failed. Please try again.");
      }
      console.error("Logo upload error:", msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSaveEdits() {
    setActiveAction("save");
    setError(null);
    try {
      const { error: err } = await supabase
        .from("run_clubs")
        .update({
          name: editName.trim(),
          city: editCity.trim() || null,
          description: editDescription.trim() || null,
          brand: editBrand.trim() || null,
          instagram: editInstagram.trim() || null,
          logo_url: editLogoUrl,
        })
        .eq("id", club.id);
      if (err) throw err;
      setEditing(false);
      startTransition(() => router.refresh());
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setActiveAction(null);
    }
  }

  function handleCancelEdit() {
    setEditName(club.name);
    setEditCity(club.city ?? "");
    setEditDescription(club.description ?? "");
    setEditBrand(club.brand ?? "");
    setEditInstagram(club.instagram ?? "");
    setEditLogoUrl(club.logo_url);
    setEditing(false);
    setError(null);
  }

  const createdDate = new Date(club.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isPendingStatus = club.status === "pending";
  const isApproved = club.status === "approved";
  const isRejected = club.status === "rejected";
  const isLoading = activeAction !== null || isPending;

  return (
    <div
      className={`bg-white rounded-card p-4 border shadow-card ${
        isPendingStatus
          ? "border-l-4 border-l-kith-orange border-kith-gray-light"
          : "border-kith-gray-light"
      }`}
    >
      {/* Header row: logo + info */}
      <div className="flex items-start gap-3">
        {/* Logo or initial fallback */}
        {club.logo_url ? (
          <img
            src={club.logo_url}
            alt={club.name}
            className="w-12 h-12 rounded-card object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-card bg-kith-surface flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-lg text-kith-muted">
              {club.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-body text-sm font-semibold text-kith-text truncate">
              {club.name}
            </h3>
            {isPendingStatus && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body font-medium bg-kith-orange/10 text-kith-orange">
                Pending
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body font-medium bg-red-50 text-red-500">
                Rejected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            {club.city && (
              <span className="font-body text-xs text-kith-muted">
                {club.city}
              </span>
            )}
            {club.city && suggestedByUsername && (
              <span className="text-kith-muted/40 text-xs">&middot;</span>
            )}
            {isPendingStatus && suggestedByUsername && (
              <span className="font-body text-xs text-kith-muted">
                Suggested by{" "}
                <span className="text-kith-text font-medium">
                  @{suggestedByUsername}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="font-body text-xs text-kith-muted">
              {createdDate}
            </span>
            <span className="font-body text-xs text-kith-muted">
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>
        </div>
      </div>

      {/* Details row (brand, instagram, description) — shown in non-edit mode */}
      {!editing && (club.brand || club.instagram || club.description) && (
        <div className="mt-3 space-y-1 pl-[60px]">
          {club.brand && (
            <p className="font-body text-xs text-kith-muted">
              <span className="text-kith-text font-medium">Brand:</span>{" "}
              {club.brand}
            </p>
          )}
          {club.instagram && (
            <p className="font-body text-xs text-kith-muted">
              <span className="text-kith-text font-medium">Instagram:</span>{" "}
              @{club.instagram.replace(/^@/, "")}
            </p>
          )}
          {club.description && (
            <p className="font-body text-xs text-kith-muted leading-relaxed">
              {club.description}
            </p>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-3 rounded-input bg-red-50 border border-red-200 px-3 py-2">
          <p className="text-xs text-red-600 font-body">{error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4 pl-[60px]">
        {/* Pending: Approve + Reject */}
        {isPendingStatus && !editing && (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-body font-medium bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {activeAction === "approve" && (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              Approve
            </button>
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-body font-medium border border-red-300 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {activeAction === "reject" && (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
              )}
              Reject
            </button>
          </div>
        )}

        {/* Approved: Edit toggle */}
        {isApproved && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-body font-medium border border-kith-gray-light text-kith-text hover:bg-kith-surface transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path d="M13.488 2.513a1.75 1.75 0 00-2.475 0L3.28 10.246a.75.75 0 00-.188.335l-.758 2.652a.75.75 0 00.926.926l2.652-.758a.75.75 0 00.335-.188l7.733-7.733a1.75 1.75 0 000-2.475l-.492-.492z" />
            </svg>
            Edit
          </button>
        )}

        {/* Rejected: Re-approve */}
        {isRejected && !editing && (
          <button
            onClick={handleReApprove}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-body font-medium bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {activeAction === "reapprove" && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Re-approve
          </button>
        )}

        {/* Inline edit form */}
        {editing && (
          <div className="space-y-4 mt-2">
            {/* Logo upload */}
            <div className="flex items-center gap-3">
              {editLogoUrl ? (
                <img
                  src={editLogoUrl}
                  alt="Logo preview"
                  className="w-12 h-12 rounded-card object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-card bg-kith-surface flex items-center justify-center shrink-0">
                  <span className="font-display font-bold text-lg text-kith-muted">
                    {editName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="font-body text-xs font-medium text-kith-orange hover:text-kith-orange/80 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-kith-orange border-t-transparent" />
                      Uploading...
                    </span>
                  ) : editLogoUrl ? (
                    "Change logo"
                  ) : (
                    "Upload logo"
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>

            <Input
              label="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Club name"
            />
            <Input
              label="City"
              value={editCity}
              onChange={(e) => setEditCity(e.target.value)}
              placeholder="City"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-body font-medium text-kith-text">
                Description
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="A short description..."
                rows={3}
                className="w-full rounded-input border border-kith-gray-light bg-white py-3 px-4 font-body text-base text-kith-text placeholder:text-kith-muted focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200 resize-none leading-relaxed"
              />
            </div>
            <Input
              label="Brand"
              value={editBrand}
              onChange={(e) => setEditBrand(e.target.value)}
              placeholder="e.g. Nike, adidas, On"
            />
            <Input
              label="Instagram"
              value={editInstagram}
              onChange={(e) => setEditInstagram(e.target.value)}
              placeholder="handle (without @)"
            />

            <div className="flex gap-2 pt-1">
              <Button
                variant="primary"
                className="text-xs px-5 py-2"
                onClick={handleSaveEdits}
                disabled={isLoading || uploading || !editName.trim()}
                loading={activeAction === "save"}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                className="text-xs px-4 py-2 text-kith-muted"
                onClick={handleCancelEdit}
                disabled={isLoading || uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
