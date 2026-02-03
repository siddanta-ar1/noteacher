"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
  Sparkles,
  BookOpen,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { login, signup } from "@/services";
import { Input } from "@/components/ui";
import { ROUTES, SITE_CONFIG } from "@/config";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleOAuth = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}${ROUTES.AUTH_CALLBACK}`,
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
        // User is auto-logged in and redirected, no confirmation needed
      }
    } catch (err: unknown) {
      const error = err as Error;
      // Ignore redirect errors
      if (error.message === "NEXT_REDIRECT") return;
      setMessage({ type: "error", text: error.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface overflow-hidden">
      {/* LEFT: Form Section */}
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12 relative z-10">
        <Link
          href={ROUTES.LANDING}
          className="absolute top-8 left-8 flex items-center gap-2 text-ink-400 hover:text-primary transition-colors group"
        >
          <div className="relative w-6 h-6">
            <Image
              src="/logo.png"
              alt="NOTEacher"
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <span className="font-bold text-sm">Back to Home</span>
        </Link>

        <div className="max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-ink-900 mb-2">
                {mode === "signin" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-ink-500">
                {mode === "signin"
                  ? "Sign in to continue your learning journey."
                  : "Join thousands of engineers leveling up."}
              </p>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium overflow-hidden
                    ${message.type === "success"
                      ? "bg-success-light text-success-dark border border-success/20"
                      : "bg-error-light text-error-dark border border-error/20"
                    }
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

            {/* OAuth Button */}
            <button
              onClick={handleOAuth}
              disabled={isLoading}
              className="w-full py-4 bg-ink-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-ink-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Github size={20} />
              )}
              Continue with GitHub
            </button>

            {/* Divider */}
            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-surface px-4 text-sm font-medium text-ink-400">
                or continue with email
              </span>
            </div>

            {/* Email Form */}
            <form action={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <>
                  <Input
                    name="fullName"
                    label="Full Name"
                    placeholder="Ada Lovelace"
                    icon={<User size={18} />}
                    required
                  />
                  <Input
                    name="username"
                    label="Username"
                    placeholder="ada_lovelace"
                    icon={<User size={18} />}
                    required
                  />
                </>
              )}

              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                icon={<Mail size={18} />}
                required
              />

              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg border-b-4 border-primary-hover active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ boxShadow: "var(--shadow-primary)" }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Mode Toggle */}
            <div className="mt-8 text-center">
              <p className="text-ink-500">
                {mode === "signin" ? "New here?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setMessage(null);
                  }}
                  className="ml-2 text-primary font-bold hover:underline"
                >
                  {mode === "signin" ? "Create account" : "Sign in"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT: Visual Side */}
      <div className="hidden lg:block bg-primary relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }} />
        </div>

        {/* Gradient overlays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-power-purple/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-power-teal/20 rounded-full blur-[80px]" />

        <div className="relative h-full flex flex-col items-center justify-center text-center p-16">
          {/* Main card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-12 rounded-[3rem] shadow-2xl max-w-md"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 p-3">
              <Image
                src="/logo.png"
                alt="NOTEacher"
                width={56}
                height={56}
                className="object-contain rounded-xl"
              />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 leading-snug">
              "The top 1% don't memorize.
              <br />
              They understand."
            </h2>
            <p className="text-white/70 font-medium">
              Join thousands of engineers mastering hardware through interactive
              scrollytelling.
            </p>
          </motion.div>

          {/* Floating Stats */}
          <div className="absolute bottom-16 left-16 right-16 flex justify-between">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md text-white px-5 py-4 rounded-2xl border border-white/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} />
                <span className="text-xs font-bold opacity-70">Courses</span>
              </div>
              <p className="text-2xl font-black">50+</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-md text-white px-5 py-4 rounded-2xl border border-white/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={16} />
                <span className="text-xs font-bold opacity-70">Completed</span>
              </div>
              <p className="text-2xl font-black">128K+</p>
            </motion.div>
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-16 right-16 bg-power-teal text-white px-5 py-3 rounded-2xl shadow-lg border border-white/20"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="fill-white" />
              <span className="font-bold text-sm">AI-Powered</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
