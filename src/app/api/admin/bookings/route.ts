import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listBookings, updateBookingStatus, getBooking } from "@/lib/bookings-store";
import {
  sendBookingConfirmed,
  sendBookingCancelled,
  toEmailData,
} from "@/lib/booking-emails";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;

  const result = await listBookings();

  // The table not existing yet is a setup step, not a server fault — say so
  // plainly rather than showing an empty dashboard that looks broken.
  if (!result.ok) {
    const missingTable = /relation .*bookings.* does not exist|schema cache/i.test(result.error ?? "");
    return NextResponse.json({
      bookings: [],
      error: missingTable
        ? "The bookings table hasn't been created yet. Run docs/bookings-table.sql in your Supabase SQL editor."
        : result.error,
    });
  }

  return NextResponse.json({ bookings: result.bookings });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status;

  if (!id || !["pending", "confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const existing = await getBooking(id).catch(() => null);
  if (!existing) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Nothing to do, and no email worth sending
  if (existing.status === status) return NextResponse.json({ success: true, emailed: false });

  const result = await updateBookingStatus(id, status);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });

  // Tell the customer. The status change is already saved, so a mail failure
  // must not report the whole action as failed — it's reported separately so
  // the dashboard can say "saved, but we couldn't email them".
  let emailed = false;
  let emailError: string | undefined;
  try {
    if (status === "confirmed") {
      await sendBookingConfirmed(toEmailData(existing));
      emailed = true;
    } else if (status === "cancelled") {
      await sendBookingCancelled(toEmailData(existing));
      emailed = true;
    }
  } catch (err) {
    emailError = String(err);
    console.error("[admin/bookings] Status saved but email failed:", emailError);
  }

  return NextResponse.json({ success: true, emailed, emailError });
}
