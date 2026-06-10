"use client";
import { useEffect, useState } from "react";
import { supabase, AGENTS } from "@/lib/supabaseClient";

function timeAgo(d) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export default function Dashboard() {
  const [customer, setCustomer] = useState(null);
  const [runs, setRuns] = useState([]);
  const [leadCount, setLeadCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess?.session?.user?.id;
      const { data: cust } = await supabase.from("customers").select("*").eq("auth_user_id", userId).single();
      if (!cust) return;
      setCustomer(cust);
      const { data: r } = await supabase.from("agent_runs").select("*")
        .eq("customer_id", cust.id).order("created_at", { ascending: false }).limit(50);
      setRuns(r || []);
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true })
        .eq("customer_id", cust.id);
      setLeadCount(count || 0);
    })();
  }, []);

  const lastRunFor = (name) => runs.find((r) => r.agent_name === name);
  const statusLabel = {
    not_started: "Not started", building: "Being built 🔨", live: "Live ✅"
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold">
        {customer?.business_name ? `Hello, ${customer.business_name}` : "Your dashboard"}
      </h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl p-5">
          <p className="text-xs uppercase tracking-wide opacity-60">Website</p>
          <p className="font-display text-xl font-bold mt-1">
            {statusLabel[customer?.website_status] || "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-xs uppercase tracking-wide opacity-60">Leads captured</p>
          <p className="font-display text-xl font-bold mt-1">{leadCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-xs uppercase tracking-wide opacity-60">Plan</p>
          <p className="font-display text-xl font-bold mt-1 capitalize">{customer?.package || "—"}</p>
        </div>
      </div>

      {/* Agent cards */}
      <h2 className="font-display text-xl font-bold mt-10">Your agents</h2>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {AGENTS.map((a) => {
          const run = lastRunFor(a.name);
          return (
            <div key={a.name} className="bg-white rounded-xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{a.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  run ? (run.status === "success" ? "bg-mint text-awning" : "bg-red-100 text-red-700")
                      : "bg-gray-100 text-gray-500"
                }`}>
                  {run ? (run.status === "success" ? "Working" : "Error") : "Scheduled"}
                </span>
              </div>
              <p className="text-sm opacity-70 mt-1">{a.desc}</p>
              <div className="mt-3 text-sm bg-mint rounded-lg p-3">
                {run ? (
                  <>
                    <p className="font-semibold">Last run · {timeAgo(run.created_at)}</p>
                    <p className="opacity-80">{run.what_it_did}</p>
                  </>
                ) : (
                  <p className="opacity-70">Starts working after your website is live.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity timeline */}
      <h2 className="font-display text-xl font-bold mt-10">Recent activity</h2>
      <div className="bg-white rounded-xl p-5 mt-4">
        {runs.length === 0 && (
          <p className="text-sm opacity-70">
            Nothing yet — activity appears here as soon as your agents start working.
          </p>
        )}
        <ul className="space-y-3">
          {runs.slice(0, 10).map((r) => (
            <li key={r.id} className="text-sm flex gap-3">
              <span className={r.status === "success" ? "text-awning" : "text-red-600"}>●</span>
              <span>
                <strong>{r.agent_name}:</strong> {r.what_it_did}
                <span className="opacity-50"> · {timeAgo(r.created_at)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
