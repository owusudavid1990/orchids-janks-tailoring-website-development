import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suit & Shirt Fit Guide: How We Measure | JANKS Tailoring",
  description: "How JANKS Tailoring garments are measured and fitted — what to expect from a made-to-measure or bespoke fitting.",
  alternates: { canonical: "https://jankstailoring.com/fit-guide" },
};

export default function FitGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
