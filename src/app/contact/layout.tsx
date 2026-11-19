import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact JANKS Tailoring | Bespoke Tailor in London",
  description: "Get in touch with JANKS Tailoring — bespoke menswear and made-to-measure tailoring by appointment, serving London.",
  alternates: { canonical: "https://jankstailoring.com/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
