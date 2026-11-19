import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Process: How a Bespoke Suit Is Made | JANKS Tailoring",
  description: "From first consultation to final fitting — how JANKS Tailoring builds a bespoke suit, made-to-measure garment, or alteration, step by step.",
  alternates: { canonical: "https://jankstailoring.com/work" },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
