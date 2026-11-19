"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const shirtMeasurements = [
  { id: "collar", label: "Collar", instruction: "Measure around the base of your neck, where a shirt collar sits. Add 1/2 inch for comfort." },
  { id: "chest", label: "Chest", instruction: "Measure around the fullest part of your chest, under the arms, with arms relaxed at sides." },
  { id: "waist", label: "Waist", instruction: "Measure around your natural waistline, typically the narrowest part of your torso." },
  { id: "sleeve", label: "Sleeve Length", instruction: "From the center back of neck, across the shoulder, down to the wrist bone with arm slightly bent." },
  { id: "shoulder", label: "Shoulder Width", instruction: "Measure from the edge of one shoulder to the other, across the back." },
];

const suitMeasurements = [
  { id: "chest-s", label: "Chest", instruction: "Measure around the fullest part of your chest, under the arms, keeping the tape level. Arms should be relaxed at your sides." },
  { id: "waist-s", label: "Waist", instruction: "Measure around your natural waistline, typically at the navel or slightly above, where you'd wear your trouser waistband." },
  { id: "shoulder-s", label: "Shoulder Width", instruction: "Measure from the edge of one shoulder bone to the other, across the back where the sleeve seam would sit." },
  { id: "sleeve-s", label: "Sleeve Length", instruction: "From the shoulder point, down the outside of the arm to the wrist bone, with arm slightly bent." },
  { id: "jacket-s", label: "Jacket Length", instruction: "From the base of the collar at the center back, down to where you want the jacket to end (typically mid-seat)." },
  { id: "armhole-s", label: "Armhole", instruction: "Measure around the armhole opening, from the top of the shoulder down under the arm and back up." },
];

const trouserMeasurements = [
  { id: "waist-t", label: "Waist", instruction: "Measure around where you normally wear your trousers, keeping the tape comfortably snug." },
  { id: "seat", label: "Seat/Hip", instruction: "Measure around the fullest part of your hips and seat." },
  { id: "inseam", label: "Inseam", instruction: "From the crotch seam down to the bottom of the ankle bone, along the inside leg." },
  { id: "outseam", label: "Outseam", instruction: "From the waist to the desired length along the outside of the leg." },
  { id: "thigh", label: "Thigh", instruction: "Measure around the fullest part of your thigh, typically just below the crotch." },
];

const tabs = [
  { id: "shirt", label: "Shirt" },
  { id: "suit", label: "Suit" },
  { id: "trouser", label: "Trousers" },
  { id: "sizes", label: "Size Charts" },
];

const shirtSizes = [
  { size: "XS", collar: "14", chest: "34-36", waist: "28-30", sleeve: "32" },
  { size: "S", collar: "14.5", chest: "36-38", waist: "30-32", sleeve: "33" },
  { size: "M", collar: "15-15.5", chest: "38-40", waist: "32-34", sleeve: "34" },
  { size: "L", collar: "16-16.5", chest: "42-44", waist: "36-38", sleeve: "35" },
  { size: "XL", collar: "17-17.5", chest: "46-48", waist: "40-42", sleeve: "36" },
  { size: "XXL", collar: "18-18.5", chest: "50-52", waist: "44-46", sleeve: "37" },
];

const trouserSizes = [
  { size: "28", waist: "28", seat: "34", inseam: "30-32" },
  { size: "30", waist: "30", seat: "36", inseam: "30-32" },
  { size: "32", waist: "32", seat: "38", inseam: "30-32" },
  { size: "34", waist: "34", seat: "40", inseam: "30-32" },
  { size: "36", waist: "36", seat: "42", inseam: "30-32" },
  { size: "38", waist: "38", seat: "44", inseam: "30-32" },
  { size: "40", waist: "40", seat: "46", inseam: "30-32" },
];

