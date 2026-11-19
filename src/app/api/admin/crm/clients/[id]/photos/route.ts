import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getClient, uploadPhoto, deletePhoto } from "@/lib/crm-store";

interface Params {
  params: Promise<{ id: string }>;
}

// Photos arrive as a data URL (the browser resizes the image on a canvas
// before sending, so this stays small — see the CameraCapture component).
// Capped well under Vercel's request body limit for serverless functions.
const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;
  const { id } = await params;

  const client = await getClient(id).catch(() => null);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const dataUrl = typeof body?.dataUrl === "string" ? body.dataUrl : "";
  const caption = typeof body?.caption === "string" ? body.caption.trim() : undefined;

  const match = dataUrl.match(/^data:(image\/(png|jpe?g|webp));base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Expected a PNG, JPEG or WEBP image" }, { status: 400 });
  }

  const [, mimeType, subtype, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large" }, { status: 413 });
  }

  const extension = subtype === "jpeg" ? "jpg" : subtype;

  try {
    const photo = await uploadPhoto(id, buffer, mimeType, extension, caption);
    return NextResponse.json({ photo });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response!;
  const { id } = await params;

  const photoId = req.nextUrl.searchParams.get("photoId");
  if (!photoId) return NextResponse.json({ error: "Missing photoId" }, { status: 400 });

  try {
    await deletePhoto(id, photoId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
