/**
 * Stores bookings so the admin dashboard has something to show.
 *
 * Uses the Supabase database the site already has. If the table hasn't been
 * created yet, saving fails quietly and the booking still completes — the
 * emails and the Shopify draft order are the records that matter. The
 * dashboard is a convenience on top of those, never a single point of
 * failure in front of them.
 *
 * The SQL to create the table is in docs/bookings-table.sql.
 */

import { supabaseAdmin } from "@/lib/supabase-admin";

export interface StoredBooking {
  reference: string;
  service: string;
  booking_date: string;
  booking_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  /** Everything from the configurable extra fields */
  details: Record<string, string>;
  calendar_choice: string;
  status: "pending" | "confirmed" | "cancelled";
  shopify_draft_order_id: number | null;
}

export interface BookingRow extends StoredBooking {
  id: string;
  created_at: string;
  reminder_sent_at: string | null;
}

export async function saveBooking(
  booking: StoredBooking
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin.from("bookings").insert(booking);
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (err) {
    const error = String(err);
    console.error("[bookings-store] Save failed (non-fatal):", error);
    return { ok: false, error };
  }
}

/** Link the Shopify draft order once it's been created. */
export async function attachDraftOrder(reference: string, draftOrderId: number): Promise<void> {
  try {
    await supabaseAdmin
      .from("bookings")
      .update({ shopify_draft_order_id: draftOrderId })
      .eq("reference", reference);
  } catch (err) {
    console.error("[bookings-store] Couldn't link draft order:", String(err));
  }
}

export async function listBookings(): Promise<{
  ok: boolean;
  bookings: BookingRow[];
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true })
      .limit(500);
    if (error) throw new Error(error.message);
    return { ok: true, bookings: (data ?? []) as BookingRow[] };
  } catch (err) {
    return { ok: false, bookings: [], error: String(err) };
  }
}

/**
 * Times already taken on a given day.
 *
 * Cancelled bookings free their slot back up. If the lookup fails we return
 * an empty list rather than throwing — better to risk a rare double booking
 * you can sort out by phone than to block every customer from booking.
 */
export async function getTakenSlots(date: string): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("booking_time")
      .eq("booking_date", date)
      .in("status", ["pending", "confirmed"]);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: { booking_time: string }) => r.booking_time);
  } catch (err) {
    console.error("[bookings-store] Slot lookup failed:", String(err));
    return [];
  }
}

/** Last check before saving — the browser's version can be bypassed. */
export async function isSlotTaken(date: string, time: string): Promise<boolean> {
  const taken = await getTakenSlots(date);
  return taken.includes(time);
}

/** Confirmed bookings on `date` that haven't had a reminder yet. */
export async function listBookingsNeedingReminder(date: string): Promise<BookingRow[]> {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed"])
    .is("reminder_sent_at", null);
  if (error) throw new Error(error.message);
  return (data ?? []) as BookingRow[];
}

export async function markReminderSent(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getBooking(id: string): Promise<BookingRow | null> {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as BookingRow) ?? null;
}

export async function updateBookingStatus(
  id: string,
  status: StoredBooking["status"]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
