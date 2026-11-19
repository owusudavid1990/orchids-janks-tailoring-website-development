const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = "2024-01";

interface UpsertParams {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  tags?: string;
  note?: string;
  acceptsMarketing?: boolean;
}

interface ShopifyCustomer {
  id: number;
  tags: string;
  note: string | null;
  accepts_marketing: boolean;
}

async function shopifyAdminFetch(path: string, options: RequestInit) {
  const res = await fetch(
    `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN ?? "",
        ...(options.headers ?? {}),
      },
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Shopify Admin API ${res.status}: ${text}`);
  }
  return res.json();
}

export async function upsertShopifyCustomer(params: UpsertParams): Promise<{ ok: boolean; error?: string }> {
  if (!SHOPIFY_STORE || !SHOPIFY_ADMIN_TOKEN) {
    const msg = "[shopify-customers] Missing SHOPIFY_ADMIN_TOKEN or store domain — skipping sync";
    console.warn(msg);
    return { ok: false, error: msg };
  }

  try {
    // Search for existing customer by email
    const searchResult = await shopifyAdminFetch(
      `/customers/search.json?query=email:${encodeURIComponent(params.email)}&limit=1`,
      { method: "GET" }
    );

    const existing: ShopifyCustomer | undefined = searchResult?.customers?.[0];

    if (existing) {
      // Merge tags — avoid duplicates
      const existingTags = existing.tags
        ? existing.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
      const newTags = params.tags
        ? params.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
      const mergedTags = Array.from(new Set([...existingTags, ...newTags])).join(", ");

      // Append note if provided
      const existingNote = existing.note ?? "";
      const noteToAppend = params.note ?? "";
      let mergedNote = existingNote;
      if (noteToAppend && !existingNote.includes(noteToAppend)) {
        mergedNote = existingNote ? `${existingNote}\n${noteToAppend}` : noteToAppend;
      }

      const updatePayload: Record<string, unknown> = { tags: mergedTags };
      if (mergedNote !== existingNote) updatePayload.note = mergedNote;
      if (params.acceptsMarketing && !existing.accepts_marketing) {
        updatePayload.accepts_marketing = true;
      }

      await shopifyAdminFetch(`/customers/${existing.id}.json`, {
        method: "PUT",
        body: JSON.stringify({ customer: updatePayload }),
      });

      console.log(`[shopify-customers] Updated customer ${existing.id} (${params.email})`);
      return { ok: true };
    } else {
      // Create new customer
      const customerPayload: Record<string, unknown> = {
        email: params.email,
        tags: params.tags ?? "",
        accepts_marketing: params.acceptsMarketing ?? false,
      };
      if (params.firstName) customerPayload.first_name = params.firstName;
      if (params.lastName) customerPayload.last_name = params.lastName;
      // Only include phone if it's in E.164 format (+countrycode...) — Shopify rejects other formats
      if (params.phone && params.phone.startsWith("+")) customerPayload.phone = params.phone;
      if (params.note) customerPayload.note = params.note;

      const createResult = await shopifyAdminFetch("/customers.json", {
        method: "POST",
        body: JSON.stringify({ customer: customerPayload }),
      });

      console.log(`[shopify-customers] Created customer ${createResult?.customer?.id} (${params.email})`);
      return { ok: true };
    }
  } catch (err) {
    const error = String(err);
    console.error("[shopify-customers] Sync failed (non-fatal):", error);
    return { ok: false, error };
  }
}
