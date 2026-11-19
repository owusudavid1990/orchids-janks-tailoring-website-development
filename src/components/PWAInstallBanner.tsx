"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    // Don't show if already installed (running in standalone)
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Don't show if dismissed this session
    if (sessionStorage.getItem("pwa-banner-dismissed")) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as any).standalone;
    setIsIOS(ios);

    if (ios) {
      // Show iOS hint after 4s
      const t = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(t);
    }

    // Android / desktop: listen for browser install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  // Nothing to show
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-0 right-0 z-[90] md:bottom-6 md:left-auto md:right-6 md:max-w-sm"
      >
        <div className="bg-charcoal border-t border-charcoal/20 md:border md:border-white/10 md:shadow-2xl px-5 py-4 flex items-center gap-4">
          {/* Logo */}
          <div className="w-12 h-12 bg-cream flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              src="/icons/icon-96.png"
              alt="JANKS"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-cinzel text-xs text-white tracking-wide">JANKS Tailoring</p>
            {isIOS ? (
              <p className="text-[10px] text-white/60 mt-0.5 leading-relaxed">
                Tap <span className="text-gold">Share</span> then <span className="text-gold">"Add to Home Screen"</span> to install
              </p>
            ) : (
              <p className="text-[10px] text-white/60 mt-0.5 leading-relaxed">
                Install the app for a faster, full-screen experience
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isIOS && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-2 bg-gold text-charcoal text-[9px] tracking-[0.2em] uppercase font-semibold hover:bg-white transition-colors duration-200"
              >
                <Download size={11} />
                Install
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* iOS share arrow hint */}
        {isIOS && (
          <div className="bg-charcoal/95 px-5 pb-4 flex items-center justify-center gap-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase text-white/30">
              <span>↑</span>
              <span>Tap the share button at the bottom of Safari</span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
