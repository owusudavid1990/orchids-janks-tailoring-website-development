/**
 * Server-side storage for client measurement & style profiles.
 *
 * The SQL to create these tables is in docs/crm-clients-table.sql. Every
 * function here fails loudly rather than quietly — unlike a booking, a
 * profile save has nothing else backing it up, so a silent failure would
 * mean a client's measurements are simply gone.
 */

import { supabaseAdmin } from "@/lib/supabase-admin";

export interface ClientRecord {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  notes: string | null;
  archived: boolean;
}

export interface NewClientInput {
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  height_cm?: number;
  weight_kg?: number;
  notes?: string;
}

export interface ProfileVersion {
  id: string;
  client_id: string;
  created_at: string;
  created_by: string | null;
  label: string | null;
  data: Record<string, unknown>;
  is_current: boolean;
}

export interface ClientPhoto {
  id: string;
  client_id: string;
  created_at: string;
  storage_path: string;
  caption: string | null;
}

const MISSING_TABLE_RE = /relation .* does not exist|schema cache/i;

/** True when the error is "table doesn't exist yet" — a setup step, not a bug. */
export function isSetupError(error: string): boolean {
  return MISSING_TABLE_RE.test(error);
}

// ── Clients ──────────────────────────────────────────────────────────────

export async function listClients(search?: string): Promise<ClientRecord[]> {
  let query = supabaseAdmin
    .from("crm_clients")
    .select("*")
    .eq("archived", false)
    .order("updated_at", { ascending: false })
    .limit(500);

  if (search?.trim()) {
    const term = search.trim().replace(/[%_]/g, "\\$&");
    query = query.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as ClientRecord[];
}

/**
 * Every active client with their current profile's data, in two queries
 * rather than one-per-client — used by the "export all clients" workbook.
 */
export async function listClientsWithCurrentProfiles(): Promise<
  { client: ClientRecord; profile: ProfileVersion | null }[]
> {
  const clients = await listClients();
  if (clients.length === 0) return [];

  const { data: profiles, error } = await supabaseAdmin
    .from("crm_profile_versions")
    .select("*")
    .in("client_id", clients.map((c) => c.id))
    .eq("is_current", true);
  if (error) throw new Error(error.message);

  const byClientId = new Map((profiles ?? []).map((p) => [p.client_id, p as ProfileVersion]));
  return clients.map((client) => ({ client, profile: byClientId.get(client.id) ?? null }));
}

export async function getClient(id: string): Promise<ClientRecord | null> {
  const { data, error } = await supabaseAdmin
    .from("crm_clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ClientRecord) ?? null;
}

export async function createClient(input: NewClientInput): Promise<ClientRecord> {
  const { data, error } = await supabaseAdmin
    .from("crm_clients")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ClientRecord;
}

export async function updateClient(
  id: string,
  patch: Partial<NewClientInput>
): Promise<ClientRecord> {
  const { data, error } = await supabaseAdmin
    .from("crm_clients")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ClientRecord;
}

export async function archiveClient(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("crm_clients")
    .update({ archived: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Profile versions ─────────────────────────────────────────────────────

export async function getCurrentProfile(clientId: string): Promise<ProfileVersion | null> {
  const { data, error } = await supabaseAdmin
    .from("crm_profile_versions")
    .select("*")
    .eq("client_id", clientId)
    .eq("is_current", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ProfileVersion) ?? null;
}

export async function listProfileHistory(clientId: string): Promise<ProfileVersion[]> {
  const { data, error } = await supabaseAdmin
    .from("crm_profile_versions")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ProfileVersion[];
}

/**
 * Saves a new profile version and makes it current. The previous current
 * version is kept — never deleted, never edited in place — so there is
 * always a record of what a profile looked like at an earlier appointment.
 */
export async function saveProfileVersion(
  clientId: string,
  data: Record<string, unknown>,
  createdBy: string,
  label?: string
): Promise<ProfileVersion> {
  // Two steps rather than a database trigger, so the SQL file stays plain
  // and readable for a non-technical owner. The unique index on
  // (client_id) WHERE is_current still guarantees only one can ever stick.
  const { error: clearError } = await supabaseAdmin
    .from("crm_profile_versions")
    .update({ is_current: false })
    .eq("client_id", clientId)
    .eq("is_current", true);
  if (clearError) throw new Error(clearError.message);

  const { data: inserted, error } = await supabaseAdmin
    .from("crm_profile_versions")
    .insert({ client_id: clientId, data, created_by: createdBy, label: label ?? null, is_current: true })
    .select()
    .single();
  if (error) throw new Error(error.message);

  await supabaseAdmin.from("crm_clients").update({ updated_at: new Date().toISOString() }).eq("id", clientId);

  return inserted as ProfileVersion;
}

// ── Photos ───────────────────────────────────────────────────────────────

const PHOTO_BUCKET = "client-photos";

export async function listPhotos(clientId: string): Promise<ClientPhoto[]> {
  const { data, error } = await supabaseAdmin
    .from("crm_client_photos")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ClientPhoto[];
}

/** Signed links expire — nothing about a client's photos is ever a permanent public URL. */
export async function signPhotoUrls(photos: ClientPhoto[]): Promise<(ClientPhoto & { url: string | null })[]> {
  return Promise.all(
    photos.map(async (p) => {
      const { data } = await supabaseAdmin.storage
        .from(PHOTO_BUCKET)
        .createSignedUrl(p.storage_path, 60 * 60); // 1 hour
      return { ...p, url: data?.signedUrl ?? null };
    })
  );
}

export async function uploadPhoto(
  clientId: string,
  fileBuffer: Buffer,
  contentType: string,
  extension: string,
  caption?: string
): Promise<ClientPhoto> {
  const path = `${clientId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(PHOTO_BUCKET)
    .upload(path, fileBuffer, { contentType, upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const { data, error } = await supabaseAdmin
    .from("crm_client_photos")
    .insert({ client_id: clientId, storage_path: path, caption: caption ?? null })
    .select()
    .single();
  if (error) {
    // Roll back the upload so an orphaned file isn't left behind
    await supabaseAdmin.storage.from(PHOTO_BUCKET).remove([path]);
    throw new Error(error.message);
  }
  return data as ClientPhoto;
}

export async function deletePhoto(clientId: string, photoId: string): Promise<void> {
  const { data: photo, error: fetchError } = await supabaseAdmin
    .from("crm_client_photos")
    .select("storage_path")
    .eq("id", photoId)
    .eq("client_id", clientId)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);
  if (!photo) return;

  await supabaseAdmin.storage.from(PHOTO_BUCKET).remove([photo.storage_path]);
  const { error } = await supabaseAdmin.from("crm_client_photos").delete().eq("id", photoId);
  if (error) throw new Error(error.message);
}
