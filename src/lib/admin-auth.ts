import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Guards the admin booking endpoints.
 *
 * Bookings hold customer names, emails and phone numbers, so these routes
 * need real authentication — not a shared password in the URL, and not a
 * check that only runs in the browser (anyone can skip that by calling the
 * API directly).
 *
 * Two things must both hold:
 *   1. A valid Supabase session token, verified server-side against Supabase.
 *   2. That user's email listed in the ADMIN_EMAILS environment variable.
 *
 * Set ADMIN_EMAILS in Vercel, comma-separated:
 *   ADMIN_EMAILS=jankstailoring@gmail.com
 *
 * With the variable unset, every request is refused. That's deliberate: a
 * misconfiguration should lock the door, not leave it open.
 */

export interface AdminCheck {
  ok: boolean;
  email?: string;
  response?: NextResponse;
}

export async function requireAdmin(req: NextRequest): Promise<AdminCheck> {
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length === 0) {
    console.error("[admin-auth] ADMIN_EMAILS is not set — refusing all admin access");
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin access is not configured" }, { status: 503 }),
    };
  }

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  const email = data?.user?.email?.toLowerCase();

  if (error || !email) {
    return { ok: false, response: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }

  if (!allowed.includes(email)) {
    console.warn(`[admin-auth] Refused admin access for ${email}`);
    return { ok: false, response: NextResponse.json({ error: "Not authorised" }, { status: 403 }) };
  }

  return { ok: true, email };
}
