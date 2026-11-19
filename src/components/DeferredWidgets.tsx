"use client";

import dynamic from "next/dynamic";

// None of these are visible on first paint (drawers/modals are closed, the promo
// popup appears after a delay, floating buttons sit in a corner). Loading them
// as separate chunks after hydration keeps them out of the initial JavaScript
// that the browser must download, parse and run before the page becomes
// interactive. They read from the same context providers as before.
const CartDrawer = dynamic(() => import("@/components/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const ShopifyCartDrawer = dynamic(() => import("@/components/ShopifyCartDrawer").then((m) => m.ShopifyCartDrawer), { ssr: false });
const AuthModal = dynamic(() => import("@/components/AuthModal").then((m) => m.AuthModal), { ssr: false });
const FloatingWidgets = dynamic(() => import("@/components/FloatingWidgets").then((m) => m.FloatingWidgets), { ssr: false });
const PromoPopup = dynamic(() => import("@/components/PromoPopup").then((m) => m.PromoPopup), { ssr: false });

export function DeferredWidgets() {
  return (
    <>
      <CartDrawer />
      <ShopifyCartDrawer />
      <AuthModal />
      <FloatingWidgets />
      <PromoPopup />
    </>
  );
}
