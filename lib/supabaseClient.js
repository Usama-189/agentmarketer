import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(url, key);

// Customer-facing agents. The Manager Agent runs behind the scenes.
// GEO + AIO + LLMO are merged into one "AI Search Agent".
export const AGENTS = [
  { name: "AI Receptionist", emoji: "💬", tint: "#6D4AFF",
    desc: "Answers your visitors 24/7 and turns them into booked leads." },
  { name: "SEO Agent", emoji: "🔎", tint: "#00C08B",
    desc: "Gets you ranking on Google with content written for you." },
  { name: "AI Search Agent", emoji: "✨", tint: "#F4A93C",
    desc: "Gets you found & recommended on ChatGPT, Gemini and Perplexity." },
  { name: "Google Business Agent", emoji: "📍", tint: "#6D4AFF",
    desc: "Keeps your Google Profile and Maps active, posted, and replied-to." },
  { name: "Lead Gen Agent", emoji: "🎯", tint: "#00C08B",
    desc: "Finds new B2B and B2C customers for you to reach out to." },
  { name: "Analytics Agent", emoji: "📈", tint: "#F4A93C",
    desc: "Shows your real growth — before vs after, every month." }
];
