"use client";

import { motion, Variants } from "framer-motion"; // 1. Added Variants import
import {
  Zap,
  ArrowRight,
  MousePointer2,
  Cpu,
  Terminal,
  Activity,
  ChevronRight,
  BookOpen,
  BrainCircuit,
  Lock,
} from "lucide-react";
import Link from "next/link";

// 2. Explicitly typed these objects as 'Variants'
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-navy/10">
      {/* 1. Navbar: Clean & Functional */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto z-50 relative"
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-navy p-2 rounded-xl shadow-lg shadow-navy/20">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-black text-navy italic tracking-tighter">
            NOT<span className="text-power-purple">Eacher</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden md:block text-sm font-bold text-slate-500 hover:text-navy transition-colors"
          >
            Log in
          </Link>
          <Link href="/login">
            <button className="px-6 py-2.5 bg-navy text-white rounded-xl font-bold text-sm border-b-4 border-navy-dark active:border-b-0 active:translate-y-1 transition-all hover:shadow-lg">
              Start Learning
            </button>
          </Link>
        </div>
      </motion.nav>

      {/* 2. Hero Section: Focused & High-Impact */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: The Pitch */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-power-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-power-green"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Democratizing Elite Pedagogy
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-6"
            >
              Elite Teaching, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-power-purple italic">
                Automated.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-500 font-medium leading-relaxed mb-10"
            >
              We transform static syllabuses into interactive, mystery-driven{" "}
              <strong>"Scrollytelling"</strong> narratives. Master complex
              concepts through the eyes of a world-class mentor.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/interest">
                <button className="w-full sm:w-auto px-8 py-4 bg-power-teal text-white rounded-2xl font-black text-lg shadow-xl shadow-power-teal/30 hover:-translate-y-1 transition-transform flex items-center justify-center gap-2 group">
                  Start Your Arc
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link href="/courses">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-navy border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-navy transition-colors flex items-center justify-center gap-2">
                  View Syllabus
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: The Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Abstract Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-power-purple/10 to-power-teal/10 rounded-full blur-3xl -z-10" />

            {/* The App Interface Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border border-slate-800 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 aspect-[4/3] relative">
                {/* Mock UI Header */}
                <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  <div className="ml-auto flex gap-2">
                    <div className="w-16 h-2 bg-white/10 rounded-full" />
                  </div>
                </div>

                {/* Mock Content */}
                <div className="p-8 grid grid-cols-2 gap-8 h-full">
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-power-teal/20 rounded-xl flex items-center justify-center text-power-teal mb-4">
                      <Cpu size={20} />
                    </div>
                    {/* Skeleton Text */}
                    <div className="h-3 w-3/4 bg-white/10 rounded-full" />
                    <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                    <div className="h-3 w-full bg-white/5 rounded-full mt-4" />
                    <div className="h-3 w-5/6 bg-white/5 rounded-full" />
                  </div>

                  {/* Animated Code Block */}
                  <div className="bg-black/50 rounded-xl p-4 border border-white/5 font-mono text-[10px] text-slate-400 leading-loose">
                    <p>
                      <span className="text-power-purple">module</span>{" "}
                      NAND_Gate (
                    </p>
                    <p>
                      &nbsp;&nbsp;
                      <span className="text-power-orange">input</span> a, b,
                    </p>
                    <p>
                      &nbsp;&nbsp;
                      <span className="text-power-orange">output</span> y
                    </p>
                    <p>);</p>
                    <p>
                      &nbsp;&nbsp;
                      <span className="text-power-teal">assign</span> y = ~(a &
                      b);
                    </p>
                    <p>
                      <span className="text-power-purple">endmodule</span>
                    </p>

                    {/* Cursor */}
                    <motion.div
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-2 h-4 bg-power-teal mt-2"
                    />
                  </div>
                </div>

                {/* Scrollytelling Interaction Hint */}
                <div className="absolute bottom-6 right-6 bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-black shadow-lg flex items-center gap-2">
                  <MousePointer2 size={12} className="text-power-purple" />
                  Interactive Mode
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* 3. Features Grid: The 3-Pillar Solution */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              The "No-Teacher" Advantage
            </h2>
            <p className="text-slate-500 font-medium">
              Bridging the gap between TikTok (high engagement) and Textbooks
              (high depth).
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BookOpen}
              title="The Narrative Syllabus"
              desc="Forget chapters. Follow the Arc: The Hook (Mystery), The Guide (Concept), and The Resolution (Application)."
              color="text-power-purple"
              bg="bg-power-purple/10"
            />
            <FeatureCard
              icon={BrainCircuit}
              title="The AI Safety Net"
              desc="Context-aware LLM support. 'Explain Like I'm 5' or 'Debug My Logic' without giving away the answer."
              color="text-power-teal"
              bg="bg-power-teal/10"
            />
            <FeatureCard
              icon={Lock}
              title="The Gamified Flow"
              desc="No passive lectures. Checkpoint Quizzes ensure you master the block before scrolling further."
              color="text-power-orange"
              bg="bg-power-orange/10"
            />
          </div>
        </div>
      </section>

      {/* 4. Minimal Footer */}
      <footer className="py-12 text-center border-t border-slate-100">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <Zap className="w-5 h-5 fill-slate-900" />
          <span className="font-black text-slate-900 italic">NOTEacher</span>
        </div>
        <p className="text-slate-400 text-sm font-medium">
          © 2024 NOTEacher Labs. Designed for the builders.
        </p>
      </footer>
    </div>
  );
}

// Reusable Feature Component
function FeatureCard({ icon: Icon, title, desc, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div
        className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-6`}
      >
        <Icon className={`${color} w-6 h-6`} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">
        {desc}
      </p>
    </div>
  );
}
