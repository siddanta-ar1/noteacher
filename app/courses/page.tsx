"use client";
import { motion } from "framer-motion";
import {
  Zap,
  BookOpen,
  Trophy,
  Star,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  Layers,
} from "lucide-react";
import Link from "next/link";

const FEATURED_PATHS = [
  {
    id: "digital",
    title: "Digital Logic",
    learners: "12k",
    color: "bg-power-teal",
    height: "h-48",
    rank: 2,
  },
  {
    id: "arch",
    title: "Computer Arch",
    learners: "25k",
    color: "bg-navy",
    height: "h-64",
    rank: 1,
  },
  {
    id: "riscv",
    title: "RISC-V Mastery",
    learners: "8k",
    color: "bg-power-orange",
    height: "h-40",
    rank: 3,
  },
];

const ALL_COURSES = [
  {
    id: 1,
    title: "Binary Foundations",
    category: "Basics",
    difficulty: "Beginner",
    xp: "1,200",
    icon: <Layers size={20} />,
  },
  {
    id: 2,
    title: "CPU Pipeline Deep-Dive",
    category: "Hardware",
    difficulty: "Advanced",
    xp: "5,000",
    icon: <Zap size={20} />,
  },
  {
    id: 3,
    title: "Memory Hierarchies",
    category: "Hardware",
    difficulty: "Intermediate",
    xp: "3,200",
    icon: <Star size={20} />,
  },
  {
    id: 4,
    title: "Assembly Optimization",
    category: "Software",
    difficulty: "Intermediate",
    xp: "2,800",
    icon: <BookOpen size={20} />,
  },
];

export default function CourseLibraryPage() {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 1. Spacious Header */}
      <header className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="bg-navy/5 text-navy px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em]">
            Course Library
          </span>
          <h1 className="text-6xl font-black text-slate-900 mt-6 tracking-tighter italic">
            Choose Your <span className="text-power-purple">Mission</span>
          </h1>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-12 gap-24 items-start">
          {/* Left Column: Featured Podium (8 cols) */}
          <div className="lg:col-span-8 space-y-24">
            <section>
              <div className="flex justify-between items-end mb-12">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Featured Paths
                </h3>
                <div className="flex items-center gap-2 text-navy font-bold text-sm">
                  <Search size={16} /> Search all
                </div>
              </div>

              {/* Course Podium Structure */}
              <div className="flex items-end justify-center gap-6 md:gap-12 pb-12 border-b-2 border-slate-50">
                {FEATURED_PATHS.map((path) => (
                  <div
                    key={path.id}
                    className="flex flex-col items-center flex-1 max-w-[200px] group cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ y: -10 }}
                      className={`w-full ${path.height} ${path.color} rounded-t-[3rem] p-8 flex flex-col items-center justify-between shadow-2xl border-b-[12px] border-black/10 relative`}
                    >
                      <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                        <Star className="text-white fill-white" size={20} />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-black text-lg leading-tight mb-2">
                          {path.title}
                        </p>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                          {path.learners} Active
                        </p>
                      </div>
                    </motion.div>
                    <div className="mt-6 w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border-2 border-slate-100 group-hover:bg-navy group-hover:text-white transition-all">
                      <ChevronRight size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Personalized Recommendation Card */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">
                AI Recommendation
              </h3>
              <div className="bg-power-purple rounded-[3rem] p-12 text-white flex items-center gap-10 shadow-3xl shadow-power-purple/30 border-b-[12px] border-purple-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <Zap size={180} fill="white" />
                </div>
                <div className="relative z-10 flex-1">
                  <h4 className="text-3xl font-black mb-2 italic">
                    Fast-Track: RISC-V Fundamentals
                  </h4>
                  <p className="text-white/70 font-bold text-lg max-w-md">
                    Based on your Logic Gate mastery, this path is 40% easier
                    for you to complete.
                  </p>
                </div>
                <button className="relative z-10 px-8 py-4 bg-white text-power-purple rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
                  Initialize Node
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Categories & Filter (4 cols) */}
          <div className="lg:col-span-4 space-y-16">
            <section className="bg-slate-50/50 rounded-[3.5rem] p-12 border-2 border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-slate-900">Explore</h3>
                <Filter className="text-power-teal" size={24} />
              </div>

              <div className="space-y-6">
                {ALL_COURSES.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ x: 10 }}
                    className="p-6 bg-white border-2 border-slate-100 rounded-3xl cursor-pointer hover:border-navy transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-navy group-hover:text-white transition-all">
                      {course.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 text-sm">
                        {course.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {course.difficulty} • {course.xp} XP
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-14 py-5 bg-navy text-white rounded-[2rem] font-black text-sm shadow-xl shadow-navy/20 border-b-8 border-navy-dark active:translate-y-1 active:border-b-4 transition-all">
                Browse Global Catalog
              </button>
            </section>

            {/* Progress Snapshot Card */}
            <section className="bg-white border-2 border-slate-100 rounded-[3.5rem] p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-power-teal rounded-full animate-pulse" />
                <span className="font-black uppercase tracking-widest text-[10px] text-slate-400">
                  Library Status
                </span>
              </div>
              <p className="text-5xl font-black text-slate-900 italic">24</p>
              <p className="text-sm font-bold text-slate-500 mt-2">
                Available Learning Paths
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
