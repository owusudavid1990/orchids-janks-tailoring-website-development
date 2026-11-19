"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const services = [
{
  id: "bespoke",
  title: "Bespoke Suit",
  duration: "8-12 weeks",
  heroImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/IMG_1536-resized-1768954631075.jpeg?width=8000&height=8000&resize=contain",
  introduction: "A bespoke suit is more than a garment—it is a collaboration between artisan and client, resulting in a piece that exists nowhere else in the world.",
  process: [
  { step: 1, title: "Consultation", duration: "90 min", description: "Your journey begins with an intimate conversation about lifestyle, occasions, and personal aesthetic.", image: "/work-consultation.jpeg" },
  { step: 2, title: "Measurements", duration: "45 min", description: "Over forty individual measurements form the blueprint of your pattern.", image: "/work-measurements.jpeg" },
  { step: 3, title: "Pattern Cutting", duration: "2-3 days", description: "Your master pattern is drafted by hand, where science meets intuition.", image: "/work-pattern-cutting.jpeg" },
  { step: 4, title: "First Fitting", duration: "60 min", description: "The basted garment arrives—adjustments are pinned and balance refined.", image: "/work-first-fitting.jpeg" },
  { step: 5, title: "Construction", duration: "4-6 weeks", description: "Hand-padded lapels, pick stitching, and hand-worked buttonholes.", image: "/work-construction.jpeg" },
  { step: 6, title: "Final Fitting", duration: "30 min", description: "Your finished suit is presented, pressed, and perfected.", image: "/work-final-fitting.webp" }]

},
{
  id: "mtm",
  title: "Made-to-Measure",
  duration: "4-6 weeks",
  heroImage: "/work-mtm-hero.jpeg",
  introduction: "Made-to-measure represents the perfect balance between accessibility and individuality, creating a fit that rivals bespoke.",
  process: [
  { step: 1, title: "Style Selection", duration: "45 min", description: "Browse our curated collection of silhouettes from contemporary slim cuts to classic English drape.", image: "/work-style-selection.jpeg" },
  { step: 2, title: "Fabric & Details", duration: "30 min", description: "Choose from hundreds of the world's finest fabrics and personalise every detail.", image: "/work-fabric-details.jpeg" },
  { step: 3, title: "Measurement", duration: "30 min", description: "Twenty-five key measurements taken and cross-referenced against master patterns.", image: "/work-mtm-measurement.jpeg" },
  { step: 4, title: "Construction", duration: "3-4 weeks", description: "Cut and assembled by skilled tailors with hand-finished critical elements.", image: "/work-construction.jpeg" },
  { step: 5, title: "Fitting", duration: "45 min", description: "Final fitting with minor adjustments made in-house to perfect the silhouette.", image: "/work-fitting-marking.jpeg" }]

},
{
  id: "alterations",
  title: "Alterations",
  duration: "1-2 weeks",
  heroImage: "/work-alterations-hero.jpeg",
  introduction: "Our alterations service applies bespoke techniques to transform any garment, ensuring your wardrobe performs at its best.",
  process: [
  { step: 1, title: "Assessment", duration: "20 min", description: "Each garment is examined with a critical eye to identify the best approach.", image: "/fabric-swatches.jpeg" },
  { step: 2, title: "Fitting & Marking", duration: "30 min", description: "Our tailor pins and marks every adjustment with methodical precision.", image: "/work-fitting-marking.jpeg" },
  { step: 3, title: "Alteration", duration: "1-2 weeks", description: "Alterations executed with surgical precision, respecting original construction.", image: "/work-alteration.jpeg" },
  { step: 4, title: "Final Review", duration: "15 min", description: "Your altered garment is pressed, inspected, and prepared for collection.", image: "/work-final-review.webp" }]

}];


export default function WorkPage() {
  const [activeService, setActiveService] = useState(services[0].id);
  const currentService = services.find((s) => s.id === activeService)!;

  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      <section className="relative h-[60vh] lg:h-[80vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentService.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0">

            <Image
              src={currentService.heroImage}
              alt={currentService.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority />

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-end pb-12 lg:pb-20 px-6 lg:px-12 mx-auto !w-full lg:!h-[863px] !max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>

            <span className="text-[11px] tracking-[0.2em] uppercase text-cream/50 block mb-3">
              Our Process
            </span>
            <h1 className="font-cinzel text-4xl lg:text-6xl text-cream leading-[1.1]">
              The Making
            </h1>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-cream/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex">
              {services.map((service) =>
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex-1 py-4 text-center transition-all relative ${
                activeService === service.id ?
                "text-cream" :
                "text-cream/40 hover:text-cream/60"}`
                }>

                  <span className="text-[10px] lg:text-[11px] tracking-[0.15em] uppercase">
                    {service.title}
                  </span>
                  {activeService === service.id &&
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-cream" />

                }
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={currentService.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="py-20 lg:py-28">

          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mb-16">

              <h2 className="font-cinzel text-2xl lg:text-3xl text-charcoal dark:text-white mb-4">
                {currentService.title}
              </h2>
              <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm">
                {currentService.introduction}
              </p>
              <span className="text-[11px] tracking-[0.15em] uppercase text-charcoal/30 dark:text-white/30 mt-4 block">
                Timeline: {currentService.duration}
              </span>
            </motion.div>

            <div className="relative">
              <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-charcoal/5 via-charcoal/20 to-charcoal/5 dark:from-white/5 dark:via-white/20 dark:to-white/5" />
              
              <div className="space-y-16 lg:space-y-24">
                {currentService.process.map((step, index) =>
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:direction-rtl" : ""}`
                  }>

                    <div className="absolute left-8 lg:left-1/2 top-1/2 -translate-y-1/2 lg:-translate-x-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-charcoal dark:bg-white border-4 border-cream dark:border-black" />
                    </div>

                    <div className={`pl-20 lg:pl-0 ${index % 2 === 1 ? "lg:order-2 lg:pl-16" : "lg:pr-16 lg:text-right"}`}>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/30 dark:text-white/30 block mb-2">
                        Step 0{step.step} — {step.duration}
                      </span>
                      <h3 className="font-cinzel text-2xl lg:text-3xl text-charcoal dark:text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-charcoal/60 dark:text-white/60 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className={`pl-20 lg:pl-0 ${index % 2 === 1 ? "lg:order-1 lg:pr-16" : "lg:pl-16"}`}>
                      <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700" />

                        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      <section className="py-20 lg:py-28 border-t border-charcoal/10 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>

            <h2 className="font-cinzel text-3xl lg:text-4xl text-charcoal dark:text-white mb-4">
              Ready to begin?
            </h2>
            <p className="text-charcoal/50 dark:text-white/50 max-w-md mx-auto mb-8 text-sm">
              Book your consultation and experience the art of true tailoring.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-cream bg-charcoal dark:text-charcoal dark:bg-white px-8 py-4 hover:opacity-90 transition-opacity">

              Book Consultation
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>);

}