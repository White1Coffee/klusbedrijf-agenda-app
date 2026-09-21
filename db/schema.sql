-- Run dit bestand in de Supabase SQL Editor. auth.users is de bron voor inloggen.
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  phone text, message text not null, created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(), name text not null unique,
  description text not null, price_indication numeric(10,2), is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists appointments_start_time_idx on public.appointments(start_time);
create index if not exists appointments_customer_id_idx on public.appointments(customer_id);

-- Activeer RLS voordat je echte klanten toegang geeft en vervang dit met op maat gemaakte policies.
alter table public.users enable row level security;
alter table public.appointments enable row level security;
alter table public.reviews enable row level security;
alter table public.contacts enable row level security;
alter table public.services enable row level security;

-- Minimale veilige leespolicy voor publieke diensten.
create policy "public can read active services" on public.services for select using (is_active = true);
