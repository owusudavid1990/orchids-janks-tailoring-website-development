import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getClient, saveProfileVersion } from "@/lib/crm-store";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;
  const { id } = await params;

  const client = await getClient(id).catch(() => null);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.data !== "object" || body.data === null) {
    return NextResponse.json({ error: "Missing profile data" }, { status: 400 });
  }

  const label = typeof body.label === "string" && body.label.trim() ? body.label.trim() : undefined;

  try {
    const version = await saveProfileVersion(id, body.data, auth.email!, label);
    return NextResponse.json({ version });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
