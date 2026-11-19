import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About JANKS Tailoring | Bespoke Menswear",
  description: "The story behind JANKS Tailoring — a private, appointment-only tailor founded in 2016. We travel to you.",
  alternates: { canonical: "https://jankstailoring.com/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
