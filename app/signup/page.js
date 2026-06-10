"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError(""); setNotice("");
    if (!agree) { setError("Please agree to the no-refund policy to continue."); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data.session) {
      router.push("/onboarding");
    } else {
      // Email confirmation is turned on in Supabase
      setNotice("Account created! Check your email to confirm, then log in.");
    }
  }

  return (
    <main className="min-h-screen bg-mint flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-sm">
        <Link href="/" className="font-display text-xl font-bold text-awning">AgentMarketer</Link>
        <h1 className="font-display text-2xl font-bold mt-6">Create your account</h1>
        <p className="text-sm opacity-70 mt-1">Five minutes from now, we'll know your business.</p>
        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold" htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={8} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
            <p className="text-xs opacity-60 mt-1">At least 8 characters.</p>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" />
            <span>I agree to the <strong>no-refund policy</strong>: payments are not refunded; I can cancel anytime to stop future payments.</span>
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {notice && <p className="text-awning text-sm font-semibold">{notice}</p>}
          <button disabled={loading}
            className="w-full bg-awning text-white py-3 rounded-lg font-semibold hover:bg-awningdark disabled:opacity-50">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account? <Link href="/login" className="text-awning font-semibold">Log in</Link>
        </p>
      </div>
    </main>
  );
}
