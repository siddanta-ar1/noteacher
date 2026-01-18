"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Github,
  ArrowRight,
  Mail,
  Lock,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // We use the browser client for OAuth because it redirects the window
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleOAuth = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      if (mode === "signin") {
        const res = await login(formData);
        if (res?.error) throw new Error(res.error);
      } else {
        const res = await signup(formData);
        if (res?.error) throw new Error(res.error);
        if (res?.success) {
          setMessage({
            type: "success",
            text: "Check your email to confirm your account!",
          });
          setIsLoading(false);
          return; // Don't redirect yet
        }
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white overflow-hidden">
      {/* LEFT: Form Section */}
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12 relative z-10">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-navy transition-colors"
        >
          <Zap size={20} />
          <span className="font-bold text-sm">Back to Base</span>
        </Link>

        <div className="max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-black text-slate-900 mb-2">
              {mode === "signin"
                ? "Welcome Back, Cadet."
                : "Initialize Profile."}
            </h1>
            <p className="text-slate-500 font-medium mb-8">
              {mode === "signin"
                ? "Your neural link is ready. Resume your arc."
                : "Join the elite 1%. Your journey begins now."}
            </p>

            {/* ERROR / SUCCESS MESSAGES */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold overflow-hidden
                    ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}
                  `}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* OAUTH BUTTONS */}
            <button
              onClick={handleOAuth}
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Github size={20} />
              )}
              Continue with GitHub
            </button>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Or with Credentials
              </span>
            </div>

            {/* EMAIL FORM */}
            <form action={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      name="fullName"
                      required
                      placeholder="Ada Lovelace"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy transition-all placeholder:text-slate-400 placeholder:font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase ml-1">
                  Email Coordinates
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="cadet@noteacher.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy transition-all placeholder:text-slate-400 placeholder:font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase ml-1">
                  Access Key
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy transition-all placeholder:text-slate-400 placeholder:font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-navy text-white rounded-2xl font-black text-lg shadow-xl shadow-navy/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {mode === "signin" ? "Engage Link" : "Create Identity"}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 font-medium">
                {mode === "signin"
                  ? "New to the system?"
                  : "Already have an ID?"}
                <button
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setMessage(null);
                  }}
                  className="ml-2 text-navy font-black hover:underline"
                >
                  {mode === "signin" ? "Initialize here" : "Sign in"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT: Visual Side */}
      <div className="hidden lg:block bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-power-purple/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-power-teal/20 rounded-full blur-[80px]" />

        <div className="relative h-full flex flex-col items-center justify-center text-center p-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] shadow-2xl"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Zap className="text-white w-12 h-12 fill-white" />
            </div>
            <h2 className="text-3xl font-black text-white italic mb-4">
              "The 1% don't memorize.
              <br />
              They understand."
            </h2>
            <p className="text-white/60 font-medium max-w-md mx-auto">
              Join thousands of engineers mastering hardware through interactive
              scrollytelling.
            </p>

            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-power-teal text-white p-4 rounded-2xl shadow-lg border border-white/20"
            >
              <span className="font-black text-xs uppercase tracking-widest">
                Active Users
              </span>
              <p className="font-black text-2xl">+12,400</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
