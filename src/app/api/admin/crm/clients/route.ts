import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listClients, createClient, isSetupError } from "@/lib/crm-store";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;

  const search = req.nextUrl.searchParams.get("q") ?? undefined;

  try {
    const clients = await listClients(search);
    return NextResponse.json({ clients });
  } catch (err) {
    const message = String(err);
    return NextResponse.json({
      clients: [],
      error: isSetupError(message)
        ? "The client tables haven't been created yet. Run docs/crm-clients-table.sql in your Supabase SQL editor."
        : message,
    });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;

  const body = await req.json().catch(() => null);
  const firstName = typeof body?.first_name === "string" ? body.first_name.trim() : "";
  if (!firstName) {
    return NextResponse.json({ error: "First name is required" }, { status: 400 });
  }

  try {
    const client = await createClient({
      first_name: firstName,
      last_name: typeof body.last_name === "string" ? body.last_name.trim() : undefined,
      email: typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined,
      phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
      height_cm: typeof body.height_cm === "number" ? body.height_cm : undefined,
      weight_kg: typeof body.weight_kg === "number" ? body.weight_kg : undefined,
      notes: typeof body.notes === "string" ? body.notes.trim() : undefined,
    });
    return NextResponse.json({ client });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
