import { createClient } from "@supabase/supabase-js";

// These two values come from YOUR Supabase project (see README step 3).
// The placeholders below only stop the build from crashing before you add them.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(url, key);

// The agents shown on the dashboard.
// Stage 1 shows their status; Stages 2-4 make them actually run.
export const AGENTS = [
  { name: "Website Chatbot", desc: "Answers your visitors 24/7 and captures leads." },
  { name: "SEO Agent", desc: "Writes blog posts and keeps your pages optimized." },
  { name: "GEO Agent", desc: "FAQ and answer content so AI search can cite you." },
  { name: "AI Search (llms.txt)", desc: "Tells AI engines who you are and what you do." },
  { name: "Google Business Agent", desc: "Posts updates and replies to reviews on Google." },
  { name: "Analytics Agent", desc: "Your monthly before-vs-after results report." }
];
