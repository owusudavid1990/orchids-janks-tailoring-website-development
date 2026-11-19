import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | JANKS Tailoring",
  description: "How JANKS Tailoring delivers bespoke garments and shop accessories, and what to expect along the way.",
  alternates: { canonical: "https://jankstailoring.com/shipping-policy" },
};

export default function ShippingPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
