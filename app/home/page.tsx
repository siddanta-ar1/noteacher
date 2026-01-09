"use client";
import { motion } from "framer-motion";
import { Play, BookOpen, Trophy, Star, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

const COURSES = [
  {
    id: "arch-101",
    title: "Architecture Foundation",
    progress: 65,
    color: "bg-power-teal",
    icon: <Zap className="w-5 h-5 text-white" />,
  },
  {
    id: "digital",
    title: "Digital Logic Design",
    progress: 12,
    color: "bg-power-purple",
    icon: <BookOpen className="w-5 h-5 text-white" />,
  },
  {
    id: "riscv",
    title: "RISC-V Mastery",
    progress: 0,
    color: "bg-power-orange",
    icon: <Trophy className="w-5 h-5 text-white" />,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy p-6 pb-20 rounded-b-[3rem] shadow-2xl shadow-navy/20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-black italic">Dashboard</h1>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/20">
            <Star className="w-4 h-4 text-power-orange fill-power-orange" />
            <span className="text-white font-bold text-sm">1,240 XP</span>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-5xl mx-auto mt-10"
        >
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="w-24 h-24 bg-power-teal rounded-[2rem] flex items-center justify-center shadow-lg shadow-power-teal/30 shrink-0">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-power-teal font-black text-xs uppercase tracking-widest">
                Active Mission
              </p>
              <h2 className="text-2xl font-black text-slate-900">
                NAND Gate Challenges
              </h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-power-teal w-[65%]" />
                </div>
                <span className="text-sm font-black text-slate-900">65%</span>
              </div>
            </div>
            <Link href="/">
              <button className="px-10 py-4 bg-navy text-white rounded-2xl font-black border-b-4 border-navy-dark active:translate-y-1 active:border-b-0 transition-all">
                Resume Path <Play className="inline ml-2 w-5 h-5 fill-white" />
              </button>
            </Link>
          </div>
        </motion.div>
      </header>

      <main className="max-w-5xl mx-auto px-6 -mt-10 pb-20">
        <h3 className="text-2xl font-black text-slate-900 mb-8">
          Continue Learning
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] hover:shadow-xl transition-all cursor-pointer group"
            >
              <div
                className={`w-12 h-12 ${course.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-inherit`}
              >
                {course.icon}
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-navy">
                {course.title}
              </h4>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-bold text-slate-400">
                  {course.progress}% Completed
                </span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-navy group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
