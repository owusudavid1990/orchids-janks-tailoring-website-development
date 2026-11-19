import { NextRequest, NextResponse } from "next/server";
import { getTakenSlots } from "@/lib/bookings-store";

/**
 * Which times are already taken on a given day.
 *
 * Public, because the booking form needs it before anyone signs in. It
 * returns times only — never who booked them — so it exposes nothing about
 * your customers beyond "this hour is busy", which any booking page shows.
 */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const taken = await getTakenSlots(date);
  return NextResponse.json(
    { date, taken },
    // Brief cache: enough to spare the database during a burst, short enough
    // that a slot taken a minute ago disappears quickly
    { headers: { "Cache-Control": "public, max-age=30" } }
  );
}
