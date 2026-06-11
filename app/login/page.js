"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault(); setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-line rounded-3xl shadow-card p-8">
        <Link href="/" className="font-display text-lg font-bold">Agent<span className="text-brand">Marketer</span></Link>
        <h1 className="font-display text-3xl font-bold mt-6">Welcome back</h1>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold" htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
              className="w-full border border-line rounded-xl px-3 py-2.5 mt-1 focus:border-brand outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
              className="w-full border border-line rounded-xl px-3 py-2.5 mt-1 focus:border-brand outline-none" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full bg-brand text-white py-3 rounded-xl font-semibold hover:bg-branddark disabled:opacity-50 transition-colors">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="text-sm mt-4 text-slate">New here? <Link href="/signup" className="text-brand font-semibold">Create an account</Link></p>
      </div>
    </main>
  );
}
