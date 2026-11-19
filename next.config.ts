import type { NextConfig } from "next";
import path from "node:path";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimised images are re-generated at most once a month instead of every minute.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // The five large PNG photos were converted to WebP (2026-09). Keep the old URLs
  // alive with permanent redirects for any bookmarks, external pages or cached
  // social previews that still point at them.
  async redirects() {
    return [
      ...["necktie-collection", "pocket-square-collection", "suits-collection", "hero-suit-1", "service-heritage-hero"].map(
        (name) => ({ source: `/${name}.png`, destination: `/${name}.webp`, permanent: true })
      ),
      // Merchant Center and old links expect /cart. The shop cart is the checkout page.
      { source: "/cart", destination: "/checkout", permanent: false },
      { source: "/wedding", destination: "/wedding-suits", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Applies to every page on the site
        source: "/:path*",
        headers: [
          // Stop the site being embedded in someone else's page (clickjacking)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Stop browsers guessing file types (MIME sniffing attacks)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak the full URL to other sites when visitors click away
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Deny access to hardware/APIs the site doesn't use
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Force HTTPS for 2 years, including subdomains
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER]
      }
    }
  }
};

export default withPWA(nextConfig);
