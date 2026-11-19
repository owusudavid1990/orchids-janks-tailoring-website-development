"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  ShopifyCart,
  ShopifyLineItem,
  createCart,
  addToCart,
  updateCartLine,
  removeCartLine,
  getCart,
  formatPrice,
} from "./shopify-storefront";

interface ShopifyCartContextType {
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
  itemCount: number;
  open: () => void;
  close: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  checkout: () => void;
  formatPrice: (amount: string, currencyCode?: string) => string;
}

const ShopifyCartContext = createContext<ShopifyCartContextType | undefined>(undefined);

const CART_ID_KEY = "janks-shopify-cart-id";

export function ShopifyCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem(CART_ID_KEY);
    if (savedId) {
      getCart(savedId).then((c) => {
        if (c) setCart(c);
        else localStorage.removeItem(CART_ID_KEY);
      });
    }
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      let updated: ShopifyCart;
      const cartId = cart?.id ?? localStorage.getItem(CART_ID_KEY);
      if (cartId) {
        updated = await addToCart(cartId, variantId, quantity);
      } else {
        updated = await createCart(variantId, quantity);
        localStorage.setItem(CART_ID_KEY, updated.id);
      }
      setCart(updated);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const updated = await updateCartLine(cart.id, lineId, quantity);
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const updated = await removeCartLine(cart.id, lineId);
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const checkout = useCallback(() => {
    if (typeof window !== "undefined" && cart?.checkoutUrl) {
      (window.top ?? window).location.href = cart.checkoutUrl;
    }
  }, [cart]);

  const itemCount = cart?.lines.reduce((sum, l) => sum + l.quantity, 0) ?? 0;

  return (
    <ShopifyCartContext.Provider
      value={{ cart, isOpen, isLoading, itemCount, open, close, addItem, updateItem, removeItem, checkout, formatPrice }}
    >
      {children}
    </ShopifyCartContext.Provider>
  );
}

export function useShopifyCart() {
  const ctx = useContext(ShopifyCartContext);
  if (!ctx) throw new Error("useShopifyCart must be used within ShopifyCartProvider");
  return ctx;
}
