import type { MetadataRoute } from "next";
import { fetchCollection, toCollectionGid } from "@/lib/shopify-storefront";
import { articles } from "@/lib/style-guide-articles";

const BASE_URL = "https://jankstailoring.com";

// Same collection IDs used by the three /category sub-pages
const PRODUCT_COLLECTION_IDS = ["687019229529", "698171883865", "687016935769"];


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Real, crawlable product pages — fetched from every collection currently
  // linked in navigation. Deduplicated by handle since collections can share
  // products. A fetch failure yields an empty list rather than breaking the
  // whole sitemap.
  const productLists = await Promise.all(
    PRODUCT_COLLECTION_IDS.map((id) => fetchCollection(toCollectionGid(id)).catch(() => []))
  );
  const seenHandles = new Set<string>();
  const productUrls = productLists.flat().filter((p) => {
    if (!p.handle || seenHandles.has(p.handle)) return false;
    seenHandles.add(p.handle);
    return true;
  });

  const primaryPages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/wedding-suits", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/corporate-tailoring", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/work", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/gallery", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/category", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/category/ties", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/category/cufflinks", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/category/pocket-squares", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/fit-guide", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/style-guide", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  const legalPages = [
    "/privacy-policy",
    "/return-policy",
    "/shipping-policy",
    "/terms-of-service",
  ];

  return [
    ...primaryPages.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}${path}`,
      changeFrequency,
      priority,
    })),
    ...articles.map(({ slug }) => ({
      url: `${BASE_URL}/style-guide/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...productUrls.map((p) => ({
      url: `${BASE_URL}/products/${p.handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...legalPages.map((path) => ({
      url: `${BASE_URL}${path}`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
