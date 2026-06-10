"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const NAV = [
  ["Dashboard", "/dashboard"],
  ["Leads", "/dashboard/leads"],
  ["My Website", "/dashboard/website"],
  ["Billing", "/dashboard/billing"]
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setReady(true);
    });
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (!ready) return <main className="p-10 text-center opacity-60">Loading…</main>;

  return (
    <div className="min-h-screen md:flex">
      <aside className="md:w-56 bg-ink text-mint p-4 flex md:flex-col gap-2 md:gap-1 overflow-x-auto">
        <span className="font-display font-bold text-white hidden md:block mb-4">AgentMarketer</span>
        {NAV.map(([label, href]) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
              pathname === href ? "bg-awning text-white font-semibold" : "hover:bg-white/10"
            }`}>
            {label}
          </Link>
        ))}
        <button onClick={logout} className="px-3 py-2 rounded-lg text-sm text-left hover:bg-white/10 md:mt-auto">
          Log out
        </button>
      </aside>
      <main className="flex-1 bg-mint p-6 md:p-10">{children}</main>
    </div>
  );
}
