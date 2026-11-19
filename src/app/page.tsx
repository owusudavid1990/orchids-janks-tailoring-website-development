import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import HomeClient from "./HomeClient";

// The interactive homepage lives in HomeClient (a client component). This thin
// server wrapper exists so the homepage can export its own metadata and an
// explicit canonical URL, which a "use client" file cannot do.
export const metadata: Metadata = {
  title: { absolute: "JANKS Tailoring | Bespoke Menswear & Garment Construction" },
  description:
    "Bespoke suits, made-to-measure tailoring, custom shirts and alterations from a London atelier founded in 2016. Book a consultation with JANKS Tailoring.",
  alternates: { canonical: "https://jankstailoring.com/" },
  openGraph: {
    type: "website",
    siteName: "JANKS Tailoring",
    title: "JANKS Tailoring | Bespoke Menswear & Garment Construction",
    description:
      "Bespoke suits, made-to-measure tailoring, custom shirts and alterations from a London atelier founded in 2016.",
    url: "https://jankstailoring.com/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JANKS Tailoring — bespoke menswear, London",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JANKS Tailoring | Bespoke Menswear & Garment Construction",
    description:
      "Bespoke suits, made-to-measure tailoring, custom shirts and alterations from a London atelier.",
    images: ["/og-image.jpg"],
  },
};

// Checked at build time: the hero video only renders if the file actually exists,
// so dropping public/hero-video.mp4 in and redeploying activates it without a 404 in between.
const HERO_VIDEO_URL = existsSync(path.join(process.cwd(), "public", "hero-video.mp4"))
  ? "/hero-video.mp4"
  : null;

export default function HomePage() {
  return <HomeClient heroVideo={HERO_VIDEO_URL} />;
}
