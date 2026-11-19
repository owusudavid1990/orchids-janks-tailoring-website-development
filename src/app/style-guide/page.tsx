"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Play, ArrowRight, Video, ChevronRight } from "lucide-react";

/*
 * The video library that used to sit here has been removed. It listed seven
 * episodes with titles, descriptions and stated runtimes ("18 min", "20 min")
 * for films that were never made — every card read "Video Coming Soon".
 *
 * Advertising content that doesn't exist is the sort of thing Google Merchant
 * Center treats as misrepresentation, and it isn't fair to visitors either.
 * The page now leads with the four essays that genuinely exist, and points at
 * the real YouTube channel for video.
 *
 * If films are made later, add them here with real links — not placeholders.
 */

const essays = [
  {
    slug: "behind-the-pattern-bespoke-suit",
    title: "Behind the Pattern: Making a Bespoke Suit from Scratch",
    excerpt:
      "A rare look inside the atelier — from the first consultation and chalk marks on cloth through to the final fitting. This is what bespoke really means.",
    image: "/suits-collection.webp",
    // Was "Atelier Vlog" — it's a written essay, and "vlog" implies video
    category: "From the Atelier",
    readTime: "5 min read",
  },
  {
    slug: "why-every-man-needs-one-bespoke-shirt",
    title: "Why Every Man Needs One Bespoke Shirt",
    excerpt:
      "Off-the-rail shirts are designed for a fictional average man. We explain why a single bespoke shirt will change how you think about your entire wardrobe.",
    image: "/hero-suit-1.webp",
    category: "Style Essay",
    readTime: "4 min read",
  },
  {
    slug: "unwritten-rules-of-black-tie-dressing",
    title: "The Unwritten Rules of Black Tie Dressing",
    excerpt:
      "Dinner jacket, bow tie, patent shoes — black tie has a strict vocabulary. Know the rules before you break them.",
    image: "/hero-suit-3.webp",
    category: "Occasion Dressing",
    readTime: "6 min read",
  },
  {
    slug: "colour-theory-for-men",
    title: "Colour Theory for Men: Building Harmonious Outfits",
    excerpt:
      "Navy and brown, charcoal and burgundy, tan and forest green — learn the colour pairings that elevate an outfit from good to exceptional.",
    image: "/hero-suit-4.jpeg",
    category: "Style Theory",
    readTime: "5 min read",
  },
];

const styleGuides = [
  {
    icon: "01",
    title: "The Anatomy of a Bespoke Suit",
    points: [
      "Canvassed vs fused construction",
      "Surgeon's cuffs & functional buttonholes",
      "Half-lining vs full-lining",
      "Pick stitching and hand finishing",
    ],
  },
  {
    icon: "02",
    title: "Reading Fabric & Cloth",
    points: [
      "Super numbers: what they actually mean",
      "Worsted vs woollen weaves",
      "Seasonal cloths: flannel, fresco, linen",
      "Pattern matching in checks & stripes",
    ],
  },
  {
    icon: "03",
    title: "The Fit Hierarchy",
    points: [
      "Shoulder — the most important dimension",
      "Chest suppression & waist shaping",
      "Trouser break: clean, half, full",
      "Sleeve pitch and roll",
    ],
  },
  {
    icon: "04",
    title: "Accessorising with Intention",
    points: [
      "Pocket square folds: TV, puff, three-point",
      "Tie width vs lapel width balance",
      "Cufflink occasions: when and which",
      "Belt vs braces — understanding the choice",
    ],
  },
];

export default function StyleGuidePage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/hero-suit-1.webp" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="text-[11px] tracking-[0.35em] uppercase text-gold block mb-5">
              Style Academy
            </span>
            <h1 className="font-cinzel text-5xl lg:text-7xl text-cream leading-[1.05] mb-6">
              Dress Better.<br />Live Sharper.
            </h1>
            <p className="text-cream/50 text-sm leading-relaxed max-w-lg">
              Style essays and reference guides from the JANKS atelier — what to look for
              in a garment, how cloth behaves, and the details worth paying for.
            </p>
            <div className="flex items-center gap-6 mt-10">
              <a
                href="https://youtube.com/@jankstailoring?si=FEwqqKDFy-IdMElm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-cream text-charcoal text-[11px] tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300"
              >
                <Play size={13} fill="currentColor" />
                Subscribe on YouTube
              </a>
              <Link
                href="/contact"
                className="text-[11px] tracking-[0.2em] uppercase text-cream/50 hover:text-cream transition-colors inline-flex items-center gap-2"
              >
                Book a Consultation <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Essays — the four that actually exist, at /style-guide/[slug] */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-3">Reading Room</span>
            <h2 className="font-cinzel text-3xl lg:text-4xl text-charcoal">Essays from the Atelier</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {essays.map((essay, index) => (
              <motion.div
                key={essay.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link href={`/style-guide/${essay.slug}`} className="group flex gap-6">
                  <div className="relative w-28 h-36 lg:w-36 lg:h-44 flex-shrink-0 overflow-hidden bg-charcoal">
                    <Image
                      src={essay.image}
                      alt={essay.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[9px] tracking-[0.2em] uppercase text-gold">{essay.category}</span>
                        <span className="text-[9px] text-charcoal/30">{essay.readTime}</span>
                      </div>
                      <h3 className="font-cinzel text-base lg:text-lg text-charcoal leading-snug mb-3 group-hover:text-gold transition-colors duration-300">
                        {essay.title}
                      </h3>
                      <p className="text-charcoal/50 text-xs leading-relaxed line-clamp-3">
                        {essay.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mt-4 text-charcoal/30 group-hover:text-charcoal transition-colors">
                      <span className="text-[10px] tracking-[0.15em] uppercase">Read More</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Guides */}
      <section className="py-20 lg:py-28 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-4">Knowledge Base</span>
            <h2 className="font-cinzel text-3xl lg:text-4xl text-cream">The JANKS Style Guides</h2>
            <p className="text-cream/40 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
              Curated reference guides on the principles that separate good dressing from great dressing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {styleGuides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-cream/10 p-6 hover:border-gold/30 transition-colors duration-300 group"
              >
                <span className="font-cinzel text-4xl text-cream/10 group-hover:text-gold/20 transition-colors duration-300 block mb-4">
                  {guide.icon}
                </span>
                <h3 className="font-cinzel text-sm text-cream mb-5 leading-snug">
                  {guide.title}
                </h3>
                <ul className="space-y-2.5">
                  {guide.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="text-gold mt-1 text-[8px]">â—†</span>
                      <span className="text-cream/40 text-xs leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24 bg-charcoal">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-cinzel text-2xl lg:text-4xl text-cream mb-4">
              Ready to Apply What You've Learned?
            </h2>
            <p className="text-cream/40 text-sm leading-relaxed mb-10 max-w-md mx-auto">
              Knowledge is the foundation. Now let our tailors craft something made entirely for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-3 px-8 py-4 bg-cream text-charcoal text-[11px] tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300"
              >
                Book a Consultation
                <ArrowRight size={13} />
              </Link>
              <a
                href="https://youtube.com/@jankstailoring?si=FEwqqKDFy-IdMElm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 border border-cream/20 text-cream text-[11px] tracking-[0.2em] uppercase hover:border-cream/60 transition-colors duration-300"
              >
                <Video size={13} />
                Visit Our YouTube Channel
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
