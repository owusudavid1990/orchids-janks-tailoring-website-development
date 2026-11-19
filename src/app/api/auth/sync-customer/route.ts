import { NextRequest, NextResponse } from "next/server";
import { upsertShopifyCustomer } from "@/lib/shopify-customers";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: "No email" }, { status: 400 });

    const [firstName, ...rest] = (name ?? "").split(" ");
    const result = await upsertShopifyCustomer({
      email,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
      tags: "website-member",
      acceptsMarketing: false,
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
