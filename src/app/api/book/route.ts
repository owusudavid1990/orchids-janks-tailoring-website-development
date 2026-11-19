import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { upsertShopifyCustomer } from "@/lib/shopify-customers";
import { createShopifyBookingDraft } from "@/lib/shopify-bookings";
import { saveBooking, isSlotTaken, attachDraftOrder } from "@/lib/bookings-store";
import { sendBookingReceived } from "@/lib/booking-emails";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { bookingSchema, firstIssue } from "@/lib/validation";
import { formatBookingWhen } from "@/lib/calendar";
import { FIELDS, BOOKING_WINDOW, TIME_SLOTS } from "@/config/booking-form";

// Max 5 booking requests per IP per 10 minutes
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const CORE_FIELDS = ["firstName", "lastName", "email", "phone"];

/** Check the slot is one we actually offer — the browser can be bypassed. */
function validateSlot(date: string, time: string): string | null {
  if (!TIME_SLOTS.includes(time)) return "That appointment time isn't available";

  const chosen = new Date(`${date}T00:00:00Z`);
  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  const daysAhead = Math.round((chosen.getTime() - todayUtc.getTime()) / 86_400_000);

  if (daysAhead < BOOKING_WINDOW.minDaysAhead) return "Please choose a later date";
  if (daysAhead > BOOKING_WINDOW.maxDaysAhead) return "That date is too far ahead";
  if (BOOKING_WINDOW.closedWeekdays.includes(chosen.getUTCDay())) {
    return "We're closed on that day";
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`book:${getClientIp(req)}`, LIMIT, WINDOW_MS);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const parsed = bookingSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
    }

    const { date, time } = parsed.data;

    const slotError = validateSlot(date, time);
    if (slotError) return NextResponse.json({ error: slotError }, { status: 400 });

    // Someone may have taken this slot while the customer was filling the form
    if (await isSlotTaken(date, time)) {
      return NextResponse.json(
        { error: "Sorry — that time has just been taken. Please choose another." },
        { status: 409 }
      );
    }

    const firstName = parsed.data.firstName;
    const lastName = parsed.data.lastName ?? "";
    const email = parsed.data.email;
    const phone = parsed.data.phone ?? "";
    const service = parsed.data.service ?? "";
    const details = parsed.data.details ?? {};

    const reference = `JNK-${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
    const whenLabel = formatBookingWhen(date, time);

    // Label the extra answers using the config, in the order defined there
    const extras = FIELDS.filter((f) => !CORE_FIELDS.includes(f.name))
      .map((f) => ({ label: f.label, value: (details[f.name] ?? "").trim() }))
      .filter((e) => e.value);

    // Save first: this claims the slot, so a second customer submitting a
    // moment later gets the 409 above rather than a clashing appointment
    await saveBooking({
      reference,
      service,
      booking_date: date,
      booking_time: time,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      details,
      calendar_choice: parsed.data.calendar ?? "none",
      status: "pending",
      shopify_draft_order_id: null,
    });

    await sendBookingReceived({
      reference,
      service,
      serviceId: parsed.data.serviceId,
      date,
      time,
      firstName,
      lastName,
      email,
      phone,
      extras,
      calendarChoice: parsed.data.calendar,
    });

    // Records. Neither may break a booking that already succeeded.
    const [shopifySync, draft] = await Promise.all([
      upsertShopifyCustomer({
        firstName,
        lastName: lastName || undefined,
        email,
        phone,
        tags: "booking-request",
        note: `${service} — ${whenLabel} (${reference})`,
      }),
      createShopifyBookingDraft({
        reference,
        service,
        date,
        time,
        whenLabel,
        firstName,
        lastName,
        email,
        phone,
        extras,
      }),
    ]);

    if (draft.draftOrderId) await attachDraftOrder(reference, draft.draftOrderId);

    return NextResponse.json({
      success: true,
      reference,
      whenLabel,
      shopifySync,
      draftOrder: draft.ok,
    });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
