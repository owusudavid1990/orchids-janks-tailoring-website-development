"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart, CartItem } from "@/lib/cart-context";

const ALL_SUGGESTIONS = [
  {
    id: "sug-tie",
    name: "Silk Neck Tie",
    subtitle: "Complete the look",
    price: 0,
    priceLabel: "Shop Collection",
    image: "/necktie-collection.webp",
    href: "/category/ties",
    tags: ["suit", "shirt"],
  },
  {
    id: "sug-cufflinks",
    name: "Sterling Cufflinks",
    subtitle: "Refined finishing touch",
    price: 0,
    priceLabel: "Shop Collection",
    image: "/cufflink-collection.webp",
    href: "/category/cufflinks",
    tags: ["shirt", "suit"],
  },
  {
    id: "sug-pocket",
    name: "Pocket Square",
    subtitle: "The final flourish",
    price: 0,
    priceLabel: "Shop Collection",
    image: "/pocket-square-collection.webp",
    href: "/category/pocket-squares",
    tags: ["suit", "tie"],
  },
  {
    id: "sug-suit",
    name: "Bespoke Suit",
    subtitle: "Precision craftsmanship",
    price: 0,
    priceLabel: "Book a consultation",
    image: "/suits-collection.webp",
    href: "/book",
    tags: ["shirt", "trouser", "tie"],
  },
  {
    id: "sug-shirt",
    name: "Bespoke Shirt",
    subtitle: "Tailored to perfection",
    price: 0,
    priceLabel: "Book a consultation",
    image: "/shirt-measurement.jpeg",
    href: "/book",
    tags: ["suit", "trouser"],
  },
];