const suitSizes = [
  { size: "36S", chest: "36", waist: "30", shoulder: "17", sleeve: "23", jacket: "28" },
  { size: "38R", chest: "38", waist: "32", shoulder: "17.5", sleeve: "24", jacket: "29" },
  { size: "40R", chest: "40", waist: "34", shoulder: "18", sleeve: "24.5", jacket: "30" },
  { size: "42R", chest: "42", waist: "36", shoulder: "18.5", sleeve: "25", jacket: "31" },
  { size: "44R", chest: "44", waist: "38", shoulder: "19", sleeve: "25.5", jacket: "31.5" },
  { size: "46L", chest: "46", waist: "40", shoulder: "19.5", sleeve: "26", jacket: "32" },
  { size: "48L", chest: "48", waist: "42", shoulder: "20", sleeve: "26.5", jacket: "32.5" },
];

function ShirtIllustration({ highlight }: { highlight: string | null }) {
  return (
    <svg viewBox="0 0 200 280" className="w-full max-w-[200px] mx-auto">
      <defs>
        <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f0" />
          <stop offset="100%" stopColor="#e8e8e0" />
        </linearGradient>
      </defs>
      
      <path
        d="M100 20 L70 30 L40 60 L30 100 L50 100 L55 70 L55 260 L145 260 L145 70 L150 100 L170 100 L160 60 L130 30 L100 20"
        fill="url(#shirtGrad)"
        stroke="#333"
        strokeWidth="1.5"
      />
      
      <ellipse cx="100" cy="25" rx="15" ry="8" fill="none" stroke="#333" strokeWidth="1.5"
        className={`transition-all duration-300 ${highlight === 'collar' ? 'stroke-amber-600 stroke-[3]' : ''}`}
      />
      
      <line x1="55" y1="100" x2="145" y2="100" stroke="#999" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'chest' ? 'stroke-amber-600 stroke-[2]' : ''}`}
      />
      {highlight === 'chest' && (
        <>
          <circle cx="55" cy="100" r="3" fill="#d97706" />
          <circle cx="145" cy="100" r="3" fill="#d97706" />
        </>
      )}
      
      <line x1="55" y1="160" x2="145" y2="160" stroke="#999" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'waist' ? 'stroke-amber-600 stroke-[2]' : ''}`}
      />
      {highlight === 'waist' && (
        <>
          <circle cx="55" cy="160" r="3" fill="#d97706" />
          <circle cx="145" cy="160" r="3" fill="#d97706" />
        </>
      )}
      
      <path d="M100 25 L70 30 L40 60 L30 100" fill="none" stroke="#999" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'sleeve' ? 'stroke-amber-600 stroke-[2]' : ''}`}
      />
      {highlight === 'sleeve' && (
        <>
          <circle cx="100" cy="25" r="3" fill="#d97706" />
          <circle cx="30" cy="100" r="3" fill="#d97706" />
        </>
      )}
      
      <line x1="70" y1="35" x2="130" y2="35" stroke="#999" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'shoulder' ? 'stroke-amber-600 stroke-[2]' : ''}`}
      />
      {highlight === 'shoulder' && (
        <>
          <circle cx="70" cy="35" r="3" fill="#d97706" />
          <circle cx="130" cy="35" r="3" fill="#d97706" />
        </>
      )}
    </svg>
  );
}

