"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const pages = [
  { title: "About", href: "/about", description: "Our story and heritage" },
  { title: "Services", href: "/services", description: "Bespoke tailoring services" },
  { title: "Shop", href: "/category", description: "Browse our collection" },
  { title: "Work", href: "/work", description: "Our portfolio" },
  { title: "Gallery", href: "/gallery", description: "Bespoke garments and client work" },
  { title: "Contact", href: "/contact", description: "Get in touch" },
  { title: "Book", href: "/book", description: "Schedule a fitting" },
];

const products = [
  {
    title: "Suits",
    href: "/services",
    description: "Bespoke and made-to-measure",
    image: "/suits-collection.webp",
    category: "Services",
  },
  {
    title: "Shirts",
    href: "/services",
    description: "Custom shirts, made to order",
    image: "/hero-suit-3.webp",
    category: "Services",
  },
  {
    title: "Trousers",
    href: "/services",
    description: "Bespoke and made-to-measure",
    image: "/trousers-collection.jpeg",
    category: "Services",
  },
  {
    title: "Neck Ties",
    href: "/category/ties",
    description: "Ties, ready to ship",
    image: "/necktie-collection.webp",
    category: "Shop",
  },
  {
    title: "Cufflinks",
    href: "/category/cufflinks",
    description: "Dress cufflinks",
    image: "/cufflink-collection.webp",
    category: "Shop",
  },
  {
    title: "Pocket Squares",
    href: "/category/pocket-squares",
    description: "Ready to ship",
    image: "/pocket-square-collection.webp",
    category: "Shop",
  },
];

interface SearchContextType {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => setIsOpen(false);

  return (
    <SearchContext.Provider value={{ isOpen, openSearch, closeSearch }}>
      {children}
      <SearchModal />
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

function SearchModal() {
  const { isOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? closeSearch() : {};
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSearch]);

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      page.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults = filteredPages.length > 0 || filteredProducts.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[80]"
            onClick={closeSearch}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto px-4 z-[85]"
          >
            <div className="bg-cream dark:bg-charcoal backdrop-blur-2xl border border-charcoal/20 dark:border-white/10 shadow-2xl overflow-hidden">
              <div className="relative border-b border-charcoal/10 dark:border-white/10">
                <Search
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal dark:text-white"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
placeholder="Search pages and products..."
                    className="w-full pl-14 pr-14 py-5 bg-transparent text-charcoal dark:text-white placeholder:text-charcoal/60 dark:placeholder:text-white/60 text-sm focus:outline-none"
                />
                <button
                  onClick={closeSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-charcoal/10 dark:bg-white/10 hover:bg-charcoal/20 dark:hover:bg-white/20 transition-colors"
                >
                  <X size={14} className="text-charcoal dark:text-white" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {query === "" ? (
                  <div className="p-6">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal dark:text-white/70 mb-4">
                      Quick Links
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {pages.slice(0, 4).map((page) => (
                        <Link
                          key={page.href}
                          href={page.href}
                          onClick={closeSearch}
className="flex items-center justify-between p-3 bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal/10 dark:hover:bg-white/10 transition-colors group"
                          >
                            <span className="text-sm text-charcoal dark:text-white font-medium">
                            {page.title}
                          </span>
                          <ArrowRight
                            size={14}
                            className="text-charcoal/30 dark:text-white/30 group-hover:text-gold transition-colors"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : hasResults ? (
                  <div className="p-4 space-y-6">
                    {filteredPages.length > 0 && (
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal dark:text-white/70 mb-3 px-2">
                          Pages
                        </p>
                        <div className="space-y-1">
                          {filteredPages.map((page) => (
                            <Link
                              key={page.href}
                              href={page.href}
                              onClick={closeSearch}
                              className="flex items-center justify-between p-3 hover:bg-charcoal/5 dark:hover:bg-white/10 transition-colors group"
                            >
                              <div>
                                <p className="text-sm text-charcoal dark:text-white font-medium">
                                  {page.title}
                                </p>
                                <p className="text-xs text-charcoal/70 dark:text-white/70 mt-0.5">
                                  {page.description}
                                </p>
                              </div>
                              <ArrowRight
                                size={14}
                                className="text-charcoal/30 dark:text-white/30 group-hover:text-gold transition-colors"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredProducts.length > 0 && (
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal dark:text-white/70 mb-3 px-2">
                          Products
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {filteredProducts.map((product) => (
                            <Link
                              key={product.title}
                              href={product.href}
                              onClick={closeSearch}
                              className="flex items-center gap-3 p-2 hover:bg-charcoal/5 dark:hover:bg-white/10 transition-colors group"
                            >
                              <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden bg-charcoal/10">
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-charcoal dark:text-white font-medium truncate">
                                  {product.title}
                                </p>
                                <p className="text-[10px] text-charcoal/70 dark:text-white/70">
                                  {product.category}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-charcoal/70 dark:text-white/70 text-sm">
                      No results found for "{query}"
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-charcoal/10 dark:border-white/10 px-5 py-3 flex items-center justify-between text-[10px] text-charcoal/60 dark:text-white/60">
                <span>Press ESC to close</span>
                <span>⌘K to search</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
