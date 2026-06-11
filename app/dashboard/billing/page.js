"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
const PRICES = { basic: "$49.50", growth: "$74.50", pro: "$99.50" };

export default function Billing() {
  const [customer, setCustomer] = useState(null);
  useEffect(() => { (async () => {
    const { data: sess } = await supabase.auth.getSession();
    const { data } = await supabase.from("customers").select("*").eq("auth_user_id", sess?.session?.user?.id).single();
    setCustomer(data);
  })(); }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Billing</h1>
      <div className="bg-white border border-line rounded-2xl shadow-card p-6 mt-6">
        <p className="text-xs uppercase tracking-wide text-slate">Your plan</p>
        <p className="font-display text-2xl font-bold mt-1 capitalize">
          {customer?.package || "—"} {customer?.package && PRICES[customer.package] && <span className="text-slate text-lg">· {PRICES[customer.package]}/mo</span>}
        </p>
        <p className="text-slate text-sm mt-3">Card payments (Paddle) arrive in the next update. For now your account is activated by our team after payment.</p>
        <p className="text-slate text-sm mt-2">No refunds — cancel anytime to stop future payments.</p>
      </div>
    </div>
  );
}
