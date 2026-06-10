import Link from "next/link";

const TICKER = [
  "Replied to a new Google review — 2 min ago",
  "Captured a lead from your website — 14 min ago",
  "Published a blog post — 1 hr ago",
  "Posted an update to Google Business — 3 hrs ago",
  "Answered 6 visitor questions overnight",
  "Updated your llms.txt for AI search — today"
];

const STEPS = [
  ["Tell us about your business", "Five minutes. Your services, prices, hours, and location. That's all we need from you — ever."],
  ["We build and launch your website", "A fast, mobile-friendly site with an AI receptionist built in, live on your own domain within days."],
  ["Customers find you", "We keep your Google profile active, publish content, and capture every interested visitor as a lead."]
];

const FAQ = [
  ["Do I need to do anything technical?", "No. You answer a few questions about your business once. We handle the website, the chatbot, Google, and the content."],
  ["Who owns my website and domain?", "The domain is bought in your name — you own your address on the internet. We build and manage the website for you."],
  ["How fast do results show?", "Your website and AI receptionist work from day one — you'll see real conversations and leads in your dashboard immediately. Google search rankings grow over 60–90 days; we show you honest progress, never fake numbers."],
  ["Can I cancel?", "Yes, anytime — cancelling stops future payments. Payments already made are not refunded, because the work (your website) is already delivered."]
];

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="font-display text-xl font-bold text-awning">AgentMarketer</span>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pricing" className="hover:text-awning">Pricing</Link>
          <Link href="/login" className="hover:text-awning">Log in</Link>
          <Link href="/signup" className="bg-awning text-white px-4 py-2 rounded-lg font-semibold hover:bg-awningdark">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-mint">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
          <p className="inline-block bg-white text-awning text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full mb-6">
            For local businesses — dentists, salons, trades, clinics
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto">
            Your business, found everywhere. <span className="text-awning">You do nothing.</span>
          </h1>
          <p className="mt-5 text-lg max-w-2xl mx-auto opacity-80">
            We build your website, answer your visitors with an AI receptionist, and keep
            you active on Google and AI search — for less than one customer is worth.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="bg-awning text-white px-6 py-3 rounded-lg font-semibold hover:bg-awningdark">
              Get my website built
            </Link>
            <Link href="/pricing" className="bg-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
              See pricing
            </Link>
          </div>
        </div>

        {/* Signature: the live work ticker */}
        <div className="border-y border-awning/20 bg-ink text-mint overflow-hidden py-3" aria-label="Examples of work our agents do for you">
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="text-sm whitespace-nowrap">
                <span className="text-amber mr-2">●</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl font-bold text-center">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {STEPS.map(([title, body], i) => (
            <div key={title} className="bg-mint rounded-2xl p-6">
              <div className="w-9 h-9 rounded-full bg-awning text-white flex items-center justify-center font-display font-bold">
                {i + 1}
              </div>
              <h3 className="font-display text-xl font-bold mt-4">{title}</h3>
              <p className="mt-2 opacity-80 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold">Simple pricing. 50% off at launch.</h2>
          <p className="mt-3 opacity-70">
            Website build: <s>$100</s> <strong className="text-amber">$50 one-time</strong> · Plans from{" "}
            <s>$99</s> <strong className="text-amber">$49.50/month</strong> · Pay annually and the website build is free.
          </p>
          <Link href="/pricing" className="inline-block mt-6 bg-amber text-ink px-6 py-3 rounded-lg font-semibold hover:opacity-90">
            See all plans
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl font-bold text-center">Questions owners ask us</h2>
        <div className="mt-8 space-y-4">
          {FAQ.map(([q, a]) => (
            <details key={q} className="bg-mint rounded-xl p-5">
              <summary className="font-semibold cursor-pointer">{q}</summary>
              <p className="mt-2 text-sm opacity-80 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm opacity-60">
        © {new Date().getFullYear()} AgentMarketer · No refunds — cancel anytime to stop future payments.
      </footer>
    </main>
  );
}
