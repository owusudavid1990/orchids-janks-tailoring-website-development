import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About JANKS Tailoring | London Bespoke Menswear Atelier",
  description: "The story behind JANKS Tailoring — a London bespoke menswear atelier built on precision, heritage, and modern craft.",
  alternates: { canonical: "https://jankstailoring.com/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
