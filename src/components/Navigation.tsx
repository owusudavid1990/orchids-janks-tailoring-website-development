"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, ShoppingBag, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { useAuth } from "@/lib/auth-context";
import { useSearch } from "./SearchModal";
import { LogOut } from "lucide-react";

// Six links, split evenly either side of the logo. Keep it at six — an odd
// number leaves the logo off-centre against the text.
const navLinks = [
{ href: "/about", label: "About" },
{ href: "/services", label: "Services" },
{ href: "/category", label: "Shop" },
{ href: "/gallery", label: "Gallery" },
{ href: "/style-guide", label: "Academy" },
{ href: "/contact", label: "Contact" }];

const HALF = navLinks.length / 2;

/** Shared styling so every link is the same weight and spacing. */
const linkClass =
  "relative px-4 py-2 text-[11px] tracking-[0.22em] uppercase text-charcoal/75 dark:text-white/75 hover:text-charcoal dark:hover:text-white transition-colors duration-300 group whitespace-nowrap";

const underlineClass =
  "absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-gold group-hover:w-[calc(100%-2rem)] transition-all duration-500 ease-out";


export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  // The bar starts tall so the logo reads clearly, then eases down once the
  // visitor scrolls — the mark stays legible without occupying the page
  const [scrolled, setScrolled] = useState(false);
  // Account menu opens on click. It used to appear on hover only, which meant
  // clicking the button did nothing and touch devices couldn't reach it at all.
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the account menu on a click elsewhere or on Escape
  useEffect(() => {
    if (!accountOpen) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);
  const { openCart, totalItems } = useCart();
  const shopifyCart = useShopifyCart();
  const router = useRouter();

  const badgeCount = shopifyCart.itemCount > 0 ? shopifyCart.itemCount : totalItems;

  const handleCartClick = () => {
    if (shopifyCart.itemCount > 0) {
      shopifyCart.open();
    } else if (totalItems > 0) {
      openCart();
    } else {
      router.push("/category");
    }
  };
  const { user, openAuthModal, signOut } = useAuth();
  const { openSearch } = useSearch();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-cream/90 dark:bg-black/90 backdrop-blur-xl border-b border-charcoal/5 dark:border-white/5">
          <div className="max-w-[1800px] mx-auto">
            {/*
              Outer columns share the leftover space equally, so the logo
              column lands dead centre. Links are pushed to the inside edge of
              each column, which puts the same gap between SHOP and the logo
              as between the logo and GALLERY.
            */}
            <div
              className={`grid grid-cols-3 xl:grid-cols-[1fr_auto_1fr] items-center px-6 xl:px-16 transition-[height] duration-500 ease-out ${
                scrolled ? "h-[72px] xl:h-20" : "h-20 xl:h-[112px]"
              }`}
            >
              {/* ── Left: search pinned to the edge, links pushed toward the logo ── */}
              <div className="hidden xl:flex items-center gap-1">
                <button
                  className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal dark:hover:bg-white transition-all duration-300 shrink-0 mr-auto"
                  aria-label="Search"
                  onClick={openSearch}>

                  <Search size={16} className="text-charcoal dark:text-white group-hover:text-cream dark:group-hover:text-charcoal transition-colors" />
                </button>
                <div className="h-5 w-px bg-charcoal/10 dark:bg-white/10 mr-3" />
                {navLinks.slice(0, HALF).map((link) =>
              <Link key={link.href} href={link.href} className={linkClass}>
                    {link.label}
                    <span className={underlineClass} />
                  </Link>
              )}
              </div>

              {/* ── Centre: the logo ── */}
              {/* Equal padding either side is what makes the gap to SHOP and
                  the gap to GALLERY identical */}
              <div className="flex justify-start xl:justify-center xl:px-12">
                <Link href="/" className="group relative" aria-label="JANKS Tailoring — home">
                  <Image
                  src="/janks-logo.webp"
                  alt="JANKS Tailoring"
                  width={320}
                  height={128}
                  priority
                  className={`w-auto brightness-0 dark:brightness-0 dark:invert transition-all duration-500 ease-out group-hover:opacity-75 ${
                    scrolled ? "h-11 xl:h-14" : "h-14 xl:h-[88px]"
                  }`} />

                </Link>
              </div>

              {/* ── Right: links hug the logo, actions pinned to the edge ── */}
              <div className="hidden xl:flex items-center gap-1">
                {navLinks.slice(HALF).map((link) =>
              <Link key={link.href} href={link.href} className={linkClass}>
                    {link.label}
                    <span className={underlineClass} />
                  </Link>
              )}
                <div className="ml-auto" />
                <div className="h-5 w-px bg-charcoal/10 dark:bg-white/10 ml-3" />
                <button
                className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal dark:hover:bg-white transition-all duration-300 shrink-0"
                aria-label="Cart"
                onClick={handleCartClick}>
                  <ShoppingBag size={16} className="text-charcoal dark:text-white group-hover:text-cream dark:group-hover:text-charcoal transition-colors" />
                  {/* Only show the count when there's something in the bag */}
                  {badgeCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold rounded-full text-[9px] text-charcoal font-medium flex items-center justify-center">{badgeCount}</span>
                  )}
                </button>
                <Link
                href="/book"
                className="ml-3 px-6 py-3 text-[11px] tracking-[0.22em] uppercase text-cream bg-charcoal dark:bg-white dark:text-charcoal hover:bg-gold dark:hover:bg-gold hover:text-charcoal transition-all duration-300 whitespace-nowrap">
                  Book
                </Link>
                  {user ? (
                    <div className="relative ml-2" ref={accountRef}>
                      <button
                        onClick={() => setAccountOpen((o) => !o)}
                        className="group flex items-center gap-2 h-10 pl-1.5 pr-3 rounded-full bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal dark:hover:bg-white transition-all duration-300 shrink-0"
                        aria-label="Account menu"
                        aria-haspopup="menu"
                        aria-expanded={accountOpen}
                      >
                        <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-[11px] font-medium text-charcoal shrink-0">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        {/* Truncated on one line — a long name like "JANKS
                            Tailoring Admin" used to wrap onto three lines and
                            stretch the header out of shape */}
                        <span className="max-w-[110px] truncate whitespace-nowrap text-[10px] tracking-[0.1em] uppercase text-charcoal/70 dark:text-white/70 group-hover:text-cream dark:group-hover:text-charcoal transition-colors">
                          {user.user_metadata?.full_name || user.email?.split("@")[0]}
                        </span>
                      </button>

                      {accountOpen && (
                        <div
                          role="menu"
                          className="absolute right-0 top-full mt-2 w-56 bg-cream dark:bg-charcoal shadow-xl border border-charcoal/10 dark:border-white/10 z-50"
                        >
                          <div className="p-3 border-b border-charcoal/10 dark:border-white/10">
                            <p className="text-[10px] text-charcoal/50 dark:text-white/50 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/dashboard"
                            role="menuitem"
                            onClick={() => setAccountOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-3 text-[10px] tracking-[0.1em] uppercase text-charcoal/70 dark:text-white/70 hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <LayoutDashboard size={12} />
                            My Dashboard
                          </Link>
                          <button
                            role="menuitem"
                            onClick={async () => { setAccountOpen(false); await signOut(); router.push("/"); }}
                            className="w-full flex items-center gap-2 px-3 py-3 text-[10px] tracking-[0.1em] uppercase text-charcoal/70 dark:text-white/70 hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <LogOut size={12} />
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Icon only, matching search and cart. The word "Login"
                    // made the right-hand group wide enough to shove the logo
                    // off centre, and the icon is understood without it.
                    <button
                      onClick={openAuthModal}
                      className="group relative ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal dark:hover:bg-white transition-all duration-300 shrink-0"
                      aria-label="Sign in to your account"
                      title="Sign in"
                    >
                      <User size={16} className="text-charcoal dark:text-white group-hover:text-cream dark:group-hover:text-charcoal transition-colors" />
                    </button>
                  )}
              </div>

              <div className="flex xl:hidden items-center justify-end gap-2 col-span-2">
<button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 dark:bg-white/5"
                  aria-label="Search"
                  onClick={openSearch}>

                  <Search size={16} className="text-charcoal dark:text-white" />
                </button>
                <button
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 dark:bg-white/5"
                aria-label="Cart"
                onClick={handleCartClick}>

                  <ShoppingBag size={16} className="text-charcoal dark:text-white" />
                  {badgeCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold rounded-full text-[9px] text-charcoal font-medium flex items-center justify-center">{badgeCount}</span>
                  )}
                </button>
                <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 dark:bg-white/5"
                aria-label="Toggle menu">

                  {isOpen ? <X size={18} className="text-charcoal dark:text-white" /> : <Menu size={18} className="text-charcoal dark:text-white" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="xl:hidden fixed inset-0 bg-black/60 z-40"
                onClick={() => setIsOpen(false)}
              />
              {/* Slide-in panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 220 }}
                className="xl:hidden fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-black z-50 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                  <Image src="/janks-logo.webp" alt="JANKS" width={140} height={56} className="h-14 w-auto brightness-0 invert opacity-70" />
                  <button onClick={() => setIsOpen(false)} aria-label="Close menu" className="w-9 h-9 flex items-center justify-center border border-white/20 text-white hover:border-white transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Nav links */}
                <div className="flex-1 overflow-y-auto px-8 py-10">
                  <nav className="space-y-1">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + index * 0.07 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center justify-between py-4 border-b border-white/8 hover:border-white/20 transition-colors"
                        >
                          <span className="font-cinzel text-lg text-white group-hover:text-gold transition-colors duration-300">{link.label}</span>
                          <span className="text-[10px] tracking-[0.2em] text-white/20 group-hover:text-gold transition-colors">0{index + 1}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="px-8 py-8 border-t border-white/10 space-y-4"
                >
                  <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gold text-charcoal text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-cream transition-colors duration-300"
                  >
                    Book a private consultation — we travel to you.
                  </Link>
                  {user ? (
                    <>
                      {/* On a phone this is the only route to the dashboard —
                          the account menu it lives in is desktop-only */}
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-center gap-2 border border-white/20 hover:border-white text-white text-[11px] tracking-[0.15em] uppercase py-3.5 transition-colors"
                      >
                        <LayoutDashboard size={13} />My Dashboard
                      </Link>
                      <p className="text-center text-[10px] text-white/25 truncate">{user.email}</p>
                      <button
                        onClick={() => { signOut(); setIsOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white text-[11px] tracking-[0.15em] uppercase transition-colors"
                      >
                        <LogOut size={13} />Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { openAuthModal(); setIsOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white text-[11px] tracking-[0.15em] uppercase transition-colors"
                    >
                      <User size={13} />Login
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>);

}