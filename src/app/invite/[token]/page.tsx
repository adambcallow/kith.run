import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function InvitePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-kith-surface">
      <div className="w-full max-w-sm text-center space-y-6">
        <h1 className="font-display font-extrabold text-3xl text-kith-black">
          kith
        </h1>
        <p className="font-body text-kith-text">
          You&apos;ve been invited to run together.
        </p>
        <p className="font-body text-sm text-kith-muted">
          Join Kith to find your crew, post runs, and show up together.
        </p>
        <div className="space-y-3">
          <Link href="/signup">
            <Button fullWidth>Join Kith</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" fullWidth>
              I already have an account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
