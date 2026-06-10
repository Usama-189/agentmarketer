"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess?.session?.user?.id;
      const { data: cust } = await supabase.from("customers").select("id").eq("auth_user_id", userId).single();
      if (cust) {
        const { data } = await supabase.from("leads").select("*")
          .eq("customer_id", cust.id).order("created_at", { ascending: false });
        setLeads(data || []);
      }
      setLoaded(true);
    })();
  }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold">Leads</h1>
      <p className="text-sm opacity-70 mt-1">
        Every visitor your AI receptionist captures appears here, with their message.
      </p>
      <div className="bg-white rounded-xl mt-6 overflow-hidden">
        {loaded && leads.length === 0 && (
          <p className="p-6 text-sm opacity-70">
            No leads yet. Once your website is live, your chatbot starts capturing
            interested visitors automatically — they'll show up here.
          </p>
        )}
        {leads.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-mint text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Message</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-3 font-semibold">{l.name || "—"}</td>
                  <td className="p-3">{l.email || "—"}</td>
                  <td className="p-3 opacity-80">{l.message || "—"}</td>
                  <td className="p-3 opacity-60">{new Date(l.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
