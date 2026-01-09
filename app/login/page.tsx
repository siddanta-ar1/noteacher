"use client";
import { motion } from "framer-motion";
import { GraduationCap, Github, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-navy/10">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-navy rounded-3xl shadow-xl shadow-navy/20 mb-6">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black text-navy tracking-tighter italic">
            NOT<span className="text-power-purple">Eacher</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3">
            Advanced Computer Architecture Lab
          </p>
        </motion.div>

        <div className="space-y-4">
          <Link href="/interest">
            <button className="btn-power w-full py-5 bg-navy border-navy-dark text-white flex items-center justify-center gap-2 hover:bg-navy-dark shadow-lg">
              Start Learning <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

          <button className="btn-power w-full py-5 bg-white border-slate-200 text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50">
            <Github className="w-5 h-5" /> Sign in with GitHub
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-black text-navy">24</p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Courses
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-power-teal">150+</p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Simulators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
