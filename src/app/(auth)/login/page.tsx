"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Branded hero panel ── */}
      <div className="relative flex flex-col items-center justify-center bg-kith-black px-8 py-16 lg:w-1/2 lg:py-0 overflow-hidden">
        {/* Subtle dot-grid pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #F95E2E 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Warm gradient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-kith-orange/20 blur-[120px]"
        />

        <div className="relative z-10 max-w-md text-center lg:text-left space-y-5">
          <h1 className="font-display font-extrabold text-6xl lg:text-7xl text-white tracking-tight">
            kith
          </h1>
          <p className="font-body text-lg text-white/70 leading-relaxed">
            &ldquo;The real run starts when you show up for someone
            else.&rdquo;
          </p>
          <div className="h-1 w-12 rounded-full bg-kith-orange mx-auto lg:mx-0" />
          <p className="font-body text-sm text-white/40">
            Your crew is waiting.
          </p>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-14 lg:py-0 bg-kith-surface">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="font-display font-bold text-2xl text-kith-black">
              Welcome back
            </h2>
            <p className="font-body text-sm text-kith-muted mt-1">
              Sign in and get moving.
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
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />

            {error && <ErrorAlert message={error} />}

            <Button type="submit" fullWidth disabled={loading} loading={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="font-body text-sm text-kith-muted hover:text-kith-orange transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          <p className="text-center font-body text-sm text-kith-muted">
            New here?{" "}
            <Link
              href="/signup"
              className="text-kith-orange font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
