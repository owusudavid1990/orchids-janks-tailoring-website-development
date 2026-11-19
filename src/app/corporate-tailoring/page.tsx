import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate Tailoring in London | JANKS Tailoring",
  description:
    "Corporate tailoring in London. Bespoke suits from £1,200, made-to-measure from £650, shirts from £75. Appointment only — we travel to you. Every order is delivered.",
  alternates: { canonical: "https://jankstailoring.com/corporate-tailoring" },
};

const offerings = [
  {
    title: "Bespoke suit",
    price: "From £1,200",
    body: "A pattern drafted for you alone. A structured shoulder and a clean line through the chest, cut close enough to look deliberate and generous enough to work a full day in. Multiple fittings. Allow four to six weeks.",
  },
  {
    title: "Made-to-measure",
    price: "From £650",
    body: "An existing block adjusted to your measurements. Much of the character of bespoke, at a lower cost and with fewer fittings. Allow four to six weeks.",
  },
  {
    title: "Custom shirt",
    price: "From £75",
    body: "Collar shape, cuff, placket and cloth chosen and cut to your measurements. The difference against off-the-peg is most obvious on a shirt.",
  },
  {
    title: "Alterations",
    price: "From £50",
    body: "Sleeves shortened, waists taken in, jackets rebalanced. Show us a garment that never quite fitted — we travel to you — and we will tell you honestly whether it can be saved.",
  },
];

export default function CorporateTailoringPage() {
  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <Image
          src="/service-confidence-hero.jpg"
          alt="A tailored jacket by JANKS Tailoring"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-5">Work</span>
          <h1 className="font-cinzel text-4xl lg:text-6xl text-cream leading-[1.05] mb-8 max-w-4xl">
            Corporate Tailoring in London
          </h1>
          <p className="text-cream/70 max-w-xl leading-relaxed text-lg">
            For the rooms where you are read before you speak. Quiet cloth, considered proportion, and a fit taken from you — not from a size chart. Consultations are by appointment only. We travel to you.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="divide-y divide-charcoal/10 dark:divide-white/10 border-y border-charcoal/10 dark:border-white/10">
            {offerings.map((item) => (
              <div key={item.title} className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-12 py-8 lg:py-10">
                <div className="max-w-xl">
                  <h2 className="font-cinzel text-2xl lg:text-3xl text-charcoal dark:text-white mb-3">{item.title}</h2>
                  <p className="text-charcoal/70 dark:text-white/60 text-sm leading-relaxed">{item.body}</p>
                </div>
                <p className="font-cinzel text-xl text-gold whitespace-nowrap">{item.price}</p>
              </div>
            ))}
          </div>
          <p className="text-charcoal/50 dark:text-white/40 text-sm leading-relaxed mt-8 max-w-2xl">
            A 70% deposit is taken before work begins, with the balance due before the garment is delivered. We take 15+ measurements, including posture and proportion. Every order is delivered. JANKS Tailoring has no shop.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-charcoal text-cream">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <h2 className="font-cinzel text-3xl lg:text-5xl leading-[1.1] mb-6">Appointment only</h2>
          <p className="text-cream/70 text-sm leading-relaxed mb-6">
            Book a private consultation — we travel to you, at home or in the office. Nothing is committed at the conversation. If you have a date to work to, tell us then and we will be straight about whether four to six weeks is enough.
          </p>
          <p className="text-cream/50 text-sm leading-relaxed">
            Registered office: 3rd Floor, 86-90 Paul Street, London EC2A 4NE. This is our registered business address, not a shop. Phone +44 7565 533096. Email jankstailoring@gmail.com.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-3 bg-gold text-charcoal text-xs leading-snug px-8 py-4 hover:bg-cream transition-colors"
            >
              Book a private consultation — we travel to you.
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-3 border border-cream/20 text-cream text-xs leading-snug px-8 py-4 hover:border-gold hover:text-gold transition-colors"
            >
              All services
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
