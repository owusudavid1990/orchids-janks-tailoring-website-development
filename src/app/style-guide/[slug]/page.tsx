"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { articles } from "@/lib/style-guide-articles";

const allArticles = articles;

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = allArticles.filter((a) => article.relatedSlugs.includes(a.slug));

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-28 pb-0 bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <Image src={article.heroImage} alt={article.title} fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/80 to-charcoal" />
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 pt-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/style-guide"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-cream/40 hover:text-cream transition-colors mb-8"
            >
              <ArrowLeft size={12} />
              Style Academy
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[9px] tracking-[0.2em] uppercase bg-gold text-charcoal px-2 py-1">
                {article.category}
              </span>
              <span className="text-[10px] text-cream/30">{article.readTime}</span>
              <span className="text-[10px] text-cream/30">{article.date}</span>
            </div>
            <h1 className="font-cinzel text-3xl lg:text-5xl text-cream leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-cream/50 text-sm leading-relaxed max-w-2xl mb-8">
              {article.excerpt}
            </p>
            <p className="text-[10px] tracking-[0.15em] uppercase text-cream/30">
              By {article.author}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="space-y-12">
            {article.sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              >
                {section.heading && (
                  <h2 className="font-cinzel text-xl lg:text-2xl text-charcoal mb-5 leading-snug">
                    {section.heading}
                  </h2>
                )}
                <div className="space-y-4">
                  {section.body.split("\n\n").map((para, j) => (
                    <p
                      key={j}
                      className="text-charcoal/70 text-sm lg:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-charcoal font-medium">$1</strong>'),
                      }}
                    />
                  ))}
                </div>
                {section.quote && (
                  <blockquote className="mt-8 pl-6 border-l-2 border-gold">
                    <p className="font-cinzel text-lg lg:text-xl text-charcoal italic leading-snug">
                      "{section.quote}"
                    </p>
                  </blockquote>
                )}
                {i < article.sections.length - 1 && (
                  <div className="mt-12 border-b border-charcoal/8" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Author strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 pt-10 border-t border-charcoal/10 flex items-center gap-5"
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-charcoal shrink-0">
              <Image src="/hero-suit-1.webp" alt={article.author} fill className="object-cover" />
            </div>
            <div>
              <p className="font-cinzel text-sm text-charcoal">{article.author}</p>
              <p className="text-charcoal/40 text-xs mt-0.5">Founder, JANKS Tailoring</p>
            </div>
            <div className="ml-auto">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-charcoal border border-charcoal/20 px-5 py-2.5 hover:bg-charcoal hover:text-cream transition-all duration-300"
              >
                Book a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 lg:py-20 bg-[#F5F3EF]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h3 className="font-cinzel text-xl text-charcoal mb-10">Continue Reading</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {related.map((rel, i) => (
                <motion.div
                  key={rel.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link href={`/style-guide/${rel.slug}`} className="group flex gap-6">
                    <div className="relative w-28 h-36 flex-shrink-0 overflow-hidden bg-charcoal">
                      <Image
                        src={rel.heroImage}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                      />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[9px] tracking-[0.2em] uppercase text-gold">{rel.category}</span>
                          <span className="text-[9px] text-charcoal/30">{rel.readTime}</span>
                        </div>
                        <h4 className="font-cinzel text-base text-charcoal leading-snug group-hover:text-gold transition-colors duration-300">
                          {rel.title}
                        </h4>
                        <p className="text-charcoal/50 text-xs leading-relaxed mt-2 line-clamp-2">
                          {rel.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 mt-4 text-charcoal/30 group-hover:text-charcoal transition-colors">
                        <span className="text-[10px] tracking-[0.15em] uppercase">Read</span>
                        <ArrowRight size={11} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Academy */}
      <section className="py-12 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link
            href="/style-guide"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-cream/50 hover:text-cream transition-colors"
          >
            <ArrowLeft size={13} />
            Back to Style Academy
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-cream border border-cream/20 px-6 py-3 hover:bg-cream hover:text-charcoal transition-all duration-300"
          >
            Book a Consultation
            <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
