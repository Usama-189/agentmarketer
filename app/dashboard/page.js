"use client";
import { useEffect, useState } from "react";
import { supabase, AGENTS } from "@/lib/supabaseClient";

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}

export default function Dashboard() {
  const [customer, setCustomer] = useState(null);
  const [runs, setRuns] = useState([]); const [leadCount, setLeadCount] = useState(0);

  useEffect(() => { (async () => {
    const { data: sess } = await supabase.auth.getSession();
    const userId = sess?.session?.user?.id;
    const { data: cust } = await supabase.from("customers").select("*").eq("auth_user_id", userId).single();
    if (!cust) return; setCustomer(cust);
    const { data: r } = await supabase.from("agent_runs").select("*").eq("customer_id", cust.id).order("created_at",{ascending:false}).limit(50);
    setRuns(r || []);
    const { count } = await supabase.from("leads").select("*",{count:"exact",head:true}).eq("customer_id", cust.id);
    setLeadCount(count || 0);
  })(); }, []);

  const lastRunFor = (n) => runs.find((r) => r.agent_name === n);
  const webLabel = { not_started: "Not started", building: "Being built", live: "Live" }[customer?.website_status] || "—";

  return (
    <div className="max-w-5xl">
      <p className="text-sm text-slate">Welcome back</p>
      <h1 className="font-display text-3xl font-bold">{customer?.business_name || "Your dashboard"}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          ["Leads captured", leadCount, "🎯"],
          ["Agents working", AGENTS.length, "🤖"],
          ["Website", webLabel, "🌐"],
          ["Plan", customer?.package || "—", "⭐"]
        ].map(([l, v, e]) => (
          <div key={l} className="bg-white border border-line rounded-2xl shadow-card p-5">
            <div className="text-xl">{e}</div>
            <p className="text-xs uppercase tracking-wide text-slate mt-2">{l}</p>
            <p className="font-display text-2xl font-bold mt-0.5 capitalize">{v}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl font-bold mt-10">Your agents</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {AGENTS.map((a) => {
          const run = lastRunFor(a.name);
          const ok = run && run.status === "success";
          return (
            <div key={a.name} className="bg-white border border-line rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 grid place-items-center rounded-xl text-xl" style={{background:a.tint+"22"}}>{a.emoji}</div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  run ? (ok ? "bg-emerald/10 text-emerald" : "bg-red-50 text-red-600") : "bg-soft text-slate"}`}>
                  {run ? (ok ? "● Working" : "● Error") : "○ Scheduled"}
                </span>
              </div>
              <h3 className="font-display font-bold mt-3">{a.name}</h3>
              <p className="text-slate text-sm mt-1">{a.desc}</p>
              <div className="mt-3 text-sm bg-soft rounded-xl p-3">
                {run ? (<><p className="font-semibold text-xs text-slate">LAST RUN · {timeAgo(run.created_at)}</p><p className="mt-0.5">{run.what_it_did}</p></>)
                     : (<p className="text-slate">Starts once your account is activated.</p>)}
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="font-display text-xl font-bold mt-10">Recent activity</h2>
      <div className="bg-white border border-line rounded-2xl shadow-card p-5 mt-4">
        {runs.length === 0 && <p className="text-sm text-slate">Nothing yet — activity appears here as your agents work.</p>}
        <ul className="space-y-3">
          {runs.slice(0,12).map((r) => (
            <li key={r.id} className="text-sm flex gap-3 items-start">
              <span className={`mt-1.5 w-2 h-2 rounded-full ${r.status==="success"?"bg-emerald":"bg-red-500"}`} />
              <span><strong>{r.agent_name}:</strong> {r.what_it_did}<span className="text-slate"> · {timeAgo(r.created_at)}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
