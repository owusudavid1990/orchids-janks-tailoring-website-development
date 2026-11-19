import type { Metadata } from "next";
import { articles } from "@/lib/style-guide-articles";

const SITE = "https://jankstailoring.com";
const BRAND = "JANKS Tailoring";
const OG_IMAGE = "/og-image.jpg";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// Prerender the known articles as static HTML; anything else is a clean 404.
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export const dynamicParams = false;

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s—-]+$/, "") + "…";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: `Article not found | ${BRAND}` };

  // Keep titles inside the ~65 character window Google displays.
  const withBrand = `${article.title} | ${BRAND}`;
  const title = withBrand.length <= 65 ? withBrand : article.title;
  const description = clip(article.excerpt, 158);
  const url = `${SITE}/style-guide/${article.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: BRAND,
      title: article.title,
      description,
      url,
      authors: [article.author],
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function ArticleLayout({ children, params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) return children;

  const url = `${SITE}/style-guide/${article.slug}`;

  // Only facts that exist in the article data — no invented dates or ratings.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `${SITE}${article.heroImage}`,
    articleSection: article.category,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: BRAND,
      logo: { "@type": "ImageObject", url: `${SITE}/janks-logo.webp` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Style Academy", item: `${SITE}/style-guide` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
