"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Minus, Plus, Loader2 } from "lucide-react";
import { ShopifyProduct, formatPrice } from "@/lib/shopify-storefront";
import { useShopifyCart } from "@/lib/shopify-cart-context";

interface Props {
  product: ShopifyProduct;
  onClose: () => void;
}

export function ShopifyProductModal({ product, onClose }: Props) {
  const { addItem, isLoading } = useShopifyCart();
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const images = product.images.length > 0 ? product.images : [{ url: "", altText: product.title }];
  const availableVariants = product.variants.filter((v) => v.availableForSale);
  const hasVariants = product.variants.length > 1;

  const handleAdd = async () => {
    if (!selectedVariant) return;
    await addItem(selectedVariant.id, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="bg-cream w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl"
      >
        {/* Images */}
        <div className="relative w-full md:w-1/2 aspect-square bg-charcoal/5 flex-shrink-0">
          {images[imgIndex]?.url ? (
            <Image
              src={images[imgIndex].url}
              alt={images[imgIndex].altText ?? product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal/20 text-sm">No image</div>
          )}

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream/80 flex items-center justify-center hover:bg-cream transition-colors"
              >
                <ChevronLeft size={16} className="text-charcoal" />
              </button>
              <button
                onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream/80 flex items-center justify-center hover:bg-cream transition-colors"
              >
                <ChevronRight size={16} className="text-charcoal" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === imgIndex ? "bg-gold w-4" : "bg-charcoal/30"}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-10 left-0 right-0 flex gap-1.5 px-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`relative flex-shrink-0 w-12 h-12 overflow-hidden border-2 transition-all ${i === imgIndex ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  {img.url && <Image src={img.url} alt={`${product.title}, image ${i + 1}`} fill className="object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-8 flex flex-col">
          {/* Close */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center border border-charcoal/20 hover:bg-charcoal group transition-all duration-200"
            >
              <X size={14} className="text-charcoal group-hover:text-cream transition-colors" />
            </button>
          </div>

          <div className="mb-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold">JANKS Tailoring</span>
          </div>
          <h2 className="font-cinzel text-2xl text-charcoal mb-3 leading-snug">{product.title}</h2>

          {selectedVariant && (
            <p className="text-xl text-charcoal mb-6">
              {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
            </p>
          )}

          {/* Variants */}
          {hasVariants && (
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/50 mb-3">Select Option</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    disabled={!v.availableForSale}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-2 text-[10px] tracking-[0.1em] uppercase border transition-all duration-200
                      ${selectedVariant?.id === v.id
                        ? "border-charcoal bg-charcoal text-cream"
                        : v.availableForSale
                          ? "border-charcoal/20 text-charcoal hover:border-charcoal"
                          : "border-charcoal/10 text-charcoal/30 cursor-not-allowed line-through"
                      }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/50 mb-3">Quantity</p>
            <div className="flex items-center border border-charcoal/20 w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-charcoal/5 transition-colors"
              >
                <Minus size={12} className="text-charcoal" />
              </button>
              <span className="w-12 text-center text-sm font-medium text-charcoal">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-charcoal/5 transition-colors"
              >
                <Plus size={12} className="text-charcoal" />
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button
              onClick={handleAdd}
              disabled={isLoading || !selectedVariant?.availableForSale || added}
              className={`w-full py-4 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2
                ${added
                  ? "bg-gold text-charcoal"
                  : "bg-charcoal text-cream hover:bg-gold hover:text-charcoal disabled:opacity-50"
                }`}
            >
              {isLoading && <Loader2 size={13} className="animate-spin" />}
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
            {!selectedVariant?.availableForSale && (
              <p className="text-[10px] text-center text-charcoal/40 tracking-wide">This variant is sold out</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
