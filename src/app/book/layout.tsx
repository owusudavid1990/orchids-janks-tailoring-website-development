import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Bespoke Tailoring Consultation in London | JANKS",
  description: "Book a bespoke tailoring, made-to-measure, or alteration consultation with JANKS Tailoring — appointment-based, serving London.",
  alternates: { canonical: "https://jankstailoring.com/book" },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
