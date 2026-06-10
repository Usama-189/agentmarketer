"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const PRICES = { basic: 49.5, growth: 74.5, pro: 99.5 };

export default function Admin() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(null); // null = checking
  const [customers, setCustomers] = useState([]);
  const [runs, setRuns] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [savedId, setSavedId] = useState("");

  async function load() {
    const { data: c } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    setCustomers(c || []);
    const { data: r } = await supabase.from("agent_runs").select("*").order("created_at", { ascending: false }).limit(30);
    setRuns(r || []);
    const { data: v } = await supabase.from("revisions").select("*").order("created_at", { ascending: false });
    setRevisions(v || []);
  }

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { router.replace("/login"); return; }
      const email = sess.session.user.email;
      const { data: adminRow } = await supabase.from("admins").select("email").eq("email", email).maybeSingle();
      if (!adminRow) { setAuthorized(false); return; }
      setAuthorized(true);
      load();
    })();
  }, [router]);

  function edit(id, key, value) {
    setCustomers((cs) => cs.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  }

  async function saveCustomer(c) {
    await supabase.from("customers").update({
      package: c.package, status: c.status, website_status: c.website_status, domain: c.domain
    }).eq("id", c.id);
    setSavedId(c.id);
    setTimeout(() => setSavedId(""), 2000);
  }

  async function markRevisionDone(id) {
    await supabase.from("revisions").update({ status: "done" }).eq("id", id);
    load();
  }

  if (authorized === null) return <main className="p-10 text-center opacity-60">Checking access…</main>;
  if (authorized === false)
    return (
      <main className="p-10 text-center">
        <h1 className="font-display text-2xl font-bold">Not authorized</h1>
        <p className="opacity-70 mt-2 text-sm">
          This page is for admins. Add your email to the <code>admins</code> table in Supabase, then refresh.
        </p>
      </main>
    );

  const active = customers.filter((c) => c.status === "active");
  const revenue = active.reduce((sum, c) => sum + (PRICES[c.package] || 0), 0);
  const nameOf = (id) => customers.find((c) => c.id === id)?.business_name || "—";
  const pendingRevs = revisions.filter((r) => r.status === "pending");

  return (
    <main className="min-h-screen bg-mint p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-2xl font-bold">Admin — control room</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            ["Total customers", customers.length],
            ["Active (paying)", active.length],
            ["Est. monthly revenue", `$${revenue.toFixed(2)}`],
            ["Pending revisions", pendingRevs.length]
          ].map(([label, val]) => (
            <div key={label} className="bg-white rounded-xl p-5">
              <p className="text-xs uppercase tracking-wide opacity-60">{label}</p>
              <p className="font-display text-2xl font-bold mt-1">{val}</p>
            </div>
          ))}
        </div>

        {/* Customers */}
        <h2 className="font-display text-xl font-bold mt-10">Customers</h2>
        <p className="text-sm opacity-70">
          After a customer pays you, set their status to <strong>active</strong>. When their site is
          deployed, set the domain and mark the website <strong>live</strong>.
        </p>
        <div className="bg-white rounded-xl mt-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-ink text-mint text-left">
              <tr>
                <th className="p-3">Business</th>
                <th className="p-3">Email</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Status</th>
                <th className="p-3">Website</th>
                <th className="p-3">Domain</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t align-top">
                  <td className="p-3 font-semibold">{c.business_name || "—"}</td>
                  <td className="p-3 opacity-70">{c.email}</td>
                  <td className="p-3">
                    <select value={c.package || "none"} onChange={(e) => edit(c.id, "package", e.target.value)}
                      className="border rounded px-2 py-1">
                      <option value="none">none</option>
                      <option value="basic">basic</option>
                      <option value="growth">growth</option>
                      <option value="pro">pro</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select value={c.status} onChange={(e) => edit(c.id, "status", e.target.value)}
                      className="border rounded px-2 py-1">
                      <option value="new">new</option>
                      <option value="active">active</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select value={c.website_status} onChange={(e) => edit(c.id, "website_status", e.target.value)}
                      className="border rounded px-2 py-1">
                      <option value="not_started">not started</option>
                      <option value="building">building</option>
                      <option value="live">live</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input value={c.domain || ""} onChange={(e) => edit(c.id, "domain", e.target.value)}
                      placeholder="example.com" className="border rounded px-2 py-1 w-36" />
                  </td>
                  <td className="p-3">
                    <button onClick={() => saveCustomer(c)}
                      className="bg-awning text-white px-3 py-1 rounded font-semibold hover:bg-awningdark">
                      {savedId === c.id ? "Saved ✓" : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td className="p-4 opacity-60" colSpan={7}>No customers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Revisions */}
        <h2 className="font-display text-xl font-bold mt-10">Website revision requests</h2>
        <div className="bg-white rounded-xl mt-4 p-4 space-y-3">
          {revisions.length === 0 && <p className="text-sm opacity-60">No revision requests.</p>}
          {revisions.map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-4 bg-mint rounded-lg p-3 text-sm">
              <div>
                <p className="font-semibold">{nameOf(r.customer_id)}</p>
                <p className="opacity-80">{r.request_text}</p>
              </div>
              {r.status === "pending" ? (
                <button onClick={() => markRevisionDone(r.id)}
                  className="bg-awning text-white px-3 py-1 rounded font-semibold shrink-0">
                  Mark done
                </button>
              ) : (
                <span className="text-xs bg-awning text-white px-2 py-1 rounded-full shrink-0">done</span>
              )}
            </div>
          ))}
        </div>

        {/* Agent health */}
        <h2 className="font-display text-xl font-bold mt-10">Agent activity (latest 30)</h2>
        <div className="bg-white rounded-xl mt-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-ink text-mint text-left">
              <tr>
                <th className="p-3">Agent</th>
                <th className="p-3">Customer</th>
                <th className="p-3">What it did</th>
                <th className="p-3">Status</th>
                <th className="p-3">When</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 font-semibold">{r.agent_name}</td>
                  <td className="p-3">{nameOf(r.customer_id)}</td>
                  <td className="p-3 opacity-80">{r.what_it_did}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      r.status === "success" ? "bg-mint text-awning" : "bg-red-100 text-red-700"
                    }`}>{r.status}</span>
                  </td>
                  <td className="p-3 opacity-60">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {runs.length === 0 && (
                <tr><td className="p-4 opacity-60" colSpan={5}>No agent activity yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl mt-10 p-5 text-sm opacity-70">
          <strong>API costs:</strong> tracked here automatically once the chatbot and SEO agents go
          live in Stage 2 (Groq usage per customer).
        </div>
      </div>
    </main>
  );
}
