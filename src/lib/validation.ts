import { z } from "zod";

/**
 * Input schemas for the public API routes.
 *
 * These cap lengths and check formats so the forms can't be used to send
 * huge payloads, malformed addresses, or injected content into the emails
 * we generate.
 */

// Block CR/LF so user input can't inject extra email headers
const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => !/[\r\n]/.test(v), { message: "Line breaks are not allowed here" });

export const emailField = z.string().trim().toLowerCase().email().max(254);

export const contactSchema = z.object({
  name: singleLine(100).min(1, "Name is required"),
  email: emailField,
  phone: singleLine(40).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  service: singleLine(100).optional().or(z.literal("")),
  type: z.enum(["message", "consultation", "newsletter"]).optional(),
});

export const bookingSchema = z.object({
  firstName: singleLine(60).min(1, "First name is required"),
  lastName: singleLine(60).optional().or(z.literal("")),
  email: emailField,
  phone: singleLine(40).optional().or(z.literal("")),
  notes: z.string().trim().max(5000).optional().or(z.literal("")),
  service: singleLine(100).optional().or(z.literal("")),
  serviceId: singleLine(60).optional().or(z.literal("")),

  // Appointment slot. Kept as strings so no timezone conversion happens
  // before we know which zone to interpret them in.
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date")
    .refine((v) => !Number.isNaN(Date.parse(v)), "That date isn't valid"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Please choose a time"),

  calendar: z.enum(["google", "outlook", "apple", "none"]).optional(),

  /**
   * Answers to whatever extra questions are configured in
   * src/config/booking-form.ts. Capped in both count and size so a new
   * field can't be used to push an unbounded payload through.
   */
  // Zod 4 requires the key schema as well as the value schema
  details: z
    .record(singleLine(60), z.string().trim().max(2000))
    .refine((d) => Object.keys(d).length <= 25, "Too many fields")
    .optional(),
});

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      })
    )
    .min(1)
    .max(30),
});

/** Escape user text before putting it into the HTML emails we send. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Turns a Zod error into a short, user-facing message. */
export function firstIssue(error: z.ZodError): string {
  const issue = error.issues[0];
  return issue ? `${issue.path.join(".") || "input"}: ${issue.message}` : "Invalid input";
}
