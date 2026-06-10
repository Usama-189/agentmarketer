# AgentMarketer — Stage 1

This folder is your real platform. It includes:

- **Landing page** with pricing and your "live work" ticker
- **Pricing page** — 3 plans, 50% launch discount, annual deal, no-refund rule
- **Signup / Login** (with the no-refund agreement checkbox)
- **Onboarding form** (the Manager Agent — collects the business info every agent uses)
- **Customer dashboard** — agent cards (last run, what it did), leads, website status, 3-revision system, billing
- **Admin control room** at `/admin` — customers, plans, revenue, agent health, revision requests
- **Database** (`supabase/schema.sql`) — all tables + security, ready to paste

Follow the recipe below in order. It takes about 30–45 minutes. Everything is free.

---

## Step 1 — Make 3 free accounts
1. **github.com** — stores your code
2. **supabase.com** — your database
3. **vercel.com** — puts your site on the internet (sign up *with your GitHub account* — easiest)

## Step 2 — Put the code on GitHub
1. On GitHub click **New repository** → name it `agentmarketer` → Create.
2. Click **uploading an existing file**.
3. Unzip this folder on your computer. Drag **everything inside it** (all files AND folders) into the upload box.
4. Click **Commit changes**.

(If drag-and-drop misses the folders, install **GitHub Desktop** and use it to publish the folder — it takes 2 minutes.)

## Step 3 — Set up Supabase (the database)
1. On supabase.com click **New project** → give it a name and a database password (save the password somewhere).
2. Left menu → **SQL Editor** → **New query**.
3. Open the file `supabase/schema.sql` from this folder, copy ALL of it, paste it in, press **Run**. You should see "Success".
4. Left menu → **Authentication → Sign In / Providers → Email** → turn **OFF** "Confirm email" → Save. (This lets customers log in instantly without a confirmation email.)
5. Left menu → **Project Settings → API**. Copy these two values into a private note:
   - **Project URL**
   - **anon public** key

## Step 4 — Put it online with Vercel
1. On vercel.com click **Add New → Project** → Import your `agentmarketer` repository.
2. Before clicking Deploy, open **Environment Variables** and add BOTH:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: your Project URL
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: your anon public key
3. Click **Deploy**. Wait ~2 minutes. Vercel gives you a link like `agentmarketer.vercel.app`.

**Your platform is now live on the internet.**

## Step 5 — Make yourself the admin
1. Open your live site → **Sign up** with YOUR email → fill the onboarding form.
2. In Supabase: **Table Editor → admins → Insert row** → put your email → Save.
3. Visit `your-site.vercel.app/admin` — your control room. You'll see yourself as the first customer.

## Step 6 — Test like a customer
- Sign up with a second email (pretend customer) → fill onboarding.
- In `/admin`: set their plan, mark status **active**, set website status.
- Log in as the customer → check the dashboard shows it.
- Request a revision as the customer → mark it done in `/admin`.

If all that works — Stage 1 is complete. 🎉

---

## What's next (we build these together)
- **Stage 2 — The Chatbot** (the AI receptionist: answers visitors, captures leads → they appear on the Leads page). Needs your Groq key.
- **Stage 3 — Payments** (Paddle checkout, so customers pay by card automatically).
- **Stage 4 — SEO / GEO / AI Search agents** (auto-written blogs, FAQs, llms.txt).
- **Stage 5 — Google Business agent.**

## If something breaks
Copy the exact error message and paste it to Claude (me). Tell me which step you were on. I will fix it with you.
