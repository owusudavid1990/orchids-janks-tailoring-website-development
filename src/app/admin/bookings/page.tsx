"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Navigation } from "@/components/Navigation";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { Download, RefreshCw, Check, X, Clock, Star } from "lucide-react";

interface Booking {
  id: string;
  created_at: string;
  reference: string;
  service: string;
  booking_date: string;
  booking_time: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  details: Record<string, string>;
  calendar_choice: string | null;
  status: "pending" | "confirmed" | "cancelled";
  shopify_draft_order_id: number | null;
}

type Filter = "upcoming" | "all" | "pending" | "confirmed" | "cancelled";

const STATUS_STYLES: Record<Booking["status"], string> = {
  pending: "border-yellow-500/40 text-yellow-400 bg-yellow-500/5",
  confirmed: "border-green-500/40 text-green-400 bg-green-500/5",
  cancelled: "border-white/15 text-white/30 bg-white/3",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<Filter>("upcoming");

  const authedFetch = useCallback(async (url: string, init?: RequestInit) => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("NOT_SIGNED_IN");
    return fetch(url, {
      ...init,
      headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await authedFetch("/api/admin/bookings");
      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setMessage("Please sign in with your JANKS account to view bookings.");
      } else if (res.status === 403) {
        setMessage("This account doesn't have admin access.");
      } else if (res.status === 503) {
        setMessage("Admin access isn't configured yet — ADMIN_EMAILS needs setting in Vercel.");
      } else if (json.error) {
        setMessage(json.error);
      }
      setBookings(json.bookings ?? []);
    } catch (err) {
      setMessage(
        String(err).includes("NOT_SIGNED_IN")
          ? "Please sign in with your JANKS account to view bookings."
          : "Couldn't load bookings."
      );
    }
    setLoading(false);
  }, [authedFetch]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: Booking["status"]) => {
    // Update on screen straight away, roll back if the server disagrees
    const previous = bookings;
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    setMessage("");
    try {
      const res = await authedFetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json().catch(() => ({}));

      if (json.emailed) {
        setMessage(
          status === "confirmed"
            ? "Confirmed — the client has been emailed."
            : "Cancelled — the client has been emailed."
        );
      } else if (json.emailError) {
        // The change saved; only the email failed. Say so precisely, so the
        // owner knows to contact the client themselves.
        setMessage("Status saved, but the client could not be emailed. Please contact them directly.");
      }
    } catch {
      setBookings(previous);
      setMessage("Couldn't save that change.");
    }
  };

  const [sendingReviewFor, setSendingReviewFor] = useState<string | null>(null);

  const sendReviewRequest = async (id: string) => {
    setSendingReviewFor(id);
    setMessage("");
    try {
      const res = await authedFetch("/api/admin/bookings/review-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      setMessage("Review request sent.");
    } catch {
      setMessage("Couldn't send the review request.");
    }
    setSendingReviewFor(null);
  };

  const visible = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return bookings.filter((b) => {
      if (filter === "all") return true;
      if (filter === "upcoming") return b.booking_date >= today && b.status !== "cancelled";
      return b.status === filter;
    });
  }, [bookings, filter]);

  const exportCsv = () => {
    const detailKeys = Array.from(
      new Set(visible.flatMap((b) => Object.keys(b.details ?? {})))
    );
    const headers = [
      "Reference", "Status", "Date", "Time", "Service",
      "First name", "Last name", "Email", "Phone",
      ...detailKeys, "Booked on",
    ];

    // A leading =, +, - or @ makes Excel treat a cell as a formula. Prefixing
    // an apostrophe keeps customer text as text.
    const cell = (v: unknown) => {
      const s = String(v ?? "");
      const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
      return `"${safe.replace(/"/g, '""')}"`;
    };

    const rows = visible.map((b) =>
      [
        b.reference, b.status, b.booking_date, b.booking_time, b.service,
        b.first_name, b.last_name, b.email, b.phone,
        ...detailKeys.map((k) => b.details?.[k] ?? ""),
        new Date(b.created_at).toLocaleString("en-GB"),
      ].map(cell).join(",")
    );

    const csv = [headers.map(cell).join(","), ...rows].join("\r\n");
    const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `janks-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <section className="max-w-6xl mx-auto px-6 lg:px-10 pt-32 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-3">Admin</span>
            <h1 className="font-cinzel text-3xl lg:text-4xl">Bookings</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="flex items-center gap-2 border border-white/15 hover:border-white/40 px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-colors"
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <button
              onClick={exportCsv}
              disabled={visible.length === 0}
              className="flex items-center gap-2 bg-gold hover:bg-gold/80 disabled:opacity-30 text-black px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-colors"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        <AdminTabs />

        <div className="flex flex-wrap gap-2 mb-8">
          {(["upcoming", "pending", "confirmed", "cancelled", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[11px] tracking-[0.15em] uppercase border transition-colors ${
                filter === f ? "border-white bg-white/5" : "border-white/10 text-white/40 hover:border-white/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {message && (
          <p className="border border-yellow-500/30 bg-yellow-500/5 text-yellow-300 px-5 py-4 text-sm mb-8">
            {message}
          </p>
        )}

        {loading ? (
          <p className="text-white/40 text-sm">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="text-white/40 text-sm">No bookings to show.</p>
        ) : (
          <div className="space-y-3">
            {visible.map((b) => (
              <div key={b.id} className="border border-white/10 bg-white/3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-cinzel text-lg">
                        {b.first_name} {b.last_name}
                      </span>
                      <span className={`text-[10px] tracking-[0.15em] uppercase border px-2 py-0.5 ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm">
                      {new Date(`${b.booking_date}T12:00:00`).toLocaleDateString("en-GB", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric",
                      })}{" "}
                      at {b.booking_time} · {b.service}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status === "confirmed" && b.booking_date < new Date().toISOString().slice(0, 10) && (
                      <button
                        onClick={() => sendReviewRequest(b.id)}
                        disabled={sendingReviewFor === b.id}
                        title="Send review request"
                        className="w-9 h-9 flex items-center justify-center border border-white/15 hover:border-gold/60 hover:text-gold transition-colors disabled:opacity-40"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setStatus(b.id, "confirmed")}
                      title="Mark confirmed"
                      className="w-9 h-9 flex items-center justify-center border border-white/15 hover:border-green-500/60 hover:text-green-400 transition-colors"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setStatus(b.id, "pending")}
                      title="Mark pending"
                      className="w-9 h-9 flex items-center justify-center border border-white/15 hover:border-yellow-500/60 hover:text-yellow-400 transition-colors"
                    >
                      <Clock size={14} />
                    </button>
                    <button
                      onClick={() => setStatus(b.id, "cancelled")}
                      title="Mark cancelled"
                      className="w-9 h-9 flex items-center justify-center border border-white/15 hover:border-red-500/60 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm border-t border-white/5 pt-4">
                  <Detail label="Email" value={<a href={`mailto:${b.email}`} className="text-gold hover:underline">{b.email}</a>} />
                  {b.phone && <Detail label="Phone" value={<a href={`tel:${b.phone}`} className="text-gold hover:underline">{b.phone}</a>} />}
                  {Object.entries(b.details ?? {})
                    .filter(([, v]) => v)
                    .map(([k, v]) => <Detail key={k} label={k} value={v} />)}
                  <Detail label="Reference" value={b.reference} />
                  {b.shopify_draft_order_id && <Detail label="Shopify draft" value={`#${b.shopify_draft_order_id}`} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="text-white/35 text-[11px] tracking-[0.1em] uppercase shrink-0 w-28">{label}</span>
      <span className="text-white/80 break-words min-w-0">{value}</span>
    </div>
  );
}
