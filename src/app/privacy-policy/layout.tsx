import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Data Policy | JANKS Tailoring",
  description: "How JANKS Tailoring collects, uses, and protects your personal data, in accordance with UK GDPR and the Data Protection Act 2018.",
  alternates: { canonical: "https://jankstailoring.com/privacy-policy" },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
