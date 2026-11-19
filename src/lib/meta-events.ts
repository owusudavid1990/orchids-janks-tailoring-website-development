/**
 * Meta Pixel event helpers.
 *
 * The pixel itself is loaded in src/components/MetaPixel.tsx and tracks
 * PageView automatically. These are the events that tell Meta something
 * valuable happened, so its ad delivery can be optimised toward the people
 * who do them rather than toward whoever clicks most.
 *
 * Every call is a no-op if the pixel hasn't loaded (ad blocker, script
 * failure) — never let analytics break a form submission.
 */

function track(event: string, params?: Record<string, unknown>) {
  try {
    window.fbq?.("track", event, params);
  } catch {
    // Analytics must never interrupt the user
  }
}

/** A fitting/consultation booking was submitted successfully. */
export function trackLead(serviceName?: string) {
  track("Lead", {
    content_name: serviceName ?? "Fitting booking",
    content_category: "Bespoke tailoring",
  });
}

/** The contact form was submitted successfully. */
export function trackContact() {
  track("Contact", { content_name: "Contact form" });
}

/** Someone reached the booking form and started filling it in. */
export function trackInitiateBooking(serviceName?: string) {
  track("InitiateCheckout", {
    content_name: serviceName ?? "Fitting booking",
    content_category: "Bespoke tailoring",
  });
}
