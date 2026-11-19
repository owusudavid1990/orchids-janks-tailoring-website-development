import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke & Made-to-Measure Tailoring in London | JANKS",
  description: "Bespoke suits, made-to-measure garments, and alterations from JANKS Tailoring — precision tailoring for the modern gentleman, by appointment in London.",
  alternates: { canonical: "https://jankstailoring.com/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
