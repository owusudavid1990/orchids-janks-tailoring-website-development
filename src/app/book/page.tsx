"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BookingCalendar } from "@/components/BookingCalendar";
import { Check, CalendarDays } from "lucide-react";
import { trackLead } from "@/lib/meta-events";
import {
  SERVICES,
  FIELDS,
  CALENDAR_CHOICES,
  BUSINESS,
  BOOKING_STEPS as TOTAL_STEPS,
  type CalendarChoice,
} from "@/config/booking-form";

const DRAFT_KEY = "janks-booking-draft";

const inputClass =
  "w-full bg-transparent border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:border-white/40 focus:outline-none transition-colors";

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [calendar, setCalendar] = useState<CalendarChoice>("google");
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ reference: string; whenLabel: string } | null>(null);

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.step) setStep(draft.step);
      if (draft.selectedService) setSelectedService(draft.selectedService);
      if (draft.date) setDate(draft.date);
      if (draft.time) setTime(draft.time);
      if (draft.calendar) setCalendar(draft.calendar);
      if (draft.values) setValues(draft.values);
    } catch {}
  }, []);

  // Save draft whenever anything changes
  useEffect(() => {
    if (result) return;
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ step, selectedService, date, time, calendar, values })
      );
    } catch {}
  }, [step, selectedService, date, time, calendar, values, result]);

  const service = SERVICES.find((s) => s.id === selectedService);
  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  // Questions marked `onlyForServices` are asked for those services alone
  const visibleFields = FIELDS.filter(
    (f) => !f.onlyForServices || f.onlyForServices.includes(selectedService)
  );

  const canProceed = () => {
    if (step === 1) return selectedService !== "";
    if (step === 2) return date !== "" && time !== "";
    if (step === 3)
      return visibleFields.every((f) => !f.required || (values[f.name] ?? "").trim() !== "");
    return false;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");

    // Core identity fields travel at the top level; everything else the
    // config defines goes into `details`, so adding a question to the
    // config file needs no change here.
    const core = ["firstName", "lastName", "email", "phone"];
    const details: Record<string, string> = {};
    for (const field of visibleFields) {
      if (!core.includes(field.name)) details[field.name] = values[field.name] ?? "";
    }

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service?.name ?? "",
          serviceId: selectedService,
          date,
          time,
          calendar,
          firstName: values.firstName ?? "",
          lastName: values.lastName ?? "",
          email: values.email ?? "",
          phone: values.phone ?? "",
          notes: values.notes ?? "",
          details,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setError(data.error || "We couldn't complete your booking. Please try again.");
        // Someone took the slot while they were filling in their details —
        // send them back to the calendar rather than leaving them stuck on a
        // form they can't submit
        if (res.status === 409) {
          setTime("");
          setStep(2);
        }
        setSubmitting(false);
        return;
      }

      trackLead(service?.name);
      localStorage.removeItem(DRAFT_KEY);
      setResult({ reference: data.reference, whenLabel: data.whenLabel });
    } catch {
      setError("We couldn't reach our booking system. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  // ── Confirmation ─────────────────────────────────────────────────────────
  if (result) {
    return (
      <main className="min-h-screen bg-black">
        <Navigation />
        <section className="min-h-screen grid lg:grid-cols-2">
          <div className="relative hidden lg:block">
            <Image src="/book-hero.jpeg" alt="JANKS Atelier" fill sizes="50vw" className="object-cover brightness-50" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
            <div className="absolute bottom-12 left-12">
              <Image src="/janks-logo.webp" alt="JANKS" width={120} height={48} className="brightness-0 invert opacity-40" />
            </div>
          </div>

          <div className="flex items-center justify-center px-8 lg:px-16 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 border-2 border-gold flex items-center justify-center mb-8"
              >
                <Check className="w-7 h-7 text-gold" />
              </motion.div>

              <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-3">Appointment Requested</span>
              <h1 className="font-cinzel text-4xl lg:text-5xl text-cream leading-tight mb-4">
                Thank you,<br />{values.firstName}.
              </h1>
              <p className="text-cream/50 text-sm leading-relaxed mb-10">
                We&apos;ve emailed your confirmation with a calendar invitation attached.
                The JANKS team will confirm your appointment within {BUSINESS.responseTime}.
              </p>

              <div className="border border-white/10 bg-white/3 p-6 mb-8 space-y-4">
                <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">Your Appointment</p>
                {[
                  { label: "When", value: result.whenLabel },
                  { label: "Service", value: service?.name },
                  { label: "Confirmation sent to", value: values.email },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <span className="text-white/40 text-[11px] tracking-[0.1em] uppercase shrink-0">{label}</span>
                    <span className="text-cream text-right">{value}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-white/20 tracking-wider mb-8">Ref: {result.reference}</p>

              <div className="flex items-center gap-4">
                <a href="/" className="flex-1 text-center border border-white/20 hover:border-white text-cream text-[11px] tracking-[0.2em] uppercase py-3.5 transition-all duration-300">
                  Return Home
                </a>
                <a href="/services" className="flex-1 text-center bg-gold hover:bg-gold/80 text-charcoal text-[11px] tracking-[0.2em] uppercase py-3.5 transition-all duration-300">
                  Explore Services
                </a>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      <section className="min-h-screen grid lg:grid-cols-2">
        <div className="relative h-[40vh] lg:h-screen lg:sticky lg:top-0">
          <Image src="/book-hero.jpeg" alt="Tailoring appointment" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center">
              <span className="text-[11px] tracking-[0.3em] uppercase text-white/40 block mb-4">
                Book Your Appointment
              </span>
              <h1 className="font-cinzel text-4xl lg:text-6xl text-white leading-tight">
                Begin Your
                <br />
                Journey
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-black text-white px-6 lg:px-16 py-20 lg:py-32">
          {/* Step indicators */}
          <div className="flex items-center gap-4 mb-12">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                    step >= s ? "bg-white text-black" : "bg-white/10 text-white/40"
                  }`}
                >
                  {step > s ? <Check size={14} /> : s}
                </div>
                {s < TOTAL_STEPS && <div className={`w-12 h-px ${step > s ? "bg-white" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1 — service */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="font-cinzel text-2xl lg:text-3xl mb-2">Select Service</h2>
              <p className="text-white/40 text-sm mb-8">Choose the service you&apos;d like to book. New to this?{" "}<Link href="/fit-guide" className="underline underline-offset-4 hover:text-white transition-colors">Read how we measure and fit</Link>.</p>

              <div className="space-y-3">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    className={`w-full p-5 text-left border transition-all ${
                      selectedService === s.id ? "border-white bg-white/5" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-lg">{s.name}</span>
                      <span className="text-white/60 text-sm">{s.price}</span>
                    </div>
                    <span className="text-white/30 text-xs mt-1 block">{s.durationMinutes} minutes</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2 — date and time */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="font-cinzel text-2xl lg:text-3xl mb-2">Choose a Date</h2>
              <p className="text-white/40 text-sm mb-8">
                {service?.name} — approximately {service?.durationMinutes} minutes
              </p>

              <BookingCalendar date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />

              {date && time && (
                <div className="mt-8">
                  <span className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-4">
                    <CalendarDays size={12} className="inline mr-2" />
                    Add to your calendar
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {CALENDAR_CHOICES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCalendar(c.id)}
                        className={`py-3 min-h-[44px] text-sm border transition-all ${
                          calendar === c.id ? "border-white bg-white/5" : "border-white/10 text-white/60 hover:border-white/40"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3 — details, generated from the config file */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="font-cinzel text-2xl lg:text-3xl mb-2">Your Details</h2>
              <p className="text-white/40 text-sm mb-8">Please provide your contact information</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  {visibleFields.map((field) => {
                    const value = values[field.name] ?? "";
                    return (
                      <div key={field.name} className={field.half ? "col-span-1" : "col-span-2"}>
                        <label htmlFor={field.name} className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">
                          {field.label}
                          {!field.required && <span className="text-white/20 normal-case tracking-normal"> (optional)</span>}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            id={field.name}
                            value={value}
                            onChange={(e) => set(field.name, e.target.value)}
                            rows={3}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={`${inputClass} resize-none`}
                          />
                        ) : field.type === "select" ? (
                          <select
                            id={field.name}
                            value={value}
                            onChange={(e) => set(field.name, e.target.value)}
                            required={field.required}
                            className={`${inputClass} [&>option]:bg-black`}
                          >
                            <option value="">Please choose…</option>
                            {(field.options ?? []).map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field.name}
                            type={field.type}
                            value={value}
                            onChange={(e) => set(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={inputClass}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-5 bg-white/5 border border-white/10">
                  <span className="text-[11px] tracking-[0.15em] uppercase text-white/40 block mb-3">Booking Summary</span>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-white/50">Service</span>
                      <span className="text-right">{service?.name}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/50">Date</span>
                      <span className="text-right">
                        {date && new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/50">Time</span>
                      <span className="text-right">{time}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-sm text-red-400 border border-red-400/30 bg-red-400/5 px-4 py-3">
                    {error}
                  </p>
                )}
              </form>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-10">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-4 min-w-[44px] min-h-[44px] text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < TOTAL_STEPS) setStep(step + 1);
                else handleSubmit();
              }}
              disabled={!canProceed() || submitting}
              className={`ml-auto min-w-[160px] min-h-[44px] text-center text-[11px] tracking-[0.2em] uppercase border px-8 py-4 transition-all ${
                canProceed() && !submitting
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-white/20 text-white/20 cursor-not-allowed"
              }`}
            >
              {submitting ? "Sending…" : step === TOTAL_STEPS ? "Confirm Booking" : "Continue"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
