import { NextRequest, NextResponse } from "next/server";
import { listBookingsNeedingReminder, markReminderSent } from "@/lib/bookings-store";
import { sendBookingReminder, toEmailData } from "@/lib/booking-emails";
import { BUSINESS } from "@/config/booking-form";

/**
 * Sends "your appointment is tomorrow" emails.
 *
 * Run once a day by Vercel Cron — see vercel.json. Vercel signs its own
 * requests with CRON_SECRET; anything else is refused, because this endpoint
 * sends email and an open one could be used to spam your customers.
 *
 * Each booking is marked once sent, so re-running it never emails anyone
 * twice. That matters — cron jobs get retried.
 */

export const dynamic = "force-dynamic";

/** Tomorrow's date in the business's own timezone, not the server's. */
function tomorrowLocal(): string {
  const now = new Date();
  const local = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(local); // en-CA gives YYYY-MM-DD
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("[cron/reminders] CRON_SECRET is not set — refusing to run");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const date = tomorrowLocal();

  try {
    const due = await listBookingsNeedingReminder(date);
    let sent = 0;
    const failures: string[] = [];

    for (const booking of due) {
      try {
        await sendBookingReminder(toEmailData(booking));
        // Marked only after the email actually went — a crash here means
        // one duplicate at worst, never a silently missed reminder
        await markReminderSent(booking.id);
        sent++;
      } catch (err) {
        failures.push(`${booking.reference}: ${String(err)}`);
      }
    }

    console.log(`[cron/reminders] ${date}: ${sent} sent, ${failures.length} failed`);
    return NextResponse.json({ date, due: due.length, sent, failures });
  } catch (err) {
    console.error("[cron/reminders] Failed:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
