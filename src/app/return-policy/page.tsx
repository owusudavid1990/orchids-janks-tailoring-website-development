"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Scissors, PackageCheck, RefreshCcw, Banknote, XCircle, Globe2, Mail } from "lucide-react";

const sections = [
  {
    id: "bespoke",
    icon: Scissors,
    title: "Bespoke & Made-to-Measure Garments",
    content: `Because every bespoke suit, bespoke shirt, made-to-measure garment, and alteration is cut and constructed specifically for you, these are **non-refundable once cutting has started**. However, if there is an issue with craftsmanship, fit based on the measurements you provided, or if the item arrives damaged or incorrect, we will work with you to put it right.

A **70% deposit** is required before work begins on your garment, with the remaining balance due before your garment is released to you.`,
  },
  {
    id: "accessories",
    icon: PackageCheck,
    title: "Ready-to-Wear Accessories",
    content: `This covers ties, pocket squares, cufflinks, and other items purchased through our online shop.

You may return items within **30 days** of delivery. Returned items must be in their original condition — unworn, unused, with tags attached, and in original packaging — and proof of purchase is required. The customer is responsible for return shipping costs. Returned items are examined for wear and damage before an exchange or refund is approved.`,
  },
  {
    id: "exceptions",
    icon: XCircle,
    title: "Exceptions / Non-Returnable Items",
    content: `Because of their personalised nature, the following items cannot be returned:

Made-to-measure garments
Custom or personalised items
Sale items

If you're unsure whether your item qualifies, reach out and we'll be happy to advise.`,
  },
  {
    id: "refunds",
    icon: Banknote,
    title: "Refunds",
    content: `Approved refunds are issued to your original payment method and will reflect in your account within **3–6 working days** of us receiving and approving the returned item. Your bank or card provider may take additional time to process the refund.

If more than 10 working days have passed since your refund was approved, contact us at jankstailoring@gmail.com. Store credit is not currently offered.`,
  },
  {
    id: "exchanges",
    icon: RefreshCcw,
    title: "Exchanges",
    content: `Exchanges are available once the returned item has been examined and found free of wear or damage. The quickest way to exchange is to return the item once approved and place a new order for the replacement.`,
  },
  {
    id: "eu",
    icon: Globe2,
    title: "European Union 14-Day Cooling-Off Period",
    content: `If your order is being shipped to the EU, you have the right to cancel or return non-custom items within 14 days for any reason. Items must be unworn, unused, with tags, and in original packaging, and you must provide proof of purchase.

Made-to-measure and personalised garments are exempt from this cooling-off period.`,
  },
  {
    id: "contact",
    icon: Mail,
    title: "Start a Return",
    content: `To start a return, contact us with your order details:

**JANKS Tailoring Ltd**
3rd Floor, 86-90 Paul Street
London, EC2A 4NE

Email: jankstailoring@gmail.com
Phone: +44 7828 338172`,
  },
];

export default function ReturnPolicyPage() {
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
              Return & Refund Policy
            </h1>
            <p className="text-cream/50 text-sm leading-relaxed max-w-2xl">
              How returns, exchanges, and refunds work for bespoke garments and shop accessories.
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
              <PackageCheck size={20} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h3 className="font-cinzel text-lg mb-2">Questions About a Return?</h3>
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
