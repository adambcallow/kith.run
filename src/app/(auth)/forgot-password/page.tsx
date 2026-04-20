"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const redirectUrl = typeof window !== "undefined"
      ? `${window.location.origin}/reset-password`
      : undefined;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: redirectUrl }
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kith-surface px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-kith-orange/10 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-kith-orange"
            >
              <rect
                x="2"
                y="4"
                width="20"
                height="16"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M2 7L10.86 12.74C11.53 13.18 12.47 13.18 13.14 12.74L22 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-2xl text-kith-text">
              Check your email
            </h1>
            <p className="font-body text-sm text-kith-muted leading-relaxed">
              If an account exists for <strong className="text-kith-text">{email}</strong>,
              we&apos;ve sent a password reset link. It may take a minute to arrive.
            </p>
          </div>

          <div className="bg-white rounded-card p-4 border border-kith-gray-light/50 space-y-2">
            <p className="font-body text-xs text-kith-muted">
              Not seeing it? Check your spam folder. Supabase emails can
              sometimes be delayed on the free tier.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="block w-full rounded-pill bg-kith-orange text-white py-3 min-h-[48px] font-body font-semibold text-sm text-center transition-all hover:brightness-110 active:scale-[0.97]"
            >
              Try a different email
            </button>
            <Link
              href="/login"
              className="block w-full rounded-pill border border-kith-gray-light text-kith-muted py-3 min-h-[48px] font-body font-medium text-sm text-center transition-all hover:border-kith-text hover:text-kith-text"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-kith-surface px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="font-display font-extrabold text-3xl text-kith-text tracking-tight">
              kith
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-kith-text">
            Reset your password
          </h1>
          <p className="font-body text-sm text-kith-muted mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          {error && <ErrorAlert message={error} />}

          <Button type="submit" fullWidth disabled={loading} loading={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <p className="text-center font-body text-sm text-kith-muted">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-kith-orange font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
