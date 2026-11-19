/**
 * Every email the booking system sends.
 *
 * Kept in one file so the wording and styling stay consistent, and so the
 * API routes stay readable. Each function returns quietly on failure —
 * a booking must never be lost because an email server hiccupped.
 */

import nodemailer from "nodemailer";
import { escapeHtml } from "@/lib/validation";
import { buildIcs, calendarLinkFor, formatBookingWhen, type CalendarEvent } from "@/lib/calendar";
import { BUSINESS, SERVICES, FIELDS, type CalendarChoice } from "@/config/booking-form";

const GOLD = "#C9A962";

// Same listing used on the site's own footer/homepage "Read Our Reviews on Google" links
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=JANKs+Tailoring+Ltd&stick=H4sIAAAAAAAA_-NgU1I1qDBKSjVJMjFPTE4xSLY0TLG0AgqZp5lYGhmkmVgkJhulJqUsYhX2cvTzLlYISczMyS_KzEtX8ClJAQA3caGpPwAAAA&hl=en&mat=CfjY04Q8A3VoElcBa0lj_2-1xkZaWdK2hWEBRfOhXnKMbKoxnvLfRYpcnV7okVUNwXUQtoe2Q0bV3y-0GiDWoL1r5uN23qyWBclJCLvMxWr5ygL-Y2bkOJ7Q52UEStMezJc&authuser=0";

export interface BookingEmailData {
  reference: string;
  service: string;
  serviceId?: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extras: Array<{ label: string; value: string }>;
  calendarChoice?: CalendarChoice;
}

const CORE_FIELDS = ["firstName", "lastName", "email", "phone"];

/**
 * Turn a stored booking row back into what these templates need.
 * Lives here rather than in a route file so the cron job and the admin
 * endpoint share exactly one version of it.
 */
export function toEmailData(b: {
  reference: string;
  service: string;
  booking_date: string;
  booking_time: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  details: Record<string, string>;
  calendar_choice: string | null;
}): BookingEmailData {
  return {
    reference: b.reference,
    service: b.service,
    serviceId: SERVICES.find((s) => s.name === b.service)?.id,
    date: b.booking_date,
    time: b.booking_time,
    firstName: b.first_name,
    lastName: b.last_name ?? "",
    email: b.email,
    phone: b.phone ?? "",
    extras: FIELDS.filter((f) => !CORE_FIELDS.includes(f.name))
      .map((f) => ({ label: f.label, value: (b.details?.[f.name] ?? "").trim() }))
      .filter((e) => e.value),
    calendarChoice: (b.calendar_choice ?? "none") as CalendarChoice,
  };
}

function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function durationFor(serviceId?: string) {
  return SERVICES.find((s) => s.id === serviceId)?.durationMinutes ?? 60;
}

export function calendarEventFor(d: BookingEmailData, confirmed: boolean): CalendarEvent {
  return {
    date: d.date,
    time: d.time,
    durationMinutes: durationFor(d.serviceId),
    summary: `${d.service || "Fitting"} — ${BUSINESS.name}`,
    description: [
      `Booking reference: ${d.reference}`,
      `Service: ${d.service || "Fitting"}`,
      `Name: ${d.firstName} ${d.lastName}`.trim(),
      `Email: ${d.email}`,
      d.phone ? `Phone: ${d.phone}` : "",
      ...d.extras.filter((e) => e.value).map((e) => `${e.label}: ${e.value}`),
      "",
      confirmed
        ? `Confirmed by ${BUSINESS.name}.`
        : `Provisional until ${BUSINESS.name} confirms it.`,
    ]
      .filter(Boolean)
      .join("\n"),
    location: BUSINESS.location,
    uid: `${d.reference.toLowerCase()}@jankstailoring.com`,
  };
}

