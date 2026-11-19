import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listClientsWithCurrentProfiles, isSetupError } from "@/lib/crm-store";
import { buildClientsListWorkbook, type ClientListRow } from "@/lib/crm-export";
import { normaliseProfile } from "@/lib/profile-data";

// Sibling to /api/admin/crm/clients/[id] — Next.js matches this static
// "export" segment before falling through to the dynamic [id] route, so the
// two coexist safely (the same way /users/me sits beside /users/[id]).
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;

  try {
    const entries = await listClientsWithCurrentProfiles();

    const rows: ClientListRow[] = entries.map(({ client, profile }) => {
      const data = normaliseProfile(profile?.data);
      return {
        client,
        profileUpdatedAt: profile?.created_at ?? null,
        jacketFields: Object.keys(data.jacket.style).length + Object.keys(data.jacket.measurements).length,
        trousersFields: Object.keys(data.trousers.style).length + Object.keys(data.trousers.measurements).length,
        vestFields: Object.keys(data.vest.style).length + Object.keys(data.vest.measurements).length,
      };
    });

    const buffer = await buildClientsListWorkbook(rows);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="janks-clients-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    });
  } catch (err) {
    const message = String(err);
    return NextResponse.json(
      {
        error: isSetupError(message)
          ? "The client tables haven't been created yet. Run docs/crm-clients-table.sql in your Supabase SQL editor."
          : message,
      },
      { status: 500 }
    );
  }
}
