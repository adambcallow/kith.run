import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Landing Page — kith.run                                           */
/*  Single viewport, no scroll, dark hero with feature collage        */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1B1C1F] relative">
      {/* ── Inline animations ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes blob1 {
              0%, 100% { transform: translate(0%, 0%) scale(1); }
              25% { transform: translate(5%, -8%) scale(1.1); }
              50% { transform: translate(-3%, 5%) scale(0.95); }
              75% { transform: translate(8%, 2%) scale(1.05); }
            }
            @keyframes blob2 {
              0%, 100% { transform: translate(0%, 0%) scale(1); }
              25% { transform: translate(-6%, 4%) scale(1.08); }
              50% { transform: translate(4%, -6%) scale(0.92); }
              75% { transform: translate(-2%, 8%) scale(1.12); }
            }
            @keyframes blob3 {
              0%, 100% { transform: translate(0%, 0%) scale(1); }
              33% { transform: translate(6%, 6%) scale(1.06); }
              66% { transform: translate(-5%, -3%) scale(0.94); }
            }

            @keyframes fadeInUp {
              0% { opacity: 0; transform: translateY(24px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .enter {
              animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .enter-d1 { animation-delay: 0.05s; }
            .enter-d2 { animation-delay: 0.15s; }
            .enter-d3 { animation-delay: 0.3s; }
            .enter-d4 { animation-delay: 0.45s; }

            @keyframes cardEnter {
              0% { opacity: 0; transform: translateY(28px) scale(0.96); }
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

            @keyframes ctaGlow {
              0%, 100% { box-shadow: 0 0 24px 0 rgba(249,94,46,0.2); }
              50% { box-shadow: 0 0 40px 4px rgba(249,94,46,0.35); }
            }
            .cta-glow {
              animation: ctaGlow 3s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .enter, .card-enter, .cta-glow { animation: none !important; opacity: 1 !important; transform: none !important; }
            }
          `,
        }}
      />

      {/* ── Animated gradient mesh ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #F95E2E 0%, transparent 70%)",
            top: "-10%",
            left: "-5%",
            filter: "blur(80px)",
            animation: "blob1 18s ease-in-out infinite",
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
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(249,94,46,0.06) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 w-full max-w-6xl mx-auto">
        {/* Wordmark */}
        <div className="enter enter-d1">
          <span className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-white">
            kith
          </span>
        </div>

        {/* Headline */}
        <h1 className="enter enter-d2 font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight text-white mt-4 md:mt-5">
          Run with your{" "}
          <span className="text-[#F95E2E]">people.</span>
        </h1>

        {/* Subline */}
        <p className="enter enter-d3 font-body text-sm sm:text-base md:text-lg text-white/50 mt-3 md:mt-4 max-w-md leading-relaxed">
          Plan a run. Rally your crew. Show up together.
        </p>

        {/* CTAs */}
        <div className="enter enter-d4 flex items-center gap-3 mt-6 md:mt-7">
          <Link
            href="/signup"
            className="cta-glow inline-flex items-center justify-center font-body font-medium text-sm sm:text-base text-white bg-[#F95E2E] rounded-full px-7 py-3 min-h-[44px] sm:min-h-[48px] transition-all duration-200 hover:brightness-110 hover:-translate-y-[1px] active:scale-[0.97]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.04) 100%)",
            }}
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center font-body font-medium text-sm sm:text-base text-white/80 border border-white/20 rounded-full px-7 py-3 min-h-[44px] sm:min-h-[48px] transition-all duration-200 hover:border-white/40 hover:text-white hover:-translate-y-[0.5px] active:scale-[0.97]"
          >
            Sign in
          </Link>
        </div>

        {/* ── Feature collage ── */}
        <div className="mt-7 md:mt-9 w-full">
          {/* Mobile: 2×2 grid */}
          <div className="grid grid-cols-2 gap-2.5 md:hidden max-w-[340px] mx-auto">
            <div className="card-enter card-d1">
              <FeatureCard label="Rally your crew" featured>
                <RunCardMini />
              </FeatureCard>
            </div>
            <div className="card-enter card-d2">
              <FeatureCard label="Earn badges">
                <BadgesMini />
              </FeatureCard>
            </div>
            <div className="card-enter card-d3">
              <FeatureCard label="Set your pace">
                <PaceMini />
              </FeatureCard>
            </div>
            <div className="card-enter card-d4">
              <FeatureCard label="Build your crew">
                <CrewMini />
              </FeatureCard>
            </div>
          </div>

          {/* Desktop: 3×2 collage with transforms */}
          <div className="hidden md:grid md:grid-cols-3 gap-3 lg:gap-4 max-w-[740px] lg:max-w-[860px] mx-auto py-1">
            <div className="rotate-[-2deg] translate-y-[6px]">
              <div className="card-enter card-d1">
                <FeatureCard label="Set your pace">
                  <PaceMini />
                </FeatureCard>
              </div>
            </div>
            <div className="translate-y-[-2px]">
              <div className="card-enter card-d2">
                <FeatureCard label="Rally your crew" featured>
                  <RunCardMini />
                </FeatureCard>
              </div>
            </div>
            <div className="rotate-[2deg] translate-y-[8px]">
              <div className="card-enter card-d3">
                <FeatureCard label="Earn badges">
                  <BadgesMini />
                </FeatureCard>
              </div>
            </div>
            <div className="rotate-[-1deg] translate-y-[-6px]">
              <div className="card-enter card-d4">
                <FeatureCard label="Build your crew">
                  <CrewMini />
                </FeatureCard>
              </div>
            </div>
            <div className="rotate-[1deg] translate-y-[-10px]">
              <div className="card-enter card-d5">
                <FeatureCard label="Runs near you">
                  <MapMini />
                </FeatureCard>
              </div>
            </div>
            <div className="rotate-[1.5deg] translate-y-[-4px]">
              <div className="card-enter card-d6">
                <FeatureCard label="Plan every split">
                  <IntervalsMini />
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
      <div className="relative w-full">
        {/* Glow behind card */}
        <div
          className="absolute -inset-3 rounded-[20px] pointer-events-none"
          style={{
            background: featured
              ? "radial-gradient(circle, rgba(249,94,46,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(249,94,46,0.04) 0%, transparent 70%)",
            filter: "blur(16px)",
          }}
          aria-hidden="true"
        />
        <div
          className={`relative w-full bg-white/[0.97] backdrop-blur-sm rounded-2xl overflow-hidden ${
            featured
              ? "shadow-[0_8px_40px_rgba(249,94,46,0.15),0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-[#F95E2E]/20"
              : "shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-white/10"
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

function IntervalsMini() {
  return (
    <div className="p-2.5 md:p-3 space-y-1.5">
      <span className="font-body text-[8px] md:text-[9px] text-[#2D2D2D] font-medium">
        Interval splits
      </span>

      {/* Segment rows */}
      <div className="space-y-1">
        {[
          { n: 1, km: "2", pace: "4:30" },
          { n: 2, km: "3", pace: "5:15" },
          { n: 3, km: "2", pace: "4:45" },
        ].map((s) => (
          <div
            key={s.n}
            className="flex items-center gap-1.5 bg-[#F6F7F8] rounded-md px-1.5 py-[3px]"
          >
            <span className="text-[6px] font-body text-[#8A8F99] w-2.5 tabular-nums">
              {s.n}.
            </span>
            <span className="text-[7px] md:text-[8px] font-body text-[#2D2D2D] tabular-nums">
              {s.km} km
            </span>
            <span className="text-[6px] font-body text-[#8A8F99]">at</span>
            <span className="text-[7px] md:text-[8px] font-body text-[#2D2D2D] tabular-nums">
              {s.pace}/km
            </span>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="flex gap-0.5 h-[18px] md:h-5 rounded-md overflow-hidden">
        <div
          className="flex items-center justify-center"
          style={{
            width: "28%",
            backgroundColor: "rgba(249, 94, 46, 0.9)",
            borderRadius: "5px 2px 2px 5px",
          }}
        >
          <span className="text-[6px] md:text-[7px] font-body font-medium text-white">
            4:30
          </span>
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: "43%",
            backgroundColor: "rgba(249, 94, 46, 0.45)",
            borderRadius: "2px",
          }}
        >
          <span className="text-[6px] md:text-[7px] font-body font-medium text-white">
            5:15
          </span>
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: "29%",
            backgroundColor: "rgba(249, 94, 46, 0.7)",
            borderRadius: "2px 5px 5px 2px",
          }}
        >
          <span className="text-[6px] md:text-[7px] font-body font-medium text-white">
            4:45
          </span>
        </div>
      </div>

      <span className="font-body text-[7px] md:text-[8px] font-semibold text-[#2D2D2D]">
        Total: 7 km
      </span>
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
