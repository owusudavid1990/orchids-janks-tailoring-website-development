"use client";

import { createClient } from "@/lib/supabase";

/**
 * Fetch wrapper for admin API routes — attaches the signed-in user's
 * Supabase session token as a Bearer header, which is what requireAdmin()
 * checks server-side. Throws "NOT_SIGNED_IN" if there's no session, so
 * callers can show the same "please sign in" message the bookings page uses.
 */
export async function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("NOT_SIGNED_IN");
  return fetch(url, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
  });
}
