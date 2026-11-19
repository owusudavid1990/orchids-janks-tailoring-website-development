import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getBooking } from "@/lib/bookings-store";
import { sendReviewRequest, toEmailData } from "@/lib/booking-emails";

/**
 * Sends a "how was your appointment / leave a review" email for one booking.
 *
 * Triggered manually from the admin bookings dashboard once an appointment
 * is complete — deliberately not automated on a timer, so a human always
 * decides when a commission is actually finished before asking for a review.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const booking = await getBooking(id).catch(() => null);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  try {
    await sendReviewRequest(toEmailData(booking));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/bookings/review-request] Email failed:", String(err));
    return NextResponse.json({ error: "Couldn't send the email" }, { status: 500 });
  }
}
