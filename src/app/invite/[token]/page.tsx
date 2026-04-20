import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function InvitePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-kith-black overflow-hidden">
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
      {/* Warm gradient glow — top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-kith-orange/20 blur-[140px]"
      />
      {/* Warm gradient glow — bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-kith-orange/10 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-sm text-center space-y-8">
        {/* Wordmark */}
        <h1 className="font-display font-extrabold text-6xl text-white tracking-tight">
          kith
        </h1>

        {/* Accent bar */}
        <div className="h-1 w-12 rounded-full bg-kith-orange mx-auto" />

        {/* Invite messaging */}
        <div className="space-y-3">
          <p className="font-display font-bold text-xl text-white">
            You&apos;ve been invited to join the crew
          </p>
          <p className="font-body text-white/60 leading-relaxed">
            Someone you run with wants you here. Join Kith to find your people,
            post runs, and show up together.
          </p>
        </div>

        {/* CTAs */}
        <div className="space-y-3 pt-2">
          <Link href="/signup">
            <Button fullWidth>Join Kith</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" fullWidth>
              I already have an account
            </Button>
          </Link>
        </div>

        <p className="font-body text-xs text-white/30">
          Free forever. No spam. Just runs.
        </p>
      </div>
    </div>
  );
}
