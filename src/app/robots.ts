import type { MetadataRoute } from "next";

const BASE_URL = "https://jankstailoring.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional / account pages have no search value
      disallow: ["/api/", "/auth/", "/checkout", "/dashboard", "/admin"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
