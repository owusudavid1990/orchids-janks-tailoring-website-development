"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { FaPinterest, FaTiktok } from "react-icons/fa6";
import { PaymentBadge } from "./PaymentBadge";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=JANKs+Tailoring+Ltd&stick=H4sIAAAAAAAA_-NgU1I1qDBKSjVJMjFPTE4xSLY0TLG0AgqZp5lYGhmkmVgkJhulJqUsYhX2cvTzLlYISczMyS_KzEtX8ClJAQA3caGpPwAAAA&hl=en&mat=CfjY04Q8A3VoElcBa0lj_2-1xkZaWdK2hWEBRfOhXnKMbKoxnvLfRYpcnV7okVUNwXUQtoe2Q0bV3y-0GiDWoL1r5uN23qyWBclJCLvMxWr5ygL-Y2bkOJ7Q52UEStMezJc&authuser=0";

export function Footer() {
  return (
    <footer className="bg-black text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/janks-logo.webp"
                alt="JANKS Tailoring"
                width={160}
                height={64}
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed text-cream/50 mb-6">
              Bespoke tailoring for the modern gentleman. Precision, heritage, and craft.
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <a href="https://www.instagram.com/official_janks.tailoring?igsh=azNjdnkzYXU0Mm1h&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="JANKS Tailoring on Instagram" className="relative before:absolute before:-inset-1.5 before:content-[''] text-cream/40 hover:text-cream transition-colors duration-300">
                <Instagram size={17} />
              </a>
              <a href="https://youtube.com/@jankstailoring?si=FEwqqKDFy-IdMElm" target="_blank" rel="noopener noreferrer" aria-label="JANKS Tailoring on YouTube" className="relative before:absolute before:-inset-1.5 before:content-[''] text-cream/40 hover:text-cream transition-colors duration-300">
                <Youtube size={17} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100054995383463" target="_blank" rel="noopener noreferrer" aria-label="JANKS Tailoring on Facebook" className="relative before:absolute before:-inset-1.5 before:content-[''] text-cream/40 hover:text-cream transition-colors duration-300">
                <Facebook size={17} />
              </a>
              <a href="https://www.tiktok.com/@janks.tailoring" target="_blank" rel="noopener noreferrer" aria-label="JANKS Tailoring on TikTok" className="relative before:absolute before:-inset-1.5 before:content-[''] text-cream/40 hover:text-cream transition-colors duration-300">
                <FaTiktok size={16} />
              </a>
              <a href="https://www.pinterest.com/JanksTailoring/" target="_blank" rel="noopener noreferrer" aria-label="JANKS Tailoring on Pinterest" className="relative before:absolute before:-inset-1.5 before:content-[''] text-cream/40 hover:text-cream transition-colors duration-300">
                <FaPinterest size={17} />
              </a>
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" aria-label="Read our reviews on Google" className="relative before:absolute before:-inset-1.5 before:content-[''] text-cream/40 hover:text-cream transition-colors duration-300">
                <FaGoogle size={16} />
              </a>
            </div>
          </div>

          {/* Col 2 — Navigate */}
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-cream/30 block mb-5">Navigate</span>
            <ul className="space-y-3">
              {[
                { label: "Services", href: "/services" },
                { label: "Wedding", href: "/wedding-suits" },
                { label: "Corporate", href: "/corporate-tailoring" },
                { label: "Work", href: "/work" },
                { label: "Fit Guide", href: "/fit-guide" },
                { label: "Gallery", href: "/gallery" },
                { label: "About", href: "/about" },
                { label: "Shop", href: "/category" },
                { label: "Book", href: "/book" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[11px] tracking-[0.15em] uppercase text-cream/50 hover:text-cream transition-colors duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-cream/30 block mb-5">Contact</span>
            <ul className="space-y-3">
              <li>
                <a href="mailto:jankstailoring@gmail.com" className="text-[11px] tracking-[0.15em] uppercase text-cream/50 hover:text-cream transition-colors duration-300">
                  Email Us
                </a>
              </li>
              <li>
                <a href="tel:+447828338172" className="text-[11px] tracking-[0.15em] uppercase text-cream/50 hover:text-cream transition-colors duration-300">
                  +44 7828 338172
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-[11px] tracking-[0.15em] uppercase text-cream/50 hover:text-cream transition-colors duration-300">
                  Send a Message
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Registered office. Not a shop, and there are no opening hours. */}
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-cream/30 block mb-5">Registered Office</span>
            <address className="not-italic text-[11px] leading-relaxed text-cream/50">
              JANKS TAILORING LTD<br />
              3rd Floor, 86–90 Paul Street<br />
              London EC2A 4NE
            </address>
            <p className="text-[11px] text-cream/30 mt-4 leading-relaxed">
              This is our registered business address, not a shop. Consultations are by appointment only — we travel to you. Every order is delivered.
            </p>
          </div>

        </div>

        {/* Payment trust badge — sitewide, matched to what's actually
            enabled in Shopify. See PaymentBadge.tsx for what's included and
            why (PayPal isn't offered; Klarna is deliberately left out). */}
        <div className="mt-16 pt-8 border-t border-cream/10">
          <PaymentBadge dark compact />
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-cream/10">
          <p className="text-[11px] leading-relaxed text-cream/40 max-w-3xl mb-6">
            jankstailoring.com is the JANKS Tailoring brand, booking and editorial site. Accessories are sold at our official shop,{" "}
            <a href="https://shop.jankstailoring.com" className="underline underline-offset-2 hover:text-cream transition-colors">
              shop.jankstailoring.com
            </a>
            .
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Registered details on every page — Google Merchant Center looks
              for clear identification of who is behind the store, and it was
              previously only on the policy pages */}
          <p className="text-[10px] tracking-[0.1em] uppercase text-cream/30 leading-relaxed">
            &copy; {new Date().getFullYear()} JANKS TAILORING LTD · London
            <br />
            <span className="normal-case tracking-normal">
              Registered in England and Wales · Company No. 16870658
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {[
              { label: "Privacy & Data Policy", href: "/privacy-policy" },
              { label: "Return & Refund Policy", href: "/return-policy" },
              { label: "Shipping Policy", href: "/shipping-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-[10px] tracking-[0.1em] uppercase text-cream/30 hover:text-cream/60 transition-colors duration-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        </div>

      </div>
    </footer>
  );
}
