"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Leads() {
  const [leads, setLeads] = useState([]); const [loaded, setLoaded] = useState(false);
  useEffect(() => { (async () => {
    const { data: sess } = await supabase.auth.getSession();
    const { data: cust } = await supabase.from("customers").select("id").eq("auth_user_id", sess?.session?.user?.id).single();
    if (cust) { const { data } = await supabase.from("leads").select("*").eq("customer_id", cust.id).order("created_at",{ascending:false}); setLeads(data||[]); }
    setLoaded(true);
  })(); }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Leads</h1>
      <p className="text-slate text-sm mt-1">Every visitor your AI Receptionist captures lands here.</p>
      <div className="bg-white border border-line rounded-2xl shadow-card mt-6 overflow-hidden">
        {loaded && leads.length === 0 && (
          <p className="p-8 text-sm text-slate text-center">No leads yet. Once your agents are live, interested visitors show up here automatically.</p>
        )}
        {leads.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-soft text-left text-slate"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Message</th><th className="p-3">Date</th></tr></thead>
            <tbody>{leads.map((l)=>(
              <tr key={l.id} className="border-t border-line">
                <td className="p-3 font-semibold">{l.name||"—"}</td><td className="p-3">{l.email||"—"}</td>
                <td className="p-3 text-slate">{l.message||"—"}</td><td className="p-3 text-slate">{new Date(l.created_at).toLocaleDateString()}</td>
              </tr>))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
