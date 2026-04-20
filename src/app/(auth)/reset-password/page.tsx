"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Supabase sets the session from the URL hash on load
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Also check if already in a recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don\u2019t match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/feed");
      router.refresh();
    }, 1500);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kith-surface px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-green-500"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-kith-text">
            Password updated
          </h1>
          <p className="font-body text-sm text-kith-muted">
            Taking you to your feed...
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kith-surface px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-kith-surface flex items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-kith-orange border-t-transparent" />
          </div>
          <p className="font-body text-sm text-kith-muted">
            Verifying your reset link...
          </p>
          <Link
            href="/forgot-password"
            className="block font-body text-sm text-kith-orange hover:underline"
          >
            Request a new reset link
          </Link>
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
            Set a new password
          </h1>
          <p className="font-body text-sm text-kith-muted mt-1">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Type it again"
            minLength={6}
            required
          />

          {error && <ErrorAlert message={error} />}

          <Button type="submit" fullWidth disabled={loading} loading={loading}>
            {loading ? "Updating..." : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
