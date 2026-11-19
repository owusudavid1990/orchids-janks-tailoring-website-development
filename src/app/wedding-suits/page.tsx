import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Wedding Suits for the Groom and Groomsmen | JANKS Tailoring",
  description:
    "Wedding suits for the groom and groomsmen. Bespoke from £1,200, made-to-measure from £650. Appointment only — we travel to you. Every order is delivered.",
  alternates: { canonical: "https://jankstailoring.com/wedding-suits" },
};

const approaches = [
  {
    title: "The groom",
    price: "Bespoke from £1,200",
    body: "A pattern drafted for you alone, cut and constructed from scratch. Cloth, lining, buttons and pockets are decided with you. Multiple fittings. Allow four to six weeks from the first measurement.",
  },
  {
    title: "The groomsmen",
    price: "Made-to-measure from £650",
    body: "An existing block adjusted to each person's measurements, so a party can dress in the same cloth without one pattern standing in for everyone. Allow four to six weeks.",
  },
  {
    title: "The shirt",
    price: "Custom shirts from £75",
    body: "Collar, cuff, placket and cloth cut to the wearer's measurements. Worth doing with the suit — the difference against off-the-peg is most obvious on a shirt.",
  },
];

export default function WeddingSuitsPage() {
  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <Image
          src="/suits-collection.webp"
          alt="A suit by JANKS Tailoring"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-5">Wedding</span>
          <h1 className="font-cinzel text-4xl lg:text-6xl text-cream leading-[1.05] mb-8 max-w-4xl">
            Wedding Suits for the Groom and Groomsmen
          </h1>
          <p className="text-cream/70 max-w-xl leading-relaxed text-lg">
            A wedding suit is a commission, not a hire. We cut it for the person who will wear it, then deliver it. Consultations are by appointment only — we travel to you.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="divide-y divide-charcoal/10 dark:divide-white/10 border-y border-charcoal/10 dark:border-white/10">
            {approaches.map((item) => (
              <div key={item.title} className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-12 py-8 lg:py-10">
                <div className="max-w-xl">
                  <h2 className="font-cinzel text-2xl lg:text-3xl text-charcoal dark:text-white mb-3">{item.title}</h2>
                  <p className="text-charcoal/70 dark:text-white/60 text-sm leading-relaxed">{item.body}</p>
                </div>
                <p className="font-cinzel text-xl text-gold">{item.price}</p>
              </div>
            ))}
          </div>
          <p className="text-charcoal/50 dark:text-white/40 text-sm leading-relaxed mt-8 max-w-2xl">
            Prices are starting points. The cloth you choose is the largest variable. You are given a firm figure at the consultation, before anything is committed to. A 70% deposit is taken before work begins, with the balance due before the garment is delivered.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-charcoal text-cream">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <h2 className="font-cinzel text-3xl lg:text-5xl leading-[1.1] mb-8">How a wedding commission runs</h2>
          <ol className="space-y-6 text-sm leading-relaxed text-cream/70">
            <li><span className="text-gold font-cinzel mr-3">01</span>Book a private consultation. We travel to you, at home or in the office. Nothing is measured or ordered unless you want it to be.</li>
            <li><span className="text-gold font-cinzel mr-3">02</span>We take 15+ measurements, including posture and proportion, and choose the cloth together.</li>
            <li><span className="text-gold font-cinzel mr-3">03</span>The garment is fitted on the person who will wear it. Private fittings are at your home or office.</li>
            <li><span className="text-gold font-cinzel mr-3">04</span>Every order is delivered. We have no shop, and we do not offer collection in person.</li>
          </ol>
          <p className="text-cream/50 text-sm leading-relaxed mt-10">
            Registered office: 3rd Floor, 86-90 Paul Street, London EC2A 4NE. This is our registered business address, not a shop.
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
