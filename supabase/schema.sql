-- =============================================================
-- AgentMarketer database — paste ALL of this into Supabase
-- (Supabase dashboard -> SQL Editor -> New query -> paste -> Run)
-- =============================================================

-- 1) CUSTOMERS — one row per business that signs up
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  email text,
  business_name text,
  business_type text,
  services text,
  location text,
  phone text,
  business_hours text,
  special text,
  tone text default 'friendly',
  package text default 'none',           -- none | basic | growth | pro
  billing_cycle text default 'monthly',  -- monthly | annual
  status text default 'new',             -- new | active | cancelled
  domain text,
  website_status text default 'not_started', -- not_started | building | live
  created_at timestamptz default now()
);

-- 2) LEADS — captured by the chatbot (and added manually for now)
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  name text,
  email text,
  message text,
  source text default 'chatbot',
  created_at timestamptz default now()
);

-- 3) AGENT RUNS — every time an agent does work, one row goes here.
--    This powers the dashboard cards ("last run: what it did").
create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  agent_name text not null,       -- e.g. 'SEO Agent'
  what_it_did text,               -- e.g. 'Wrote 1 blog post about teeth whitening'
  status text default 'success',  -- success | error
  created_at timestamptz default now()
);

-- 4) REVISIONS — website change requests (max 3 per customer, checked in app)
create table public.revisions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  request_text text,
  status text default 'pending', -- pending | done
  created_at timestamptz default now()
);

-- 5) ADMINS — emails allowed to open /admin (add YOUR email after signup)
create table public.admins (
  email text primary key
);

-- =============================================================
-- AUTO-CREATE a customer row when someone signs up
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.customers (auth_user_id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================
-- SECURITY (Row Level Security)
-- Customers can only see THEIR OWN data. Admins can see everything.
-- =============================================================
alter table public.customers enable row level security;
alter table public.leads enable row level security;
alter table public.agent_runs enable row level security;
alter table public.revisions enable row level security;
alter table public.admins enable row level security;

-- helper: is the logged-in user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- customers table
create policy "own customer row - read" on public.customers
  for select using (auth.uid() = auth_user_id or public.is_admin());
create policy "own customer row - update" on public.customers
  for update using (auth.uid() = auth_user_id or public.is_admin());

-- leads table
create policy "own leads - read" on public.leads
  for select using (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
    or public.is_admin()
  );
create policy "own leads - insert" on public.leads
  for insert with check (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
    or public.is_admin()
  );

-- agent_runs table
create policy "own runs - read" on public.agent_runs
  for select using (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
    or public.is_admin()
  );
create policy "own runs - insert" on public.agent_runs
  for insert with check (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
    or public.is_admin()
  );

-- revisions table
create policy "own revisions - read" on public.revisions
  for select using (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
    or public.is_admin()
  );
create policy "own revisions - insert" on public.revisions
  for insert with check (
    customer_id in (select id from public.customers where auth_user_id = auth.uid())
    or public.is_admin()
  );

-- admins table: logged-in users may check the list (needed for the admin page)
create policy "admins readable" on public.admins
  for select using (auth.role() = 'authenticated');

-- allow admins to update revisions (e.g. mark them done)
create policy "revisions - admin update" on public.revisions
  for update using (public.is_admin());
