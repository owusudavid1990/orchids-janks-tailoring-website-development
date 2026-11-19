import { NextRequest } from "next/server";

/**
 * Simple in-memory rate limiter.
 *
 * Keeps a sliding window of request timestamps per client IP. This runs per
 * server instance, so on serverless hosting a determined attacker spread across
 * many instances could exceed the limit. It still stops the common cases:
 * a script hammering the contact form, or someone repeatedly submitting a form.
 * For stronger guarantees, swap the Map for a shared store (e.g. Upstash Redis).
 */
const hits = new Map<string, number[]>();

// Stop the Map growing forever on a long-running server
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, times] of hits.entries()) {
    const recent = times.filter((t) => now - t < windowMs);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
}

/** Best-effort client IP. Vercel sets x-forwarded-for. */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * @param key      unique per route + client (e.g. `contact:1.2.3.4`)
 * @param limit    max requests allowed inside the window
 * @param windowMs length of the window in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanup(windowMs);

  const times = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (times.length >= limit) {
    const oldest = Math.min(...times);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  times.push(now);
  hits.set(key, times);
  return { allowed: true, remaining: limit - times.length, retryAfterSeconds: 0 };
}

/** Standard 429 response with a Retry-After header. */
export function tooManyRequests(retryAfterSeconds: number) {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again shortly." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}
