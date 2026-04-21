import Link from "next/link";
import ParallaxMesh from "@/components/landing/ParallaxMesh";

/* ------------------------------------------------------------------ */
/*  Landing Page — kith.run                                           */
/*  Single viewport, dark hero with premium feature collage           */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1B1C1F] relative">
      {/* ── Animation system ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ============================
               BASE KEYFRAMES
               ============================ */

            /* Blob drift */
            @keyframes blob1 {
              0%, 100% { transform: translate(calc(var(--mx,0) * -18px), calc(var(--my,0) * -14px)) scale(1); }
              25%  { transform: translate(calc(5% + var(--mx,0) * -18px), calc(-8% + var(--my,0) * -14px)) scale(1.1); }
              50%  { transform: translate(calc(-3% + var(--mx,0) * -18px), calc(5% + var(--my,0) * -14px)) scale(0.95); }
              75%  { transform: translate(calc(8% + var(--mx,0) * -18px), calc(2% + var(--my,0) * -14px)) scale(1.05); }
            }
            @keyframes blob2 {
              0%, 100% { transform: translate(calc(var(--mx,0) * 14px), calc(var(--my,0) * 18px)) scale(1); }
              25%  { transform: translate(calc(-6% + var(--mx,0) * 14px), calc(4% + var(--my,0) * 18px)) scale(1.08); }
              50%  { transform: translate(calc(4% + var(--mx,0) * 14px), calc(-6% + var(--my,0) * 18px)) scale(0.92); }
              75%  { transform: translate(calc(-2% + var(--mx,0) * 14px), calc(8% + var(--my,0) * 18px)) scale(1.12); }
            }
            @keyframes blob3 {
              0%, 100% { transform: translate(calc(var(--mx,0) * -10px), calc(var(--my,0) * 12px)) scale(1); }
              33%  { transform: translate(calc(6% + var(--mx,0) * -10px), calc(6% + var(--my,0) * 12px)) scale(1.06); }
              66%  { transform: translate(calc(-5% + var(--mx,0) * -10px), calc(-3% + var(--my,0) * 12px)) scale(0.94); }
            }

            /* ---- Entrance animations ---- */
            @keyframes fadeInUp {
              0%   { opacity: 0; transform: translateY(24px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .enter {
              animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .enter-d1 { animation-delay: 0.05s; }
            .enter-d2 { animation-delay: 0.15s; }
            .enter-d3 { animation-delay: 0.3s; }
            .enter-d35 { animation-delay: 0.38s; }
            .enter-d4 { animation-delay: 0.45s; }

            /* ---- Wordmark letter-spacing reveal ---- */
            @keyframes wordmarkReveal {
              0%   { letter-spacing: 0.18em; opacity: 0; }
              100% { letter-spacing: 0.02em; opacity: 1; }
            }
            .wordmark-enter {
              animation: wordmarkReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
            }

            /* ---- Headline shimmer (single pass on load) ---- */
            @keyframes textShimmer {
              0%   { background-position: -200% center; }
              100% { background-position: 200% center; }
            }
            .headline-shimmer {
              background-image: linear-gradient(
                110deg,
                rgba(255,255,255,0) 0%,
                rgba(255,255,255,0) 40%,
                rgba(255,255,255,0.12) 50%,
                rgba(255,255,255,0) 60%,
                rgba(255,255,255,0) 100%
              );
              background-size: 200% 100%;
              -webkit-background-clip: text;
              background-clip: text;
              animation: textShimmer 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
            }

            /* ---- "people." underline glow ---- */
            @keyframes underlineGrow {
              0%   { transform: scaleX(0); opacity: 0; }
              100% { transform: scaleX(1); opacity: 1; }
            }
            @keyframes underlinePulse {
              0%, 100% { opacity: 0.7; filter: blur(3px); }
              50%      { opacity: 1; filter: blur(5px); }
            }
            .people-underline {
              position: relative;
              display: inline-block;
            }
            .people-underline::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              right: 0;
              height: 3px;
              border-radius: 2px;
              background: linear-gradient(90deg, #F95E2E, #FF8F6B);
              transform-origin: left;
              animation: underlineGrow 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both,
                         underlinePulse 4s ease-in-out 1.4s infinite;
              will-change: transform, opacity;
            }

            /* ---- Card entrance (staggered, with scale) ---- */
            @keyframes cardEnter {
              0%   { opacity: 0; transform: translateY(28px) scale(0.96); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .card-enter {
              animation: cardEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .card-d1 { animation-delay: 0.5s; }
            .card-d2 { animation-delay: 0.62s; }
            .card-d3 { animation-delay: 0.74s; }
            .card-d4 { animation-delay: 0.86s; }
            .card-d5 { animation-delay: 0.98s; }
            .card-d6 { animation-delay: 1.1s; }
            .card-d7 { animation-delay: 1.22s; }

            /* ---- Mobile card entrance (staggered scale-up) ---- */
            @keyframes cardScaleUp {
              0%   { opacity: 0; transform: scale(0.88); }
              100% { opacity: 1; transform: scale(1); }
            }
            .card-scale-enter {
              animation: cardScaleUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
            }

            /* ---- Individual card floating ---- */
            @keyframes float1 {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-4px); }
            }
            @keyframes float2 {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-5px); }
            }
            @keyframes float3 {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-3px); }
            }
            @keyframes float4 {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-6px); }
            }
            @keyframes float5 {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-4px); }
            }
            @keyframes float6 {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-5px); }
            }

            .card-float-1 { animation: float1 6s ease-in-out infinite 1.6s; will-change: transform; }
            .card-float-2 { animation: float2 5.5s ease-in-out infinite 1.8s; will-change: transform; }
            .card-float-3 { animation: float3 7s ease-in-out infinite 2.0s; will-change: transform; }
            .card-float-4 { animation: float4 5s ease-in-out infinite 2.2s; will-change: transform; }
            .card-float-5 { animation: float5 6.5s ease-in-out infinite 2.4s; will-change: transform; }
            .card-float-6 { animation: float6 5.8s ease-in-out infinite 2.6s; will-change: transform; }

            /* ---- Featured glow pulse ---- */
            @keyframes glowPulse {
              0%, 100% { opacity: 0.5; }
              50%      { opacity: 0.85; }
            }
            .glow-pulse {
              animation: glowPulse 4s ease-in-out infinite;
            }

            /* ---- CTA button glow + gradient shift ---- */
            @keyframes ctaGlow {
              0%, 100% { box-shadow: 0 0 24px 0 rgba(249,94,46,0.2); }
              50%      { box-shadow: 0 0 40px 4px rgba(249,94,46,0.35); }
            }
            @keyframes ctaGradientShift {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .cta-glow {
              animation: ctaGlow 3s ease-in-out infinite,
                         ctaGradientShift 6s ease-in-out infinite;
              background-size: 200% 200%;
            }

            /* ---- Social proof fade-in ---- */
            @keyframes fadeIn {
              0%   { opacity: 0; }
              100% { opacity: 1; }
            }
            .social-proof-enter {
              animation: fadeIn 1.2s ease-out 0.55s both;
            }

            /* ---- Feature hints fade-in ---- */
            .hints-enter {
              animation: fadeIn 1s ease-out 1.4s both;
            }

            /* ---- Mobile secondary CTA fade-in ---- */
            .mobile-cta-enter {
              animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.6s both;
            }

            /* ---- Desktop card hover ---- */
            @media (hover: hover) {
              .feature-card-hover {
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                            box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                            border-color 0.3s ease;
              }
              .feature-card-hover:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 40px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08);
              }
              .feature-card-hover:hover .card-border {
                border-color: rgba(249,94,46,0.18);
              }
            }

            /* ---- Reduced motion ---- */
            @media (prefers-reduced-motion: reduce) {
              .enter,
              .wordmark-enter,
              .card-enter,
              .card-scale-enter,
              .cta-glow,
              .glow-pulse,
              .social-proof-enter,
              .headline-shimmer,
              .hints-enter,
              .mobile-cta-enter,
              .card-float-1, .card-float-2, .card-float-3,
              .card-float-4, .card-float-5, .card-float-6 {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
              }
              .people-underline::after {
                animation: none !important;
                opacity: 1 !important;
                transform: scaleX(1) !important;
              }
            }
          `,
        }}
      />

      {/* ── Animated gradient mesh (with parallax) ── */}
      <ParallaxMesh>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full opacity-[0.12]"
            style={{
              background: "radial-gradient(circle, #F95E2E 0%, transparent 70%)",
              top: "-10%",
              left: "-5%",
              filter: "blur(80px)",
              animation: "blob1 18s ease-in-out infinite",
              willChange: "transform",
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-[0.08]"
            style={{
              background: "radial-gradient(circle, #FF7A45 0%, transparent 70%)",
              top: "20%",
              right: "-10%",
              filter: "blur(100px)",
              animation: "blob2 22s ease-in-out infinite",
              willChange: "transform",
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.06]"
            style={{
              background: "radial-gradient(circle, #FFAA5C 0%, transparent 70%)",
              bottom: "-5%",
              left: "30%",
              filter: "blur(90px)",
              animation: "blob3 20s ease-in-out infinite",
              willChange: "transform",
            }}
          />
          {/* Top gradient veil */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(249,94,46,0.06) 0%, transparent 60%)",
            }}
          />
          {/* Subtle vignette for depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(27,28,31,0.4) 100%)",
            }}
          />
        </div>
      </ParallaxMesh>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 w-full max-w-6xl mx-auto">
        {/* Wordmark */}
        <div className="wordmark-enter">
          <span className="font-display font-extrabold text-3xl md:text-4xl tracking-[0.02em] text-white">
            kith
          </span>
        </div>

        {/* Headline */}
        <h1 className="enter enter-d2 font-display font-extrabold text-[1.75rem] sm:text-5xl md:text-6xl leading-[1.08] tracking-tight text-white mt-3 md:mt-5 headline-shimmer">
          Run with your{" "}
          <span className="text-[#F95E2E] people-underline">people.</span>
        </h1>

        {/* Subline */}
        <p className="enter enter-d3 font-body text-sm sm:text-base md:text-lg text-white/50 mt-2 md:mt-4 max-w-md leading-relaxed">
          The app for runners who show up for each other.
        </p>

        {/* Social proof */}
        <p className="social-proof-enter font-body text-[11px] sm:text-xs text-white/25 mt-1.5 md:mt-2.5 tracking-wide">
          Built for crews who run together
        </p>

        {/* CTAs */}
        <div className="enter enter-d4 flex items-center gap-3 mt-4 md:mt-6">
          <Link
            href="/signup"
            className="cta-glow inline-flex items-center justify-center font-body font-semibold text-sm sm:text-base text-white rounded-full px-8 py-3 min-h-[48px] sm:min-h-[50px] transition-all duration-200 hover:brightness-110 hover:-translate-y-[1px] active:scale-[0.97]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #F95E2E 0%, #FF7A45 50%, #F95E2E 100%)",
              backgroundSize: "200% 200%",
            }}
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center font-body font-medium text-sm sm:text-base text-white/70 border border-white/[0.12] rounded-full px-8 py-3 min-h-[48px] sm:min-h-[50px] transition-all duration-300 hover:border-white/30 hover:text-white/90 hover:bg-white/[0.04] hover:-translate-y-[0.5px] active:scale-[0.97]"
          >
            Sign in
          </Link>
        </div>

        {/* ── Feature collage ── */}
        <div className="mt-5 md:mt-10 w-full">
          {/* Mobile: horizontally scrollable card strip */}
          <div className="md:hidden -mx-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory">
              <div className="min-w-[200px] max-w-[200px] snap-center shrink-0 card-scale-enter card-d1">
                <FeatureCard label="Rally your crew" featured>
                  <RunCardMini />
                </FeatureCard>
              </div>
              <div className="min-w-[200px] max-w-[200px] snap-center shrink-0 card-scale-enter card-d2">
                <FeatureCard label="Earn badges">
                  <BadgesMini />
                </FeatureCard>
              </div>
              <div className="min-w-[200px] max-w-[200px] snap-center shrink-0 card-scale-enter card-d3">
                <FeatureCard label="Set your pace">
                  <PaceMini />
                </FeatureCard>
              </div>
              <div className="min-w-[200px] max-w-[200px] snap-center shrink-0 card-scale-enter card-d4">
                <FeatureCard label="Build your crew">
                  <CrewMini />
                </FeatureCard>
              </div>
              <div className="min-w-[200px] max-w-[200px] snap-center shrink-0 card-scale-enter card-d5">
                <FeatureCard label="Runs near you">
                  <MapMini />
                </FeatureCard>
              </div>
              <div className="min-w-[200px] max-w-[200px] snap-center shrink-0 card-scale-enter card-d6">
                <FeatureCard label="Run clubs">
                  <RunClubsMini />
                </FeatureCard>
              </div>
            </div>

            {/* Feature hints row */}
            <div className="hints-enter flex items-center justify-center gap-4 mt-4 px-4">
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span className="font-body text-[10px] text-white/30">Track your pace</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                <span className="font-body text-[10px] text-white/30">Earn badges</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="font-body text-[10px] text-white/30">Find clubs</span>
              </div>
            </div>

            {/* Mobile secondary CTA */}
            <div className="mobile-cta-enter flex justify-center mt-4 px-4">
              <Link
                href="/signup"
                className="cta-glow inline-flex items-center justify-center font-body font-semibold text-sm text-white rounded-full px-8 py-2.5 transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #F95E2E 0%, #FF7A45 50%, #F95E2E 100%)",
                  backgroundSize: "200% 200%",
                }}
              >
                Get started
              </Link>
            </div>
          </div>

          {/* Desktop: gradient separator line */}
          <div className="hidden md:block mx-auto max-w-[780px] lg:max-w-[920px] mb-4" aria-hidden="true">
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(249,94,46,0.25) 50%, transparent 100%)" }} />
          </div>

          {/* Desktop: 3x2 collage with transforms, float, and hover */}
          <div className="hidden md:grid md:grid-cols-3 gap-3 lg:gap-4 max-w-[780px] lg:max-w-[920px] mx-auto py-1">
            <div className="rotate-[-2deg] translate-y-[6px] card-float-1">
              <div className="card-enter card-d1">
                <FeatureCard label="Set your pace">
                  <PaceMini />
                </FeatureCard>
              </div>
            </div>
            <div className="translate-y-[-2px] card-float-2">
              <div className="card-enter card-d2">
                <FeatureCard label="Rally your crew" featured>
                  <RunCardMini />
                </FeatureCard>
              </div>
            </div>
            <div className="rotate-[2deg] translate-y-[8px] card-float-3">
              <div className="card-enter card-d3">
                <FeatureCard label="Earn badges">
                  <BadgesMini />
                </FeatureCard>
              </div>
            </div>
            <div className="rotate-[-1deg] translate-y-[-6px] card-float-4">
              <div className="card-enter card-d4">
                <FeatureCard label="Build your crew">
                  <CrewMini />
                </FeatureCard>
              </div>
            </div>
            <div className="rotate-[1deg] translate-y-[-10px] card-float-5">
              <div className="card-enter card-d5">
                <FeatureCard label="Runs near you">
                  <MapMini />
                </FeatureCard>
              </div>
            </div>
            <div className="rotate-[1.5deg] translate-y-[-4px] card-float-6">
              <div className="card-enter card-d6">
                <FeatureCard label="Run clubs">
                  <RunClubsMini />
                </FeatureCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature card wrapper                                              */
/* ------------------------------------------------------------------ */

function FeatureCard({
  label,
  children,
  featured = false,
}: {
  label: string;
  children: React.ReactNode;
  featured?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full feature-card-hover">
        {/* Glow behind card */}
        <div
          className={`absolute -inset-3 rounded-[20px] pointer-events-none ${featured ? "glow-pulse" : ""}`}
          style={{
            background: featured
              ? "radial-gradient(circle, rgba(249,94,46,0.1) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(249,94,46,0.04) 0%, transparent 70%)",
            filter: "blur(16px)",
          }}
          aria-hidden="true"
        />
        <div
          className={`card-border relative w-full bg-white/[0.97] backdrop-blur-sm rounded-2xl overflow-hidden transition-[border-color] duration-300 ${
            featured
              ? "shadow-[0_8px_40px_rgba(249,94,46,0.15),0_2px_12px_rgba(0,0,0,0.08)] border border-[#F95E2E]/20"
              : "shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/[0.06]"
          }`}
        >
          {children}
        </div>
      </div>
      <span
        className={`mt-1.5 text-[10px] md:text-[11px] font-body font-medium ${
          featured ? "text-[#F95E2E]/70" : "text-white/40"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini components — faithful to the real app UI                     */
/* ------------------------------------------------------------------ */

function RunCardMini() {
  return (
    <div className="p-2.5 md:p-3 space-y-1.5">
      {/* Creator row */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-[#F95E2E] to-[#FF8F6B] flex items-center justify-center shrink-0">
          <span className="text-white text-[6px] md:text-[7px] font-bold font-display">
            SK
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body font-medium text-[8px] md:text-[9px] text-[#2D2D2D] truncate">
            Sarah K.
          </p>
          <p className="font-body text-[6px] md:text-[7px] text-[#8A8F99]">
            Tomorrow 6:00 am
          </p>
        </div>
        <span className="flex items-center gap-0.5 text-[6px] md:text-[7px] font-body font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
          <span className="w-1 h-1 rounded-full bg-green-500" />
          Open
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-[#8A8F99]">
        <svg
          className="w-2.5 h-2.5 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-body text-[7px] md:text-[8px]">
          Safa Park, Dubai
        </span>
      </div>

      {/* Distance + Pace */}
      <div className="flex items-baseline gap-1.5">
        <span className="font-display font-bold text-[11px] md:text-[13px] text-[#2D2D2D]">
          10 km
        </span>
        <span className="text-[#BFCCD9] text-[8px]">&middot;</span>
        <span className="font-body text-[7px] md:text-[8px] text-[#8A8F99]">
          5:00 &ndash; 6:00/km
        </span>
      </div>

      {/* Note */}
      <p className="font-body text-[6px] md:text-[7px] text-[#8A8F99] italic border-l-[1.5px] border-[#F95E2E]/40 pl-1.5 leading-relaxed">
        &ldquo;Easy vibes, all welcome&rdquo;
      </p>

      {/* Participants + join */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center">
          <div className="flex -space-x-1">
            {["bg-blue-400", "bg-purple-400", "bg-emerald-400"].map((c, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full ${c} border-[1.5px] border-white flex items-center justify-center`}
              >
                <span className="text-white text-[5px] font-bold">
                  {["JR", "MT", "AL"][i]}
                </span>
              </div>
            ))}
          </div>
          <span className="text-[6px] md:text-[7px] font-body text-[#8A8F99] ml-1">
            +2
          </span>
        </div>
        <div className="bg-[#F95E2E] text-white text-[6px] md:text-[7px] font-body font-medium px-2 py-1 rounded-full">
          I&apos;m in
        </div>
      </div>
    </div>
  );
}

function PaceMini() {
  return (
    <div className="p-2.5 md:p-3 space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="font-body text-[8px] md:text-[9px] text-[#2D2D2D] font-medium">
          Pace
        </span>
        <span className="font-display text-[9px] md:text-[10px] font-semibold text-[#2D2D2D]">
          5:00 &ndash; 6:00
          <span className="text-[#8A8F99] font-body text-[7px] font-normal ml-0.5">
            /km
          </span>
        </span>
      </div>
      {/* Track */}
      <div className="relative h-7">
        <div
          className="absolute w-full h-[7px] md:h-[8px] rounded-full top-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(to right, #BFCCD9 25%, #F95E2E 25%, #F95E2E 65%, #BFCCD9 65%)",
          }}
        />
        {/* Min thumb */}
        <div
          className="absolute w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border-[2px] border-[#F95E2E] shadow-md top-1/2 -translate-y-1/2"
          style={{ left: "calc(25% - 10px)" }}
        />
        {/* Max thumb */}
        <div
          className="absolute w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border-[2px] border-[#F95E2E] shadow-md top-1/2 -translate-y-1/2"
          style={{ left: "calc(65% - 10px)" }}
        />
      </div>
    </div>
  );
}

function BadgesMini() {
  return (
    <div className="p-2.5 md:p-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-body text-[7px] md:text-[8px] text-[#8A8F99] uppercase tracking-wider">
          Badges
        </span>
        <span className="font-body text-[7px] md:text-[8px] font-semibold text-[#F95E2E]">
          5/12
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 md:gap-1.5">
        {/* Earned */}
        {[
          { emoji: "\uD83D\uDD25", name: "Regular" },
          { emoji: "\uD83E\uDD1D", name: "Crew Up" },
          { emoji: "\u270B", name: "Team Player" },
        ].map((b) => (
          <div
            key={b.name}
            className="bg-[#F95E2E]/10 border border-[#F95E2E]/20 rounded-lg p-1.5 flex flex-col items-center gap-0.5"
          >
            <span className="text-[11px] md:text-[13px] leading-none select-none">
              {b.emoji}
            </span>
            <span className="font-body text-[5px] md:text-[6px] font-medium text-[#2D2D2D] text-center leading-tight">
              {b.name}
            </span>
          </div>
        ))}
        {/* Locked */}
        {[
          { name: "Centurion", pct: 12 },
          { name: "Squad", pct: 40 },
          { name: "The Magnet", pct: 60 },
        ].map((b) => (
          <div
            key={b.name}
            className="bg-[#F6F7F8] border border-[#BFCCD9]/40 rounded-lg p-1.5 flex flex-col items-center gap-0.5"
          >
            <span className="text-[11px] md:text-[13px] leading-none grayscale opacity-40 select-none">
              {"\uD83D\uDD12"}
            </span>
            <span className="font-body text-[5px] md:text-[6px] text-[#8A8F99] text-center leading-tight">
              {b.name}
            </span>
            <div className="w-full h-[2px] rounded-full bg-[#BFCCD9]/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#F95E2E]/50"
                style={{ width: `${b.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CrewMini() {
  const members = [
    {
      initials: "JR",
      name: "James R.",
      handle: "@jamesr",
      pace: "5:00\u20136:00",
      color: "from-blue-500 to-blue-400",
    },
    {
      initials: "SK",
      name: "Sarah K.",
      handle: "@sarahk",
      pace: "4:30\u20135:30",
      color: "from-[#F95E2E] to-[#FF8F6B]",
    },
    {
      initials: "MT",
      name: "Mike T.",
      handle: "@miket",
      pace: "5:30\u20136:30",
      color: "from-emerald-500 to-emerald-400",
    },
  ];

  return (
    <div className="p-2.5 md:p-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-body text-[7px] md:text-[8px] text-[#8A8F99] uppercase tracking-wider">
          My crew
        </span>
        <span className="font-body text-[7px] md:text-[8px] text-[#8A8F99]">
          (3)
        </span>
      </div>
      <div className="space-y-1">
        {members.map((m) => (
          <div
            key={m.handle}
            className="flex items-center gap-1.5 bg-white rounded-lg p-1.5 border border-[#BFCCD9]/30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          >
            <div
              className={`w-5 h-5 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0`}
            >
              <span className="text-white text-[6px] font-bold font-display">
                {m.initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[7px] md:text-[8px] font-medium text-[#2D2D2D] truncate">
                {m.name}
              </p>
              <p className="font-body text-[5px] md:text-[6px] text-[#8A8F99]">
                {m.handle}
              </p>
            </div>
            <span className="bg-[#F6F7F8] text-[#2D2D2D] text-[5px] md:text-[6px] font-body font-medium px-1.5 py-0.5 rounded-full shrink-0">
              {m.pace}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapMini() {
  return (
    <div className="relative overflow-hidden rounded-2xl h-[120px] md:h-[140px]">
      {/* Map background */}
      <div className="absolute inset-0 bg-[#EDEEF0]">
        {/* Roads */}
        <div className="absolute top-[30%] left-0 right-0 h-[1.5px] bg-white/60" />
        <div className="absolute top-[55%] left-0 right-0 h-[1.5px] bg-white/60" />
        <div className="absolute top-[78%] left-[10%] right-[20%] h-[1.5px] bg-white/60" />
        <div className="absolute left-[25%] top-0 bottom-0 w-[1.5px] bg-white/60" />
        <div className="absolute left-[60%] top-[10%] bottom-[15%] w-[1.5px] bg-white/60" />
        <div className="absolute left-[80%] top-[20%] bottom-[30%] w-[1.5px] bg-white/60" />
        <div
          className="absolute top-[15%] left-[5%] w-[60%] h-[1.5px] bg-white/50"
          style={{
            transform: "rotate(25deg)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Pins */}
      <div className="absolute top-[25%] left-[20%] w-2.5 h-2.5 rounded-full bg-[#F95E2E] border-[1.5px] border-white shadow-md" />
      <div className="absolute top-[50%] left-[55%] w-2.5 h-2.5 rounded-full bg-[#F95E2E] border-[1.5px] border-white shadow-md" />
      <div className="absolute top-[40%] left-[75%] w-2 h-2 rounded-full bg-[#FF8F6B] border-[1.5px] border-white shadow-md" />
      <div className="absolute top-[68%] left-[35%] w-2 h-2 rounded-full bg-[#F95E2E] border-[1.5px] border-white shadow-md" />

      {/* Popup */}
      <div className="absolute top-[16%] left-[28%] bg-white rounded-md shadow-lg px-1.5 py-1 min-w-max">
        <p className="font-display font-bold text-[6px] md:text-[7px] text-[#2D2D2D] leading-tight">
          Sarah K.
        </p>
        <p className="font-body text-[5px] md:text-[6px] text-[#8A8F99] leading-tight">
          10km &middot; Tomorrow 6am
        </p>
        <div className="absolute -bottom-[3px] left-2.5 w-1.5 h-1.5 bg-white rotate-45 shadow-sm" />
      </div>
    </div>
  );
}

function RunClubsMini() {
  const clubs = [
    { name: "Dubai Creek Striders", color: "from-blue-600 to-blue-400", initials: "DC", members: "128" },
    { name: "Safa Park Runners", color: "from-[#F95E2E] to-[#FF8F6B]", initials: "SP", members: "86" },
    { name: "JLT Run Crew", color: "from-emerald-600 to-emerald-400", initials: "JL", members: "64" },
  ];

  return (
    <div className="p-2.5 md:p-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-body text-[7px] md:text-[8px] text-[#8A8F99] uppercase tracking-wider">
          Run Clubs
        </span>
        <span className="font-body text-[7px] md:text-[8px] text-[#F95E2E] font-medium">
          Explore
        </span>
      </div>
      <div className="space-y-1">
        {clubs.map((club) => (
          <div
            key={club.name}
            className="flex items-center gap-1.5 bg-white rounded-lg p-1.5 border border-[#BFCCD9]/30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          >
            <div
              className={`w-5 h-5 rounded-md bg-gradient-to-br ${club.color} flex items-center justify-center shrink-0`}
            >
              <span className="text-white text-[5px] font-bold font-display">
                {club.initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[7px] md:text-[8px] font-medium text-[#2D2D2D] truncate">
                {club.name}
              </p>
              <p className="font-body text-[5px] md:text-[6px] text-[#8A8F99]">
                {club.members} runners
              </p>
            </div>
            <div className="bg-[#F95E2E]/10 text-[#F95E2E] text-[5px] md:text-[6px] font-body font-medium px-1.5 py-0.5 rounded-full shrink-0">
              Join
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
