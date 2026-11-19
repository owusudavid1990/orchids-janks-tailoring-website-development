import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getGalleryPhotos } from "@/lib/gallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery of Bespoke Suits & Client Work | JANKS Tailoring",
  description: "A gallery of JANKS Tailoring's bespoke garments and client moments.",
  alternates: { canonical: "https://jankstailoring.com/gallery" },
};

export default function GalleryPage() {
  const { photos, categories } = getGalleryPhotos();

  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <span className="text-[11px] tracking-[0.3em] uppercase text-cream/40 block mb-4">Portfolio</span>
          <h1 className="font-cinzel text-4xl lg:text-6xl text-cream mb-6 leading-tight">
            Gallery
          </h1>
          <p className="text-cream/50 text-sm leading-relaxed max-w-2xl">
            A closer look at the garments we make — from cloth and construction to the moments they were made for.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <GalleryGrid photos={photos} categories={categories} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
