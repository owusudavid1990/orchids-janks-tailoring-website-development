import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cinzel, Libre_Franklin, Outfit } from "next/font/google";
import "./globals.css";
import { VisualEditsLoader } from "@/components/VisualEditsLoader";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { SearchProvider } from "@/components/SearchModal";
import { DeferredWidgets } from "@/components/DeferredWidgets";
import { ShopifyCartProvider } from "@/lib/shopify-cart-context";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import { MetaPixel } from "@/components/MetaPixel";

// Self-hosted (no request to fonts.googleapis.com, so nothing blocks first paint and
// no visitor IPs are sent to Google). Same two typefaces the site already used;
// variable fonts, so every weight the CSS asks for is available.
const libreFranklin = Libre_Franklin({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-libre-loaded",
});
const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-outfit-loaded",
});
// Cinzel is the display face. It was named in CSS but never loaded, so headings
// fell back to Times New Roman. next/font self-hosts it; no request to Google at runtime.
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cinzel-loaded",
});

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const SITE_DESCRIPTION = "Precision. Heritage. Modern craft. Luxury bespoke menswear, made-to-measure tailoring and alterations from JANKS Tailoring, London.";
const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: "JANKS Tailoring — bespoke menswear, London" };

export const metadata: Metadata = {
  metadataBase: new URL("https://jankstailoring.com"),
  title: "JANKS Tailoring | Bespoke Menswear & Garment Construction",
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "JANKS Tailoring",
    title: "JANKS Tailoring | Bespoke Menswear & Garment Construction",
    description: SITE_DESCRIPTION,
    url: "https://jankstailoring.com",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "JANKS Tailoring | Bespoke Menswear & Garment Construction",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JANKS",
    startupImage: [
      { url: "/icons/icon-512.png" },
    ],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/icon-152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
    ],
    shortcut: "/icons/icon-192.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "JANKS",
    "application-name": "JANKS",
    "msapplication-TileColor": "#1a1a1a",
    "msapplication-TileImage": "/icons/icon-144.png",
  },
};

// Business identity for crawlers. ProfessionalService, not Store: JANKS has no
// shop. Paul Street is the registered office only, there are no opening hours,
// and consultations cover the United Kingdom because the tailor travels.
const BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "JANKS Tailoring",
  "legalName": "JANKS TAILORING LTD",
  "identifier": {
    "@type": "PropertyValue",
    "name": "Companies House number",
    "value": "16870658",
  },
  "foundingDate": "2016",
  "url": "https://jankstailoring.com",
  "logo": "https://jankstailoring.com/janks-logo.webp",
  "image": "https://jankstailoring.com/og-image.jpg",
  "telephone": "+447828338172",
  "email": "jankstailoring@gmail.com",
  "description": "Private, appointment-only tailoring. JANKS Tailoring has no shop. Consultations are by appointment only — we travel to you. Every order is delivered. The address is the registered office, not a place to visit.",
  "address": {
    "@type": "PostalAddress",
    "name": "Registered office",
    "streetAddress": "3rd Floor, 86-90 Paul Street",
    "addressLocality": "London",
    "postalCode": "EC2A 4NE",
    "addressCountry": "GB",
  },
  "areaServed": {
    "@type": "Country",
    "name": "United Kingdom",
  },
  "publicAccess": false,
  "sameAs": [
    "https://www.instagram.com/official_janks.tailoring",
    "https://youtube.com/@jankstailoring",
    "https://www.facebook.com/profile.php?id=100054995383463",
    "https://www.tiktok.com/@janks.tailoring",
    "https://www.pinterest.com/JanksTailoring/",
  ],
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "JANKS Tailoring",
  "url": "https://jankstailoring.com",
  "inLanguage": "en-GB",
  "publisher": { "@type": "Organization", "name": "JANKS Tailoring Ltd" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${libreFranklin.variable} ${outfit.variable} ${cinzel.variable}`}>
      <body className="antialiased">
        {/* Business identity structured data */}
        {/* Plain <script> tags (not next/script) so the structured data is present in the
            server-rendered HTML that crawlers and validators read, not injected after load. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HFWSNXJXKH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HFWSNXJXKH');
          `}
        </Script>
        {/* Meta Pixel (Facebook & Instagram ads) */}
        <MetaPixel />
        <AuthProvider>
          <ShopifyCartProvider>
          <CartProvider>
            <SearchProvider>
              {children}
              <DeferredWidgets />
              <PWAInstallBanner />
              <VisualEditsLoader />
            </SearchProvider>
          </CartProvider>
          </ShopifyCartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
