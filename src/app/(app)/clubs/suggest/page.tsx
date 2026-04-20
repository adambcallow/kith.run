"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function SuggestClubPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [instagram, setInstagram] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      setLoading(false);
    }

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Club name is required.");
      return;
    }

    setSubmitting(true);

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { error: insertError } = await supabase.from("run_clubs").insert({
      name: name.trim(),
      slug,
      city: city.trim() || null,
      instagram: instagram.trim().replace(/^@/, "") || null,
      description: description.trim() || null,
      status: "pending",
      suggested_by: userId,
    });

    setSubmitting(false);

    if (insertError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-kith-orange border-t-transparent" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="pb-12 pt-2">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-lg text-kith-text">
            Thanks!
          </h2>
          <p className="font-body text-sm text-kith-muted max-w-[260px]">
            We&apos;ll review your suggestion and add it to the list if it&apos;s a good fit.
          </p>
          <Link
            href="/clubs"
            className="font-body text-sm text-kith-orange font-medium hover:underline mt-2"
          >
            Back to Run Clubs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 pt-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/clubs"
          className="flex items-center justify-center w-11 h-11 -ml-2 rounded-full hover:bg-kith-surface transition-colors"
          aria-label="Back to clubs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-kith-text"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="font-display text-xl font-bold text-kith-text">
          Suggest a club
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Club name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dubai Creek Striders"
          required
        />

        <Input
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Dubai"
        />

        <Input
          label="Instagram handle"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="@runclub"
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          }
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-sm font-body font-medium text-kith-text"
          >
            Tell us about this club
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What makes this club special? When and where do they run?"
            rows={4}
            maxLength={500}
            className="w-full rounded-input border border-kith-gray-light bg-white py-3 px-4 font-body text-base text-kith-text placeholder:text-kith-muted focus:outline-none focus:ring-2 focus:ring-kith-orange/30 focus:border-kith-orange transition-all duration-200 resize-none leading-relaxed"
          />
        </div>

        {error && <ErrorAlert message={error} />}

        <Button
          type="submit"
          fullWidth
          loading={submitting}
          disabled={submitting}
          className="!mt-10"
        >
          Submit suggestion
        </Button>
      </form>
    </div>
  );
}
