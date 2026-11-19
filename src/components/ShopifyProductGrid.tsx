"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ShopifyProduct, fetchCollection, toCollectionGid, formatPrice } from "@/lib/shopify-storefront";

interface Props {
  collectionId?: string; // numeric ID e.g. "687019229529" — fetched client-side if provided
  initialProducts?: ShopifyProduct[]; // pre-fetched server-side (real, crawlable HTML on first render)
}

export function ShopifyProductGrid({ collectionId, initialProducts }: Props) {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProducts || !collectionId) return;
    setLoading(true);
    setError(null);
    fetchCollection(toCollectionGid(collectionId))
      .then(setProducts)
      .catch((e) => setError(e.message ?? "Failed to load products"))
      .finally(() => setLoading(false));
  }, [collectionId, initialProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-sm text-charcoal/50 mb-2">Unable to load products.</p>
        <p className="text-xs text-charcoal/30">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-sm text-charcoal/50">No products in this collection yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-8">
      {products.map((product, i) => {
        const img = product.images[0];
        const lowestVariant = product.variants.reduce((min, v) =>
          parseFloat(v.price.amount) < parseFloat(min.price.amount) ? v : min,
          product.variants[0]
        );
        const inStock = product.variants.some((v) => v.availableForSale);

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className={`group ${!inStock ? "opacity-60" : ""}`}
          >
            <Link href={`/products/${product.handle}`} className="block cursor-pointer">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-charcoal/5 mb-4">
                {img?.url ? (
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/20 text-xs">No image</div>
                )}

                {/* Overlay CTA */}
                {inStock && (
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-cream bg-charcoal/80 px-5 py-2.5 backdrop-blur-sm">
                      View Product
                    </span>
                  </div>
                )}

                {!inStock && (
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-charcoal bg-cream/90 px-2.5 py-1">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h3 className="font-cinzel text-sm text-charcoal group-hover:text-gold transition-colors duration-300 leading-snug">
                  {product.title}
                </h3>
                {lowestVariant && (
                  <p className="text-xs text-charcoal/60 mt-1.5">
                    {product.variants.length > 1 ? "From " : ""}
                    {formatPrice(lowestVariant.price.amount, lowestVariant.price.currencyCode)}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
