import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy | JANKS Tailoring",
  description: "How returns, exchanges, and refunds work for JANKS Tailoring's bespoke garments and shop accessories.",
  alternates: { canonical: "https://jankstailoring.com/return-policy" },
};

export default function ReturnPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
