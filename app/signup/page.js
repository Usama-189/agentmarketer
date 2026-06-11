"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const FEED = [["💬","AI Receptionist booked a lead"],["✨","Appearing in ChatGPT answers"],["🎯","Found 18 new leads"]];

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(""); const [notice, setNotice] = useState(""); const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault(); setError(""); setNotice("");
    if (!agree) { setError("Please agree to the no-refund policy to continue."); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data.session) router.push("/onboarding");
    else setNotice("Account created! Check your email to confirm, then log in.");
  }

  return (
    <main className="min-h-screen md:grid md:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden md:flex flex-col justify-between bg-ink text-white p-10 hero-glow">
        <Link href="/" className="font-display text-lg font-bold">Agent<span className="text-brand">Marketer</span></Link>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight">Your AI team is ready to start working.</h2>
          <div className="mt-6 space-y-2">
            {FEED.map(([e,t]) => (
              <div key={t} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="w-9 h-9 grid place-items-center rounded-lg bg-white/10 text-lg">{e}</span>
                <span className="text-sm text-white/80">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-sm">Founding customers lock in 50% off for life.</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="md:hidden font-display text-lg font-bold">Agent<span className="text-brand">Marketer</span></Link>
          <h1 className="font-display text-3xl font-bold mt-6 md:mt-0">Create your account</h1>
          <p className="text-slate text-sm mt-1">Five minutes from now, your agents start.</p>
          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold" htmlFor="email">Email</label>
              <input id="email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
                className="w-full border border-line rounded-xl px-3 py-2.5 mt-1 focus:border-brand outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="password">Password</label>
              <input id="password" type="password" required minLength={8} value={password} onChange={(e)=>setPassword(e.target.value)}
                className="w-full border border-line rounded-xl px-3 py-2.5 mt-1 focus:border-brand outline-none" />
              <p className="text-xs text-slate mt-1">At least 8 characters.</p>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} className="mt-1" />
              <span>I agree to the <strong>no-refund policy</strong>: payments aren't refunded; I can cancel anytime to stop future payments.</span>
            </label>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {notice && <p className="text-emerald text-sm font-semibold">{notice}</p>}
            <button disabled={loading} className="w-full bg-brand text-white py-3 rounded-xl font-semibold hover:bg-branddark disabled:opacity-50 transition-colors">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="text-sm mt-4 text-slate">Already have an account? <Link href="/login" className="text-brand font-semibold">Log in</Link></p>
        </div>
      </div>
    </main>
  );
}
