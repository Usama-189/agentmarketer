"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const PRICES = { basic: 49.5, growth: 74.5, pro: 99.5 };

export default function Admin() {
  const [phase, setPhase] = useState("checking"); // checking | login | denied | ok
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  const [customers, setCustomers] = useState([]); const [runs, setRuns] = useState([]); const [revisions, setRevisions] = useState([]);
  const [savedId, setSavedId] = useState("");

  async function gate() {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) { setPhase("login"); return; }
    const userEmail = sess.session.user.email;
    const { data: adminRow } = await supabase.from("admins").select("email").eq("email", userEmail).maybeSingle();
    if (!adminRow) { setPhase("denied"); return; }
    setPhase("ok"); load();
  }
  useEffect(() => { gate(); }, []);

  async function load() {
    const { data: c } = await supabase.from("customers").select("*").order("created_at",{ascending:false}); setCustomers(c||[]);
    const { data: r } = await supabase.from("agent_runs").select("*").order("created_at",{ascending:false}).limit(30); setRuns(r||[]);
    const { data: v } = await supabase.from("revisions").select("*").order("created_at",{ascending:false}); setRevisions(v||[]);
  }

  async function doLogin(e) {
    e.preventDefault(); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    setPhase("checking"); gate();
  }

  function edit(id,k,v){ setCustomers(cs=>cs.map(c=>c.id===id?{...c,[k]:v}:c)); }
  async function saveCustomer(c){
    await supabase.from("customers").update({package:c.package,status:c.status,website_status:c.website_status,domain:c.domain}).eq("id",c.id);
    setSavedId(c.id); setTimeout(()=>setSavedId(""),2000);
  }
  async function markRevisionDone(id){ await supabase.from("revisions").update({status:"done"}).eq("id",id); load(); }

  if (phase === "checking") return <main className="min-h-screen grid place-items-center text-slate">Checking access…</main>;

  if (phase === "login") return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={doLogin} className="w-full max-w-sm bg-white border border-line rounded-3xl shadow-card p-8">
        <div className="w-12 h-12 grid place-items-center rounded-xl bg-ink text-white text-xl">🔒</div>
        <h1 className="font-display text-2xl font-bold mt-4">Admin login</h1>
        <p className="text-slate text-sm mt-1">This control room is for staff only.</p>
        <input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
          className="w-full border border-line rounded-xl px-3 py-2.5 mt-5 focus:border-brand outline-none" />
        <input type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}
          className="w-full border border-line rounded-xl px-3 py-2.5 mt-3 focus:border-brand outline-none" />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <button className="w-full bg-ink text-white py-3 rounded-xl font-semibold mt-4 hover:bg-brand transition-colors">Log in</button>
      </form>
    </main>
  );

  if (phase === "denied") return (
    <main className="min-h-screen grid place-items-center p-6 text-center">
      <div>
        <div className="text-4xl">🚫</div>
        <h1 className="font-display text-2xl font-bold mt-3">Not authorized</h1>
        <p className="text-slate text-sm mt-2 max-w-sm">This account is not an admin. Add your email to the <code>admins</code> table in Supabase, then refresh.</p>
        <button onClick={async()=>{await supabase.auth.signOut(); setPhase("login");}} className="mt-5 bg-ink text-white px-5 py-2 rounded-xl font-semibold">Log in as a different account</button>
      </div>
    </main>
  );

  const active = customers.filter(c=>c.status==="active");
  const revenue = active.reduce((s,c)=>s+(PRICES[c.package]||0),0);
  const nameOf = (id)=>customers.find(c=>c.id===id)?.business_name || "—";
  const pendingRevs = revisions.filter(r=>r.status==="pending");

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Control room</h1>
          <button onClick={async()=>{await supabase.auth.signOut(); setPhase("login");}} className="text-sm text-slate hover:text-ink">Log out</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[["Total customers",customers.length],["Active (paying)",active.length],["Est. monthly revenue",`$${revenue.toFixed(2)}`],["Pending revisions",pendingRevs.length]].map(([l,v])=>(
            <div key={l} className="bg-white border border-line rounded-2xl shadow-card p-5">
              <p className="text-xs uppercase tracking-wide text-slate">{l}</p>
              <p className="font-display text-2xl font-bold mt-1">{v}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-xl font-bold mt-10">Customers</h2>
        <p className="text-slate text-sm">After payment set status to <strong>active</strong>. When the site is deployed, set the domain and mark it <strong>live</strong>.</p>
        <div className="bg-white border border-line rounded-2xl shadow-card mt-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-ink text-white text-left">
              <tr><th className="p-3">Business</th><th className="p-3">Email</th><th className="p-3">Plan</th><th className="p-3">Status</th><th className="p-3">Website</th><th className="p-3">Domain</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {customers.map(c=>(
                <tr key={c.id} className="border-t border-line align-top">
                  <td className="p-3 font-semibold">{c.business_name||"—"}</td>
                  <td className="p-3 text-slate">{c.email}</td>
                  <td className="p-3"><select value={c.package||"none"} onChange={e=>edit(c.id,"package",e.target.value)} className="border border-line rounded px-2 py-1"><option value="none">none</option><option value="basic">basic</option><option value="growth">growth</option><option value="pro">pro</option></select></td>
                  <td className="p-3"><select value={c.status} onChange={e=>edit(c.id,"status",e.target.value)} className="border border-line rounded px-2 py-1"><option value="new">new</option><option value="active">active</option><option value="cancelled">cancelled</option></select></td>
                  <td className="p-3"><select value={c.website_status} onChange={e=>edit(c.id,"website_status",e.target.value)} className="border border-line rounded px-2 py-1"><option value="not_started">not started</option><option value="building">building</option><option value="live">live</option></select></td>
                  <td className="p-3"><input value={c.domain||""} onChange={e=>edit(c.id,"domain",e.target.value)} placeholder="example.com" className="border border-line rounded px-2 py-1 w-32" /></td>
                  <td className="p-3"><button onClick={()=>saveCustomer(c)} className="bg-brand text-white px-3 py-1 rounded font-semibold hover:bg-branddark">{savedId===c.id?"Saved ✓":"Save"}</button></td>
                </tr>
              ))}
              {customers.length===0 && <tr><td className="p-4 text-slate" colSpan={7}>No customers yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-xl font-bold mt-10">Revision requests</h2>
        <div className="bg-white border border-line rounded-2xl shadow-card mt-4 p-4 space-y-3">
          {revisions.length===0 && <p className="text-sm text-slate">No revision requests.</p>}
          {revisions.map(r=>(
            <div key={r.id} className="flex items-start justify-between gap-4 bg-soft rounded-xl p-3 text-sm">
              <div><p className="font-semibold">{nameOf(r.customer_id)}</p><p className="text-slate">{r.request_text}</p></div>
              {r.status==="pending"
                ? <button onClick={()=>markRevisionDone(r.id)} className="bg-brand text-white px-3 py-1 rounded font-semibold shrink-0">Mark done</button>
                : <span className="text-xs bg-emerald text-white px-2 py-1 rounded-full shrink-0">done</span>}
            </div>
          ))}
        </div>

        <h2 className="font-display text-xl font-bold mt-10">Agent activity (latest 30)</h2>
        <div className="bg-white border border-line rounded-2xl shadow-card mt-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-ink text-white text-left"><tr><th className="p-3">Agent</th><th className="p-3">Customer</th><th className="p-3">What it did</th><th className="p-3">Status</th><th className="p-3">When</th></tr></thead>
            <tbody>
              {runs.map(r=>(
                <tr key={r.id} className="border-t border-line">
                  <td className="p-3 font-semibold">{r.agent_name}</td><td className="p-3">{nameOf(r.customer_id)}</td>
                  <td className="p-3 text-slate">{r.what_it_did}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full ${r.status==="success"?"bg-emerald/10 text-emerald":"bg-red-50 text-red-600"}`}>{r.status}</span></td>
                  <td className="p-3 text-slate">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {runs.length===0 && <tr><td className="p-4 text-slate" colSpan={5}>No agent activity yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-line rounded-2xl shadow-card mt-10 p-5 text-sm text-slate">
          <strong className="text-ink">API costs:</strong> tracked here automatically once the chatbot and SEO agents go live (Groq usage per customer).
        </div>
      </div>
    </main>
  );
}
