import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getClient, getCurrentProfile } from "@/lib/crm-store";
import { buildClientWorkbook } from "@/lib/crm-export";
import { normaliseProfile } from "@/lib/profile-data";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;
  const { id } = await params;

  const client = await getClient(id).catch(() => null);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const version = await getCurrentProfile(id).catch(() => null);
  const profile = normaliseProfile(version?.data);

  const buffer = await buildClientWorkbook(client, profile, version?.created_at ?? client.updated_at);

  const safeName = `${client.first_name}-${client.last_name ?? ""}`
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="janks-${safeName || "client"}-order.xlsx"`,
    },
  });
}