/** Shared shell so every email looks like it came from the same business. */
function shell(title: string, subtitle: string, body: string) {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#1c1c1c;color:#FAF9F7;padding:40px;">
      <div style="border-bottom:1px solid ${GOLD};padding-bottom:24px;margin-bottom:24px;">
        <h1 style="font-size:24px;color:${GOLD};margin:0 0 4px;">${title}</h1>
        <p style="color:#999;font-size:13px;margin:0;">${subtitle}</p>
      </div>
      ${body}
      <div style="border-top:1px solid #333;margin-top:32px;padding-top:20px;">
        <p style="font-size:12px;color:#555;margin:0;">
          ${BUSINESS.name} · ${BUSINESS.location} · jankstailoring@gmail.com
        </p>
      </div>
    </div>`;
}

function detailTable(rows: Array<[string, string]>) {
  return `<table style="width:100%;border-collapse:collapse;margin-bottom:28px;border:1px solid #2a2a2a;">
    ${rows
      .map(
        ([label, value], i) => `<tr>
          <td style="padding:14px 16px;color:#999;font-size:13px;width:150px;${i < rows.length - 1 ? "border-bottom:1px solid #2a2a2a;" : ""}">${label}</td>
          <td style="padding:14px 16px;font-size:14px;${i === 0 ? `color:${GOLD};` : ""}${i < rows.length - 1 ? "border-bottom:1px solid #2a2a2a;" : ""}">${value}</td>
        </tr>`
      )
      .join("")}
  </table>`;
}

// ── 1. Booking received ────────────────────────────────────────────────────

export async function sendBookingReceived(d: BookingEmailData) {
  const t = transporter();
  const when = formatBookingWhen(d.date, d.time);
  const event = calendarEventFor(d, false);
  const ics = {
    filename: `janks-appointment-${d.reference}.ics`,
    content: buildIcs(event),
    contentType: "text/calendar; charset=utf-8; method=PUBLISH",
  };
  const link = calendarLinkFor(d.calendarChoice, event);

  const name = escapeHtml(d.firstName);
  const service = escapeHtml(d.service);

  // To JANKS
  await t.sendMail({
    from: `"JANKS Booking System" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    replyTo: d.email,
    subject: `New Booking — ${when} — ${name} ${escapeHtml(d.lastName)} (${service})`,
    attachments: [ics],
    html: shell(
      "New Appointment Booked",
      `Reference ${d.reference}`,
      detailTable([
        ["Appointment", when],
        ["Service", service],
        ["Client", `${name} ${escapeHtml(d.lastName)}`],
        ["Email", `<a href="mailto:${escapeHtml(d.email)}" style="color:${GOLD};">${escapeHtml(d.email)}</a>`],
        ["Phone", d.phone ? escapeHtml(d.phone) : "—"],
        ...d.extras.filter((e) => e.value).map((e) => [escapeHtml(e.label), escapeHtml(e.value)] as [string, string]),
      ]) +
        `<p style="font-size:13px;color:#777;line-height:1.6;">
           Confirm or cancel this booking in your
           <a href="https://jankstailoring.com/admin/bookings" style="color:${GOLD};">bookings dashboard</a>.
           The client is told either way.
         </p>`
    ),
  });

  // To the customer
  await t.sendMail({
    from: `"${BUSINESS.name}" <${process.env.SMTP_USER}>`,
    to: d.email,
    subject: `Your JANKS appointment — ${when}`,
    attachments: [ics],
    html: shell(
      "Appointment Requested",
      `${BUSINESS.name}, ${BUSINESS.location}`,
      `<p style="font-size:15px;margin-bottom:20px;">Dear ${name},</p>
       <p style="font-size:14px;color:#bbb;line-height:1.7;margin-bottom:28px;">
         Thank you for booking with ${BUSINESS.name}. We have reserved the time below and
         will confirm it within <strong style="color:${GOLD};">${BUSINESS.responseTime}</strong>.
       </p>
       ${detailTable([
         ["Appointment", when],
         ["Service", service],
         ["Reference", d.reference],
       ])}
       ${
         link
           ? `<div style="margin-bottom:28px;"><a href="${link.url}"
                style="display:inline-block;background:${GOLD};color:#1c1c1c;text-decoration:none;
                       padding:14px 28px;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
                ${link.label}</a></div>`
           : ""
       }
       <p style="font-size:13px;color:#777;line-height:1.6;margin-bottom:20px;">
         A calendar file is attached — opening it adds the appointment to Apple Calendar,
         Outlook, Google Calendar or whichever calendar you use.
       </p>
       <p style="font-size:13px;color:#777;line-height:1.6;">
         Need to change or cancel? Reply to this email quoting ${d.reference}.
       </p>`
    ),
  });
}

// ── 2. Confirmed ───────────────────────────────────────────────────────────

export async function sendBookingConfirmed(d: BookingEmailData) {
  const t = transporter();
  const when = formatBookingWhen(d.date, d.time);
  const event = calendarEventFor(d, true);
  const name = escapeHtml(d.firstName);

  await t.sendMail({
    from: `"${BUSINESS.name}" <${process.env.SMTP_USER}>`,
    to: d.email,
    replyTo: process.env.NOTIFY_EMAIL,
    subject: `Confirmed — your JANKS appointment on ${when}`,
    attachments: [
      {
        filename: `janks-appointment-${d.reference}.ics`,
        // STATUS:CONFIRMED so calendars replace the provisional entry rather
        // than creating a second one — the UID is unchanged
        content: buildIcs(event).replace("STATUS:TENTATIVE", "STATUS:CONFIRMED"),
        contentType: "text/calendar; charset=utf-8; method=PUBLISH",
      },
    ],
    html: shell(
      "Appointment Confirmed",
      `${BUSINESS.name}, ${BUSINESS.location}`,
      `<p style="font-size:15px;margin-bottom:20px;">Dear ${name},</p>
       <p style="font-size:14px;color:#bbb;line-height:1.7;margin-bottom:28px;">
         Your appointment is confirmed. We look forward to seeing you.
       </p>
       ${detailTable([
         ["Appointment", when],
         ["Service", escapeHtml(d.service)],
         ["Reference", d.reference],
       ])}
       <p style="font-size:13px;color:#777;line-height:1.6;">
         The attached calendar file updates the provisional entry you were sent earlier.
         If anything changes, reply to this email quoting ${d.reference}.
       </p>`
    ),
  });
}

