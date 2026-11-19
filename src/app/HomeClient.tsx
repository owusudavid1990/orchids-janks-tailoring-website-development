"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ShopifyProductGrid } from "@/components/ShopifyProductGrid";
import { ArrowRight, ChevronDown, Star, Check, Volume2, VolumeX } from "lucide-react";

const heroSlides = [
  {
    src: "/hero-groomsmen-garden.jpg",
    headline: "Bespoke\nTailoring",
    sub: "Every garment begins with you.",
  },
  {
    src: "/hero-groom-bar.jpg",
    headline: "Made\nto Measure",
    sub: "Precision fit. Singular style.",
  },
  {
    src: "/hero-jacquard-lapel-bw.jpg",
    headline: "Crafted\nfor You",
    sub: "Heritage craft. Modern silhouette.",
  },
];

const services = [
  {
    label: "Bespoke Suit",
    desc: "Fully cut and crafted from scratch to your unique measurements and style.",
    image: "/suits-collection.webp",
    href: "/services",
    price: "From consultation",
  },
  {
    label: "Custom Shirt",
    desc: "A shirt built around your collar, chest, sleeve and posture — not a size chart.",
    image: "/hero-suit-1.webp",
    href: "/book",
    price: "From £75",
  },
  {
    label: "Made-to-Measure",
    desc: "Premium patterns adapted precisely to every dimension of your body.",
    image: "/work-mtm-hero.jpeg",
    href: "/services",
    price: "From £650",
  },
  {
    label: "Alterations",
    desc: "Expert adjustments that restore and perfect the fit of any garment.",
    image: "/work-alterations-hero.jpeg",
    href: "/services",
    price: "From consultation",
  },
];

const process = [
  { step: "01", title: "Consult", body: "We start with a conversation — your lifestyle, occasions, and aesthetic goals." },
  { step: "02", title: "Measure", body: "15+ precise measurements, including posture and proportion, taken when we visit you." },
  { step: "03", title: "Design", body: "Choose your cloth, lining, details, and silhouette from hundreds of options." },
  { step: "04", title: "Craft", body: "Your garment is built by hand and fitted until it is exactly right." },
];

const testimonials = [
  { quote: "The quality of their work was outstanding, and the attention to detail really impressed me. Everything was tailored perfectly, and the service was professional, friendly, and efficient.", author: "Jessica Amanfo", role: "Google Review" },
  { quote: "I wore one of their suits to a wedding and the quality was outstanding: the fit was spot on, the tailoring was clean and precise, and the fabric felt premium the moment I put it on. A cut that actually flatters.", author: "Theo Dwumah", role: "Wedding Client · Google Review" },
  { quote: "JANKs is your trusted brand for quality men's clothing and accessories. Choose JANKs, choose excellence.", author: "Vivian Manu", role: "Google Review" },
];

const stats = [
  { value: "500+", label: "Garments crafted" },
  { value: "98%", label: "Client satisfaction" },
  { value: "5★", label: "Average rating" },
  { value: "10+", label: "Years of craft" },
];

// The hero video is optional. page.tsx passes its URL only when public/hero-video.mp4
// exists, so a missing file no longer causes a 404 request on every visit.

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=JANKs+Tailoring+Ltd&stick=H4sIAAAAAAAA_-NgU1I1qDBKSjVJMjFPTE4xSLY0TLG0AgqZp5lYGhmkmVgkJhulJqUsYhX2cvTzLlYISczMyS_KzEtX8ClJAQA3caGpPwAAAA&hl=en&mat=CfjY04Q8A3VoElcBa0lj_2-1xkZaWdK2hWEBRfOhXnKMbKoxnvLfRYpcnV7okVUNwXUQtoe2Q0bV3y-0GiDWoL1r5uN23qyWBclJCLvMxWr5ygL-Y2bkOJ7Q52UEStMezJc&authuser=0";

