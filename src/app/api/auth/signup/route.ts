import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { upsertShopifyCustomer } from "@/lib/shopify-customers";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { emailField } from "@/lib/validation";

// Max 5 new accounts per IP per hour (stops bulk account creation)
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`signup:${getClientIp(req)}`, LIMIT, WINDOW_MS);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!emailField.safeParse(email).success) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Create the user server-side using the Admin API — bypasses browser CORS/CSP
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: name ?? "" },
      email_confirm: true, // skip email confirmation — admin-created accounts are auto-confirmed
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Fire-and-forget Shopify customer sync — runs in background, never blocks response
    if (data?.user) {
      const [firstName, ...rest] = (name ?? "").split(" ");
      upsertShopifyCustomer({
        email,
        firstName: firstName || undefined,
        lastName: rest.join(" ") || undefined,
        tags: "website-member",
        acceptsMarketing: false,
      }).catch(() => {});
    }

    // Sign the new user in immediately and return session tokens so the browser can
    // establish a session in one round-trip (avoids a second /api/auth/signin call)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });

    return NextResponse.json({
      success: true,
      access_token: signInData.session?.access_token ?? null,
      refresh_token: signInData.session?.refresh_token ?? null,
    });
  } catch (err) {
    console.error("[api/auth/signup] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
