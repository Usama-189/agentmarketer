"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Onboarding() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: "",
    business_type: "",
    services: "",
    location: "",
    phone: "",
    business_hours: "",
    special: "",
    tone: "friendly",
    package: "basic"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
    });
  }, [router]);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data: sess } = await supabase.auth.getSession();
    const userId = sess?.session?.user?.id;

    const { data: customer, error: updError } = await supabase
      .from("customers")
      .update({ ...form, website_status: "building" })
      .eq("auth_user_id", userId)
      .select()
      .single();

    if (updError) { setLoading(false); setError(updError.message); return; }

    // Log the Manager Agent's first run so the dashboard shows real activity.
    await supabase.from("agent_runs").insert({
      customer_id: customer.id,
      agent_name: "Manager Agent",
      what_it_did: "Saved your business profile. All agents will now use this information.",
      status: "success"
    });

    setLoading(false);
    router.push("/dashboard");
  }

  const field = "w-full border rounded-lg px-3 py-2 mt-1";
  const label = "text-sm font-semibold";

  return (
    <main className="min-h-screen bg-mint px-6 py-10">
      <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
        <h1 className="font-display text-2xl font-bold">Tell us about your business</h1>
        <p className="text-sm opacity-70 mt-1">
          This is the only work you do. Everything we build — your website, your chatbot,
          your content — comes from these answers. Be specific.
        </p>
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className={label} htmlFor="bn">Business name</label>
            <input id="bn" required className={field} value={form.business_name}
              onChange={(e) => set("business_name", e.target.value)} placeholder="Smith Family Dental" />
          </div>
          <div>
            <label className={label} htmlFor="bt">What kind of business?</label>
            <input id="bt" required className={field} value={form.business_type}
              onChange={(e) => set("business_type", e.target.value)} placeholder="Dentist, salon, plumber…" />
          </div>
          <div>
            <label className={label} htmlFor="sv">Your services and prices</label>
            <textarea id="sv" required rows={4} className={field} value={form.services}
              onChange={(e) => set("services", e.target.value)}
              placeholder={"Cleaning — $90\nWhitening — $250\nEmergency visits — same day"} />
            <p className="text-xs opacity-60 mt-1">One per line. Prices help your chatbot answer visitors.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="loc">City / address</label>
              <input id="loc" required className={field} value={form.location}
                onChange={(e) => set("location", e.target.value)} placeholder="Houston, TX" />
            </div>
            <div>
              <label className={label} htmlFor="ph">Phone</label>
              <input id="ph" className={field} value={form.phone}
                onChange={(e) => set("phone", e.target.value)} placeholder="(713) 555-0142" />
            </div>
          </div>
          <div>
            <label className={label} htmlFor="hr">Opening hours</label>
            <input id="hr" className={field} value={form.business_hours}
              onChange={(e) => set("business_hours", e.target.value)} placeholder="Mon–Fri 9–6, Sat 10–2" />
          </div>
          <div>
            <label className={label} htmlFor="sp">What makes you special?</label>
            <textarea id="sp" rows={2} className={field} value={form.special}
              onChange={(e) => set("special", e.target.value)}
              placeholder="20 years in the neighborhood, same-day appointments…" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="tn">Tone</label>
              <select id="tn" className={field} value={form.tone} onChange={(e) => set("tone", e.target.value)}>
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="pk">Plan you chose</label>
              <select id="pk" className={field} value={form.package} onChange={(e) => set("package", e.target.value)}>
                <option value="basic">Basic — $49.50/mo</option>
                <option value="growth">Growth — $74.50/mo</option>
                <option value="pro">Pro — $99.50/mo</option>
              </select>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading}
            className="w-full bg-awning text-white py-3 rounded-lg font-semibold hover:bg-awningdark disabled:opacity-50">
            {loading ? "Saving…" : "Save — start building my website"}
          </button>
        </form>
      </div>
    </main>
  );
}