function SuitIllustration({ highlight }: { highlight: string | null }) {
  return (
    <svg viewBox="0 0 220 320" className="w-full max-w-[220px] mx-auto">
      <defs>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="lapelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
      </defs>
      
      <path
        d="M110 25 L75 35 L40 70 L25 130 L45 130 L50 90 L50 290 L170 290 L170 90 L175 130 L195 130 L180 70 L145 35 L110 25"
        fill="url(#suitGrad)"
        stroke="#111"
        strokeWidth="1.5"
      />
      
      <path d="M110 25 L95 50 L85 100 L90 180 L110 200" fill="url(#lapelGrad)" stroke="#333" strokeWidth="1" />
      <path d="M110 25 L125 50 L135 100 L130 180 L110 200" fill="url(#lapelGrad)" stroke="#333" strokeWidth="1" />
      
      <ellipse cx="110" cy="30" rx="12" ry="6" fill="#f5f5f0" stroke="#333" strokeWidth="1" />
      
      <circle cx="110" cy="220" r="4" fill="#333" />
      <circle cx="110" cy="250" r="4" fill="#333" />
      
      <line x1="50" y1="120" x2="170" y2="120" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'chest-s' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'chest-s' && (
        <>
          <circle cx="50" cy="120" r="3" fill="#f59e0b" />
          <circle cx="170" cy="120" r="3" fill="#f59e0b" />
        </>
      )}
      
      <line x1="55" y1="180" x2="165" y2="180" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'waist-s' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'waist-s' && (
        <>
          <circle cx="55" cy="180" r="3" fill="#f59e0b" />
          <circle cx="165" cy="180" r="3" fill="#f59e0b" />
        </>
      )}
      
      <line x1="75" y1="40" x2="145" y2="40" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'shoulder-s' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'shoulder-s' && (
        <>
          <circle cx="75" cy="40" r="3" fill="#f59e0b" />
          <circle cx="145" cy="40" r="3" fill="#f59e0b" />
        </>
      )}
      
      <path d="M145 40 L180 70 L195 130" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'sleeve-s' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'sleeve-s' && (
        <>
          <circle cx="145" cy="40" r="3" fill="#f59e0b" />
          <circle cx="195" cy="130" r="3" fill="#f59e0b" />
        </>
      )}
      
      <line x1="110" y1="30" x2="110" y2="290" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'jacket-s' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'jacket-s' && (
        <>
          <circle cx="110" cy="30" r="3" fill="#f59e0b" />
          <circle cx="110" cy="290" r="3" fill="#f59e0b" />
        </>
      )}
      
      <ellipse cx="55" cy="80" rx="15" ry="35" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'armhole-s' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'armhole-s' && (
        <>
          <circle cx="55" cy="45" r="3" fill="#f59e0b" />
          <circle cx="55" cy="115" r="3" fill="#f59e0b" />
        </>
      )}
    </svg>
  );
}

function TrouserIllustration({ highlight }: { highlight: string | null }) {
  return (
    <svg viewBox="0 0 180 320" className="w-full max-w-[180px] mx-auto">
      <defs>
        <linearGradient id="trouserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="100%" stopColor="#333" />
        </linearGradient>
      </defs>
      
      <path
        d="M30 20 L150 20 L150 30 L140 130 L130 300 L100 300 L90 150 L80 300 L50 300 L40 130 L30 30 L30 20"
        fill="url(#trouserGrad)"
        stroke="#222"
        strokeWidth="1.5"
      />
      
      <line x1="30" y1="25" x2="150" y2="25" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'waist-t' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'waist-t' && (
        <>
          <circle cx="30" cy="25" r="3" fill="#f59e0b" />
          <circle cx="150" cy="25" r="3" fill="#f59e0b" />
        </>
      )}
      
      <ellipse cx="90" cy="65" rx="55" ry="30" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'seat' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'seat' && (
        <>
          <circle cx="35" cy="65" r="3" fill="#f59e0b" />
          <circle cx="145" cy="65" r="3" fill="#f59e0b" />
        </>
      )}
      
      <line x1="75" y1="130" x2="75" y2="300" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'inseam' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'inseam' && (
        <>
          <circle cx="75" cy="130" r="3" fill="#f59e0b" />
          <circle cx="75" cy="300" r="3" fill="#f59e0b" />
        </>
      )}
      
      <line x1="50" y1="25" x2="50" y2="300" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'outseam' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'outseam' && (
        <>
          <circle cx="50" cy="25" r="3" fill="#f59e0b" />
          <circle cx="50" cy="300" r="3" fill="#f59e0b" />
        </>
      )}
      
      <ellipse cx="65" cy="150" rx="20" ry="12" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="4 4"
        className={`transition-all duration-300 ${highlight === 'thigh' ? 'stroke-amber-500 stroke-[2]' : ''}`}
      />
      {highlight === 'thigh' && (
        <>
          <circle cx="45" cy="150" r="3" fill="#f59e0b" />
          <circle cx="85" cy="150" r="3" fill="#f59e0b" />
        </>
      )}
    </svg>
  );
}

