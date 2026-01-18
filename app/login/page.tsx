"use client";

import { motion } from "framer-motion";
import { GraduationCap, Github, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGithubLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setIsLoading(false);
    }
    // Supabase will redirect automatically on success
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center p-6">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 border border-slate-100"
      >
        {/* Mascot / Icon */}
        <div className="flex justify-center -mt-20 mb-6">
          <div className="w-24 h-24 rounded-full bg-[#0055FF] flex items-center justify-center shadow-[0_10px_0_#003ECC]">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tight text-[#0055FF]">
            NOT<span className="text-purple-500">Eacher</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Advanced Computer Architecture Lab
          </p>
        </div>

        {/* Progress Bar (Game Style) */}
        <div className="mb-8">
          <p className="text-xs font-bold text-slate-400 mb-2">
            Learning Progress
          </p>
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-teal-400 rounded-full shadow-inner" />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link href="/interest">
            <button
              className="w-full py-5 rounded-2xl font-bold text-white bg-[#0055FF]
              shadow-[0_6px_0_#003ECC] hover:translate-y-[2px]
              hover:shadow-[0_4px_0_#003ECC] transition-all
              flex items-center justify-center gap-2"
            >
              Start Learning <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

          <button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full py-5 rounded-2xl font-bold text-slate-700 bg-white
            border-2 border-slate-200
            shadow-[0_6px_0_#CBD5E1] hover:translate-y-[2px]
            hover:shadow-[0_4px_0_#CBD5E1] transition-all
            flex items-center justify-center gap-2
            disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Github className="w-5 h-5" />
            )}
            Sign in with GitHub
          </button>
        </div>

        {/* Stats (Card-based) */}
        <div className="grid grid-cols-2 gap-4 mt-10">
          <div className="rounded-2xl bg-slate-50 p-4 text-center shadow-sm">
            <p className="text-3xl font-black text-[#0055FF]">24</p>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
              Courses
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-center shadow-sm">
            <p className="text-3xl font-black text-teal-500">150+</p>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
              Simulators
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
