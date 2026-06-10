import Link from "next/link";

const PLANS = [
  {
    name: "Basic",
    full: 99,
    launch: 49.5,
    tag: "Get online",
    features: [
      "Website maintenance & hosting managed for you",
      "AI receptionist (chatbot) on your website",
      "Leads captured into your dashboard",
      "Support contact + handover when your site goes live"
    ]
  },
  {
    name: "Growth",
    full: 149,
    launch: 74.5,
    tag: "Most popular",
    popular: true,
    features: [
      "Everything in Basic",
      "SEO Agent: blog posts, titles & meta done for you",
      "GEO Agent: FAQ & answer content for AI search",
      "Google Business Agent: posts to your profile"
    ]
  },
  {
    name: "Pro",
    full: 199,
    launch: 99.5,
    tag: "Full service",
    features: [
      "Everything in Growth",
      "Review management: drafted replies to every review",
      "AI Search file (llms.txt) kept up to date",
      "Monthly before-vs-after analytics report"
    ]
  }
];

export default function Pricing() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <nav className="flex items-center justify-between mb-12">
        <Link href="/" className="font-display text-xl font-bold text-awning">AgentMarketer</Link>
        <Link href="/signup" className="bg-awning text-white px-4 py-2 rounded-lg font-semibold hover:bg-awningdark">
          Get started
        </Link>
      </nav>

      <h1 className="font-display text-4xl font-bold text-center">Launch pricing — 50% off</h1>
      <p className="text-center mt-3 opacity-70 max-w-xl mx-auto">
        One-time website build: <s>$100</s> <strong>$50</strong> — includes delivery by a real
        person and 3 free revisions. Then pick your monthly plan.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl p-6 border-2 ${p.popular ? "border-awning bg-mint" : "border-gray-200"}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-awning">{p.tag}</p>
            <h2 className="font-display text-2xl font-bold mt-1">{p.name}</h2>
            <p className="mt-3">
              <s className="opacity-50">${p.full}</s>{" "}
              <span className="font-display text-4xl font-bold">${p.launch}</span>
              <span className="opacity-60">/month</span>
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-awning font-bold">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={`block text-center mt-6 px-4 py-3 rounded-lg font-semibold ${
                p.popular ? "bg-awning text-white hover:bg-awningdark" : "bg-ink text-white hover:opacity-90"
              }`}
            >
              Choose {p.name}
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-ink text-white rounded-2xl p-8 mt-10 text-center">
        <h3 className="font-display text-2xl font-bold">Pay annually — website build FREE</h3>
        <p className="mt-2 opacity-80">
          Pay for 11 months, get 12. Plus we build your website at no charge (normally $50).
        </p>
      </div>

      <p className="text-center text-sm opacity-60 mt-8 max-w-2xl mx-auto">
        No refunds — your website is real work delivered to you. You can cancel anytime to stop
        future payments. Annual plans only: full refund within the first 7 days, before your
        website is built.
      </p>

      <p className="text-center text-sm mt-6 opacity-70">
        Online payment checkout is added in Stage 3 (Paddle). For now, new customers are
        activated by the admin after payment.
      </p>
    </main>
  );
}
