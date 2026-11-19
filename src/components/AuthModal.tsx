"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          closeAuthModal();
          router.push("/dashboard");
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          closeAuthModal();
          router.push("/dashboard");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError(null);
    setSuccess(null);
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    resetForm();
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onClick={closeAuthModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[90]"
          >
            <div className="bg-white/30 dark:bg-charcoal/40 backdrop-blur-2xl border border-white/30 dark:border-white/15 mx-4 shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-cinzel text-2xl text-charcoal dark:text-white">
                      {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-xs text-charcoal/50 dark:text-white/50 mt-1">
                      {mode === "login"
                        ? "Sign in to access your account"
                        : "Join JANKS for exclusive benefits"}
                    </p>
                  </div>
                  <button
                    onClick={closeAuthModal}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal dark:hover:bg-white group transition-all duration-300"
                  >
                    <X size={18} className="text-charcoal dark:text-white group-hover:text-cream dark:group-hover:text-charcoal transition-colors" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase text-charcoal/60 dark:text-white/60 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/30" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white/30 dark:bg-white/5 border border-white/30 dark:border-white/10 text-charcoal dark:text-white text-sm focus:outline-none focus:border-gold transition-colors backdrop-blur-sm"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase text-charcoal/60 dark:text-white/60 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/30" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-white/30 dark:bg-white/5 border border-white/30 dark:border-white/10 text-charcoal dark:text-white text-sm focus:outline-none focus:border-gold transition-colors backdrop-blur-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase text-charcoal/60 dark:text-white/60 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/30" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-12 py-3 bg-white/30 dark:bg-white/5 border border-white/30 dark:border-white/10 text-charcoal dark:text-white text-sm focus:outline-none focus:border-gold transition-colors backdrop-blur-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/30 hover:text-charcoal dark:hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs"
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs"
                    >
                      {success}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-charcoal dark:bg-white text-cream dark:text-charcoal text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-gold hover:text-charcoal transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/20 dark:border-white/10 text-center">
                  <p className="text-xs text-charcoal/50 dark:text-white/50">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                      className="ml-2 text-charcoal dark:text-white hover:text-gold transition-colors underline underline-offset-2"
                    >
                      {mode === "login" ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