// ── 3. Cancelled ───────────────────────────────────────────────────────────

export async function sendBookingCancelled(d: BookingEmailData) {
  const t = transporter();
  const when = formatBookingWhen(d.date, d.time);
  const name = escapeHtml(d.firstName);

  await t.sendMail({
    from: `"${BUSINESS.name}" <${process.env.SMTP_USER}>`,
    to: d.email,
    replyTo: process.env.NOTIFY_EMAIL,
    subject: `Your JANKS appointment on ${when} has been cancelled`,
    html: shell(
      "Appointment Cancelled",
      `${BUSINESS.name}, ${BUSINESS.location}`,
      `<p style="font-size:15px;margin-bottom:20px;">Dear ${name},</p>
       <p style="font-size:14px;color:#bbb;line-height:1.7;margin-bottom:28px;">
         We're sorry — the appointment below has been cancelled. If this wasn't expected,
         please reply to this email and we'll put it right.
       </p>
       ${detailTable([
         ["Was booked for", when],
         ["Service", escapeHtml(d.service)],
         ["Reference", d.reference],
       ])}
       <div style="margin-bottom:28px;">
         <a href="https://jankstailoring.com/book"
            style="display:inline-block;background:${GOLD};color:#1c1c1c;text-decoration:none;
                   padding:14px 28px;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
           Choose Another Time
         </a>
       </div>
       <p style="font-size:13px;color:#777;line-height:1.6;">
         Please also remove the appointment from your own calendar.
       </p>`
    ),
  });
}

// ── 4. Reminder, the day before ────────────────────────────────────────────

export async function sendBookingReminder(d: BookingEmailData) {
  const t = transporter();
  const when = formatBookingWhen(d.date, d.time);
  const name = escapeHtml(d.firstName);

  await t.sendMail({
    from: `"${BUSINESS.name}" <${process.env.SMTP_USER}>`,
    to: d.email,
    replyTo: process.env.NOTIFY_EMAIL,
    subject: `Tomorrow — your JANKS appointment at ${d.time}`,
    html: shell(
      "A Reminder",
      `${BUSINESS.name}, ${BUSINESS.location}`,
      `<p style="font-size:15px;margin-bottom:20px;">Dear ${name},</p>
       <p style="font-size:14px;color:#bbb;line-height:1.7;margin-bottom:28px;">
         A short note that your appointment with us is tomorrow.
       </p>
       ${detailTable([
         ["Appointment", when],
         ["Service", escapeHtml(d.service)],
         ["Reference", d.reference],
       ])}
       <p style="font-size:13px;color:#777;line-height:1.6;">
         If you can no longer make it, please reply to this email so we can offer
         the time to someone else.
       </p>`
    ),
  });
}

// ── 5. Review request, sent manually once an appointment is complete ───────

export async function sendReviewRequest(d: BookingEmailData) {
  const t = transporter();
  const name = escapeHtml(d.firstName);
  const service = escapeHtml(d.service);

  await t.sendMail({
    from: `"${BUSINESS.name}" <${process.env.SMTP_USER}>`,
    to: d.email,
    replyTo: process.env.NOTIFY_EMAIL,
    subject: `How was your ${service || "appointment"} with ${BUSINESS.name}?`,
    html: shell(
      "Thank You",
      `${BUSINESS.name}, ${BUSINESS.location}`,
      `<p style="font-size:15px;margin-bottom:20px;">Dear ${name},</p>
       <p style="font-size:14px;color:#bbb;line-height:1.7;margin-bottom:28px;">
         Thank you for choosing ${BUSINESS.name}. We hope you're delighted with the result.
         If you have a moment, a short review helps other clients find us — and means a great
         deal to a small, independent atelier like ours.
       </p>
       <div style="margin-bottom:28px;">
         <a href="${GOOGLE_REVIEWS_URL}"
            style="display:inline-block;background:${GOLD};color:#1c1c1c;text-decoration:none;
                   padding:14px 28px;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
           Leave a Google Review
         </a>
       </div>
       <p style="font-size:13px;color:#777;line-height:1.6;">
         Thank you again for trusting us with your commission. Reply to this email any time
         — we're always happy to hear from you, quoting ${d.reference} if it's about this visit.
       </p>`
    ),
  });
}