function getSuggestions(items: CartItem[]) {
  const itemNames = items.map((i) => i.name.toLowerCase());
  const cartTags = new Set<string>();
  itemNames.forEach((name) => {
    if (name.includes("suit")) cartTags.add("suit");
    if (name.includes("shirt")) cartTags.add("shirt");
    if (name.includes("trouser")) cartTags.add("trouser");
    if (name.includes("tie")) cartTags.add("tie");
    if (name.includes("cufflink")) cartTags.add("cufflink");
    if (name.includes("pocket")) cartTags.add("pocket");
  });

  const cartIds = new Set(items.map((i) => i.id));

  return ALL_SUGGESTIONS.filter((s) => {
    if (cartIds.has(s.id)) return false;
    return s.tags.some((tag) => cartTags.has(tag));
  }).slice(0, 3);
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const suggestions = getSuggestions(items);
  const [isShopifyPage, setIsShopifyPage] = useState(false);

  useEffect(() => {
    setIsShopifyPage(!!document.querySelector("[data-shopify-page]"));
  }, []);

  if (isShopifyPage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white/30 dark:bg-charcoal/40 backdrop-blur-2xl border-l border-white/30 dark:border-white/10 z-[70] flex flex-col shadow-2xl"
            >
            <div className="flex items-center justify-between p-6 border-b border-charcoal/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-charcoal dark:text-white" />
                <h2 className="font-cinzel text-lg text-charcoal dark:text-white">
                  Your Bag
                </h2>
                <span className="text-xs text-charcoal/50 dark:text-white/50">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal dark:hover:bg-white group transition-all duration-300"
              >
                <X size={18} className="text-charcoal dark:text-white group-hover:text-cream dark:group-hover:text-charcoal transition-colors" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-charcoal/5 dark:bg-white/5 flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-charcoal/30 dark:text-white/30" />
                  </div>
                  <h3 className="font-cinzel text-lg text-charcoal dark:text-white mb-2">
                    Your bag is empty
                  </h3>
                  <p className="text-sm text-charcoal/50 dark:text-white/50 mb-6 max-w-xs">
                    Discover our bespoke collection and add items to your bag.
                  </p>
                  <Link
                    href="/category"
                    onClick={closeCart}
                    className="px-6 py-3 text-[10px] tracking-[0.2em] uppercase bg-charcoal dark:bg-white text-cream dark:text-charcoal hover:bg-gold hover:text-charcoal transition-all duration-300"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 pb-6 border-b border-charcoal/10 dark:border-white/10 last:border-0"
                    >
                      <div className="relative w-24 h-32 bg-secondary dark:bg-charcoal/50 flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={24} className="text-charcoal/20 dark:text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-cinzel text-sm text-charcoal dark:text-white">
                              {item.name}
                            </h4>
                            {(item.size || item.color) && (
                              <p className="text-[10px] text-charcoal/50 dark:text-white/50 mt-1">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && " / "}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-charcoal/40 dark:text-white/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-charcoal/5 dark:bg-white/5 rounded-full">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-charcoal/10 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                              <Minus size={12} className="text-charcoal dark:text-white" />
                            </button>
                            <span className="w-6 text-center text-xs text-charcoal dark:text-white font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-charcoal/10 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                              <Plus size={12} className="text-charcoal dark:text-white" />
                            </button>
                          </div>
                          <p className="font-cinzel text-sm text-charcoal dark:text-white">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="pt-2"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={13} className="text-gold" />
                        <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/50 dark:text-white/50">
                          Complete Your Look
                        </span>
                      </div>
                      <div className="space-y-3">
                        {suggestions.map((s, i) => (
                          <motion.div
                            key={s.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + i * 0.08 }}
                          >
                            {s.href ? (
                              <Link
                                href={s.href}
                                onClick={closeCart}
                                className="flex items-center gap-3 p-3 bg-charcoal/[0.03] dark:bg-white/5 border border-charcoal/8 dark:border-white/8 hover:border-gold/40 hover:bg-gold/5 transition-all duration-300 group"
                              >
                                <div className="relative w-14 flex-shrink-0 overflow-hidden bg-secondary dark:bg-charcoal/50" style={{ height: "4.5rem" }}>
                                  <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-cinzel text-xs text-charcoal dark:text-white group-hover:text-gold transition-colors duration-300 truncate">{s.name}</p>
                                  <p className="text-[10px] text-charcoal/40 dark:text-white/40 mt-0.5">{s.subtitle}</p>
                                  <p className="text-[10px] tracking-[0.1em] uppercase text-gold mt-1.5">{s.priceLabel}</p>
                                </div>
                                <span className="text-charcoal/20 dark:text-white/20 group-hover:text-gold transition-colors text-lg leading-none">→</span>
                              </Link>
                            ) : (
                              <div className="flex items-center gap-3 p-3 bg-charcoal/[0.03] dark:bg-white/5 border border-charcoal/8 dark:border-white/8 opacity-60 cursor-default">
                                <div className="relative w-14 flex-shrink-0 overflow-hidden bg-secondary dark:bg-charcoal/50" style={{ height: "4.5rem" }}>
                                  <Image src={s.image} alt={s.name} fill className="object-cover brightness-50" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-cinzel text-xs text-charcoal dark:text-white truncate">{s.name}</p>
                                  <p className="text-[10px] text-charcoal/40 dark:text-white/40 mt-0.5">{s.subtitle}</p>
                                  <span className="inline-block text-[9px] tracking-[0.2em] uppercase text-gold border border-gold/30 px-2 py-0.5 mt-1.5">Coming Soon</span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/20 dark:border-white/10 p-6 space-y-4 bg-white/20 dark:bg-charcoal/30 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-charcoal/70 dark:text-white/70">Subtotal</span>
                    <span className="font-cinzel text-lg text-charcoal dark:text-white">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-charcoal/50 dark:text-white/50">
                    Shipping and taxes calculated at checkout
                  </p>
                  <button className="w-full py-4 bg-charcoal dark:bg-white text-cream dark:text-charcoal text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-gold hover:text-charcoal transition-all duration-300">
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={closeCart}
                    className="w-full py-3 text-[10px] tracking-[0.2em] uppercase text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white transition-colors"
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
