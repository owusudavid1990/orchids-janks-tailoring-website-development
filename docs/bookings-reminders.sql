-- ───────────────────────────────────────────────────────────────────────────
-- JANKS Tailoring — add reminder tracking
--
-- Run this the same way as before:
--   1. https://supabase.com/dashboard/project/sreaowbmyklwmhhjtoaz/sql/new
--   2. Paste this in
--   3. Click Run
--
-- Green "Success. No rows returned." means it worked.
--
-- This adds one column that records when a reminder email was sent, so the
-- daily job never emails the same customer twice.
-- ───────────────────────────────────────────────────────────────────────────

alter table public.bookings
  add column if not exists reminder_sent_at timestamptz;

-- Lets the daily job find tomorrow's un-reminded bookings quickly
create index if not exists bookings_reminder_idx
  on public.bookings (booking_date)
  where reminder_sent_at is null;
