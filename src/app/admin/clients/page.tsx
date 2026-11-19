"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { adminFetch } from "@/lib/admin-fetch";
import { Search, UserPlus, ChevronRight, X, FileSpreadsheet, Loader2 } from "lucide-react";

interface ClientRow {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  updated_at: string;
}

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const load = useCallback(async (search?: string) => {
    setLoading(true);
    setMessage("");
    try {
      const url = search ? `/api/admin/crm/clients?q=${encodeURIComponent(search)}` : "/api/admin/crm/clients";
      const res = await adminFetch(url);
      const json = await res.json().catch(() => ({}));

      if (res.status === 401) setMessage("Please sign in with your JANKS account to view clients.");
      else if (res.status === 403) setMessage("This account doesn't have admin access.");
      else if (res.status === 503) setMessage("Admin access isn't configured yet — ADMIN_EMAILS needs setting in Vercel.");
      else if (json.error) setMessage(json.error);

      setClients(json.clients ?? []);
    } catch (err) {
      setMessage(String(err).includes("NOT_SIGNED_IN") ? "Please sign in with your JANKS account to view clients." : "Couldn't load clients.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(query || undefined), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const createClient = async () => {
    if (!newFirst.trim()) return;
    setCreating(true);
    try {
      const res = await adminFetch("/api/admin/crm/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: newFirst.trim(),
          last_name: newLast.trim() || undefined,
          email: newEmail.trim() || undefined,
          phone: newPhone.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.error) {
        setMessage(json.error || "Couldn't create client.");
        return;
      }
      router.push(`/admin/clients/${json.client.id}`);
    } catch {
      setMessage("Couldn't create client.");
    } finally {
      setCreating(false);
    }
  };

  const [exportingAll, setExportingAll] = useState(false);
  const exportAllToExcel = async () => {
    setExportingAll(true);
    setMessage("");
    try {
      const res = await adminFetch("/api/admin/crm/clients/export");
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setMessage(json.error || "Couldn't export clients.");
        return;
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const filenameMatch = disposition.match(/filename="([^"]+)"/);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filenameMatch?.[1] ?? "janks-clients.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage("Couldn't export — check your connection.");
    } finally {
      setExportingAll(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <section className="max-w-5xl mx-auto px-6 lg:px-10 pt-32 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-3">Admin</span>
            <h1 className="font-cinzel text-3xl lg:text-4xl">Clients</h1>
          </div>
          <div className="flex items-center gap-3">
          <button
            onClick={exportAllToExcel}
            disabled={exportingAll || clients.length === 0}
            className="flex items-center gap-2 border border-white/20 hover:border-gold text-white/70 hover:text-gold px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-colors disabled:opacity-30"
          >
            {exportingAll ? <Loader2 size={13} className="animate-spin" /> : <FileSpreadsheet size={13} />}
            {exportingAll ? "Exporting…" : "Export All"}
          </button>
          <button
            onClick={() => setShowNew((v) => !v)}
            className="flex items-center gap-2 bg-gold hover:bg-gold/80 text-black px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-colors"
          >
            <UserPlus size={13} /> New Client
          </button>
          </div>
        </div>

        <AdminTabs />

        {showNew && (
          <div className="border border-white/10 bg-white/3 p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] tracking-[0.15em] uppercase text-white/50">New Client</span>
              <button onClick={() => setShowNew(false)} aria-label="Close" className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <input value={newFirst} onChange={(e) => setNewFirst(e.target.value)} placeholder="First name *" className="bg-black border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-gold" />
              <input value={newLast} onChange={(e) => setNewLast(e.target.value)} placeholder="Last name" className="bg-black border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-gold" />
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" type="email" className="bg-black border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-gold" />
              <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Phone" className="bg-black border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-gold" />
            </div>
            <button
              onClick={createClient}
              disabled={!newFirst.trim() || creating}
              className="bg-white text-black px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase disabled:opacity-30 hover:bg-gold transition-colors"
            >
              {creating ? "Creating…" : "Create & Open Profile"}
            </button>
          </div>
        )}

        <div className="relative mb-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full bg-white/3 border border-white/10 pl-9 pr-3 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold"
          />
        </div>

        {message && (
          <p className="border border-yellow-500/30 bg-yellow-500/5 text-yellow-300 px-5 py-4 text-sm mb-8">{message}</p>
        )}

        {loading ? (
          <p className="text-white/40 text-sm">Loading…</p>
        ) : clients.length === 0 ? (
          <p className="text-white/40 text-sm">{query ? "No clients match that search." : "No clients yet — add your first one above."}</p>
        ) : (
          <div className="divide-y divide-white/8 border-t border-white/8">
            {clients.map((c) => (
              <Link
                key={c.id}
                href={`/admin/clients/${c.id}`}
                className="flex items-center justify-between gap-4 py-4 hover:bg-white/[0.02] px-2 -mx-2 transition-colors group"
              >
                <div>
                  <p className="font-cinzel text-base">
                    {c.first_name} {c.last_name}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {[c.email, c.phone].filter(Boolean).join("  ·  ") || "No contact details"}
                  </p>
                </div>
                <ChevronRight size={16} className="text-white/20 group-hover:text-gold transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
