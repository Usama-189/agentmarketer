"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Website() {
  const [customer, setCustomer] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const { data: sess } = await supabase.auth.getSession();
    const userId = sess?.session?.user?.id;
    const { data: cust } = await supabase.from("customers").select("*").eq("auth_user_id", userId).single();
    setCustomer(cust);
    if (cust) {
      const { data: revs } = await supabase.from("revisions").select("*")
        .eq("customer_id", cust.id).order("created_at", { ascending: false });
      setRevisions(revs || []);
    }
  }
  useEffect(() => { load(); }, []);

  async function requestRevision(e) {
    e.preventDefault();
    setMsg("");
    if (revisions.length >= 3) { setMsg("You have used all 3 of your included revisions."); return; }
    await supabase.from("revisions").insert({ customer_id: customer.id, request_text: text });
    setText("");
    setMsg("Revision request sent. Our team will be in touch.");
    load();
  }

  const statusLabel = { not_started: "Not started", building: "Being built 🔨", live: "Live ✅" };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">My website</h1>
      <div className="bg-white rounded-xl p-6 mt-6">
        <p className="text-xs uppercase tracking-wide opacity-60">Status</p>
        <p className="font-display text-xl font-bold mt-1">
          {statusLabel[customer?.website_status] || "—"}
        </p>
        {customer?.domain ? (
          <a href={`https://${customer.domain}`} target="_blank" rel="noreferrer"
            className="inline-block mt-3 text-awning font-semibold underline">
            Visit {customer.domain}
          </a>
        ) : (
          <p className="text-sm opacity-70 mt-2">
            Your domain appears here once your website goes live.
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 mt-6">
        <h2 className="font-semibold">Revisions ({revisions.length} of 3 used)</h2>
        <p className="text-sm opacity-70 mt-1">
          Want something changed on your website? Tell us here — 3 revisions are included.
        </p>
        <form onSubmit={requestRevision} className="mt-4">
          <textarea required rows={3} value={text} onChange={(e) => setText(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Example: Please change the photo on the home page and add my Saturday hours." />
          <button disabled={revisions.length >= 3}
            className="mt-3 bg-awning text-white px-5 py-2 rounded-lg font-semibold hover:bg-awningdark disabled:opacity-50">
            Send revision request
          </button>
          {msg && <p className="text-sm mt-2 text-awning">{msg}</p>}
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {revisions.map((r) => (
            <li key={r.id} className="bg-mint rounded-lg p-3">
              <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${
                r.status === "done" ? "bg-awning text-white" : "bg-amber/30 text-ink"
              }`}>{r.status}</span>
              {r.request_text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
