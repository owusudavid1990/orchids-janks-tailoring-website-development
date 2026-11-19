"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ShopifyImage } from "@/lib/shopify-storefront";

interface Props {
  images: ShopifyImage[];
  productTitle: string;
}

export function ProductGallery({ images, productTitle }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const gallery = images.length > 0 ? images : [{ url: "", altText: productTitle }];

  return (
    <div className="relative w-full aspect-square bg-charcoal/5">
      {gallery[imgIndex]?.url ? (
        <Image
          src={gallery[imgIndex].url}
          alt={gallery[imgIndex].altText ?? productTitle}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-charcoal/20 text-sm">No image</div>
      )}

      {gallery.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setImgIndex((i) => (i - 1 + gallery.length) % gallery.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-cream/80 flex items-center justify-center hover:bg-cream transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={17} className="text-charcoal" />
          </button>
          <button
            type="button"
            onClick={() => setImgIndex((i) => (i + 1) % gallery.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-cream/80 flex items-center justify-center hover:bg-cream transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={17} className="text-charcoal" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {gallery.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImgIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === imgIndex ? "bg-gold w-4" : "bg-charcoal/30"}`}
              />
            ))}
          </div>

          <div className="absolute bottom-10 left-0 right-0 flex gap-1.5 px-3 overflow-x-auto">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImgIndex(i)}
                aria-label={`Thumbnail ${i + 1}`}
                className={`relative flex-shrink-0 w-14 h-14 overflow-hidden border-2 transition-all ${i === imgIndex ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                {img.url && <Image src={img.url} alt="" fill className="object-cover" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
