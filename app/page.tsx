"use client";

import React from "react";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import {
  Zap,
  ArrowRight,
  MousePointer2,
  Cpu,
  BookOpen,
  BrainCircuit,
  Lock,
  Play,
  Users,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// Animation variants
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-power-purple/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-power-teal/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50"
      >
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 transition-all">
              <Image
                src="/logo.png"
                alt="NOTEacher Logo"
                fill
                className="object-contain rounded-xl"
                priority
              />
            </div>
            <span className="text-xl font-black text-primary italic tracking-tighter">
              NOT<span className="text-power-purple">Eacher</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:block text-sm font-bold text-ink-500 hover:text-primary transition-colors"
            >
              Log in
            </Link>
            <Link href="/login">
              <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm border-b-4 border-primary-hover active:border-b-0 active:translate-y-1 transition-all hover:shadow-lg" style={{ boxShadow: "var(--shadow-primary)" }}>
                Start Learning
              </button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
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
              className="inline-flex items-center gap-2 bg-surface-raised border border-border px-4 py-2 rounded-full mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-500">
                Now in Beta • Join 12,000+ Learners
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-ink-900 leading-[0.95] tracking-tight mb-6"
            >
              Elite Teaching,{" "}
              <span className="text-gradient-primary italic block md:inline">
                Automated.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-ink-500 leading-relaxed mb-10 max-w-lg"
            >
              Transform static syllabuses into interactive,{" "}
              <strong className="text-ink-700">mystery-driven Scrollytelling</strong>{" "}
              narratives. Master complex concepts through the eyes of a world-class mentor.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/interest">
                <button className="w-full sm:w-auto px-8 py-4 bg-power-teal text-white rounded-2xl font-black text-lg hover:-translate-y-1 hover:shadow-xl transition-all flex items-center justify-center gap-2 group" style={{ boxShadow: "var(--shadow-teal)" }}>
                  <Play size={18} className="fill-white" />
                  Start Your Arc
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link href="/courses">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-primary border-2 border-border rounded-2xl font-bold text-lg hover:border-primary hover:bg-primary-light transition-all flex items-center justify-center gap-2">
                  View Courses
                </button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 mt-10 pt-10 border-t border-border"
            >
              <div className="flex -space-x-2">
                {["#6366f1", "#14b8a6", "#f97316", "#a855f7"].map((color, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full ring-2 ring-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {["JD", "AK", "MS", "LP"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-power-orange">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} size={14} className="fill-power-orange" />
                  ))}
                </div>
                <p className="text-sm text-ink-500 font-medium">
                  <strong className="text-ink-700">4.9/5</strong> from 2,400+ reviews
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: The Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Abstract Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-tr from-power-purple/20 to-power-teal/20 rounded-full blur-3xl"
              />
            </div>

            {/* The App Interface Card */}
            <motion.div
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-ink-900 rounded-[2.5rem] p-4 shadow-2xl border border-ink-700/50 rotate-[-3deg]"
            >
              <div className="bg-black rounded-[2rem] overflow-hidden border border-white/10 aspect-[4/3] relative">
                {/* Mock UI Header */}
                <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                  <div className="ml-auto flex gap-2">
                    <div className="w-20 h-2 bg-white/10 rounded-full" />
                  </div>
                </div>

                {/* Mock Content */}
                <div className="p-8 grid grid-cols-2 gap-8 h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-power-teal/20 rounded-xl flex items-center justify-center text-power-teal mb-4">
                      <Cpu size={24} />
                    </div>
                    {/* Skeleton Text with animated shimmer */}
                    <div className="h-4 w-3/4 bg-white/10 rounded-full" />
                    <div className="h-4 w-1/2 bg-white/10 rounded-full" />
                    <div className="h-3 w-full bg-white/5 rounded-full mt-4" />
                    <div className="h-3 w-5/6 bg-white/5 rounded-full" />
                  </div>

                  {/* Animated Code Block */}
                  <div className="bg-black/50 rounded-xl p-4 border border-white/5 font-mono text-xs text-ink-400 leading-loose overflow-hidden">
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
                      <span className="text-power-teal">assign</span> y = ~(a &amp;
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

                {/* Interactive Mode Badge */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute bottom-6 right-6 bg-white text-ink-900 px-4 py-2 rounded-full text-xs font-black shadow-lg flex items-center gap-2"
                >
                  <MousePointer2 size={12} className="text-power-purple" />
                  Interactive Mode
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-5 shadow-xl border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center">
                  <Users className="text-success" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-ink-900">12,400+</p>
                  <p className="text-xs font-bold text-ink-400">Active Learners</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 bg-surface-raised border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-primary-light text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6">
              Why NOTEacher?
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-ink-900 mb-4">
              The "No-Teacher" Advantage
            </h2>
            <p className="text-ink-500 font-medium max-w-2xl mx-auto">
              Bridging the gap between TikTok (high engagement) and Textbooks
              (high depth). Learn like the top 1%.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BookOpen}
              title="Narrative Syllabus"
              desc="Follow the Arc: The Hook (Mystery), The Guide (Concept), and The Resolution (Application). No boring chapters."
              color="text-power-purple"
              bg="bg-power-purple-light"
              glowColor="hover:shadow-purple"
            />
            <FeatureCard
              icon={BrainCircuit}
              title="AI Safety Net"
              desc="Context-aware LLM support. 'Explain Like I'm 5' or 'Debug My Logic' without giving away the answer."
              color="text-power-teal"
              bg="bg-power-teal-light"
              glowColor="hover:shadow-teal"
            />
            <FeatureCard
              icon={Lock}
              title="Gamified Flow"
              desc="No passive lectures. Checkpoint Quizzes ensure you master each block before scrolling further."
              color="text-power-orange"
              bg="bg-power-orange-light"
              glowColor="hover:shadow-orange"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-ink-900 mb-6">
              Ready to learn like the{" "}
              <span className="text-gradient-primary italic">top 1%</span>?
            </h2>
            <p className="text-lg text-ink-500 mb-10 max-w-2xl mx-auto">
              Join thousands of engineers mastering hardware through interactive scrollytelling. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg border-b-4 border-primary-hover active:border-b-0 active:translate-y-1 transition-all hover:shadow-xl flex items-center justify-center gap-2" style={{ boxShadow: "var(--shadow-primary)" }}>
                  Get Started Free
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <Zap className="w-5 h-5 fill-ink-900" />
          <span className="font-black text-ink-900 italic">NOTEacher</span>
        </div>
        <p className="text-ink-400 text-sm font-medium">
          © 2026 NOTEacher Labs. Designed for the builders.
        </p>
      </footer>
    </div>
  );
}

// Reusable Feature Component
function FeatureCard({ icon: Icon, title, desc, color, bg, glowColor }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  bg: string;
  glowColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className={`bg-white p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 group ${glowColor}`}
      style={{
        ['--shadow-purple' as string]: '0 20px 60px -15px rgba(168, 85, 247, 0.25)',
        ['--shadow-teal' as string]: '0 20px 60px -15px rgba(20, 184, 166, 0.25)',
        ['--shadow-orange' as string]: '0 20px 60px -15px rgba(249, 115, 22, 0.25)',
      } as React.CSSProperties}
    >
      <div
        className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        <Icon className={`${color} w-7 h-7`} />
      </div>
      <h3 className="text-xl font-black text-ink-900 mb-3">{title}</h3>
      <p className="text-ink-500 leading-relaxed text-sm">
        {desc}
      </p>
    </motion.div>
  );
}
