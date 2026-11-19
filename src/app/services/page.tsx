"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight, Plus, Minus } from "lucide-react";

/* ───────────────────────────────────────────────────────────────────────────
   IMAGES — to change one, drop a new file into /public and update the path.
   Portrait crops work best; these render at 4:5.
   ─────────────────────────────────────────────────────────────────────────── */
const IMAGES = {
  heritage: "/service-heritage-hero.webp",
  confidence: "/service-confidence-hero.jpg",
  sartorial: "/service-sartorial-jacket.jpg",
  hero: "/hero-jacquard-lapel-bw.jpg",
};

/* ── The three approaches ─────────────────────────────────────────────────── */
const collections = [
  {
    id: "heritage",
    title: "Heritage",
    subtitle: "Traditional Craftsmanship",
    lead: "Made the way it was made before shortcuts existed.",
    description:
      "A canvas laid inside the chest so the jacket takes on your posture over years, rather than losing its shape in months. Buttonholes worked by hand. Cloth chosen for how it wears in, not how it photographs on the first day.",
    features: [
      "Hand-stitched buttonholes",
      "Traditional canvas construction",
      "Heritage cloth selection",
      "Classic silhouettes",
    ],
    image: IMAGES.heritage,
  },
  {
    id: "confidence",
    title: "Confidence",
    subtitle: "Power Dressing",
    lead: "For the rooms where you're read before you speak.",
    description:
      "A structured shoulder and a clean line through the chest. Cut close enough to look deliberate, generous enough to work a full day in. Quiet cloth, considered proportion — presence without anything that shouts.",
    features: [
      "Structured shoulder construction",
      "Considered proportion",
      "Premium wool and silk blends",
      "Executive styling",
    ],
    image: IMAGES.confidence,
  },
  {
    id: "sartorial",
    title: "Sartorial",
    subtitle: "Occasion & Celebration",
    lead: "Cloth that speaks first.",
    description:
      "Brocades, jacquards and velvets cut on a clean modern line, so the cloth carries the interest and the tailoring stays quiet beneath it. For the occasions where turning up in plain navy isn't the point.",
    features: [
      "Brocade, jacquard and velvet",
      "Contemporary cuts",
      "Contrast lapels and detailing",
      "Weddings and occasion wear",
    ],
    image: IMAGES.sartorial,
  },
];

/* ── What we actually make. Prices and durations match the booking page. ──── */
const offerings = [
  {
    name: "Consultation",
    // Deliberately not labelled free — matches the wording on the booking page
    price: "By appointment",
    meta: "30 minutes",
    description:
      "A conversation before any commitment. Talk through the occasion, the cloth and what you already own. Nothing is measured or ordered unless you want it to be.",
    href: "/book",
  },
  {
    name: "Bespoke Suit",
    price: "From £1,200",
    meta: "Allow 4–6 weeks",
    description:
      "A pattern drafted for you alone, cut and constructed from scratch. Multiple fittings, and every detail — cloth, lining, buttons, pockets — decided by you.",
    href: "/book",
  },
  {
    name: "Made-to-Measure",
    price: "From £650",
    meta: "Allow 4–6 weeks",
    description:
      "An existing block adjusted to your measurements. Much of the character of bespoke, at a lower cost and with fewer fittings.",
    href: "/book",
  },
  {
    name: "Custom Shirt",
    price: "From £75",
    meta: "Collar, cuff and cloth to your specification",
    description:
      "Collar shape, cuff, placket and cloth chosen and cut to your measurements. Worth doing in pairs — the difference against off-the-peg is most obvious on a shirt.",
    href: "/book",
  },
  {
    name: "Alterations",
    price: "From £50",
    meta: "Garments you already own",
    description:
      "Sleeves shortened, waists taken in, jackets rebalanced. Bring us something that never quite fitted and we'll tell you honestly whether it can be saved.",
    href: "/book",
  },
];

/* ── How a commission runs ────────────────────────────────────────────────── */
const process = [
  {
    step: "01",
    title: "Consultation",
    body: "We talk through the occasion, your wardrobe and what you want the garment to do. At our studio, or at your home or office. You're under no obligation to proceed.",
    image: "/work-consultation.jpeg",
  },
  {
    step: "02",
    title: "Measure & Cloth",
    body: "Measurements are taken and the cloth, lining and details are chosen together. A 70% deposit is taken before work begins.",
    image: "/work-measurements.jpeg",
  },
  {
    step: "03",
    title: "Fittings",
    body: "The garment is fitted on you and adjusted — on your body, not a mannequin. Private fittings can be arranged at your home or office.",
    image: "/work-first-fitting.jpeg",
  },
  {
    step: "04",
    title: "Collection",
    body: "Collect in person, or have it sent by DHL. Allow four to six weeks from the first measurement.",
    image: "/work-final-fitting.webp",
  },
];

