"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Building2, CreditCard, CalendarCheck, Ruler, CalendarX, Palette, Ban, RefreshCcw, Truck, Copyright, ShieldAlert, Scale, Mail } from "lucide-react";

const sections = [
  {
    id: "about",
    icon: Building2,
    title: "About Us",
    content: `This website is operated by **JANKS TAILORING LTD** (Company No. 16870658), incorporated in November 2025. The tailoring business was founded in 2016.

**Registered office:** 3rd Floor, 86-90 Paul Street, London EC2A 4NE.

This is our registered business address, not a shop. Consultations are by appointment only — we travel to you. Every order is delivered.

jankstailoring.com is the brand, booking and editorial site. shop.jankstailoring.com is the official shop for accessories.`,
  },
  {
    id: "orders",
    icon: CreditCard,
    title: "Orders & Payment",
    content: `Bespoke and made-to-measure commissions require a **70% deposit** before work begins, with the balance due before your garment is delivered to you.

Prices for ready-to-wear accessories are as shown at checkout in GBP (£). All information you provide with an order must be accurate and complete, and we accept the major payment methods displayed at checkout.`,
  },
  {
    id: "consultations",
    icon: CalendarCheck,
    title: "Consultations & Bookings",
    content: `A consultation is a conversation, with nothing committed. You may cancel or reschedule an appointment at any time.`,
  },
  {
    id: "made-to-measure",
    icon: Ruler,
    title: "Made-to-Measure Services",
    content: `By placing a made-to-measure or bespoke order, you acknowledge that these items are unique to you and cannot be resold, that production begins once your order is confirmed, and that you are responsible for the accuracy of any measurements not taken by us directly.

We reserve the right to decline orders that cannot be fulfilled due to design limitations or material availability.`,
  },
  {
    id: "returns",
    icon: RefreshCcw,
    title: "Returns & Refunds",
    content: `Ready-to-wear accessory returns are accepted within **30 days from delivery** if the item is unused, unworn, with tags and in original packaging. Bespoke and made-to-measure garments are non-refundable once cutting has started.

See our [Return & Refund Policy](/return-policy) for exchanges, refunds, and exceptions.`,
  },
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping & Delivery",
    content: `Every order is delivered. We do not offer collection in person.

See our [Shipping Policy](/shipping-policy) for delivery times and costs.`,
  },
  {
    id: "cancellations",
    icon: CalendarX,
    title: "Cancellations",
    content: `Because custom garments begin production quickly, made-to-measure orders can only be cancelled within 24 hours of purchase, and ready-to-wear orders may be cancelled before dispatch. After these periods, cancellations cannot be accepted.`,
  },
  {
    id: "accuracy",
    icon: Palette,
    title: "Accuracy of Information",
    content: `We aim to provide accurate product descriptions, fabric details, and imagery. However, colours may vary due to screen settings, fabric availability may change, and minor variations in stitching or finish may occur due to hand craftsmanship.`,
  },
  {
    id: "prohibited",
    icon: Ban,
    title: "Prohibited Uses",
    content: `You agree not to use our site or services for fraudulent or unlawful activity, interfering with website functionality, or copying or reverse-engineering our designs.`,
  },
  {
    id: "ip",
    icon: Copyright,
    title: "Intellectual Property",
    content: `All content on this website — text, photographs, logos, and design — is owned by JANKS Tailoring Ltd and may not be reproduced without permission.`,
  },
  {
    id: "liability",
    icon: ShieldAlert,
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law, JANKS Tailoring Ltd's liability for any claim arising from your use of this website or our services is limited to the amount you paid for the relevant product or service. We are not liable for indirect or consequential losses. Nothing in these Terms excludes or limits liability for death, personal injury caused by negligence, or fraud.`,
  },
  {
    id: "law",
    icon: Scale,
    title: "Governing Law",
    content: `These Terms are governed by the laws of **England and Wales**, and any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.`,
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact",
    content: `**JANKS TAILORING LTD**
Company No. 16870658
Registered office: 3rd Floor, 86-90 Paul Street
London EC2A 4NE

This is our registered business address, not a shop. Consultations are by appointment only — we travel to you. Every order is delivered.

Email: jankstailoring@gmail.com
Phone: +44 7565 533096`,
  },
];

function renderInline(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-charcoal font-medium">$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-charcoal underline hover:text-gold transition-colors">$1</a>');
}

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="text-cream/50 text-sm leading-relaxed max-w-2xl">
              The terms governing your use of the JANKS Tailoring website and our bespoke tailoring, made-to-measure, alteration, and retail services.
            </p>
            <p className="text-cream/30 text-xs mt-6 tracking-wide">
              Last updated: 19 November 2026
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
                    <span className="text-charcoal/20 text-xs font-cinzel w-6 shrink-0">{String(index + 1).padStart(2, "0")}</span>
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
                        dangerouslySetInnerHTML={{ __html: renderInline(para).replace(/\n/g, "<br/>") }}
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
              <Scale size={20} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h3 className="font-cinzel text-lg mb-2">Questions About These Terms?</h3>
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
