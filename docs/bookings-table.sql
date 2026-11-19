-- ───────────────────────────────────────────────────────────────────────────
-- JANKS Tailoring — bookings table
--
-- HOW TO RUN THIS (one time only, takes about a minute):
--   1. Go to supabase.com and open your project
--   2. Click "SQL Editor" in the left sidebar
--   3. Click "New query"
--   4. Paste everything in this file
--   5. Click "Run"
--
-- You only ever need to do this once. If you skip it, bookings still work —
-- you'll get the emails and the Shopify draft orders — but the admin
-- dashboard at /admin/bookings will have nothing to display.
-- ───────────────────────────────────────────────────────────────────────────

create table if not exists public.bookings (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),

  reference               text not null unique,
  service                 text not null,

  booking_date            date not null,
  booking_time            text not null,

  first_name              text not null,
  last_name               text,
  email                   text not null,
  phone                   text,

  -- Any extra questions you add to the booking form land here
  details                 jsonb not null default '{}'::jsonb,

  calendar_choice         text,
  status                  text not null default 'pending',
  shopify_draft_order_id  bigint,

  constraint bookings_status_check
    check (status in ('pending', 'confirmed', 'cancelled'))
);

-- Makes the dashboard's "upcoming appointments" view fast
create index if not exists bookings_date_idx
  on public.bookings (booking_date, booking_time);

create index if not exists bookings_email_idx
  on public.bookings (email);

-- ── SECURITY ───────────────────────────────────────────────────────────────
-- Row Level Security is switched on and NO public policy is created. That
-- means the anonymous key used by your website's browser code cannot read
-- these rows at all. Only the server, which holds the service-role key, can
-- read or write them.
--
-- This matters: bookings contain customer names, emails and phone numbers.
-- Without this, anyone who viewed your site's source could read every
-- customer record you hold.

alter table public.bookings enable row level security;

-- Deliberately no "create policy" statements. Locked to server-side only.
