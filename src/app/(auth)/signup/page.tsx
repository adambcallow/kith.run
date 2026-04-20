"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check username uniqueness before creating account
    const trimmedUsername = username.toLowerCase().trim();
    if (!trimmedUsername || !/^[a-z0-9_]{3,30}$/.test(trimmedUsername)) {
      setError("Username must be 3-30 characters: letters, numbers, underscores only.");
      setLoading(false);
      return;
    }

    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", trimmedUsername)
      .maybeSingle();

    if (existingUser) {
      setError("That username is already taken.");
      setLoading(false);
      return;
    }

    const redirectUrl = typeof window !== "undefined"
      ? `${window.location.origin}/welcome`
      : undefined;

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase().trim(),
          full_name: fullName.trim() || null,
        },
        emailRedirectTo: redirectUrl,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Redirect to email verification page
    router.push("/verify");
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
          className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-kith-orange/20 blur-[120px]"
        />

        <div className="relative z-10 max-w-md text-center lg:text-left space-y-5">
          <h1 className="font-display font-extrabold text-6xl lg:text-7xl text-white tracking-tight">
            kith
          </h1>
          <p className="font-display font-bold text-xl text-white/80">
            Start running together
          </p>
          <p className="font-body text-lg text-white/70 leading-relaxed">
            Post a run, rally your crew, and actually show up. It takes 30
            seconds to get started.
          </p>
          <div className="h-1 w-12 rounded-full bg-kith-orange mx-auto lg:mx-0" />
          <ul className="font-body text-sm text-white/50 space-y-2">
            <li className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
              Create or join a crew
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
              Post your next run
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
              Show up together
            </li>
          </ul>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-14 lg:py-0 bg-kith-surface">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="font-display font-bold text-2xl text-kith-black">
              Join the crew
            </h2>
            <p className="font-body text-sm text-kith-muted mt-1">
              In 30 seconds you&apos;ll be posting your first run.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pick a username"
              required
            />
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
              placeholder="At least 6 characters"
              minLength={6}
              required
            />

            {error && <ErrorAlert message={error} />}

            <Button type="submit" fullWidth disabled={loading} loading={loading}>
              {loading ? "Creating account..." : "Get started"}
            </Button>
          </form>

          <p className="text-center font-body text-sm text-kith-muted">
            Already on Kith?{" "}
            <Link
              href="/login"
              className="text-kith-orange font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
