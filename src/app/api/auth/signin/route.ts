import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

// Max 10 sign-in attempts per IP per 15 minutes (slows password guessing)
const LIMIT = 10;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`signin:${getClientIp(req)}`, LIMIT, WINDOW_MS);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Use regular (anon key) client — admin client has persistSession:false so data.session is null
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        user_metadata: data.user?.user_metadata,
      },
    });
  } catch (err) {
    console.error("[api/auth/signin] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