export default function HomeClient({ heroVideo = null }: { heroVideo?: string | null }) {
  const [slide, setSlide] = useState(0);
  const [tIndex, setTIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [consultForm, setConsultForm] = useState({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" });
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${consultForm.firstName} ${consultForm.lastName}`.trim(), email: consultForm.email, phone: consultForm.phone, service: consultForm.service, message: consultForm.message, type: "consultation" }),
      });
    } catch (_) {}
    setConsultSubmitted(true);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newsletterEmail, email: newsletterEmail, message: "Newsletter subscription request.", type: "newsletter" }),
      });
    } catch (_) {}
    setNewsletterSubmitted(true);
  };
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTIndex((i) => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      {/* ── HERO: video background with image slideshow fallback ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">

        {/* Video background — shown once loaded */}
        {heroVideo && (
          <video
            ref={videoRef}
            src={heroVideo}
            autoPlay
            loop
            muted={muted}
            playsInline
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {/* Image slideshow fallback — hidden behind video when ready */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: videoReady ? 0 : 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[slide].src}
              alt={heroSlides[slide].headline}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/80 z-10" />

        {/* Mute toggle — only shown when video is playing */}
        {videoReady && (
          <button
            onClick={() => {
              setMuted((m) => !m);
              if (videoRef.current) videoRef.current.muted = !muted;
            }}
            className="absolute top-24 right-6 lg:right-16 z-20 w-10 h-10 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-cream/60 hover:text-cream hover:bg-black/50 transition-all"
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        )}

        {/* Hero text */}
        <div className="relative z-20 h-full flex flex-col justify-end px-6 lg:px-16 pb-20 lg:pb-28 max-w-[1800px] mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={videoReady ? "video" : slide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h1 className="font-cinzel text-[clamp(3.5rem,10vw,8rem)] text-cream leading-[1.0] tracking-[-0.02em] whitespace-pre-line">
                {videoReady ? "Bespoke\nTailoring" : heroSlides[slide].headline}
              </h1>
              <p className="text-cream/60 text-sm mt-4 tracking-wide">
                {videoReady ? "Every garment begins with you." : heroSlides[slide].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-10">
            {/* Slide dots — hidden when video plays */}
            <div className="flex gap-2">
              {!videoReady && heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === slide}
                  className={`relative before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] h-px transition-all duration-500 ${i === slide ? "w-10 bg-cream" : "w-4 bg-cream/30"}`}
                />
              ))}
            </div>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 bg-cream text-charcoal text-[11px] tracking-[0.25em] uppercase px-7 py-3.5 hover:bg-gold transition-colors duration-300"
            >
              Book a Consultation
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <ChevronDown size={18} className="text-cream/30" />
        </motion.div>
      </section>

      {/* ── FEATURED PRODUCTS (live from Shopify) ── */}
      {/* ── SHOP: featured products, live from Shopify ── */}
      <section className="py-16 lg:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-2">Shop</span>
              <h2 className="font-cinzel text-3xl lg:text-5xl text-charcoal leading-tight">Featured Pieces</h2>
              <p className="text-charcoal/50 text-sm mt-3 max-w-md">
                Ties, ready to ship.
              </p>
            </div>
            <Link href="/category" className="hidden lg:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal/40 hover:text-charcoal transition-colors duration-300">
              Shop All <ArrowRight size={12} />
            </Link>
          </div>
          <ShopifyProductGrid collectionId="687019229529" />
          <div className="mt-10 lg:hidden">
            <Link href="/category" className="inline-flex items-center gap-3 border border-charcoal/20 hover:border-gold hover:text-gold text-charcoal text-[11px] tracking-[0.25em] uppercase px-7 py-3.5 transition-all duration-300">
              Shop All <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES TILE GRID ── */}
      <section className="pt-14 lg:pt-20 pb-0 bg-cream">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-2">Services</span>
              <h2 className="font-cinzel text-3xl lg:text-5xl text-charcoal leading-tight">What We Create</h2>
            </div>
            <Link href="/services" className="hidden lg:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal/40 hover:text-charcoal transition-colors duration-300">
              All Services <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Full-bleed mosaic */}
        <div className="flex flex-col lg:flex-row gap-px" style={{ height: "clamp(520px, 72vh, 820px)" }}>

          {/* Left: hero tile */}
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="group relative overflow-hidden cursor-pointer h-72 lg:h-full lg:w-[58%] flex-shrink-0"
          >
            <Link href={services[0].href} className="absolute inset-0">
              <Image
                src={services[0].image}
                alt={services[0].label}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Layered gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/20 to-transparent" />

              {/* Number badge */}
              <div className="absolute top-6 left-6 w-9 h-9 border border-gold/60 flex items-center justify-center">
                <span className="font-cinzel text-gold text-[11px]">01</span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <span className="text-[10px] tracking-[0.25em] uppercase text-gold block mb-2">{services[0].price}</span>
                <h3 className="font-cinzel text-3xl lg:text-4xl text-cream group-hover:text-gold transition-colors duration-500 leading-tight">
                  {services[0].label}
                </h3>
                <p className="text-cream/55 text-sm mt-3 leading-relaxed max-w-xs hidden lg:block">
                  {services[0].desc}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 bg-gold/0 border border-cream/30 group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal text-cream text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 transition-all duration-400">
                  Explore <ArrowRight size={10} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right: 3 stacked tiles */}
          <div className="flex flex-row lg:flex-col gap-px lg:w-[42%] h-44 lg:h-full">
            {services.slice(1).map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
                className="group relative overflow-hidden cursor-pointer flex-1 min-h-0"
              >
                <Link href={s.href} className="absolute inset-0">
                  <Image
                    src={s.image}
                    alt={s.label}
                    fill
                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 33vw, 14vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />

                  {/* Number badge */}
                  <div className="absolute top-4 left-4 w-7 h-7 border border-gold/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-cinzel text-gold text-[10px]">0{i + 2}</span>
                  </div>

                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 flex items-end justify-between">
                    <div>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-gold block mb-0.5">{s.price}</span>
                      <h3 className="font-cinzel text-base lg:text-lg text-cream group-hover:text-gold transition-colors duration-300">
                        {s.label}
                      </h3>
                    </div>
                    <ArrowRight size={14} className="text-cream/30 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mb-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FULL-BLEED ABOUT SPLIT ── */}
      <section className="grid lg:grid-cols-2 min-h-[560px]">
        <div className="relative min-h-[320px] lg:min-h-0">
          <Image src="/service-heritage-hero.webp" alt="Bespoke garment by JANKS Tailoring" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-charcoal/20" />
        </div>
        <div className="relative flex items-center px-8 lg:px-16 py-16 lg:py-20 overflow-hidden">
          <Image src="/our-story-bg.png" alt="Cloth and tailoring by JANKS Tailoring" fill sizes="50vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-charcoal/75" />
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10 max-w-md"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-5">Our Story</span>
            <h2 className="font-cinzel text-3xl lg:text-4xl text-cream leading-tight mb-6">
              Founded on craft.<br />Built on fit.
            </h2>
            <p className="text-cream/50 text-sm leading-relaxed mb-4">
              Founded by Kwaku Acheampong, JANKS Tailoring brings together traditional British cutting technique and a contemporary eye for silhouette.
            </p>
            <p className="text-cream/50 text-sm leading-relaxed mb-8">
              Every garment we create begins with listening — to who you are, how you move, and how you want to be seen. Based in the heart of London, we believe clothing should be a tool of confidence, not an afterthought.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-cream border border-cream/20 px-6 py-3.5 hover:bg-cream hover:text-charcoal transition-all duration-300"
            >
              Meet Kwaku <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY SHOP GRID (hero placement) ── */}
      <section className="pt-16 lg:pt-24 pb-0 bg-cream">
        {/* Header — constrained */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-2">Shop</span>
              <h2 className="font-cinzel text-3xl lg:text-5xl text-charcoal leading-tight">Browse the Collection</h2>
              <p className="text-charcoal/50 text-sm mt-3 tracking-wide max-w-sm">Suits, shirts and trousers are made to order. Ties, cufflinks and pocket squares are ready to ship.</p>
            </div>
            <Link
              href="/category"
              className="hidden lg:inline-flex items-center gap-2 border border-charcoal/20 hover:border-charcoal px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-charcoal/60 hover:text-charcoal transition-all duration-300"
            >
              Shop All <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Tile grid — full bleed, no padding */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-cream/50">
          {[
            { label: "Suits", sub: "Bespoke & MTM", image: "/suits-collection.webp", href: "/services" },
            { label: "Shirts", sub: "Dress & Casual", image: "/hero-suit-3.webp", href: "/services" },
            { label: "Trousers", sub: "Flat & Pleated", image: "/trousers-collection.jpeg", href: "/services" },
            { label: "Ties", sub: "Ties, ready to ship", image: "/necktie-collection.webp", href: "/category/ties" },
            { label: "Cufflinks", sub: "Dress cufflinks", image: "/cufflink-collection.webp", href: "/category/cufflinks" },
            { label: "Pocket Squares", sub: "Ready to ship", image: "/pocket-square-collection.webp", href: "/category/pocket-squares" },
          ].map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              {(cat as any).comingSoon ? (
                <div className="group block cursor-default">
                  <div className="relative aspect-[2/3] overflow-hidden bg-charcoal/5">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 17vw"
                      className="object-cover brightness-50"
                    />
                    <div className="absolute inset-0 bg-charcoal/50" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-gold border border-gold/40 px-3 py-1 mb-3">Coming Soon</span>
                      <p className="text-[11px] tracking-[0.2em] uppercase text-cream font-semibold">{cat.label}</p>
                      <p className="text-[9px] tracking-[0.1em] text-cream/40 mt-0.5 uppercase">{cat.sub}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href={cat.href} className="group block">
                  <div className="relative aspect-[2/3] overflow-hidden bg-charcoal/5">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 17vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-x-0 bottom-0 px-4 pb-5 pt-8">
                      <p className="text-[11px] tracking-[0.2em] uppercase text-cream font-semibold group-hover:text-gold transition-colors duration-300">
                        {cat.label}
                      </p>
                      <p className="text-[9px] tracking-[0.1em] text-cream/50 mt-0.5 uppercase">{cat.sub}</p>
                    </div>
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-1.5 bg-cream text-charcoal text-[10px] tracking-[0.2em] uppercase px-4 py-2">
                        {cat.href.startsWith("/services") ? "View" : "Shop"} <ArrowRight size={9} />
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 pb-10 text-center lg:hidden px-6">
          <Link
            href="/category"
            className="inline-flex items-center gap-2 border border-charcoal/20 hover:border-charcoal px-6 py-3 text-[11px] tracking-[0.2em] uppercase text-charcoal/60 hover:text-charcoal transition-all duration-300"
            >
              Shop All Categories <ArrowRight size={12} />
            </Link>
          </div>
      </section>

      {/* ── PORTFOLIO SPLIT ── */}
      <section className="bg-white overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[640px] lg:min-h-[720px]">

          {/* Left: single full-bleed image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="relative lg:w-[52%] aspect-[4/5] lg:aspect-auto overflow-hidden"
          >
            <Image
              src="/hero-suit-1.webp"
              alt="JANKS bespoke portfolio"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/20 hidden lg:block" />
          </motion.div>

          {/* Right: editorial copy */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-[48%] flex flex-col justify-center px-8 lg:px-16 xl:px-20 py-16 lg:py-0"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-6">Portfolio</span>

            <h2 className="font-cinzel text-4xl lg:text-5xl xl:text-6xl text-charcoal leading-tight mb-8">
              Our Work
            </h2>

            <div className="w-10 h-px bg-gold mb-8" />

            <p className="text-charcoal/60 text-base leading-relaxed mb-6">
              Every garment we make is a testament to the belief that clothing is not merely worn — it is experienced. We tailor for executives, dignitaries, and discerning individuals who understand that true style begins with fit.
            </p>

            <p className="text-charcoal/40 text-sm leading-relaxed mb-10">
              From the first consultation to the final fitting, each piece is constructed by hand using the finest British and Italian cloth. No shortcuts. No compromises. Only work we are proud to put our name to.
            </p>

            <Link
              href="/gallery"
              className="self-start inline-flex items-center gap-3 border border-charcoal/20 hover:border-gold hover:text-gold text-charcoal text-[11px] tracking-[0.25em] uppercase px-7 py-3.5 transition-all duration-300"
            >
              View Full Portfolio <ArrowRight size={12} />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ── TESTIMONIALS ROTATING ── */}
      <section className="py-20 lg:py-24 bg-[#F5F3EF]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-8">Client Stories</span>
          <div className="flex justify-center mb-6 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-gold fill-gold" />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-cinzel text-xl lg:text-2xl text-charcoal leading-relaxed mb-8 italic">
                "{testimonials[tIndex].quote}"
              </p>
              <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal">{testimonials[tIndex].author}</p>
              <p className="text-[10px] tracking-[0.1em] uppercase text-charcoal/40 mt-1">{testimonials[tIndex].role}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-4 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === tIndex}
                className={`relative before:absolute before:-inset-2 before:content-[''] w-2 h-2 rounded-full transition-all duration-300 ${i === tIndex ? "bg-charcoal" : "bg-charcoal/20"}`}
              />
            ))}
          </div>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.15em] uppercase text-charcoal/50 hover:text-charcoal transition-colors duration-300"
          >
            Read Our Reviews on Google
            <ArrowRight size={12} />
          </a>
        </div>
      </section>

      {/* ── WHY JANKS: VALUE PROPOSITIONS ── */}
      <section className="grid lg:grid-cols-2 min-h-[560px] bg-white">
        {/* Left: full-bleed image */}
        <div className="relative min-h-[320px] lg:min-h-0">
          {/* The slot is landscape, the photo is portrait. Centring the crop
              lands on the sleeve; pulling the focus up keeps the peak lapel
              and shoulder line — the part worth showing — in frame. */}
          <Image src="/janks-craftsmanship-ivory.jpg" alt="Ivory jacquard dinner jacket with satin peak lapel, made by JANKS Tailoring" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[50%_28%]" />
        </div>
        {/* Right: text on white */}
        <div className="flex items-center px-8 lg:px-16 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-4">Why JANKS</span>
            <h2 className="font-cinzel text-3xl lg:text-4xl text-charcoal leading-tight mb-8">
              The difference a proper fit makes.
            </h2>
            <ul className="space-y-5">
              {[
                "Every pattern cut from scratch — never from a template",
                "15+ body measurements including posture and proportion",
                "Cloths sourced from leading British and Italian mills",
                "Multiple fittings until the garment is exactly right",
                "Lifetime pattern on file — every future garment fits faster",
                "Based in London. We travel to you for consultations across the United Kingdom",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <Check size={14} className="text-gold shrink-0 mt-0.5" />
                  <span className="text-charcoal/60 text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>


      {/* ── STYLE ACADEMY: the four essays that actually exist ──
           This replaced a video strip that showed five "vlogs" with runtimes
           and dates, a featured lesson at 18:42 and four more topics with
           durations — all with play buttons, none of which were ever filmed.
           Everything below links to a real article at /style-guide/[slug]. */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-2">Style Academy</span>
              <h2 className="font-cinzel text-3xl lg:text-5xl text-charcoal leading-tight">
                Learn to Dress<br className="hidden lg:block" /> with Intention.
              </h2>
            </div>
            <Link href="/style-guide" className="hidden lg:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal/40 hover:text-charcoal transition-colors">
              All Essays <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                slug: "behind-the-pattern-bespoke-suit",
                title: "Behind the Pattern: Making a Bespoke Suit from Scratch",
                excerpt: "From the first consultation and chalk marks on cloth through to the final fitting.",
                category: "From the Atelier",
                readTime: "5 min read",
                img: "/suits-collection.webp",
              },
              {
                slug: "why-every-man-needs-one-bespoke-shirt",
                title: "Why Every Man Needs One Bespoke Shirt",
                excerpt: "Off-the-rail shirts are cut for a fictional average man. One bespoke shirt changes how you see the rest.",
                category: "Style Essay",
                readTime: "4 min read",
                img: "/hero-suit-1.webp",
              },
              {
                slug: "unwritten-rules-of-black-tie-dressing",
                title: "The Unwritten Rules of Black Tie Dressing",
                excerpt: "Dinner jacket, bow tie, patent shoes. Know the vocabulary before you break it.",
                category: "Occasion Dressing",
                readTime: "6 min read",
                img: "/hero-suit-3.webp",
              },
              {
                slug: "colour-theory-for-men",
                title: "Colour Theory for Men: Building Harmonious Outfits",
                excerpt: "Navy and brown, charcoal and burgundy — the pairings that lift an outfit from good to exceptional.",
                category: "Style Theory",
                readTime: "5 min read",
                img: "/hero-suit-4.jpeg",
              },
            ].map((essay, i) => (
              <motion.div
                key={essay.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link href={`/style-guide/${essay.slug}`} className="group block h-full">
                  <div className="relative aspect-[4/5] overflow-hidden bg-charcoal mb-4">
                    <Image
                      src={essay.img}
                      alt={essay.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <span className="absolute top-3 left-3 bg-gold text-charcoal text-[8px] tracking-[0.15em] uppercase px-2 py-0.5">
                      {essay.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-charcoal/35 mb-1.5">{essay.readTime}</p>
                  <h3 className="font-cinzel text-[15px] text-charcoal group-hover:text-gold transition-colors duration-300 leading-snug mb-2">
                    {essay.title}
                  </h3>
                  <p className="text-charcoal/50 text-xs leading-relaxed">{essay.excerpt}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <Link
            href="/style-guide"
            className="lg:hidden mt-10 flex items-center justify-center gap-2 border border-charcoal/15 hover:border-gold text-charcoal/50 hover:text-gold text-[11px] tracking-[0.2em] uppercase py-3.5 transition-all duration-300"
          >
            All Essays <ArrowRight size={11} />
          </Link>
        </div>
      </section>

      {/* ── CTA: BEGIN YOUR BESPOKE JOURNEY ── */}
      <section className="relative py-16 lg:py-24 bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/fabric-swatches.jpeg" alt="Fabric swatches used by JANKS Tailoring" fill sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-charcoal/70" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-cream/40 block mb-5">05 — Contact</span>
            <h2 className="font-cinzel text-4xl lg:text-5xl text-cream leading-[1.1] mb-4">
              Begin your <span className="text-gold">bespoke</span><br />journey
            </h2>
            <p className="text-cream/50 text-sm mb-8">
              Book a private consultation — we travel to you.
            </p>
            <div className="flex items-center justify-center gap-8 mb-10">
              {[{ n: "01", l: "Consult" }, { n: "02", l: "Measure" }, { n: "03", l: "Create" }].map((s) => (
                <div key={s.n} className="flex items-center gap-2">
                  <span className="text-gold text-[11px] font-cinzel">{s.n}</span>
                  <span className="text-cream/60 text-[11px] tracking-[0.1em]">{s.l}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-charcoal/40 backdrop-blur-sm border border-cream/10 p-6 lg:p-8">
              {consultSubmitted ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center">
                  <div className="w-12 h-12 border border-gold flex items-center justify-center mx-auto mb-4">
                    <Check size={20} className="text-gold" />
                  </div>
                  <p className="font-cinzel text-cream text-lg mb-2">Request Received</p>
                  <p className="text-cream/50 text-sm">Thank you, {consultForm.firstName}. We'll be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First name" required value={consultForm.firstName}
                      onChange={(e) => setConsultForm({ ...consultForm, firstName: e.target.value })}
                      className="w-full bg-transparent border-b border-cream/20 pb-2 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors" />
                    <input type="text" placeholder="Last name" required value={consultForm.lastName}
                      onChange={(e) => setConsultForm({ ...consultForm, lastName: e.target.value })}
                      className="w-full bg-transparent border-b border-cream/20 pb-2 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="email" placeholder="Email address" required value={consultForm.email}
                      onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                      className="w-full bg-transparent border-b border-cream/20 pb-2 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors" />
                    <input type="tel" placeholder="Phone number" value={consultForm.phone}
                      onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-cream/20 pb-2 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <select aria-label="Select service" value={consultForm.service} onChange={(e) => setConsultForm({ ...consultForm, service: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/20 pb-2 text-cream/40 text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                    <option value="" className="bg-charcoal">Select service</option>
                    <option value="Bespoke Suit" className="bg-charcoal text-cream">Bespoke Suit</option>
                    <option value="Custom Shirt" className="bg-charcoal text-cream">Custom Shirt</option>
                    <option value="Made-to-Measure" className="bg-charcoal text-cream">Made-to-Measure</option>
                    <option value="Alterations" className="bg-charcoal text-cream">Alterations</option>
                  </select>
                  <textarea rows={2} placeholder="Tell us about your vision..." value={consultForm.message}
                    onChange={(e) => setConsultForm({ ...consultForm, message: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/20 pb-2 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors resize-none" />
                  <button type="submit"
                    className="w-full bg-gold text-charcoal py-4 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-cream transition-colors duration-300 flex items-center justify-center gap-3">
                    Request Consultation
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}
            </div>
            <p className="text-cream/20 text-[10px] tracking-wide mt-4">We typically respond within 24 hours</p>
          </motion.div>
        </div>
      </section>

      {/* ── MAILING LIST ── */}
      <section className="bg-gold py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* Copy */}
            <div className="lg:max-w-md">
              <span className="text-[11px] tracking-[0.3em] uppercase text-charcoal/60 block mb-2">Stay Informed</span>
              <h2 className="font-cinzel text-2xl lg:text-3xl text-charcoal leading-tight">
                Join the JANKS Family
              </h2>
              <p className="text-charcoal/60 text-sm mt-3 leading-relaxed">
                Style notes, fabric stories, and early access to new commissions — delivered once a month, never more.
              </p>
            </div>

            {/* Form */}
            {newsletterSubmitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:min-w-[440px] flex items-center gap-3 border border-charcoal/20 px-6 py-4">
                <Check size={16} className="text-charcoal shrink-0" />
                <p className="text-charcoal text-sm">You&apos;re on the list. Welcome to the JANKS family.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 lg:min-w-[440px]">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white/30 placeholder:text-charcoal/50 text-charcoal font-cinzel text-sm px-5 py-3.5 border border-charcoal/20 focus:border-charcoal focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-charcoal text-cream text-[11px] tracking-[0.25em] uppercase px-7 py-3.5 hover:bg-black transition-colors duration-300 whitespace-nowrap"
                >
                  Subscribe <ArrowRight size={12} />
                </button>
              </form>
            )}

          </div>

          <p className="text-[10px] tracking-wide text-charcoal/40 mt-6">
            No spam. Unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
