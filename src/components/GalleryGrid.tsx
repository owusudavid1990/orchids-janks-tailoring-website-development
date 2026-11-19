"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryPhoto, GalleryCategory } from "@/lib/gallery";

interface GalleryGridProps {
  photos: GalleryPhoto[];
  categories: GalleryCategory[];
}

export function GalleryGrid({ photos, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const filteredPhotos = useMemo(
    () => (activeCategory === "all" ? photos : photos.filter((p) => p.category === activeCategory)),
    [photos, activeCategory]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filteredPhotos.length));
  }, [filteredPhotos.length]);

  const showPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filteredPhotos.length) % filteredPhotos.length));
  }, [filteredPhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) showNext();
      else showPrev();
    }
    touchStartX.current = null;
  };

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <>
      {/* Filter tabs */}
      {categories.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 mb-10 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 border transition-colors duration-300 ${
              activeCategory === "all"
                ? "bg-charcoal text-cream border-charcoal dark:bg-white dark:text-charcoal dark:border-white"
                : "border-charcoal/20 text-charcoal/60 hover:border-charcoal/40 dark:border-white/20 dark:text-white/60 dark:hover:border-white/40"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`shrink-0 text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 border transition-colors duration-300 ${
                activeCategory === cat.slug
                  ? "bg-charcoal text-cream border-charcoal dark:bg-white dark:text-charcoal dark:border-white"
                  : "border-charcoal/20 text-charcoal/60 hover:border-charcoal/40 dark:border-white/20 dark:text-white/60 dark:hover:border-white/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filteredPhotos.length === 0 ? (
        <p className="text-charcoal/40 dark:text-white/40 text-sm py-20 text-center">
          No photos in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
          {filteredPhotos.map((photo, i) => (
            <motion.button
              key={photo.src}
              onClick={() => setLightboxIndex(i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
              className="group relative aspect-[3/4] overflow-hidden bg-charcoal/5 dark:bg-white/5 cursor-zoom-in"
              aria-label={`Open photo: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute top-5 right-5 sm:top-8 sm:right-8 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Prev arrow */}
            {filteredPhotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next arrow */}
            {filteredPhotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next photo"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Image */}
            <div
              className="flex-1 flex items-center justify-center p-4 sm:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={activePhoto.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-full max-w-4xl"
              >
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Caption */}
            <div className="shrink-0 text-center pb-6 sm:pb-8 px-6">
              <p className="text-cream text-sm tracking-wide">{activePhoto.alt}</p>
              {lightboxIndex !== null && (
                <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mt-1">
                  {lightboxIndex + 1} / {filteredPhotos.length}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
