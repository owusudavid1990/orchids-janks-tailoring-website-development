"use client";

import { useState } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { ShopifyProduct, formatPrice } from "@/lib/shopify-storefront";
import { useShopifyCart } from "@/lib/shopify-cart-context";

interface Props {
  product: ShopifyProduct;
}

export function ProductAddToCart({ product }: Props) {
  const { addItem, isLoading } = useShopifyCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const hasVariants = product.variants.length > 1;

  const handleAdd = async () => {
    if (!selectedVariant) return;
    await addItem(selectedVariant.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div>
      {selectedVariant && (
        <p className="text-xl text-charcoal mb-6">
          {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
        </p>
      )}

      {hasVariants && (
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/50 mb-3">Select Option</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
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

      <div className="mb-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/50 mb-3">Quantity</p>
        <div className="flex items-center border border-charcoal/20 w-fit">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-charcoal/5 transition-colors"
          >
            <Minus size={12} className="text-charcoal" />
          </button>
          <span className="w-12 text-center text-sm font-medium text-charcoal">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-charcoal/5 transition-colors"
          >
            <Plus size={12} className="text-charcoal" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
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
  );
}
