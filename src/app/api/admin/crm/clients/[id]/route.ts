import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getClient,
  updateClient,
  archiveClient,
  getCurrentProfile,
  listProfileHistory,
  listPhotos,
  signPhotoUrls,
} from "@/lib/crm-store";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;
  const { id } = await params;

  try {
    const client = await getClient(id);
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const [profile, history, photos] = await Promise.all([
      getCurrentProfile(id),
      listProfileHistory(id),
      listPhotos(id),
    ]);
    const photosWithUrls = await signPhotoUrls(photos);

    return NextResponse.json({ client, profile, history, photos: photosWithUrls });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof body.first_name === "string" && body.first_name.trim()) patch.first_name = body.first_name.trim();
  if ("last_name" in body) patch.last_name = typeof body.last_name === "string" ? body.last_name.trim() : null;
  if ("email" in body) patch.email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
  if ("phone" in body) patch.phone = typeof body.phone === "string" ? body.phone.trim() : null;
  if ("height_cm" in body) patch.height_cm = typeof body.height_cm === "number" ? body.height_cm : null;
  if ("weight_kg" in body) patch.weight_kg = typeof body.weight_kg === "number" ? body.weight_kg : null;
  if ("notes" in body) patch.notes = typeof body.notes === "string" ? body.notes.trim() : null;

  try {
    const client = await updateClient(id, patch);
    return NextResponse.json({ client });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;
  const { id } = await params;

  try {
    await archiveClient(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
