"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Truck, Package, Globe2, MapPin, AlertTriangle, MapPinOff, Boxes, Mail } from "lucide-react";

const sections = [
  {
    id: "bespoke",
    icon: Package,
    title: "Bespoke & Made-to-Measure Garments",
    content: `Construction typically takes **4–6 weeks**. Once your garment is complete, it can be **shipped to you or collected in person** at our London atelier.

Private fittings at your home or office can also be arranged where convenient for both parties.`,
  },
  {
    id: "accessories",
    icon: Truck,
    title: "Ready-to-Wear Accessories",
    content: `Orders are processed once full payment is received, and are typically dispatched within **1–2 working days**. We ship via **DHL**, with tracking provided on every order.

**Within London** — from £6 (may vary based on your specific location)
**Elsewhere in the UK and internationally** — shipping is available; cost is calculated at checkout based on your delivery address`,
  },
  {
    id: "delivery-times",
    icon: Globe2,
    title: "Delivery Times",
    content: `**UK delivery** — 3–4 working days.

**International delivery** — delivery times vary by destination and will be confirmed by email, on your invoice, or by phone. International customers are responsible for any customs duties, import taxes, and local handling fees, which vary by country and are not included in our prices.`,
  },
  {
    id: "tracking",
    icon: MapPin,
    title: "Order Tracking",
    content: `All shop orders can be tracked from dispatch to delivery. Tracking details are sent to you once your order ships.`,
  },
  {
    id: "delivery-issues",
    icon: AlertTriangle,
    title: "Delivery Issues",
    content: `If your parcel is delayed, lost, or arrives damaged, contact us immediately at jankstailoring@gmail.com with your order number and tracking details, and we will work with the courier to resolve the issue. For damaged items, please include photos so we can assess the situation.`,
  },
  {
    id: "address",
    icon: MapPinOff,
    title: "Incorrect Address",
    content: `Customers are responsible for providing accurate shipping information. If an incorrect address is entered, we cannot guarantee recovery of the parcel, and additional shipping fees may apply for re-delivery.`,
  },
  {
    id: "split",
    icon: Boxes,
    title: "Split Shipments",
    content: `If your order contains multiple items, they may be shipped separately depending on availability and production timelines.`,
  },
  {
    id: "contact",
    icon: Mail,
    title: "Questions About Your Order",
    content: `**JANKS Tailoring Ltd**
3rd Floor, 86-90 Paul Street
London, EC2A 4NE

Email: jankstailoring@gmail.com
Phone: +44 7828 338172`,
  },
];

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-cream/40 block mb-4">Legal</span>
            <h1 className="font-cinzel text-4xl lg:text-6xl text-cream mb-6 leading-tight">
              Shipping Policy
            </h1>
            <p className="text-cream/50 text-sm leading-relaxed max-w-2xl">
              How we deliver bespoke garments and shop accessories, and what to expect along the way.
            </p>
            <p className="text-cream/30 text-xs mt-6 tracking-wide">
              Last updated: 16 August 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick navigation */}
      <section className="border-b border-charcoal/10 bg-white sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-[10px] tracking-[0.15em] uppercase text-charcoal/50 hover:text-charcoal whitespace-nowrap transition-colors duration-200"
              >
                {s.title.split(" ")[0]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Policy content */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="space-y-16">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="scroll-mt-32"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-charcoal flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-cream" />
                    </div>
                    <h2 className="font-cinzel text-xl lg:text-2xl text-charcoal">{section.title}</h2>
                  </div>
                  <div className="pl-14 border-l border-charcoal/10 ml-5">
                    {section.content.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        className="text-charcoal/70 text-sm leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: para.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, '<strong class="text-charcoal font-medium">$1</strong>') }}
                      />
                    ))}
                  </div>
                  {index < sections.length - 1 && (
                    <div className="mt-16 border-b border-charcoal/8" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20 p-8 bg-charcoal text-cream"
          >
            <div className="flex items-start gap-4">
              <Truck size={20} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h3 className="font-cinzel text-lg mb-2">Questions About Delivery?</h3>
                <p className="text-cream/60 text-sm leading-relaxed">
                  We're happy to help. Reach out and a member of the JANKS team will get back to you within 24 hours.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 mt-4 text-[11px] tracking-[0.2em] uppercase text-gold hover:text-cream transition-colors"
                >
                  Contact Us →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
