import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | JANKS Tailoring",
  description: "The terms governing use of the JANKS Tailoring website and our bespoke tailoring, made-to-measure, alteration, and retail services.",
  alternates: { canonical: "https://jankstailoring.com/terms-of-service" },
};

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
