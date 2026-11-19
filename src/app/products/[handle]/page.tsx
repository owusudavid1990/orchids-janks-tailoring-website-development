import type { Metadata } from "next";
import Link from "next/link";

import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductAddToCart } from "@/components/ProductAddToCart";
import { fetchProductByHandle } from "@/lib/shopify-storefront";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await fetchProductByHandle(handle).catch(() => null);
  if (!product) return { title: "Product Not Found | JANKS Tailoring" };

  const plainDescription = product.descriptionHtml
    ? product.descriptionHtml.replace(/<[^>]*>/g, "").slice(0, 160)
    : `Shop ${product.title} at JANKS Tailoring — bespoke menswear accessories, handcrafted in London.`;

  return {
    title: `${product.title} | JANKS Tailoring`,
    description: plainDescription,
    alternates: { canonical: `https://jankstailoring.com/products/${product.handle}` },
    openGraph: {
      title: product.title,
      description: plainDescription,
      url: `https://jankstailoring.com/products/${product.handle}`,
      siteName: "JANKS Tailoring",
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: plainDescription,
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await fetchProductByHandle(handle).catch(() => null);
  if (!product) notFound();

  const inStock = product.variants.some((v) => v.availableForSale);
  const lowestVariant = product.variants.reduce(
    (min, v) => (parseFloat(v.price.amount) < parseFloat(min.price.amount) ? v : min),
    product.variants[0]
  );

  const productJsonLd = lowestVariant && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.descriptionHtml
      ? product.descriptionHtml.replace(/<[^>]*>/g, "").slice(0, 500)
      : undefined,
    brand: { "@type": "Brand", name: "JANKS Tailoring" },
    offers: {
      "@type": "Offer",
      url: `https://jankstailoring.com/products/${product.handle}`,
      priceCurrency: lowestVariant.price.currencyCode,
      price: lowestVariant.price.amount,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="min-h-screen bg-cream">
      {/* Product-specific Open Graph tags (Pinterest Rich Pins, Facebook product cards).
          Next's typed Metadata API doesn't cover og:type="product" or the product:* fields,
          so these are rendered directly — Next hoists <meta> tags from a Server Component
          into <head> automatically. */}
      {lowestVariant && (
        <>
          <meta property="og:type" content="product" />
          <meta property="product:price:amount" content={lowestVariant.price.amount} />
          <meta property="product:price:currency" content={lowestVariant.price.currencyCode} />
          <meta property="product:availability" content={inStock ? "in stock" : "out of stock"} />
          <meta property="product:retailer_item_id" content={product.handle} />
        </>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://jankstailoring.com/" },
              { "@type": "ListItem", position: 2, name: "Shop", item: "https://jankstailoring.com/category" },
              {
                "@type": "ListItem",
                position: 3,
                name: product.title,
                item: `https://jankstailoring.com/products/${product.handle}`,
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />

      {productJsonLd && (
        <script
          type="application/ld+json"
          // "<" is escaped so product text from Shopify can never close the script tag early.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
        />
      )}

      <Navigation />

      <div className="pt-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-8">
          <Link
            href="/category"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-charcoal/40 hover:text-charcoal transition-colors"
          >
            <ChevronLeft size={12} />
            Back to Shop
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10 grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={product.images} productTitle={product.title} />

          {/* Details */}
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold block mb-2">JANKS Tailoring</span>
            <h1 className="font-cinzel text-2xl lg:text-3xl text-charcoal mb-4 leading-snug">{product.title}</h1>

            {!inStock && (
              <span className="inline-block text-[9px] tracking-[0.2em] uppercase text-charcoal bg-cream/90 border border-charcoal/20 px-2.5 py-1 mb-4">
                Sold Out
              </span>
            )}

            {product.descriptionHtml && (
              <div
                className="text-charcoal/70 text-sm leading-relaxed mb-8 prose-sm max-w-none [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            <ProductAddToCart product={product} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
