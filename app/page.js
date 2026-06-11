import Link from "next/link";
import { AGENTS } from "@/lib/supabaseClient";

const FEED = [
  ["💬", "AI Receptionist booked a new lead", "just now"],
  ["✨", "Now appearing in ChatGPT answers", "12 min ago"],
  ["📍", "Replied to a 5-star Google review", "1 hr ago"],
  ["🔎", "Published an SEO article", "3 hrs ago"],
  ["🎯", "Found 18 new leads to reach", "today"]
];

const WHY = [
  ["The way people search has changed", "Your customers no longer only Google you. They ask ChatGPT, Gemini and Perplexity who's the best near them. If those AIs don't know you, you're invisible to your best customers."],
  ["Agencies are slow and expensive", "A marketing agency charges thousands a month and still makes you wait. Our agents work every day, never sleep, and cost less than one new customer is worth."],
  ["Doing it yourself is impossible", "SEO, AI search, Google, reviews, leads, content — no owner has time for all of it. Your agents handle the work so you can run your business."]
];

const STEPS = [
  ["Tell us about your business once", "A few questions about what you do. This is the only work you ever do."],
  ["Your agents get to work", "They make you findable on Google and AI search, answer your visitors, and bring in leads — automatically."],
  ["You watch customers come in", "Real leads and real growth show up in your dashboard. You just reply and close them."]
];

const FAQ = [
  ["What exactly do I get?", "A team of AI agents that market your business every day: an AI receptionist that answers visitors and captures leads, plus agents for Google, AI search, content, and finding new customers. We can also build you a website if you need one."],
  ["Do I need any tech skill?", "None. You answer a few questions once. The agents do the rest, and everything shows up in one simple dashboard."],
  ["How fast will I see results?", "Your AI receptionist and lead capture work from day one. Search results on Google and AI engines build over 60-90 days — we show you honest progress, never fake numbers."],
  ["Can I cancel anytime?", "Yes. Cancelling stops any future payment immediately. We keep you by doing great work, not by trapping you."]
];

export default function Home() {
  return (
    <main>
      <header className="sticky top-0 z-30 backdrop-blur bg-paper/80 border-b border-line">
        <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <span className="font-display text-lg font-bold">Agent<span className="text-brand">Marketer</span></span>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/pricing" className="hidden sm:inline text-slate hover:text-ink">Pricing</Link>
            <Link href="/login" className="text-slate hover:text-ink">Log in</Link>
            <Link href="/signup" className="bg-ink text-white px-4 py-2 rounded-xl font-semibold hover:bg-brand transition-colors">Start now</Link>
          </div>
        </nav>
      </header>

      <section className="hero-glow">
        <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="rise">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand bg-soft border border-line px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald dot" /> Your AI marketing team
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mt-5">
              Get found <span className="gradient-text">everywhere</span> customers look.
            </h1>
            <p className="text-lg text-slate mt-5 max-w-md">
              AI agents that put your business in front of customers on Google and AI search,
              answer them 24/7, and bring you new leads — automatically.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/signup" className="bg-brand text-white px-6 py-3 rounded-xl font-semibold shadow-lift hover:bg-branddark transition-colors">Start now</Link>
              <Link href="/pricing" className="bg-white border border-line px-6 py-3 rounded-xl font-semibold hover:border-brand transition-colors">See pricing</Link>
            </div>
            <p className="text-xs text-slate mt-4">No tech skills needed · Cancel anytime</p>
          </div>

          <div className="rise">
            <div className="bg-white rounded-3xl shadow-card border border-line p-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-sm font-semibold">Your agents · live</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald dot" /> working
                </span>
              </div>
              <ul className="mt-3 space-y-1">
                {FEED.map(([e, t, w], i) => (
                  <li key={i} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-soft">
                    <span className="w-9 h-9 grid place-items-center rounded-xl bg-soft text-lg">{e}</span>
                    <span className="text-sm flex-1">{t}</span>
                    <span className="text-xs text-slate">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-y border-line bg-white/60">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate">
            <span className="font-semibold text-ink">Be a founding business</span>
            <span>·</span>
            <span>Early customers lock in launch pricing for life</span>
            <span>·</span>
            <span>Real reviews from real owners appear here soon</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-sm font-semibold text-brand">Why now</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 max-w-2xl">The businesses AI recommends will win the next ten years.</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {WHY.map(([t, b]) => (
            <div key={t} className="bg-white rounded-2xl border border-line shadow-card p-6">
              <h3 className="font-display text-lg font-bold">{t}</h3>
              <p className="text-slate text-sm mt-2 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-sm font-semibold text-emerald">Your team</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Six agents working for you</h2>
          <p className="text-white/60 mt-3 max-w-xl">Each one does a real job, every day, and reports back to you in plain language.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {AGENTS.map((a) => (
              <div key={a.name} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="w-11 h-11 grid place-items-center rounded-xl text-xl" style={{ background: a.tint + "22" }}>{a.emoji}</div>
                <h3 className="font-display font-bold mt-4">{a.name}</h3>
                <p className="text-white/60 text-sm mt-1 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-sm mt-8">Need a website too? We build, host and manage one for you as an add-on. It's a bonus, not the point.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {STEPS.map(([t, b], i) => (
            <div key={t} className="relative bg-soft rounded-2xl p-6">
              <span className="font-display text-5xl font-bold text-brand/20">{i + 1}</span>
              <h3 className="font-display text-lg font-bold mt-2">{t}</h3>
              <p className="text-slate text-sm mt-2 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="font-display text-3xl font-bold text-center">Questions</h2>
        <div className="mt-8 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="bg-white border border-line rounded-2xl p-5 group">
              <summary className="font-semibold cursor-pointer flex justify-between items-center">
                {q}<span className="text-brand group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="text-slate text-sm mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-ink text-white p-10 md:p-14 text-center hero-glow">
          <h2 className="font-display text-3xl md:text-5xl font-bold">Put your AI team to work today.</h2>
          <p className="text-white/70 mt-4 max-w-md mx-auto">Founding customers lock in 50% off for life. Setup takes five minutes.</p>
          <Link href="/signup" className="inline-block mt-8 bg-brand text-white px-8 py-4 rounded-xl font-semibold shadow-lift hover:bg-branddark transition-colors">Start now</Link>
        </div>
      </section>

      <footer className="border-t border-line py-8 text-center text-sm text-slate">
        © 2026 AgentMarketer · Cancel anytime to stop future payments.
      </footer>
    </main>
  );
}
