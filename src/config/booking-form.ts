/**
 * ── BOOKING FORM CONFIGURATION ──────────────────────────────────────────────
 *
 * This is the file to edit when you want to change the booking form.
 * You do not need to touch any other file.
 *
 *  • To change a service name or price  -> edit SERVICES below
 *  • To add or remove a question        -> edit FIELDS below
 *  • To change bookable appointment times -> edit TIME_SLOTS / BOOKING_WINDOW
 *
 * After editing, the site needs to be redeployed for changes to appear.
 * ───────────────────────────────────────────────────────────────────────────
 */

// ── 1. SERVICES ────────────────────────────────────────────────────────────
// The options shown on step 1. `id` must be unique and contain no spaces.
// `durationMinutes` sets how long the calendar appointment is blocked out for.

export interface ServiceOption {
  id: string;
  name: string;
  price: string;
  durationMinutes: number;
}

export const SERVICES: ServiceOption[] = [
  // Listed first because it's the easiest thing for a new client to say yes to
  { id: "consultation", name: "Consultation", price: "By appointment", durationMinutes: 30 },
  { id: "bespoke", name: "Bespoke Suit", price: "From £1,200", durationMinutes: 90 },
  { id: "mtm", name: "Made-to-Measure", price: "From £650", durationMinutes: 60 },
  { id: "custom-shirt", name: "Custom Shirt", price: "From £75", durationMinutes: 45 },
  { id: "alterations", name: "Alterations", price: "From £50", durationMinutes: 30 },
];

// ── 2. FORM FIELDS ─────────────────────────────────────────────────────────
// The questions on step 3. Add, remove or reorder freely.
//
//   name      – internal key. Lowercase, no spaces. Must be unique.
//   label     – what the customer sees
//   type      – "text" | "email" | "tel" | "textarea" | "select"
//   required  – true means the customer can't continue without it
//   options   – only for type "select"
//
// Anything you add here automatically appears on the form, in your
// notification email, in Shopify, and in the admin dashboard.
//
// To ask a question only for certain services, add `onlyForServices` with
// the service ids it applies to. Leave it off and the question is asked
// every time.

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  placeholder?: string;
  options?: string[];
  /** Half-width on desktop, so two fields sit side by side */
  half?: boolean;
  /** Only ask this when one of these service ids is chosen */
  onlyForServices?: string[];
}

export const FIELDS: FormField[] = [
  { name: "firstName", label: "First Name", type: "text", required: true, placeholder: "James", half: true },
  { name: "lastName", label: "Last Name", type: "text", required: true, placeholder: "Okonkwo", half: true },
  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "james@example.com" },
  { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+44 7000 000000" },
  // Only asked when someone books a Consultation
  {
    name: "consultationTopic",
    label: "What would you like to discuss?",
    type: "textarea",
    required: true,
    placeholder:
      "A wedding in June, a first bespoke suit, reworking something you already own — whatever's on your mind.",
    onlyForServices: ["consultation"],
  },
  {
    name: "location",
    label: "Where would you like to meet?",
    type: "select",
    required: false,
    options: ["At my home", "At my office", "I'll travel to you", "Not sure yet"],
  },
  {
    name: "notes",
    label: "Anything we should know?",
    type: "textarea",
    required: false,
    placeholder: "The occasion, a deadline, fabric preferences…",
  },
];

// ── 3. APPOINTMENT TIMES ───────────────────────────────────────────────────
// The slots offered on step 2, in 24-hour format.

/** How many steps the booking form has. Used by the progress dots and the
 *  "unfinished booking" card on the member dashboard. */
export const BOOKING_STEPS = 3;

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

/** How far ahead customers can book. */
export const BOOKING_WINDOW = {
  /** Earliest bookable day, counted from today. 1 = tomorrow. */
  minDaysAhead: 1,
  /** Latest bookable day. */
  maxDaysAhead: 90,
  /** Days of the week that are closed. 0 = Sunday, 6 = Saturday. */
  closedWeekdays: [0],
};

// ── 4. CALENDAR ────────────────────────────────────────────────────────────
// Where the customer wants the appointment saved.

export const CALENDAR_CHOICES = [
  { id: "google", label: "Google Calendar" },
  { id: "outlook", label: "Outlook" },
  { id: "apple", label: "Apple Calendar" },
  { id: "none", label: "No thanks" },
] as const;

export type CalendarChoice = (typeof CALENDAR_CHOICES)[number]["id"];

// ── 5. BUSINESS DETAILS ────────────────────────────────────────────────────
// Used in calendar invitations and emails.

export const BUSINESS = {
  name: "JANKS Tailoring",
  location: "London, United Kingdom",
  timeZone: "Europe/London",
  /** Shown to the customer as the response promise. */
  responseTime: "24 hours",
};
