"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-mint flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-sm">
        <Link href="/" className="font-display text-xl font-bold text-awning">AgentMarketer</Link>
        <h1 className="font-display text-2xl font-bold mt-6">Welcome back</h1>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold" htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading}
            className="w-full bg-awning text-white py-3 rounded-lg font-semibold hover:bg-awningdark disabled:opacity-50">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          New here? <Link href="/signup" className="text-awning font-semibold">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
