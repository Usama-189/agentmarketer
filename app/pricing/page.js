"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  { id: "basic", name: "Basic", full: 99, launch: 49.5, tag: "Get found",
    features: ["AI Receptionist (chatbot) on your site", "Google Business Agent", "Leads captured into your dashboard", "Monthly analytics report"] },
  { id: "growth", name: "Growth", full: 149, launch: 74.5, tag: "Most popular", popular: true,
    features: ["Everything in Basic", "SEO Agent — articles & on-page", "AI Search Agent — ChatGPT, Gemini, Perplexity", "Review replies handled for you"] },
  { id: "pro", name: "Pro", full: 199, launch: 99.5, tag: "Full team",
    features: ["Everything in Growth", "Lead Gen Agent — B2B & B2C leads", "Priority support & faster runs", "Deeper analytics & competitor view"] }
];

const WEBSITE_FEE = 50; // one-time, 50% off from $100

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [website, setWebsite] = useState({ basic: false, growth: false, pro: false });

  function priceFor(p) {
    if (annual) return (p.launch * 11).toFixed(2);   // pay 11 months, get 12
    return p.launch.toFixed(2);
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-line">
        <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <Link href="/" className="font-display text-lg font-bold">Agent<span className="text-brand">Marketer</span></Link>
          <Link href="/signup" className="bg-ink text-white px-4 py-2 rounded-xl font-semibold hover:bg-brand transition-colors">Start now</Link>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-center">Simple pricing. 50% off at launch.</h1>
        <p className="text-center text-slate mt-3">Pick a plan. Add a done-for-you website if you want one.</p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={!annual ? "font-semibold" : "text-slate"}>Monthly</span>
          <button onClick={() => setAnnual(!annual)}
            className="relative w-14 h-8 rounded-full bg-soft border border-line transition-colors"
            aria-label="Toggle annual billing">
            <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-brand transition-transform ${annual ? "translate-x-6" : ""}`} />
          </button>
          <span className={annual ? "font-semibold" : "text-slate"}>
            Annual <span className="text-emerald text-sm font-semibold">· 1 month free + website FREE</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {PLANS.map((p) => {
            const websiteOn = annual || website[p.id];
            return (
              <div key={p.id}
                className={`rounded-3xl p-6 bg-white border shadow-card flex flex-col ${p.popular ? "border-brand ring-2 ring-brand/20" : "border-line"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand">{p.tag}</span>
                  {p.popular && <span className="text-xs bg-brand text-white px-2 py-0.5 rounded-full">Popular</span>}
                </div>
                <h2 className="font-display text-2xl font-bold mt-2">{p.name}</h2>
                <p className="mt-3">
                  <s className="text-slate text-sm">${annual ? p.full * 12 : p.full}</s>{" "}
                  <span className="font-display text-4xl font-bold">${priceFor(p)}</span>
                  <span className="text-slate">/{annual ? "year" : "month"}</span>
                </p>

                <ul className="mt-5 space-y-2 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-emerald font-bold">✓</span><span>{f}</span></li>
                  ))}
                </ul>

                {/* Website add-on */}
                <label className={`mt-5 flex items-start gap-2 text-sm rounded-xl p-3 border ${websiteOn ? "border-emerald bg-emerald/5" : "border-line bg-soft"}`}>
                  <input type="checkbox" className="mt-0.5" checked={websiteOn} disabled={annual}
                    onChange={(e) => setWebsite({ ...website, [p.id]: e.target.checked })} />
                  <span>
                    <strong>Done-for-you website</strong>{" "}
                    {annual ? <span className="text-emerald font-semibold">included FREE</span>
                            : <span className="text-slate">+${WEBSITE_FEE} one-time</span>}
                    <span className="block text-slate text-xs mt-0.5">We build, host & manage it. 3 revisions included.</span>
                  </span>
                </label>

                <Link href="/signup"
                  className={`block text-center mt-5 px-4 py-3 rounded-xl font-semibold ${p.popular ? "bg-brand text-white hover:bg-branddark" : "bg-ink text-white hover:bg-brand"} transition-colors`}>
                  Choose {p.name}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-slate mt-10 max-w-2xl mx-auto">
          No refunds — cancel anytime to stop future payments. Annual plans: full refund within
          7 days, before your website is built. Card checkout (Paddle) is added in the next update;
          for now new customers are activated by our team after payment.
        </p>
      </div>
    </main>
  );
}
