"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { StylePicker } from "@/components/admin/StylePicker";
import { MeasurementTable } from "@/components/admin/MeasurementTable";
import { PhotoUploader, type ProfilePhoto } from "@/components/admin/PhotoUploader";
import { adminFetch } from "@/lib/admin-fetch";
import { GARMENTS, BODY_SHAPE_PARTS, EMBROIDERY_POSITIONS, type GarmentId } from "@/config/measurement-profile";
import { emptyProfile, normaliseProfile, type ProfileData } from "@/lib/profile-data";
import { ArrowLeft, Save, History, RotateCcw, FileSpreadsheet, Loader2 } from "lucide-react";

interface ClientRecord {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  notes: string | null;
}
interface ProfileVersion {
  id: string;
  created_at: string;
  created_by: string | null;
  label: string | null;
  data: Partial<ProfileData>;
  is_current: boolean;
}

type TabId = "overview" | GarmentId | "bodyShape" | "photos" | "history";
const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "jacket", label: "Jacket" },
  { id: "trousers", label: "Trousers" },
  { id: "vest", label: "Vest" },
  { id: "bodyShape", label: "Body Shape" },
  { id: "photos", label: "Photos" },
  { id: "history", label: "History" },
];

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.id as string;

  const [client, setClient] = useState<ClientRecord | null>(null);
  const [history, setHistory] = useState<ProfileVersion[]>([]);
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [profile, setProfile] = useState<ProfileData>(emptyProfile());
  const [savedProfile, setSavedProfile] = useState<ProfileData>(emptyProfile());
  const [tab, setTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveLabel, setSaveLabel] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await adminFetch(`/api/admin/crm/clients/${clientId}`);
      const json = await res.json().catch(() => ({}));

      if (res.status === 401) { setMessage("Please sign in with your JANKS account."); setLoading(false); return; }
      if (res.status === 403) { setMessage("This account doesn't have admin access."); setLoading(false); return; }
      if (res.status === 404) { setMessage("Client not found."); setLoading(false); return; }
      if (json.error) setMessage(json.error);

      setClient(json.client ?? null);
      setHistory(json.history ?? []);
      setPhotos(json.photos ?? []);

      const loaded = normaliseProfile(json.profile?.data);
      setProfile(loaded);
      setSavedProfile(loaded);
    } catch (err) {
      setMessage(String(err).includes("NOT_SIGNED_IN") ? "Please sign in with your JANKS account." : "Couldn't load this client.");
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(savedProfile), [profile, savedProfile]);

  const setGarmentStyle = (garment: GarmentId, categoryId: string, code: string) => {
    setProfile((p) => ({
      ...p,
      [garment]: { ...p[garment], style: { ...p[garment].style, [categoryId]: code } },
    }));
  };

  const setGarmentMeasurement = (garment: GarmentId, pointId: string, field: "body" | "finished", value: number | undefined) => {
    setProfile((p) => ({
      ...p,
      [garment]: {
        ...p[garment],
        measurements: { ...p[garment].measurements, [pointId]: { ...p[garment].measurements[pointId], [field]: value } },
      },
    }));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await adminFetch(`/api/admin/crm/clients/${clientId}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: profile, label: saveLabel.trim() || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.error) {
        setMessage(json.error || "Couldn't save.");
        return;
      }
      setSavedProfile(profile);
      setSaveLabel("");
      setMessage("Saved.");
      load();
    } catch {
      setMessage("Couldn't save — check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const restoreVersion = (version: ProfileVersion) => {
    setProfile(normaliseProfile(version.data));
    setSaveLabel(`Restored from ${new Date(version.created_at).toLocaleDateString("en-GB")}`);
    setTab("overview");
  };

  const uploadPhoto = async (dataUrl: string, caption: string) => {
    const res = await adminFetch(`/api/admin/crm/clients/${clientId}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl, caption }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.error) throw new Error(json.error || "Upload failed");
    load();
  };

  const deletePhotoById = async (photoId: string) => {
    setPhotos((p) => p.filter((x) => x.id !== photoId));
    await adminFetch(`/api/admin/crm/clients/${clientId}/photos?photoId=${photoId}`, { method: "DELETE" }).catch(() => {});
  };

  const [exporting, setExporting] = useState(false);
  const exportToExcel = async () => {
    setExporting(true);
    setMessage("");
    try {
      const res = await adminFetch(`/api/admin/crm/clients/${clientId}/export`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setMessage(json.error || "Couldn't export this profile.");
        return;
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const filenameMatch = disposition.match(/filename="([^"]+)"/);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filenameMatch?.[1] ?? "janks-client-order.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage("Couldn't export — check your connection.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="pt-40 text-center text-white/40 text-sm">Loading…</div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-6 pt-40 text-center">
          <p className="text-white/60 mb-6">{message || "Client not found."}</p>
          <Link href="/admin/clients" className="text-gold text-sm inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back to clients
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-32">
      <Navigation />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-32">
        <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-[11px] tracking-[0.1em] uppercase mb-6 transition-colors">
          <ArrowLeft size={12} /> All Clients
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-2">Client Profile</span>
            <h1 className="font-cinzel text-3xl lg:text-4xl">
              {client.first_name} {client.last_name}
            </h1>
            <p className="text-white/40 text-sm mt-1">{[client.email, client.phone].filter(Boolean).join("  ·  ")}</p>
          </div>
          <button
            onClick={exportToExcel}
            disabled={exporting}
            className="flex items-center gap-2 border border-white/20 hover:border-gold text-white/70 hover:text-gold px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-colors disabled:opacity-40 shrink-0"
          >
            {exporting ? <Loader2 size={13} className="animate-spin" /> : <FileSpreadsheet size={13} />}
            {exporting ? "Exporting…" : "Export to Excel"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-white/10 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-4 py-3 text-[11px] tracking-[0.15em] uppercase border-b-2 -mb-px transition-colors ${
                tab === t.id ? "border-gold text-white" : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {t.label}
              {t.id === "history" && history.length > 0 && (
                <span className="ml-1.5 text-white/30">({history.length})</span>
              )}
            </button>
          ))}
        </div>

        {message && (
          <p className="border border-yellow-500/30 bg-yellow-500/5 text-yellow-300 px-5 py-3 text-sm mb-6">{message}</p>
        )}

        {/* ── Overview ── */}
        {tab === "overview" && (
          <OverviewTab client={client} onSaved={setClient} clientId={clientId} profile={profile} setProfile={setProfile} />
        )}

        {/* ── Garment tabs ──
             Measurements sit in a narrow column that stays in view while
             scrolling — a constant reference during a fitting, rather than
             something you scroll past once and lose. Style choices, being
             the longer list, get the wider column. */}
        {GARMENTS.map(
          (g) =>
            tab === g.id && (
              <div key={g.id} className="lg:flex lg:items-start lg:gap-10">
                <div className="lg:w-[320px] lg:shrink-0 lg:sticky lg:top-24 mb-8 lg:mb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-cinzel text-lg">Measurements</h2>
                    <div className="flex border border-white/15 shrink-0">
                      {(["cm", "in"] as const).map((u) => (
                        <button
                          key={u}
                          onClick={() => setProfile((p) => ({ ...p, unit: u }))}
                          className={`px-3 py-1.5 text-[11px] uppercase transition-colors ${
                            profile.unit === u ? "bg-gold text-black" : "text-white/50 hover:text-white"
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <MeasurementTable
                    points={g.measurements}
                    values={profile[g.id].measurements}
                    unit={profile.unit}
                    onChange={(pointId, field, value) => setGarmentMeasurement(g.id, pointId, field, value)}
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-8">
                  <div>
                    <h2 className="font-cinzel text-lg mb-4">Style</h2>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                      {g.categories.map((cat) => (
                        <StylePicker
                          key={cat.id}
                          category={cat}
                          selected={profile[g.id].style[cat.id]}
                          onChange={(code) => setGarmentStyle(g.id, cat.id, code)}
                          contextLabel={g.label}
                          photos={photos}
                          onUploadReference={uploadPhoto}
                        />
                      ))}
                    </div>
                  </div>

                  {g.id === "jacket" && (
                    <div>
                      <h2 className="font-cinzel text-lg mb-4">Monogram / Embroidery</h2>
                      <label className="flex items-center gap-2.5 mb-4 cursor-pointer w-fit">
                        <input
                          type="checkbox"
                          checked={profile.embroidery.enabled}
                          onChange={(e) => setProfile((p) => ({ ...p, embroidery: { ...p.embroidery, enabled: e.target.checked } }))}
                          className="w-4 h-4 accent-[#C9A962]"
                        />
                        <span className="text-sm text-white/70">Add monogram or embroidery (extra charge)</span>
                      </label>
                      {profile.embroidery.enabled && (
                        <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
                          <input
                            placeholder="Words / initials"
                            value={profile.embroidery.words}
                            onChange={(e) => setProfile((p) => ({ ...p, embroidery: { ...p.embroidery, words: e.target.value } }))}
                            className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold"
                          />
                          <select
                            value={profile.embroidery.position}
                            onChange={(e) => setProfile((p) => ({ ...p, embroidery: { ...p.embroidery, position: e.target.value } }))}
                            className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm focus:outline-none focus:border-gold [&>option]:bg-black"
                          >
                            <option value="">Position…</option>
                            {EMBROIDERY_POSITIONS.map((pos) => (
                              <option key={pos} value={pos}>{pos}</option>
                            ))}
                          </select>
                          <input
                            placeholder="Colour"
                            value={profile.embroidery.color}
                            onChange={(e) => setProfile((p) => ({ ...p, embroidery: { ...p.embroidery, color: e.target.value } }))}
                            className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold"
                          />
                          <input
                            placeholder="Font"
                            value={profile.embroidery.font}
                            onChange={(e) => setProfile((p) => ({ ...p, embroidery: { ...p.embroidery, font: e.target.value } }))}
                            className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
        )}

        {/* ── Body Shape ── */}
        {tab === "bodyShape" && (
          <div>
            <p className="text-white/50 text-sm mb-6 max-w-2xl">
              Pick the option nearest to what you see at the fitting. Leave a part on "Unsure" or untouched if nothing stands out —
              anything unusual can go in Special Requirements below.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {BODY_SHAPE_PARTS.map((part) => (
                <StylePicker
                  key={part.id}
                  category={part}
                  selected={profile.bodyShape[part.id]}
                  onChange={(code) => setProfile((p) => ({ ...p, bodyShape: { ...p.bodyShape, [part.id]: code } }))}
                />
              ))}
            </div>
            <div className="mt-10">
              <label className="block text-[11px] tracking-[0.1em] uppercase text-white/40 mb-1.5">Special Requirements</label>
              <textarea
                value={profile.specialRequirements}
                onChange={(e) => setProfile((p) => ({ ...p, specialRequirements: e.target.value }))}
                rows={4}
                className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold resize-none"
              />
            </div>
          </div>
        )}

        {/* ── Photos ── */}
        {tab === "photos" && (
          <div>
            <p className="text-white/50 text-sm mb-6">
              Fitting photos, body-shape references, or a picture of a style the client has pointed to.
            </p>
            <PhotoUploader photos={photos} onUpload={uploadPhoto} onDelete={deletePhotoById} />
          </div>
        )}

        {/* ── History ── */}
        {tab === "history" && (
          <div>
            {history.length === 0 ? (
              <p className="text-white/40 text-sm">No saved versions yet.</p>
            ) : (
              <div className="divide-y divide-white/8 border-t border-white/8">
                {history.map((v) => (
                  <div key={v.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3">
                      <History size={14} className="text-white/25 shrink-0" />
                      <div>
                        <p className="text-sm text-white/85">
                          {v.label || "Untitled save"}
                          {v.is_current && (
                            <span className="ml-2 text-[10px] tracking-[0.1em] uppercase text-gold border border-gold/40 px-1.5 py-0.5">Current</span>
                          )}
                        </p>
                        <p className="text-white/35 text-xs mt-0.5">
                          {new Date(v.created_at).toLocaleString("en-GB")} {v.created_by ? `· ${v.created_by}` : ""}
                        </p>
                      </div>
                    </div>
                    {!v.is_current && (
                      <button
                        onClick={() => restoreVersion(v)}
                        className="flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase text-white/50 hover:text-gold border border-white/15 hover:border-gold/50 px-3 py-1.5 transition-colors shrink-0"
                      >
                        <RotateCcw size={11} /> Load into editor
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Sticky save bar */}
      {tab !== "photos" && tab !== "history" && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-white/10 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-wrap items-center gap-3">
            <input
              value={saveLabel}
              onChange={(e) => setSaveLabel(e.target.value)}
              placeholder='Optional note for this save, e.g. "Updated for wedding order"'
              className="flex-1 min-w-[220px] bg-white/5 border border-white/15 px-3 py-2 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold"
            />
            <button
              onClick={save}
              disabled={!dirty || saving}
              className={`flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-colors ${
                dirty && !saving ? "bg-gold text-black hover:bg-gold/80" : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              <Save size={13} /> {saving ? "Saving…" : dirty ? "Save Profile" : "Saved"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ── Overview tab: contact details + a quick summary of what's filled in ────
function OverviewTab({
  client, onSaved, clientId, profile, setProfile,
}: {
  client: ClientRecord;
  onSaved: (c: ClientRecord) => void;
  clientId: string;
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}) {
  const [first, setFirst] = useState(client.first_name);
  const [last, setLast] = useState(client.last_name ?? "");
  const [email, setEmail] = useState(client.email ?? "");
  const [phone, setPhone] = useState(client.phone ?? "");
  const [height, setHeight] = useState(client.height_cm?.toString() ?? "");
  const [weight, setWeight] = useState(client.weight_kg?.toString() ?? "");
  const [notes, setNotes] = useState(client.notes ?? "");
  const [savingContact, setSavingContact] = useState(false);

  const saveContact = async () => {
    setSavingContact(true);
    try {
      const res = await adminFetch(`/api/admin/crm/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first, last_name: last, email, phone,
          height_cm: height ? parseFloat(height) : null,
          weight_kg: weight ? parseFloat(weight) : null,
          notes,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.client) onSaved(json.client);
    } finally {
      setSavingContact(false);
    }
  };

  const completion = (garment: GarmentId) =>
    Object.keys(profile[garment].style).length + Object.keys(profile[garment].measurements).length;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-10">
      <div>
        <h2 className="font-cinzel text-lg mb-4">Contact Details</h2>
        <div className="grid sm:grid-cols-2 gap-3 max-w-xl mb-4">
          <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold" />
          <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last name" className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold" />
          <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height (cm)" type="number" className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold" />
          <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" type="number" className="bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold" />
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="General notes about this client…" rows={3} className="w-full max-w-xl bg-white/5 border border-white/15 px-3 py-2.5 text-sm placeholder:text-white/25 focus:outline-none focus:border-gold resize-none mb-3" />
        <button onClick={saveContact} disabled={savingContact} className="text-[11px] tracking-[0.15em] uppercase border border-white/20 hover:border-gold px-4 py-2 transition-colors disabled:opacity-40">
          {savingContact ? "Saving…" : "Save Contact Details"}
        </button>
      </div>

      <div>
        <h2 className="font-cinzel text-lg mb-4">Profile Summary</h2>
        <div className="space-y-2">
          {GARMENTS.map((g) => (
            <div key={g.id} className="flex items-center justify-between border border-white/10 px-4 py-3">
              <span className="text-sm text-white/70">{g.label}</span>
              <span className="text-[11px] text-white/35">
                {completion(g.id) === 0 ? "Not started" : `${completion(g.id)} fields set`}
              </span>
            </div>
          ))}
        </div>
        <p className="text-white/30 text-[11px] mt-4 leading-relaxed">
          Fill in each garment tab, then save from the bar at the bottom of the page. Every save keeps the previous version — nothing is overwritten.
        </p>
      </div>
    </div>
  );
}
