"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const NAV = [
  ["Overview", "/dashboard", "▦"],
  ["Leads", "/dashboard/leads", "🎯"],
  ["My Website", "/dashboard/website", "🌐"],
  ["Billing", "/dashboard/billing", "💳"]
];

export default function DashboardLayout({ children }) {
  const router = useRouter(); const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login"); else setReady(true);
    });
  }, [router]);

  async function logout() { await supabase.auth.signOut(); router.replace("/login"); }

  if (!ready) return <main className="min-h-screen grid place-items-center text-slate">Loading…</main>;

  return (
    <div className="min-h-screen md:flex bg-paper">
      <aside className="md:w-60 md:min-h-screen border-b md:border-b-0 md:border-r border-line bg-white p-4 flex md:flex-col gap-1 overflow-x-auto">
        <span className="font-display font-bold hidden md:block mb-4 px-2">Agent<span className="text-brand">Marketer</span></span>
        {NAV.map(([label, href, icon]) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap flex items-center gap-2 ${
              pathname === href ? "bg-brand text-white font-semibold" : "text-slate hover:bg-soft"}`}>
            <span>{icon}</span>{label}
          </Link>
        ))}
        <button onClick={logout} className="px-3 py-2 rounded-xl text-sm text-left text-slate hover:bg-soft md:mt-auto flex items-center gap-2">
          <span>↩</span>Log out
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
