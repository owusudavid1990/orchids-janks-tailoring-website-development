import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style Academy | JANKS Tailoring",
  description: "Menswear style essays and guides from JANKS Tailoring — on bespoke tailoring, fabric, colour, and dressing well.",
  alternates: { canonical: "https://jankstailoring.com/style-guide" },
};

export default function StyleGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
