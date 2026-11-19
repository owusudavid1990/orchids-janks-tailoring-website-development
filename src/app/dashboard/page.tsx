"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogOut, ShoppingBag, Calendar, User, ChevronRight, Package, Scissors, Mail, Clock, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { getCart, formatPrice } from "@/lib/shopify-storefront";
import { SERVICES, BOOKING_STEPS } from "@/config/booking-form";

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      images: { edges: { node: { url: string; altText: string | null } }[] };
    };
  };
}

interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  lines: { edges: { node: CartLine }[] };
}

interface BespokeCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface BookingDraft {
  step: number;
  selectedService: string;
  formData: { firstName: string; lastName: string; email: string; phone: string; notes: string };
}

// Read from the booking config so this can't drift out of step when a
// service is renamed or added
const serviceLabels: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.name])
);

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const [bespokeItems, setBespokeItems] = useState<BespokeCartItem[]>([]);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  const [cartLoading, setCartLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Load cart + booking draft from localStorage
  useEffect(() => {
    if (!user) return;

    // Shopify cart
    const cartId = localStorage.getItem("janks-shopify-cart-id");
    if (cartId) {
      getCart(cartId)
        .then((cart) => setShopifyCart(cart as ShopifyCart | null))
        .catch(() => {})
        .finally(() => setCartLoading(false));
    } else {
      setCartLoading(false);
    }

    // Bespoke cart
    try {
      const raw = localStorage.getItem("janks-cart");
      if (raw) setBespokeItems(JSON.parse(raw));
    } catch {}

    // Booking draft
    try {
      const raw = localStorage.getItem("janks-booking-draft");
      if (raw) setBookingDraft(JSON.parse(raw));
    } catch {}
  }, [user]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Member";
  const firstName = displayName.split(" ")[0];
  const memberSince = new Date(user.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const shopifyLines = shopifyCart?.lines?.edges?.map((e) => e.node) ?? [];
  const shopifyTotal = shopifyCart?.cost?.totalAmount;
  const hasShopifyItems = shopifyLines.length > 0;
  const hasBespokeItems = bespokeItems.length > 0;
  const hasAnyItems = hasShopifyItems || hasBespokeItems;

  const handleCheckout = () => {
    if (shopifyCart?.checkoutUrl) {
      (window.top ?? window).location.href = shopifyCart.checkoutUrl;
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Navigation />

      {/* Hero header */}
      <section className="pt-32 pb-12 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-start justify-between flex-wrap gap-6"
          >
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Member Dashboard</p>
              <h1 className="font-cinzel text-3xl md:text-4xl text-white font-normal">
                Welcome back, {firstName}
              </h1>
              <p className="text-white/40 text-sm mt-2">Member since {memberSince}</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-[10px] tracking-[0.15em] uppercase transition-all"
            >
              <LogOut size={12} />
              Sign Out
            </button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* Quick actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/book", icon: Scissors, label: "Book a Consultation", desc: "We travel to you" },
              { href: "/category", icon: ShoppingBag, label: "Shop Accessories", desc: "Ties, cufflinks & more" },
              { href: "/contact", icon: Mail, label: "Contact Us", desc: "Get in touch" },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 p-4 border border-white/8 hover:border-gold/40 bg-white/2 hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-10 h-10 border border-white/10 group-hover:border-gold/30 flex items-center justify-center transition-colors shrink-0">
                  <Icon size={16} className="text-white/40 group-hover:text-gold transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-white group-hover:text-gold transition-colors">{label}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{desc}</p>
                </div>
                <ChevronRight size={14} className="text-white/20 group-hover:text-gold ml-auto shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Booking draft resume */}
        {bookingDraft && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">In Progress</p>
            <div className="border border-gold/20 bg-gold/5 p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
                  <Clock size={16} className="text-gold" />
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-white">
                    Unfinished Booking
                  </p>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    {serviceLabels[bookingDraft.selectedService] || bookingDraft.selectedService || "Service selected"} · Step {bookingDraft.step} of {BOOKING_STEPS}
                  </p>
                </div>
              </div>
              <Link
                href="/book"
                className="flex items-center gap-2 px-5 py-2.5 border border-gold text-gold hover:bg-gold hover:text-charcoal text-[10px] tracking-[0.2em] uppercase transition-all"
              >
                Resume <ArrowRight size={12} />
              </Link>
            </div>
          </motion.section>
        )}

        {/* Your Bag */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">Your Bag</p>

          {cartLoading ? (
            <div className="border border-white/8 p-8 flex items-center justify-center">
              <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : !hasAnyItems ? (
            <div className="border border-white/8 p-10 text-center">
              <ShoppingBag size={28} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/40 text-sm">Your bag is empty</p>
              <p className="text-white/20 text-xs mt-1">Add accessories or book a fitting to get started</p>
            </div>
          ) : (
            <div className="border border-white/8">
              {/* Shopify items */}
              {hasShopifyItems && (
                <>
                  <div className="px-5 py-3 border-b border-white/5">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/25">Accessories</p>
                  </div>
                  {shopifyLines.map((line) => {
                    const img = line.merchandise.product.images.edges[0]?.node;
                    return (
                      <div key={line.id} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0">
                        <div className="w-14 h-14 bg-white/5 shrink-0 overflow-hidden">
                          {img && (
                            <Image src={img.url} alt={img.altText || line.merchandise.product.title} width={56} height={56} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] tracking-[0.05em] text-white truncate">{line.merchandise.product.title}</p>
                          {line.merchandise.title !== "Default Title" && (
                            <p className="text-[10px] text-white/40 mt-0.5">{line.merchandise.title}</p>
                          )}
                          <p className="text-[10px] text-white/30 mt-0.5">Qty: {line.quantity}</p>
                        </div>
                        <p className="text-[11px] text-gold shrink-0">
                          {formatPrice(
                            String(parseFloat(line.merchandise.price.amount) * line.quantity),
                            line.merchandise.price.currencyCode
                          )}
                        </p>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Bespoke items */}
              {hasBespokeItems && (
                <>
                  <div className="px-5 py-3 border-b border-white/5">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/25">Bespoke Services</p>
                  </div>
                  {bespokeItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0">
                      <div className="w-14 h-14 bg-white/5 shrink-0 flex items-center justify-center">
                        <Scissors size={18} className="text-white/20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] tracking-[0.05em] text-white truncate">{item.name}</p>
                        {item.size && <p className="text-[10px] text-white/40 mt-0.5">Size: {item.size}</p>}
                        <p className="text-[10px] text-white/30 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[11px] text-gold shrink-0">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {/* Totals + checkout */}
              {hasShopifyItems && shopifyTotal && (
                <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Subtotal</p>
                    <p className="text-lg text-white font-light mt-0.5">
                      {formatPrice(shopifyTotal.amount, shopifyTotal.currencyCode)}
                    </p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="flex items-center gap-2 px-6 py-3 bg-gold text-charcoal text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all"
                  >
                    Continue to Checkout <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.section>

        {/* Account details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">Account Details</p>
          <div className="border border-white/8 divide-y divide-white/5">
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center shrink-0">
                <span className="text-sm font-medium text-charcoal">{user.email?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.1em] text-white">{displayName}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{user.email}</p>
              </div>
              <span className="ml-auto text-[9px] tracking-[0.2em] uppercase px-2 py-1 border border-gold/30 text-gold">
                JANKS Member
              </span>
            </div>
            <div className="flex items-center px-5 py-3">
              <div className="flex items-center gap-3 text-white/30">
                <Calendar size={12} />
                <p className="text-[10px]">Member since {memberSince}</p>
              </div>
            </div>
            <div className="flex items-center px-5 py-3">
              <div className="flex items-center gap-3 text-white/30">
                <Package size={12} />
                <p className="text-[10px]">Orders appear here after purchase via Shopify checkout</p>
              </div>
            </div>
          </div>
        </motion.section>

      </div>

      <Footer />
    </main>
  );
}
