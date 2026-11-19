"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { PaymentBadge } from "@/components/PaymentBadge";
import { formatPrice } from "@/lib/shopify-storefront";
import { Loader2, ChevronLeft, ShoppingBag, Lock } from "lucide-react";

export default function CheckoutPage() {
  const { cart, isLoading } = useShopifyCart();
  const router = useRouter();
  const lines = cart?.lines ?? [];
  const currencyCode = cart?.totalAmount?.currencyCode ?? "GBP";
  const subtotal = cart?.totalAmount
    ? formatPrice(cart.totalAmount.amount, currencyCode)
    : "£0.00";

  // If cart is empty and not loading, redirect to shop
  useEffect(() => {
    if (!isLoading && lines.length === 0) {
      router.replace("/category");
    }
  }, [isLoading, lines.length, router]);

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      (window.top ?? window).location.href = cart.checkoutUrl;
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      <div className="pt-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-12 pt-10 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal/40">JANKS Tailoring</span>
            <span className="text-charcoal/20">—</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold">Checkout</span>
          </div>
          <h1 className="font-cinzel text-3xl text-charcoal">Review Your Order</h1>
        </div>

        <div className="max-w-2xl mx-auto px-6 lg:px-12 py-8">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 size={28} className="animate-spin text-gold" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Cart items */}
              <div className="border border-charcoal/10 bg-white divide-y divide-charcoal/8 mb-6">
                {lines.map((line) => {
                  const img = line.merchandise.product.images[0];
                  const lineTotal = parseFloat(line.merchandise.price.amount) * line.quantity;
                  return (
                    <div key={line.id} className="flex gap-4 p-5">
                      <div className="relative w-20 h-20 bg-charcoal/5 flex-shrink-0 overflow-hidden">
                        {img?.url ? (
                          <Image src={img.url} alt={line.merchandise.product.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={18} className="text-charcoal/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-cinzel text-sm text-charcoal">{line.merchandise.product.title}</p>
                        {line.merchandise.title !== "Default Title" && (
                          <p className="text-[10px] text-charcoal/50 mt-0.5">{line.merchandise.title}</p>
                        )}
                        <p className="text-xs text-charcoal/50 mt-1">Qty: {line.quantity}</p>
                      </div>
                      <p className="font-cinzel text-sm text-charcoal flex-shrink-0">
                        {formatPrice(lineTotal.toString(), currencyCode)}
                      </p>
                    </div>
                  );
                })}

                {/* Totals */}
                <div className="p-5 space-y-2 bg-charcoal/[0.02]">
                  <div className="flex justify-between text-xs text-charcoal/60">
                    <span>Subtotal</span>
                    <span>{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-charcoal/60">
                    <span>Shipping & taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-cinzel text-base text-charcoal pt-2 border-t border-charcoal/8">
                    <span>Total</span>
                    <span>{subtotal}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleCheckout}
                disabled={!cart?.checkoutUrl}
                className="w-full py-4 bg-charcoal text-cream text-[10px] tracking-[0.25em] uppercase hover:bg-gold hover:text-charcoal transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2 mb-4"
              >
                <Lock size={12} />
                Proceed to Secure Checkout
              </button>

              <p className="text-center text-[10px] text-charcoal/40 tracking-wide mb-6">
                You'll complete your order on Shopify's secure checkout — then return here.
              </p>

              <PaymentBadge className="mb-8 pb-8 border-b border-charcoal/8" />

              <Link
                href="/category"
                className="flex items-center justify-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-charcoal/40 hover:text-charcoal transition-colors"
              >
                <ChevronLeft size={11} />
                Continue Shopping
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
