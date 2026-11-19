"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ExternalLink } from "lucide-react";

const categories = [
  {
    title: "Suits",
    description: "Impeccably tailored suits for every occasion",
    image: "/suits-collection.webp",
    hoverImage: "/hero-suit-1.webp",
    shopifyLink: "/services",
    internal: true,
  },
  {
    title: "Shirts",
    description: "Custom shirts, made to order",
    image: "/hero-suit-3.webp",
    hoverImage: "/hero-suit-4.jpeg",
    shopifyLink: "/services",
    internal: true,
  },
  {
    title: "Trousers",
    description: "Bespoke and made-to-measure trousers",
    image: "/trousers-collection.jpeg",
    hoverImage: "/hero-suit-4.jpeg",
    shopifyLink: "/services",
    internal: true,
  },
  {
    title: "Neck Ties",
    description: "Ties, ready to ship",
    image: "/necktie-collection.webp",
    hoverImage: "/hero-suit-1.webp",
    shopifyLink: "/category/ties",
    internal: true,
  },
  {
    title: "Cufflinks",
    description: "Dress cufflinks",
    image: "/cufflink-collection.webp",
    hoverImage: "/hero-suit-1.webp",
    shopifyLink: "/category/cufflinks",
    internal: true,
  },
  {
    title: "Pocket Squares",
    description: "Ready to ship",
    image: "/pocket-square-collection.webp",
    hoverImage: "/pocket-square-collection.jpeg",
    shopifyLink: "/category/pocket-squares",
    internal: true,
  },
];

export default function CategoryPage() {
  const router = useRouter();

  const handleShopifyLink = (url: string, internal?: boolean) => {
    if (internal) {
      router.push(url);
    } else {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
    }
  };

  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      <section className="relative pt-32 pb-16 bg-charcoal" style={{ backgroundImage: 'url(https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/Untitled-10.5-x-15-in-15-x-10.5-in-381-x-266.7-mm-4-1768666086090.png?width=8000&height=8000&resize=contain)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold font-semibold">
              Shop Collection
            </span>
            <h1 className="font-cinzel text-5xl lg:text-7xl text-white mt-4 leading-[1.05] drop-shadow-lg">
              Categories
            </h1>
            <p className="text-white mt-6 max-w-lg leading-relaxed drop-shadow-md">
              Ties, cufflinks and pocket squares are ready to ship from the official shop. Suits, shirts and trousers are made to order — we travel to you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="sr-only">Shop by category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const soon = (category as any).comingSoon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group ${soon ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                    {/* Real link so search engines can follow it; covers the whole card. */}
                    {!soon && (
                      <Link
                        href={category.shopifyLink}
                        aria-label={`Shop ${category.title}`}
                        className="absolute inset-0 z-20"
                      />
                    )}
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-cover transition-all duration-700 ${soon ? "brightness-50" : "group-hover:scale-105 group-hover:opacity-0"}`}
                    />
                    {!soon && (
                      <Image
                        src={category.hoverImage}
                        alt={`${category.title} alternate`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-all duration-700 opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100"
                      />
                    )}
                    <div className={`absolute inset-0 ${soon ? "bg-charcoal/60" : "bg-charcoal/40 group-hover:bg-charcoal/20 transition-colors duration-500"}`} />

                    {soon ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-[10px] tracking-[0.35em] uppercase text-gold border border-gold/40 px-4 py-1.5 mb-4">Coming Soon</span>
                        <h3 className="font-cinzel text-2xl text-white drop-shadow-md">{category.title}</h3>
                        <p className="text-white/50 text-sm mt-2 leading-relaxed max-w-[200px]">{category.description}</p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-cinzel text-2xl text-white group-hover:text-gold transition-colors duration-300 drop-shadow-md">
                              {category.title}
                            </h3>
                            <p className="text-white/90 text-sm mt-2 leading-relaxed drop-shadow-sm">
                              {category.description}
                            </p>
                          </div>
                          <ExternalLink className="text-white/80 group-hover:text-gold transition-colors duration-300" size={20} />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
