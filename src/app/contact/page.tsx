"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, Instagram, Youtube } from "lucide-react";
import { FaTiktok, FaPinterest } from "react-icons/fa6";
import { trackContact } from "@/lib/meta-events";

const socials = [
  { name: "Instagram", handle: "@official_janks.tailoring", url: "https://www.instagram.com/official_janks.tailoring?igsh=azNjdnkzYXU0Mm1h&utm_source=qr", icon: Instagram },
  { name: "YouTube", handle: "Janks Tailoring", url: "https://youtube.com/@jankstailoring?si=FEwqqKDFy-IdMElm", icon: Youtube },
  { name: "TikTok", handle: "@janks.tailoring", url: "https://www.tiktok.com/@janks.tailoring", icon: FaTiktok },
  { name: "Pinterest", handle: "JanksTailoring", url: "https://www.pinterest.com/JanksTailoring/", icon: FaPinterest },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleExternalLink = (url: string) => {
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "message" }),
      });
      if (res.ok) trackContact();
    } catch (_) {}
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      {/* Hero */}
      <section className="relative h-[45vh] flex items-end overflow-hidden">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/IMG_1542-1768955980067.jpeg?width=8000&height=8000&resize=contain"
          alt="Janks Tailoring Atelier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-12 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/50 block mb-3">Get in Touch</span>
            <h1 className="font-cinzel text-4xl lg:text-6xl text-white">Contact Us</h1>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left — contact details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-10"
            >
              {/* Founder */}
              <div className="flex items-center gap-4 pb-8 border-b border-charcoal/10 dark:border-white/10">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-charcoal/10 dark:border-white/10 shrink-0">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/IMG_0366-1768955930563.png?width=8000&height=8000&resize=contain"
                    alt="Kwaku Acheampong"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-cinzel text-xl text-charcoal dark:text-white">Kwaku Acheampong</h2>
                  <p className="text-charcoal/50 dark:text-white/50 text-sm mt-0.5">Master Tailor & Founder</p>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-6">
                <a href="mailto:jankstailoring@gmail.com" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 border border-charcoal/15 dark:border-white/15 flex items-center justify-center shrink-0 group-hover:bg-charcoal dark:group-hover:bg-white transition-colors">
                    <Mail size={16} className="text-charcoal dark:text-white group-hover:text-cream dark:group-hover:text-charcoal transition-colors" />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 block mb-1">Email</span>
                    <span className="text-charcoal dark:text-white group-hover:text-gold transition-colors">jankstailoring@gmail.com</span>
                  </div>
                </a>

                <a href="tel:+447828338172" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 border border-charcoal/15 dark:border-white/15 flex items-center justify-center shrink-0 group-hover:bg-charcoal dark:group-hover:bg-white transition-colors">
                    <Phone size={16} className="text-charcoal dark:text-white group-hover:text-cream dark:group-hover:text-charcoal transition-colors" />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 block mb-1">Phone</span>
                    <span className="text-charcoal dark:text-white group-hover:text-gold transition-colors">+44 7828 338172</span>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-charcoal/15 dark:border-white/15 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-charcoal dark:text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 block mb-1">Atelier</span>
                    <address className="not-italic text-charcoal dark:text-white leading-relaxed">
                      3rd Floor, 86-90 Paul Street<br />London, EC2A 4NE
                    </address>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="border border-charcoal/10 dark:border-white/10 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={14} className="text-charcoal/40 dark:text-white/40" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40">Opening Hours</span>
                </div>
                <div className="space-y-3 text-sm text-charcoal/70 dark:text-white/70">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="text-charcoal dark:text-white">9:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-charcoal dark:text-white">10:00 – 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-charcoal/40 dark:text-white/40">By appointment</span>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 block mb-4">Follow Us</span>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 border border-charcoal/10 dark:border-white/10 px-4 py-3 hover:border-charcoal/30 dark:hover:border-white/30 hover:bg-charcoal/5 dark:hover:bg-white/5 transition-all"
                      >
                        <Icon size={16} className="text-charcoal dark:text-white" />
                        <span className="text-[11px] tracking-wide text-charcoal/60 dark:text-white/60">{s.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right — contact form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-cinzel text-2xl lg:text-3xl text-charcoal dark:text-white mb-2">Send a Message</h2>
              <p className="text-charcoal/50 dark:text-white/50 text-sm mb-8">We typically respond within 24 hours.</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-charcoal/10 dark:border-white/10 p-10 text-center"
                >
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Send size={20} className="text-gold" />
                  </div>
                  <h3 className="font-cinzel text-xl text-charcoal dark:text-white mb-2">Message Sent</h3>
                  <p className="text-charcoal/50 dark:text-white/50 text-sm">Thank you, {formData.name}. We'll be in touch shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border border-charcoal/15 dark:border-white/15 px-4 py-3 text-charcoal dark:text-white placeholder:text-charcoal/25 dark:placeholder:text-white/25 focus:border-charcoal/40 dark:focus:border-white/40 focus:outline-none transition-colors text-sm"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-transparent border border-charcoal/15 dark:border-white/15 px-4 py-3 text-charcoal dark:text-white placeholder:text-charcoal/25 dark:placeholder:text-white/25 focus:border-charcoal/40 dark:focus:border-white/40 focus:outline-none transition-colors text-sm"
                        placeholder="+44 7000 000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border border-charcoal/15 dark:border-white/15 px-4 py-3 text-charcoal dark:text-white placeholder:text-charcoal/25 dark:placeholder:text-white/25 focus:border-charcoal/40 dark:focus:border-white/40 focus:outline-none transition-colors text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-white/40 mb-2">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-transparent border border-charcoal/15 dark:border-white/15 px-4 py-3 text-charcoal dark:text-white placeholder:text-charcoal/25 dark:placeholder:text-white/25 focus:border-charcoal/40 dark:focus:border-white/40 focus:outline-none transition-colors resize-none text-sm"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full group flex items-center justify-center gap-3 bg-charcoal dark:bg-white text-cream dark:text-charcoal py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-gold hover:text-charcoal transition-all duration-300"
                  >
                    Send Message
                    <Send size={13} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
