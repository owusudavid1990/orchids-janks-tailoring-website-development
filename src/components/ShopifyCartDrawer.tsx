"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { useShopifyCart } from "@/lib/shopify-cart-context";

export function ShopifyCartDrawer() {
  const { cart, isOpen, isLoading, itemCount, close, updateItem, removeItem, formatPrice } = useShopifyCart();

  const handleCheckout = () => {
    close();
    if (cart?.checkoutUrl) {
      (window.top ?? window).location.href = cart.checkoutUrl;
    }
  };
  const lines = cart?.lines ?? [];
  const subtotal = cart?.totalAmount ? formatPrice(cart.totalAmount.amount, cart.totalAmount.currencyCode) : "£0.00";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream border-l border-charcoal/10 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-charcoal" />
                <h2 className="font-cinzel text-base text-charcoal tracking-wide">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="text-xs text-charcoal/50">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                )}
              </div>
              <button
                onClick={close}
                className="w-9 h-9 flex items-center justify-center border border-charcoal/20 hover:border-charcoal hover:bg-charcoal group transition-all duration-300"
              >
                <X size={15} className="text-charcoal group-hover:text-cream transition-colors" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 border border-charcoal/10 flex items-center justify-center mb-5">
                    <ShoppingBag size={24} className="text-charcoal/20" />
                  </div>
                  <h3 className="font-cinzel text-base text-charcoal mb-2">Your cart is empty</h3>
                  <p className="text-sm text-charcoal/50 mb-6 max-w-xs leading-relaxed">
                    Add accessories from our collection to begin.
                  </p>
                  <button
                    onClick={close}
                    className="px-6 py-3 text-[10px] tracking-[0.2em] uppercase bg-charcoal text-cream hover:bg-gold hover:text-charcoal transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {lines.map((line) => {
                    const img = line.merchandise.product.images[0];
                    const price = parseFloat(line.merchandise.price.amount) * line.quantity;
                    return (
                      <motion.div
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        className="flex gap-4 pb-5 border-b border-charcoal/8 last:border-0"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-24 bg-charcoal/5 flex-shrink-0 overflow-hidden">
                          {img ? (
                            <Image src={img.url} alt={img.altText ?? line.merchandise.product.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={18} className="text-charcoal/20" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-cinzel text-xs text-charcoal truncate">{line.merchandise.product.title}</p>
                              {line.merchandise.title !== "Default Title" && (
                                <p className="text-[10px] text-charcoal/50 mt-0.5">{line.merchandise.title}</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(line.id)}
                              disabled={isLoading}
                              className="p-1 text-charcoal/30 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-3">
                            {/* Qty stepper */}
                            <div className="flex items-center border border-charcoal/15">
                              <button
                                onClick={() => updateItem(line.id, line.quantity - 1)}
                                disabled={isLoading}
                                className="w-7 h-7 flex items-center justify-center hover:bg-charcoal/5 transition-colors disabled:opacity-50"
                              >
                                <Minus size={10} className="text-charcoal" />
                              </button>
                              <span className="w-8 text-center text-xs text-charcoal font-medium">
                                {isLoading ? <Loader2 size={10} className="animate-spin mx-auto" /> : line.quantity}
                              </span>
                              <button
                                onClick={() => updateItem(line.id, line.quantity + 1)}
                                disabled={isLoading}
                                className="w-7 h-7 flex items-center justify-center hover:bg-charcoal/5 transition-colors disabled:opacity-50"
                              >
                                <Plus size={10} className="text-charcoal" />
                              </button>
                            </div>
                            <p className="font-cinzel text-xs text-charcoal">
                              {formatPrice(price.toString(), cart?.totalAmount.currencyCode ?? "GBP")}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="border-t border-charcoal/10 px-6 py-6 space-y-4 bg-cream">
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-[0.1em] uppercase text-charcoal/60">Subtotal</span>
                  <span className="font-cinzel text-base text-charcoal">{subtotal}</span>
                </div>
                <p className="text-[10px] text-charcoal/40 leading-relaxed">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-4 bg-charcoal text-cream text-[10px] tracking-[0.25em] uppercase hover:bg-gold hover:text-charcoal transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Lock size={12} />}
                  Proceed to Checkout
                </button>
                <button
                  onClick={close}
                  className="w-full py-3 text-[10px] tracking-[0.2em] uppercase text-charcoal/50 hover:text-charcoal transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
