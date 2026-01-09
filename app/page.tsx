// - Complete overhaul for new Vision/Mission
"use client";
import { motion } from "framer-motion";
import {
  Zap,
  Sparkles,
  ArrowRight,
  BookOpen,
  MousePointer2,
  Lock,
  Star,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* 1. Navigation */}
      <nav className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-navy p-2 rounded-xl shadow-lg">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <span className="text-2xl font-black text-navy italic tracking-tighter">
            NOT<span className="text-power-purple">Eacher</span>
          </span>
        </div>
        <div className="flex items-center gap-8">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-500 hover:text-navy transition-colors uppercase tracking-widest"
          >
            Login
          </Link>
          <Link href="/login">
            <button className="px-8 py-3 bg-navy text-white rounded-2xl font-black text-sm border-b-4 border-navy-dark active:translate-y-1 active:border-b-0 transition-all shadow-xl shadow-navy/20">
              Start Learning
            </button>
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section: The Scrollytelling Pitch */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full mb-8">
              <Star className="w-4 h-4 text-power-orange fill-power-orange" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                Democratizing Elite Pedagogy
              </span>
            </div>
            <h1 className="text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 italic">
              Elite Teaching, <br />
              <span className="text-navy">Automated.</span>
            </h1>
            <p className="text-xl text-slate-500 font-bold leading-relaxed mb-10 max-w-lg">
              We turn static syllabuses into mystery-driven scrollytelling
              narratives. Master complex engineering and science concepts
              through the eyes of a world-class mentor.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <Link href="/interest">
                <button className="w-full sm:w-auto px-10 py-6 bg-navy text-white rounded-[2rem] font-black text-xl border-b-8 border-navy-dark hover:scale-105 active:translate-y-2 active:border-b-0 transition-all shadow-2xl shadow-navy/30 flex items-center justify-center gap-3 group">
                  Begin Your Arc{" "}
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <div className="text-center sm:text-left">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Join the 1%
                </p>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 shadow-sm"
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-navy flex items-center justify-center text-[10px] text-white font-bold">
                    +12k
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium Visual Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-100 to-white rounded-[4rem] p-8 shadow-2xl border border-slate-100">
              <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-200 aspect-[4/5] relative">
                {/* Simulated Scrollytelling UI */}
                <div className="p-8 space-y-8">
                  <div className="h-2 w-20 bg-power-teal/20 rounded-full" />
                  <h3 className="text-3xl font-black italic text-navy leading-tight">
                    The Quantum Paradox
                  </h3>
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-slate-50 rounded-full" />
                    <div className="h-4 w-5/6 bg-slate-50 rounded-full" />
                    <div className="h-4 w-4/6 bg-slate-50 rounded-full" />
                  </div>
                  <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group">
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <MousePointer2 className="text-power-teal w-10 h-10" />
                    </motion.div>
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Scroll to Reveal Theory
                    </span>
                  </div>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />
              </div>
            </div>

            {/* Floating Achievement Badge */}
            <motion.div
              animate={{ x: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="absolute -top-6 -right-6 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 flex items-center gap-4"
            >
              <div className="bg-power-orange/10 p-3 rounded-xl">
                <BookOpen className="text-power-orange" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  New Narrative
                </p>
                <p className="text-sm font-black text-navy italic">
                  The Silicon Mystery
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* 3. The 3-Pillar Solution */}
      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-navy mb-6 italic tracking-tighter">
              The "No-Teacher" Advantage
            </h2>
            <p className="text-slate-500 font-bold max-w-2xl mx-auto text-lg">
              We replace the "Bad Teacher" lottery with a system designed for
              how the brain actually learns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PillarCard
              icon={Layers}
              title="Narrative Arcs"
              desc="Forget chapters. Follow the Hook, the Guide, and the Resolution. Every concept is a tool to solve a mystery."
              color="bg-power-teal"
            />
            <PillarCard
              icon={MousePointer2}
              title="Interactive Scrollytelling"
              desc="Textbooks that move. Animations trigger as you scroll, reducing cognitive load and maximizing depth."
              color="bg-power-purple"
            />
            <PillarCard
              icon={Lock}
              title="Elite Pedagogy"
              desc="Automated world-class teaching. High-engagement, high-depth content that was once exclusive to the top 1%."
              color="bg-power-orange"
            />
          </div>
        </div>
      </section>

      {/* 4. Vision CTA */}
      <section className="py-32 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-black text-slate-900 mb-8 italic">
          Stop reading textbooks. <br />
          <span className="text-power-purple">Start living the story.</span>
        </h2>
        <p className="text-slate-500 font-medium mb-12 text-lg">
          Whether you are a struggling student or a topper, NOTEacher ensures
          the story of science is never boring again.
        </p>
        <Link href="/interest">
          <button className="px-12 py-6 bg-navy text-white rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-transform">
            Democratize My Learning
          </button>
        </Link>
      </section>
    </div>
  );
}

function PillarCard({ icon: Icon, title, desc, color }: any) {
  return (
    <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
      <div
        className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-8 shadow-lg shadow-black/5`}
      >
        <Icon className="text-white w-7 h-7" />
      </div>
      <h3 className="text-2xl font-black text-navy mb-4 italic tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 font-bold leading-relaxed">{desc}</p>
    </div>
  );
}
