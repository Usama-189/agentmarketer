"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Website() {
  const [customer, setCustomer] = useState(null); const [revisions, setRevisions] = useState([]);
  const [text, setText] = useState(""); const [msg, setMsg] = useState("");

  async function load() {
    const { data: sess } = await supabase.auth.getSession();
    const { data: cust } = await supabase.from("customers").select("*").eq("auth_user_id", sess?.session?.user?.id).single();
    setCustomer(cust);
    if (cust) { const { data: revs } = await supabase.from("revisions").select("*").eq("customer_id", cust.id).order("created_at",{ascending:false}); setRevisions(revs||[]); }
  }
  useEffect(() => { load(); }, []);

  async function requestRevision(e) {
    e.preventDefault(); setMsg("");
    if (revisions.length >= 3) { setMsg("You have used all 3 included revisions."); return; }
    await supabase.from("revisions").insert({ customer_id: customer.id, request_text: text });
    setText(""); setMsg("Revision request sent — our team will be in touch."); load();
  }
  const label = { not_started: "Not started", building: "Being built 🔨", live: "Live ✅" }[customer?.website_status] || "—";

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold">My website</h1>
      <p className="text-slate text-sm mt-1">An optional add-on we build, host and manage for you.</p>
      <div className="bg-white border border-line rounded-2xl shadow-card p-6 mt-6">
        <p className="text-xs uppercase tracking-wide text-slate">Status</p>
        <p className="font-display text-2xl font-bold mt-1">{label}</p>
        {customer?.domain
          ? <a href={`https://${customer.domain}`} target="_blank" rel="noreferrer" className="inline-block mt-3 text-brand font-semibold underline">Visit {customer.domain}</a>
          : <p className="text-slate text-sm mt-2">Your domain appears here once your website goes live.</p>}
      </div>

      <div className="bg-white border border-line rounded-2xl shadow-card p-6 mt-6">
        <h2 className="font-semibold">Revisions <span className="text-slate font-normal">({revisions.length} of 3 used)</span></h2>
        <form onSubmit={requestRevision} className="mt-4">
          <textarea required rows={3} value={text} onChange={(e)=>setText(e.target.value)}
            className="w-full border border-line rounded-xl px-3 py-2 focus:border-brand outline-none"
            placeholder="Example: change the home photo and add my Saturday hours." />
          <button disabled={revisions.length>=3} className="mt-3 bg-brand text-white px-5 py-2 rounded-xl font-semibold hover:bg-branddark disabled:opacity-50 transition-colors">
            Send revision request
          </button>
          {msg && <p className="text-sm mt-2 text-emerald font-semibold">{msg}</p>}
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {revisions.map((r)=>(
            <li key={r.id} className="bg-soft rounded-xl p-3">
              <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${r.status==="done"?"bg-emerald text-white":"bg-amber/30 text-ink"}`}>{r.status}</span>
              {r.request_text}
            </li>))}
        </ul>
      </div>
    </div>
  );
}
