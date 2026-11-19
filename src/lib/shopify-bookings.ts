/**
 * Records a booking in Shopify as a **draft order**.
 *
 * Why a draft order rather than a customer note or a real order:
 *
 *   • A real order would enter your sales figures and inventory for an
 *     appointment nobody has paid for — it would corrupt your reporting.
 *   • A customer note is a single free-text blob. You can't sort it, filter
 *     it, or see it in a list.
 *   • A draft order appears under Orders → Drafts as its own row with the
 *     date, the customer and the service. Every booking detail is stored as
 *     a structured attribute you can read at a glance. If the customer later
 *     goes ahead, you can add the real garment and take payment against the
 *     same record.
 */

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = "2024-01";

export interface BookingRecord {
  reference: string;
  service: string;
  date: string;
  time: string;
  whenLabel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Everything from the configurable fields, already labelled */
  extras: Array<{ label: string; value: string }>;
}

export async function createShopifyBookingDraft(
  booking: BookingRecord
): Promise<{ ok: boolean; draftOrderId?: number; adminUrl?: string; error?: string }> {
  if (!SHOPIFY_STORE || !SHOPIFY_ADMIN_TOKEN) {
    return { ok: false, error: "Shopify credentials not configured" };
  }

  try {
    const noteAttributes = [
      { name: "Booking reference", value: booking.reference },
      { name: "Service", value: booking.service },
      { name: "Appointment", value: booking.whenLabel },
      { name: "Phone", value: booking.phone || "—" },
      ...booking.extras
        .filter((e) => e.value)
        .map((e) => ({ name: e.label, value: e.value })),
    ];

    const payload = {
      draft_order: {
        // £0.00 — this is an appointment, not a sale. Adding a priced item
        // here would show as unpaid revenue on your dashboard.
        line_items: [
          {
            title: `${booking.service} — Fitting Appointment`,
            price: "0.00",
            quantity: 1,
            requires_shipping: false,
            taxable: false,
          },
        ],
        customer: undefined as unknown, // set below only when we have an email
        email: booking.email,
        note: [
          `Booking ${booking.reference}`,
          `${booking.service} — ${booking.whenLabel}`,
          booking.extras
            .filter((e) => e.value)
            .map((e) => `${e.label}: ${e.value}`)
            .join("\n"),
        ]
          .filter(Boolean)
          .join("\n\n"),
        note_attributes: noteAttributes,
        tags: "booking, website, unconfirmed",
        use_customer_default_address: false,
      },
    };
    delete (payload.draft_order as Record<string, unknown>).customer;

    const res = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/draft_orders.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Shopify draft order ${res.status}: ${text}`);
    }

    const data = await res.json();
    const id = data?.draft_order?.id;
    const storeHandle = SHOPIFY_STORE.replace(".myshopify.com", "");

    console.log(`[shopify-bookings] Created draft order ${id} for ${booking.reference}`);
    return {
      ok: true,
      draftOrderId: id,
      adminUrl: `https://admin.shopify.com/store/${storeHandle}/draft_orders/${id}`,
    };
  } catch (err) {
    // Never fail the booking because Shopify was unreachable — the customer
    // has still booked, and the email record still reaches you.
    const error = String(err);
    console.error("[shopify-bookings] Draft order failed (non-fatal):", error);
    return { ok: false, error };
  }
}