export default function FitGuidePage() {
  const [activeTab, setActiveTab] = useState<"shirt" | "suit" | "trouser" | "sizes">("shirt");
  const [highlightShirt, setHighlightShirt] = useState<string | null>(null);
  const [highlightSuit, setHighlightSuit] = useState<string | null>(null);
  const [highlightTrouser, setHighlightTrouser] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-cream dark:bg-black">
      <Navigation />

      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-charcoal">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/IMG_1541-1768955593954.jpeg?width=8000&height=8000&resize=contain"
            alt="Tailoring fabrics"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/40 block mb-4">
              How to Measure
            </span>
            <h1 className="font-cinzel text-4xl lg:text-6xl text-white leading-[1.1]">
              Fit Guide
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-charcoal/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
<div className="flex overflow-x-auto border-b border-charcoal/10 dark:border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`shrink-0 py-4 px-6 text-[11px] tracking-[0.15em] uppercase transition-all relative ${
                    activeTab === tab.id
                      ? "text-charcoal dark:text-white"
                      : "text-charcoal/40 dark:text-white/40 hover:text-charcoal/60 dark:hover:text-white/60"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="fitTab"
                      className="absolute bottom-0 left-0 right-0 h-px bg-charcoal dark:bg-white"
                    />
                  )}
                </button>
              ))}
            </div>
        </div>
      </section>

      {activeTab === "shirt" && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <div className="bg-secondary p-6 lg:p-8">
                  <Image
                    src="/shirt-measurement.jpeg"
                    alt="Shirt measurement guide"
                    width={600}
                    height={700}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-cinzel text-2xl text-charcoal dark:text-white mb-8">
                  Shirt Measurements
                </h2>
                <div className="space-y-1">
                  {shirtMeasurements.map((m, index) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={() => setHighlightShirt(m.id)}
                      onMouseLeave={() => setHighlightShirt(null)}
                      className={`p-4 border border-charcoal/10 dark:border-white/10 cursor-pointer transition-all ${
                        highlightShirt === m.id ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700" : "hover:bg-secondary dark:hover:bg-charcoal/10"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-charcoal/20 dark:text-white/20 text-sm">0{index + 1}</span>
                        <div>
                          <h3 className="font-cinzel text-base text-charcoal dark:text-white mb-1">{m.label}</h3>
                          <p className="text-charcoal/50 dark:text-white/50 text-sm leading-relaxed">{m.instruction}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === "trouser" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="py-16 lg:py-24"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                <div className="lg:sticky lg:top-32 lg:self-start">
                  <div className="bg-secondary dark:bg-charcoal/20 p-8 lg:p-12">
                    <img 
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/IMG_1524-1768769948838.jpeg?width=8000&height=8000&resize=contain" 
                      alt="Trouser measurement guide showing waist, hip, thigh, knee, outseam, front rise, back rise, and hem measurements"
                      className="w-full max-w-[400px] mx-auto"
                    />
                    <p className="text-center text-charcoal/40 dark:text-white/40 text-xs mt-6">
                      Hover over measurements to see where to measure
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="font-cinzel text-2xl text-charcoal dark:text-white mb-8">
                    Trouser Measurements
                  </h2>
                  <div className="space-y-1">
                    {trouserMeasurements.map((m, index) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onMouseEnter={() => setHighlightTrouser(m.id)}
                        onMouseLeave={() => setHighlightTrouser(null)}
                        className={`p-4 border border-charcoal/10 dark:border-white/10 cursor-pointer transition-all ${
                          highlightTrouser === m.id ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700" : "hover:bg-secondary dark:hover:bg-charcoal/10"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-charcoal/20 dark:text-white/20 text-sm">0{index + 1}</span>
                          <div>
                            <h3 className="font-cinzel text-base text-charcoal dark:text-white mb-1">{m.label}</h3>
                            <p className="text-charcoal/50 dark:text-white/50 text-sm leading-relaxed">{m.instruction}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

      {activeTab === "suit" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="py-16 lg:py-24"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                <div className="lg:sticky lg:top-32 lg:self-start">
                  <div className="bg-secondary dark:bg-charcoal/20 p-8 lg:p-12">
                    <img 
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/66a35657-54dd-40fc-bc1c-b2be802f78da/IMG_1526-1768769650418.jpeg?width=8000&height=8000&resize=contain" 
                      alt="Suit measurement guide showing chest, waist, sleeve length, shoulder width, and other key measurements"
                      className="w-full max-w-[400px] mx-auto"
                    />
                    <p className="text-center text-charcoal/40 dark:text-white/40 text-xs mt-6">
                      Hover over measurements to see where to measure
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="font-cinzel text-2xl text-charcoal dark:text-white mb-8">
                    Suit Measurements
                  </h2>
                  <div className="space-y-1">
                    {suitMeasurements.map((m, index) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onMouseEnter={() => setHighlightSuit(m.id)}
                        onMouseLeave={() => setHighlightSuit(null)}
                        className={`p-4 border border-charcoal/10 dark:border-white/10 cursor-pointer transition-all ${
                          highlightSuit === m.id ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700" : "hover:bg-secondary dark:hover:bg-charcoal/10"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-charcoal/20 dark:text-white/20 text-sm">0{index + 1}</span>
                          <div>
                            <h3 className="font-cinzel text-base text-charcoal dark:text-white mb-1">{m.label}</h3>
                            <p className="text-charcoal/50 dark:text-white/50 text-sm leading-relaxed">{m.instruction}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

      {activeTab === "sizes" && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
            <div>
              <h2 className="font-cinzel text-2xl text-charcoal dark:text-white mb-6">Shirt Size Chart</h2>
              <p className="text-charcoal/50 dark:text-white/50 text-sm mb-6">All measurements in inches</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-charcoal/10 dark:border-white/10">
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Size</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Collar</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Chest</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Waist</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shirtSizes.map((row) => (
                      <tr key={row.size} className="border-b border-charcoal/5 dark:border-white/5 hover:bg-secondary dark:hover:bg-charcoal/10">
                        <td className="py-3 px-4 font-cinzel text-charcoal dark:text-white">{row.size}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.collar}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.chest}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.waist}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-cinzel text-2xl text-charcoal dark:text-white mb-6">Trouser Size Chart</h2>
              <p className="text-charcoal/50 dark:text-white/50 text-sm mb-6">All measurements in inches</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-charcoal/10 dark:border-white/10">
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Size</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Waist</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Seat</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Inseam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trouserSizes.map((row) => (
                      <tr key={row.size} className="border-b border-charcoal/5 dark:border-white/5 hover:bg-secondary dark:hover:bg-charcoal/10">
                        <td className="py-3 px-4 font-cinzel text-charcoal dark:text-white">{row.size}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.waist}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.seat}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.inseam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-cinzel text-2xl text-charcoal dark:text-white mb-6">Suit Size Chart</h2>
              <p className="text-charcoal/50 dark:text-white/50 text-sm mb-6">All measurements in inches. S = Short, R = Regular, L = Long</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-charcoal/10 dark:border-white/10">
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Size</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Chest</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Waist</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Shoulder</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Sleeve</th>
                      <th className="py-3 px-4 text-left text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-white/40">Jacket Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suitSizes.map((row) => (
                      <tr key={row.size} className="border-b border-charcoal/5 dark:border-white/5 hover:bg-secondary dark:hover:bg-charcoal/10">
                        <td className="py-3 px-4 font-cinzel text-charcoal dark:text-white">{row.size}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.chest}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.waist}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.shoulder}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.sleeve}</td>
                        <td className="py-3 px-4 text-charcoal/60 dark:text-white/60">{row.jacket}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      <section className="py-16 lg:py-20 bg-charcoal">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-cinzel text-2xl lg:text-3xl text-cream mb-4">
              Need Help Measuring?
            </h2>
            <p className="text-cream/50 text-sm mb-8 max-w-md mx-auto">
              Book a consultation and our expert tailors will take all measurements for you, 
              ensuring the perfect fit every time.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 text-cream text-[11px] tracking-[0.2em] uppercase border border-cream/20 px-8 py-4 hover:bg-cream hover:text-charcoal transition-all duration-300"
            >
              Book Consultation
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
