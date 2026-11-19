/**
 * Calendar invitations for booking confirmations.
 *
 * A website cannot write into a customer's Google or Outlook calendar — no
 * API permits that without the customer signing in and granting access, and
 * nobody does that to book a fitting. What we do instead is what every
 * booking system does:
 *
 *   1. Attach a .ics file to the confirmation email. Google, Outlook, Apple
 *      Mail and Android all recognise it and offer to add the appointment.
 *   2. Include one-tap "Add to Calendar" links for the provider the customer
 *      told us they use.
 *
 * The result is the same for the customer — the appointment lands in their
 * calendar — without asking them to log into anything.
 */

import { BUSINESS, type CalendarChoice } from "@/config/booking-form";

export interface CalendarEvent {
  /** "2026-08-20" */
  date: string;
  /** "14:00" — local time in BUSINESS.timeZone */
  time: string;
  durationMinutes: number;
  summary: string;
  description: string;
  location: string;
  /** Stable identifier so re-sending the email updates rather than duplicates */
  uid: string;
}

/**
 * How far the given IANA zone is from UTC at that instant, in milliseconds.
 * Uses Intl rather than a date library so there's no dependency to keep
 * current as British Summer Time rules change.
 */
function zoneOffsetMs(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(date).map((p) => [p.type, p.value])
  ) as Record<string, string>;

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    // Intl renders midnight as "24" in some environments
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - date.getTime();
}

/** Convert a wall-clock time in BUSINESS.timeZone to a real UTC instant. */
export function toUtc(date: string, time: string): Date {
  const naive = new Date(`${date}T${time}:00Z`);
  // First pass gets us close; a second pass settles days near a DST switch
  const firstGuess = new Date(naive.getTime() - zoneOffsetMs(naive, BUSINESS.timeZone));
  return new Date(naive.getTime() - zoneOffsetMs(firstGuess, BUSINESS.timeZone));
}

/** 20260820T130000Z */
function icsStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Commas, semicolons and backslashes are field separators in iCalendar. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** iCalendar lines must not exceed 75 octets; continuations start with a space. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    chunks.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest) chunks.push(" " + rest);
  return chunks.join("\r\n");
}

/** Build an RFC 5545 .ics file. */
export function buildIcs(event: CalendarEvent): string {
  const start = toUtc(event.date, event.time);
  const end = new Date(start.getTime() + event.durationMinutes * 60_000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JANKS Tailoring//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${escapeText(event.summary)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    "STATUS:TENTATIVE",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(event.summary)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(fold).join("\r\n");
}

/** "Add to Google Calendar" link. */
export function googleCalendarUrl(event: CalendarEvent): string {
  const start = toUtc(event.date, event.time);
  const end = new Date(start.getTime() + event.durationMinutes * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.summary,
    dates: `${icsStamp(start)}/${icsStamp(end)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** "Add to Outlook" link — works for both Outlook.com and Microsoft 365. */
export function outlookCalendarUrl(event: CalendarEvent): string {
  const start = toUtc(event.date, event.time);
  const end = new Date(start.getTime() + event.durationMinutes * 60_000);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.summary,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: event.description,
    location: event.location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** The link matching whichever calendar the customer picked, if any. */
export function calendarLinkFor(
  choice: CalendarChoice | undefined,
  event: CalendarEvent
): { label: string; url: string } | null {
  switch (choice) {
    case "google":
      return { label: "Add to Google Calendar", url: googleCalendarUrl(event) };
    case "outlook":
      return { label: "Add to Outlook", url: outlookCalendarUrl(event) };
    // Apple Calendar has no web endpoint — the attached .ics is how it's added
    default:
      return null;
  }
}

/** Human-readable date for emails: "Thursday, 20 August 2026 at 2:00 pm". */
export function formatBookingWhen(date: string, time: string): string {
  const d = toUtc(date, time);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}