/* ── Questions clients actually ask ───────────────────────────────────────── */
const faqs = [
  {
    q: "How long does a commission take?",
    a: "Allow four to six weeks from your first measurement. If you have a date to work to — a wedding, an event — tell us at the consultation and we'll be straight with you about whether it's achievable.",
  },
  {
    q: "What is your payment structure?",
    a: "A 70% deposit is taken before any work begins, with the balance due on completion. You'll be given a firm figure at the consultation, so nothing about the cost comes as a surprise later.",
  },
  {
    q: "What is the cancellation process?",
    a: "Consultations can be cancelled or rearranged at any time — reply to your confirmation email and we'll sort it. Once cutting has started, bespoke and made-to-measure garments cannot be refunded: the cloth has been cut to your pattern and can't be used for anyone else.",
  },
  {
    q: "Where do fittings take place?",
    a: "Private fittings can be arranged at your home or your office anywhere in London, as well as at our studio — whichever suits you.",
  },
  {
    q: "Do you deliver outside London?",
    a: "Yes. Finished garments are sent by DHL, with tracking. UK delivery is typically three to four working days, and we ship internationally.",
  },
  {
    q: "I'm not sure which service I need.",
    a: "Then book the consultation. That's what it's for — describing what you want in plain language and letting us tell you what it takes.",
  },
];

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <Image
          src={IMAGES.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-5">
              Our Expertise
            </span>
            <h1 className="font-cinzel text-5xl lg:text-8xl text-cream leading-[0.95] mb-8">
              Services
            </h1>
            <p className="text-cream/70 max-w-xl leading-relaxed text-lg">
              Three approaches to the same intention — a garment that fits you,
              made in London, by people who will tell you the truth about what
              suits you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Jump between the three ───────────────────────────────────────── */}
      <nav
        aria-label="Our approaches"
        className="sticky top-20 z-30 bg-cream/85 dark:bg-black/85 backdrop-blur-md border-b border-charcoal/10 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ul className="flex items-center gap-6 sm:gap-10 overflow-x-auto py-4">
            {collections.map((c, i) => (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#${c.id}`}
                  className="group flex items-baseline gap-2 text-[11px] tracking-[0.22em] uppercase text-charcoal/50 dark:text-white/50 hover:text-charcoal dark:hover:text-white transition-colors"
                >
                  <span className="text-gold">0{i + 1}</span>
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── The three approaches ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 overflow-hidden">
        {collections.map((c, index) => {
          const flipped = index % 2 === 1;
          return (
            <motion.article
              key={c.id}
              id={c.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
              className={`relative scroll-mt-36 ${
                index !== collections.length - 1 ? "mb-24 lg:mb-36" : ""
              }`}
            >
              {/* Oversized numeral, sitting behind everything as a watermark */}
              <span
                aria-hidden
                className={`pointer-events-none absolute -top-8 lg:-top-16 hidden sm:block font-cinzel text-[120px] lg:text-[220px] leading-none text-charcoal/[0.05] dark:text-white/[0.05] select-none ${
                  flipped ? "right-6 lg:right-16" : "left-6 lg:left-16"
                }`}
              >
                0{index + 1}
              </span>

              <div className="relative max-w-[1500px] mx-auto lg:grid lg:grid-cols-12 lg:items-center">
                {/* Image — runs wide, to the edge of the page on its own side */}
                {/* Both cells are pinned to row 1 — without that, grid
                    auto-placement drops the image into a second row whenever
                    the copy panel claims row 1 */}
                <div
                  className={`relative lg:col-span-7 lg:row-start-1 ${
                    flipped ? "lg:col-start-6" : "lg:col-start-1"
                  }`}
                >
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-charcoal/5 dark:bg-white/5">
                    <Image
                      src={c.image}
                      alt={`${c.title} — ${c.subtitle}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
                    />
                  </div>
                </div>

                {/* Copy — overlaps the image on desktop so the two read as one object */}
                <div
                  className={`relative z-10 lg:col-span-6 lg:row-start-1 ${
                    flipped ? "lg:col-start-1 lg:-mr-16" : "lg:col-start-7 lg:-ml-16"
                  }`}
                >
                  <div className="bg-cream dark:bg-black border border-charcoal/10 dark:border-white/10 px-7 py-10 sm:px-10 lg:px-12 lg:py-14 -mt-12 mx-4 lg:mt-0 lg:mx-0 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
                    <span className="text-[11px] tracking-[0.28em] uppercase text-gold">
                      {c.subtitle}
                    </span>
                    <h2 className="font-cinzel text-4xl lg:text-6xl text-charcoal dark:text-white mt-4 mb-6 leading-[1.03]">
                      {c.title}
                    </h2>

                    <p className="font-cinzel text-xl lg:text-2xl text-charcoal dark:text-white/90 leading-snug mb-5">
                      {c.lead}
                    </p>
                    <p className="text-charcoal/70 dark:text-white/60 leading-relaxed mb-9">
                      {c.description}
                    </p>

                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-10 border-t border-charcoal/10 dark:border-white/10 pt-8">
                      {c.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-charcoal/80 dark:text-white/70 text-sm"
                        >
                          <span className="w-1 h-1 bg-gold rounded-full shrink-0 mt-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/book"
                      className="group inline-flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-cream bg-charcoal dark:bg-white dark:text-charcoal px-7 py-4 hover:bg-gold dark:hover:bg-gold hover:text-charcoal transition-all duration-300"
                    >
                      Book a Consultation
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      {/* ── What we make ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-charcoal/[0.03] dark:bg-white/[0.03] border-y border-charcoal/10 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 lg:mb-20"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-4">
              What We Make
            </span>
            <h2 className="font-cinzel text-3xl lg:text-5xl text-charcoal dark:text-white leading-[1.1] max-w-xl">
              Book Appointment
            </h2>
          </motion.div>

          <div className="divide-y divide-charcoal/10 dark:divide-white/10 border-t border-charcoal/10 dark:border-white/10">
            {offerings.map((o, i) => (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group grid md:grid-cols-[1fr_auto] gap-6 md:gap-12 py-8 lg:py-10"
              >
                <div className="max-w-xl">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                    <h3 className="font-cinzel text-2xl lg:text-3xl text-charcoal dark:text-white">
                      {o.name}
                    </h3>
                    <span className="text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">
                      {o.meta}
                    </span>
                  </div>
                  <p className="text-charcoal/70 dark:text-white/60 text-sm leading-relaxed">
                    {o.description}
                  </p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
                  <span className="font-cinzel text-xl lg:text-2xl text-gold whitespace-nowrap">
                    {o.price}
                  </span>
                  <Link
                    href={o.href}
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-charcoal/60 dark:text-white/60 hover:text-gold border-b border-charcoal/20 dark:border-white/20 hover:border-gold pb-1 transition-colors whitespace-nowrap"
                  >
                    Book
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-charcoal/40 dark:text-white/35 text-xs mt-10 leading-relaxed max-w-lg">
            Prices are starting points — the cloth you choose is the largest
            variable. You&apos;ll be given a firm figure at the consultation,
            before anything is committed to.
          </p>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 lg:mb-20 max-w-xl"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-4">
              The Process
            </span>
            <h2 className="font-cinzel text-3xl lg:text-5xl text-charcoal dark:text-white leading-[1.1]">
              From conversation to collection
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-charcoal/5 dark:bg-white/5">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute top-4 left-4 font-cinzel text-2xl text-cream drop-shadow-lg">
                    {p.step}
                  </span>
                </div>
                <h3 className="font-cinzel text-xl text-charcoal dark:text-white mb-3">
                  {p.title}
                </h3>
                <p className="text-charcoal/65 dark:text-white/55 text-sm leading-relaxed">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Questions ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-charcoal/[0.03] dark:bg-white/[0.03] border-y border-charcoal/10 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-4">
              Before You Book
            </span>
            <h2 className="font-cinzel text-3xl lg:text-5xl text-charcoal dark:text-white leading-[1.1]">
              Questions worth asking
            </h2>
          </motion.div>

          <div className="divide-y divide-charcoal/10 dark:divide-white/10 border-y border-charcoal/10 dark:border-white/10">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  >
                    <span className="font-cinzel text-lg lg:text-xl text-charcoal dark:text-white group-hover:text-gold transition-colors">
                      {faq.q}
                    </span>
                    <span className="shrink-0 mt-1 text-charcoal/40 dark:text-white/40 group-hover:text-gold transition-colors">
                      {open ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  {open && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="text-charcoal/70 dark:text-white/60 text-sm leading-relaxed pb-6 max-w-2xl overflow-hidden"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Closing ──────────────────────────────────────────────────────── */}
      <section className="relative py-28 lg:py-40 overflow-hidden">
        <Image
          src="/our-story-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/85" />

        <div className="relative max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-6">
              Confidence In Gentility
            </span>
            <h2 className="font-cinzel text-4xl lg:text-6xl text-cream leading-[1.05] mb-7">
              Start with a conversation
            </h2>
            <p className="text-cream/60 max-w-md mx-auto mb-11 leading-relaxed">
              A conversation first, with nothing committed. Come with an occasion
              in mind, or just a suit that has never fitted properly.
            </p>
            <Link
              href="/book"
              className="group inline-flex items-center gap-3 bg-gold text-charcoal text-[11px] tracking-[0.25em] uppercase px-10 py-5 hover:bg-cream transition-all duration-300"
            >
              Book a Consultation
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
