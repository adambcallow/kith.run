import Link from "next/link";
import { Button } from "@/components/ui/Button";

const locations = [
  "JBR",
  "Safa Park",
  "Al Qudra",
  "Creek Harbour",
  "Business Bay",
  "Yas Island",
  "Zabeel Park",
  "Jumeirah",
  "Downtown",
  "Marina",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="bg-kith-black text-white flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight max-w-lg">
          Run with your people.
        </h1>
        <p className="font-body text-lg text-white/70 mt-4 max-w-md">
          Find your kith. Plan a run. Show up together.
        </p>
        <div className="flex items-center gap-3 mt-8">
          <Link href="/signup">
            <Button>Get started</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="border-white/30 text-white">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-md mx-auto space-y-10">
          <h2 className="font-display font-bold text-2xl text-center text-kith-text">
            How it works
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Post your run",
                desc: "Start spot, time, distance, pace.",
              },
              {
                step: "2",
                title: "Your crew joins",
                desc: "One tap. No group chat needed.",
              },
              {
                step: "3",
                title: "Run together",
                desc: "Show up. React afterwards.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-kith-orange text-white font-display font-bold text-lg flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display font-bold text-kith-text">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-kith-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location marquee */}
      <section className="bg-kith-surface py-4 overflow-hidden">
        <div className="flex whitespace-nowrap">
          {[...locations, ...locations].map((loc, i) => (
            <span
              key={i}
              className="font-body text-sm text-kith-muted mx-4"
            >
              {loc}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kith-black text-white py-16 px-6 text-center">
        <h2 className="font-display font-bold text-2xl max-w-sm mx-auto">
          Your kith is out there running right now.
        </h2>
        <div className="mt-6">
          <Link href="/signup">
            <Button>Get started</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
