import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-kith-surface px-6">
      <div className="w-full max-w-sm text-center space-y-6">
        {/* Icon */}
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
            We sent you a verification link. Tap the link in the email to
            activate your account and start using Kith.
          </p>
        </div>

        <div className="bg-white rounded-card p-4 border border-kith-gray-light/50">
          <p className="font-body text-xs text-kith-muted">
            Didn&apos;t receive it? Check your spam folder, or go back and try
            a different email address.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full rounded-pill bg-kith-orange text-white py-3 min-h-[48px] font-body font-semibold text-sm text-center transition-all hover:brightness-110 active:scale-[0.97]"
          >
            Go to sign in
          </Link>
          <Link
            href="/signup"
            className="block w-full rounded-pill border border-kith-gray-light text-kith-muted py-3 min-h-[48px] font-body font-medium text-sm text-center transition-all hover:border-kith-text hover:text-kith-text"
          >
            Back to sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
