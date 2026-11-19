"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      <section className="min-h-screen">
          <div className="px-6 lg:px-16 xl:px-24 py-20 lg:py-32 lg:pt-40 max-w-5xl mx-auto text-justify">
              <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>

                <span className="text-[11px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 block mb-4">
                  Our Story
                </span>
                <h1 className="font-cinzel text-4xl lg:text-5xl text-charcoal dark:text-white leading-[1.1] mb-8">
                  The Art of Tailoring
                </h1>

                {/* First image floated left */}
                <div className="float-left mr-6 mb-4 w-full sm:w-[45%] lg:w-[40%] relative overflow-hidden">
                  <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/CC426A62-0ED1-4931-AABA-FA1F23442D3D-resized-1768952044593.jpeg?width=8000&height=8000&resize=contain"
                alt="Master tailor at work"
                width={600}
                height={750}
                className="object-cover w-full h-auto"
                priority />
                </div>

                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-6">
                  JANKs Tailoring was born from a singular passion: the pursuit of the perfect fit. What began as a young tailor&apos;s personal journey into the world of bespoke menswear has evolved into a refined destination for individuals who understand that true elegance lies in craftsmanship, precision, and attention to detail.
                </p>
                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-6">
                  The story of JANKs begins in Ghana, where founder Kwaku Nketiah Acheampong first discovered his passion for fashion and textiles. While studying Fashion &amp; Textiles at Kumasi Technical University, he immersed himself in the art of garment construction, pattern making, and design. This period laid the foundation for his technical expertise and ignited the entrepreneurial spirit that would soon define his career.
                </p>
                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-6">
                  In 2016, Kwaku transformed his passion into a fully-fledged enterprise by establishing JANKs Tailoring, which quickly expanded from a one&#8209;person venture into a growing business overseeing a team of six staff. Clients quickly came to associate JANKs with precision, exceptional customer service, and garments that felt uniquely personal. Whether creating bespoke suits or traditional African garments, every stitch was placed with purpose, skill, and pride.
                </p>
                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-6">
                  JANKs Tailoring earned a loyal clientele not only because of the craftsmanship, but because of Kwaku&apos;s approach. He took the time to understand each client&apos;s tastes, shape, and personality. For him, tailoring wasn&apos;t just about fabric, it was about creating confidence. Clients returned repeatedly, trusting him with their most important garments, knowing that every piece would be crafted with thoughtfulness and integrity.
                </p>

                {/* Clear float before next section */}
                <div className="clear-both" />

                {/* Second image floated right */}
                <div className="float-right ml-6 mb-4 w-full sm:w-[45%] lg:w-[40%] relative overflow-hidden">
                  <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/IMG_3709-resized-1768953591227.jpeg?width=8000&height=8000&resize=contain"
                alt="Tailoring craftsmanship"
                width={600}
                height={750}
                className="object-cover w-full h-auto" />
                </div>

                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-6">
                  Throughout this journey, faith in God remained the most important foundation of Kwaku&apos;s growth. Every step from his early apprenticeship days in Ghana, to building a thriving tailoring business, to moving across continents was guided by a deep belief that God&apos;s hand was shaping his path. Kwaku attributes his resilience, opportunities, creativity, and milestones to God&apos;s grace. His progress reflects not only hard work and skill, but a conviction that he is walking in the purpose God has prepared for him. Faith continues to guide where he is today and where he is destined to go.
                </p>
                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-6">
                  Kwaku migrated to the United Kingdom as a refugee in 2022 and despite considerable challenges associated with rebuilding his life in a new country, he remained committed to pursuing his long&#8209;held dreams. Navigating unfamiliar systems, adapting to cultural and social differences, and overcoming setbacks that would have discouraged many, he has consistently demonstrated remarkable determination and resilience. His journey reflects not only his personal strength but also his unwavering belief in his aspirations, which continue to motivate him as he strives for a brighter and more stable future.
                </p>
                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-6">
                  His journey in the United Kingdom took him to some of the most respected names in British tailoring, including Ozwald Boateng Studios and Anderson &amp; Sheppard on Savile Row. These experiences deepened his understanding of luxury menswear, enhanced his mastery of intricate tailoring techniques, and strengthened his commitment to excellence.
                </p>

                {/* Clear float before next section */}
                <div className="clear-both" />

                {/* Third and fourth images floated left */}
                <div className="float-left mr-6 mb-4 w-full sm:w-[45%] lg:w-[40%] space-y-4">
                  <div className="relative overflow-hidden aspect-square">
                    <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/IMG_2452-resized-1768955079152.jpeg?width=8000&height=8000&resize=contain"
                  alt="Tailored suit detail"
                  fill
                  className="object-cover" />
                  </div>

                </div>

                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-6">
                  These experiences combined with his faith, determination, and unwavering commitment to excellence now shape the identity of JANKs Tailoring. The brand stands as a fusion of Ghanaian artistry, British refinement, and a relentless dedication to perfect fit. Every garment tells a story. Every measurement is taken with intention. Every detail reflects years of learning, growth and passion.
                </p>
                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-6">
                  Today, JANKs Tailoring is more than a tailoring service. It is the embodiment of a journey shaped by craftsmanship, culture, and the belief that God guides every step. JANKs Tailoring continues to evolve, but its core belief remains unchanged:
                </p>
                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm italic font-medium mb-6">
                  We are not merely crafting garments, we are creating Confidence In Gentility.
                </p>

                {/* Clear float */}
                <div className="clear-both" />
              </motion.div>

              <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 lg:mt-28 max-w-lg">

                <span className="text-[11px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 block mb-4">
                  A Personal Journey
                </span>
                <h2 className="font-cinzel text-2xl lg:text-3xl text-charcoal dark:text-white leading-[1.15] mb-6 lg:!w-[862px] lg:!h-[34px]">
                  Where tradition meets innovation
                </h2>
                <p className="text-charcoal/50 dark:text-white/50 leading-relaxed text-sm mb-8 text-justify lg:!w-[895px] lg:!h-[220px]">With Ghanaian roots and a deep appreciation for both African heritage and contemporary fashion, my creative vision is shaped by the stories, textures, and symbolism embedded within my culture. I aim to fuse the richness of African history with modern design principles to create fashion that feels both innovative and meaningful. My goal is to develop pieces that honour traditional influences such as African craftsmanship, fabrics, and motifs while presenting them through a fresh, contemporary lens. By blending these two worlds, I hope to produce work that not only stands out aesthetically, but also celebrates identity, heritage, and the evolving narrative of African creativity in global fashion.

            </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-charcoal/5 dark:bg-white/5 overflow-hidden">
                    <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/IMG_0366-1768955864528.png?width=8000&height=8000&resize=contain"
                  alt="Founder"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full" />

                  </div>
                  <div>
                    <p className="font-cinzel text-charcoal dark:text-white text-sm">Kwaku Acheampong</p>
                    <p className="text-charcoal/40 dark:text-white/40 text-xs">Founder & Master Tailor</p>
                  </div>
                </div>
              </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 lg:mt-28 max-w-lg">

              <span className="text-[11px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 block mb-4">
                Our Values
              </span>
              <h2 className="font-cinzel text-2xl lg:text-3xl text-charcoal dark:text-white mb-8">
                What guides us
              </h2>
              <div className="space-y-6">
                {[
              { title: "Craftsmanship", desc: "Every stitch is placed with intention, every detail considered." },
              { title: "Integrity", desc: "We use only the finest materials and transparent pricing." },
              { title: "Personalization", desc: "No two bodies are alike; no two suits should be either." },
              { title: "Legacy", desc: "We create garments meant to last generations, not seasons." }].
              map((value, index) =>
              <div key={value.title} className="flex gap-4">
                    <span className="text-charcoal/20 dark:text-white/20 text-sm">0{index + 1}</span>
                    <div>
                      <h3 className="font-cinzel text-base text-charcoal dark:text-white mb-1">{value.title}</h3>
                      <p className="text-charcoal/50 dark:text-white/50 text-sm leading-relaxed">{value.desc}</p>
                    </div>
                  </div>
              )}
              </div>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 lg:mt-28 pt-12 border-t border-charcoal/10 dark:border-white/10 max-w-lg">

              <h2 className="font-cinzel text-xl text-charcoal dark:text-white mb-4">
                Begin Your Journey
              </h2>
              <p className="text-charcoal/50 dark:text-white/50 text-sm mb-6">
                Experience the JANKS difference. Book a consultation and discover 
                what bespoke tailoring truly means.
              </p>
              <Link
              href="/book"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-cream bg-charcoal dark:text-charcoal dark:bg-white px-6 py-3 hover:opacity-90 transition-opacity">

                Book Consultation
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

      <Footer />
    </main>);

}