"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const PRICES = { basic: "$49.50", growth: "$74.50", pro: "$99.50" };

export default function Billing() {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess?.session?.user?.id;
      const { data } = await supabase.from("customers").select("*").eq("auth_user_id", userId).single();
      setCustomer(data);
    })();
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Billing</h1>
      <div className="bg-white rounded-xl p-6 mt-6">
        <p className="text-xs uppercase tracking-wide opacity-60">Your plan</p>
        <p className="font-display text-xl font-bold mt-1 capitalize">
          {customer?.package || "—"} {customer?.package && PRICES[customer.package] && `· ${PRICES[customer.package]}/month`}
        </p>
        <p className="text-sm opacity-70 mt-3">
          Online card payments (Paddle) arrive in the next update. For now your account is
          activated by our team after payment. Questions? Contact support.
        </p>
        <p className="text-sm opacity-60 mt-3">
          No refunds — cancel anytime to stop future payments.
        </p>
      </div>
    </div>
  );
}
