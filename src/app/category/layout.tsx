import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Ties, Cufflinks & Pocket Squares | JANKS Tailoring",
  description: "Shop ties, cufflinks, and pocket squares from JANKS Tailoring — ready-to-wear accessories crafted to the same standard as our bespoke garments.",
  alternates: { canonical: "https://jankstailoring.com/category" },
};

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
