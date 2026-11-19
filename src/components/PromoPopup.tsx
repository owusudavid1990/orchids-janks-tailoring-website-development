"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Copy, Check } from "lucide-react";

const DISMISS_KEY = "janks-promo-welcome15-dismissed";
const PROMO_CODE = "WELCOME15";

export function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    // Show once the visitor has engaged (scrolled ~60% of a screen) or has been here a
    // while — not over the page the moment they arrive. That keeps the popup photo from
    // being measured as the page's Largest Contentful Paint, and avoids Google's
    // "intrusive interstitial" penalty for popups that cover content on arrival.
    let done = false;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) show();
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
    const show = () => {
      if (done) return;
      done = true;
      cleanup();
      setVisible(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    timer = setTimeout(show, 20000);
    return cleanup;
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail silently (permissions, insecure context) —
      // the code is still visible on screen for the customer to type manually.
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && dismiss()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative bg-cream w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col sm:flex-row"
          >
            {/* Close */}
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center border border-charcoal/20 bg-cream/80 hover:bg-charcoal group transition-all duration-200"
            >
              <X size={14} className="text-charcoal group-hover:text-cream transition-colors" />
            </button>

            {/* Image */}
            <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto bg-charcoal/5 flex-shrink-0">
              <Image
                src="/cufflink-collection.webp"
                alt="JANKS Tailoring accessories"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 40vw"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold block mb-3">
                Welcome to JANKS
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl text-charcoal mb-3 leading-snug">
                15% Off Your First Order
              </h2>
              <p className="text-charcoal/60 text-sm leading-relaxed mb-6">
                Ties, cufflinks, and pocket squares — handcrafted to the same standard as our bespoke work.
              </p>

              <button
                type="button"
                onClick={copyCode}
                className="w-full flex items-center justify-between border border-dashed border-charcoal/30 px-4 py-3 mb-6 hover:border-charcoal/50 transition-colors group"
              >
                <span className="font-cinzel text-base tracking-[0.15em] text-charcoal">
                  {PROMO_CODE}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-charcoal/50 group-hover:text-charcoal transition-colors">
                  {copied ? (
                    <>
                      <Check size={13} className="text-gold" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
                </span>
              </button>

              <Link
                href="/category"
                onClick={dismiss}
                className="w-full py-4 bg-charcoal text-cream text-[10px] tracking-[0.25em] uppercase hover:bg-gold hover:text-charcoal transition-all duration-300 flex items-center justify-center"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
