import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ShopifyProductGrid } from "@/components/ShopifyProductGrid";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { fetchCollection, toCollectionGid } from "@/lib/shopify-storefront";

export const revalidate = 3600; // refresh product data hourly

export const metadata: Metadata = {
  title: "Pocket Square Collection | JANKS Tailoring",
  description: "The finishing touch to every ensemble. Shop JANKS Tailoring's pocket squares, crafted from the finest fabrics to add elegance and character.",
  alternates: { canonical: "https://jankstailoring.com/category/pocket-squares" },
};

export default async function PocketSquaresCollectionPage() {
  const products = await fetchCollection(toCollectionGid("698171883865")).catch(() => []);

  return (
    <main className="min-h-screen bg-cream" data-shopify-page="true">
      <Navigation />
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <FadeIn className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] tracking-[0.3em] uppercase text-charcoal/40 block mb-4">Accessories</span>
            <h1 className="font-cinzel text-4xl lg:text-6xl text-charcoal mb-6">Pocket Square Collection</h1>
            <p className="text-charcoal/60 text-sm leading-relaxed">
              The finishing touch to every ensemble. Our pocket squares are crafted from the finest fabrics to add elegance and character.
            </p>
          </FadeIn>
        </div>
      </section>
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="sr-only">Pocket Squares in the JANKS Tailoring collection</h2>
          <ShopifyProductGrid initialProducts={products} />
          <nav
            aria-label="More from the collection"
            className="mt-16 pt-8 border-t border-charcoal/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] tracking-[0.2em] uppercase text-charcoal/50"
          >
            <span className="text-charcoal/30">More from the collection</span>
            <Link href="/category/ties" className="hover:text-charcoal transition-colors">Ties</Link>
            <Link href="/category/cufflinks" className="hover:text-charcoal transition-colors">Cufflinks</Link>
            <Link href="/category" className="hover:text-charcoal transition-colors">All Categories</Link>
            <Link href="/services" className="hover:text-charcoal transition-colors">Bespoke Tailoring</Link>
          </nav>
        </div>
      </section>
      <Footer />
    </main>
  );
}
