"use client";
import { motion } from "framer-motion";
import {
  Zap,
  Cpu,
  Sparkles,
  Trophy,
  ArrowRight,
  Play,
  CheckCircle2,
  Globe,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* 1. Minimalist Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-navy p-2 rounded-xl shadow-lg">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <span className="text-2xl font-black text-navy italic tracking-tighter">
            NOT<span className="text-power-purple">Eacher</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-black text-slate-400 hover:text-navy transition-colors uppercase tracking-widest"
          >
            Login
          </Link>
          <Link href="/login">
            <button className="px-6 py-3 bg-navy text-white rounded-2xl font-black text-sm border-b-4 border-navy-dark active:translate-y-1 active:border-b-0 transition-all shadow-lg shadow-navy/20">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section: The Big Pitch */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-power-teal/10 text-power-teal px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 inline-block">
            Future-Proof Your Mind
          </span>
          <h1 className="text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 italic">
            Architecture <br />
            <span className="text-navy">Isn't Boring</span> <br />
            Anymore.
          </h1>
          <p className="text-xl text-slate-500 font-bold leading-relaxed mb-10 max-w-lg">
            Master computer architecture through gamified paths, interactive
            logic simulators, and an AI teacher that actually understands you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/interest">
              <button className="w-full sm:w-auto px-10 py-5 bg-navy text-white rounded-[2rem] font-black text-xl border-b-8 border-navy-dark hover:scale-105 active:translate-y-2 active:border-b-0 transition-all shadow-2xl shadow-navy/30 flex items-center justify-center gap-3">
                Build My Path <ArrowRight />
              </button>
            </Link>
            <div className="flex items-center gap-4 px-8 py-5">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 shadow-sm"
                  />
                ))}
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Join 12k+ Architects
              </p>
            </div>
          </div>
        </motion.div>

        {/* Hero Visual: Interactive UI Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-slate-100 rounded-[4rem] p-4 shadow-inner">
            <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-b-[12px] border-slate-200">
              <div className="bg-navy p-6 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div className="h-2 w-32 bg-white/10 rounded-full" />
              </div>
              <div className="p-10 space-y-6">
                <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
                <div className="h-4 w-1/2 bg-slate-100 rounded-full" />
                <div className="aspect-video bg-slate-50 rounded-3xl border-4 border-dashed border-slate-100 flex items-center justify-center">
                  <Play size={40} className="text-power-teal fill-power-teal" />
                </div>
              </div>
            </div>
          </div>
          {/* Floating Power Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-10 -right-10 bg-power-orange p-6 rounded-[2.5rem] shadow-xl text-white font-black italic text-xl border-b-8 border-orange-700"
          >
            +500 XP
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 5, delay: 1 }}
            className="absolute -bottom-10 -left-10 bg-power-teal p-6 rounded-[2.5rem] shadow-xl text-white font-black flex items-center gap-3 border-b-8 border-teal-700"
          >
            <Sparkles /> AI Active
          </motion.div>
        </motion.div>
      </main>

      {/* 3. Feature Grid: "The Trio" */}
      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Why learn with NOTEacher?
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              Everything you need to master silicon logic
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={Cpu}
              title="Logic Lab"
              desc="Drag, drop, and wire logic gates in a full-screen interactive simulator."
              color="text-power-teal"
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Teacher"
              desc="Context-aware AI that summarizes lessons and grades your handwritten circuits."
              color="text-power-purple"
            />
            <FeatureCard
              icon={Trophy}
              title="Ranked Paths"
              desc="Compete in global leaderboards as you unlock sequential learning nodes."
              color="text-power-orange"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: any;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
      <div
        className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}
      >
        <Icon className={`${color} w-8 h-8`} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
