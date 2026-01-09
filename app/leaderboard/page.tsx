"use client";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Star,
  Target,
  Zap,
  Crown,
  ArrowUp,
  ChevronRight,
} from "lucide-react";

// --- Data Definitions ---
const TOP_THREE = [
  {
    id: 2,
    name: "LogicWizard",
    xp: 11200,
    level: 38,
    avatar: "bg-power-teal",
    rank: 2,
    height: "h-40",
  },
  {
    id: 1,
    name: "Alex_Arch",
    xp: 12450,
    level: 42,
    avatar: "bg-power-purple",
    rank: 1,
    height: "h-56",
  },
  {
    id: 3,
    name: "ByteMaster",
    xp: 10850,
    level: 35,
    avatar: "bg-power-orange",
    rank: 3,
    height: "h-32",
  },
];

const QUESTS = [
  {
    id: 1,
    title: "NAND Master",
    task: "Complete 5 NAND challenges",
    progress: 80,
    reward: "500 XP",
  },
  {
    id: 2,
    title: "Speed Reader",
    task: "Read 3 lessons with Auto-Scroll",
    progress: 33,
    reward: "200 XP",
  },
  {
    id: 3,
    title: "AI Scholar",
    task: "Ask AI Teacher 10 questions",
    progress: 10,
    reward: "150 XP",
  },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header Section */}
      <header className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="bg-power-purple/10 text-power-purple px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em]">
            Global Rankings
          </span>
          <h1 className="text-6xl font-black text-slate-900 mt-6 tracking-tighter">
            Hall of <span className="text-navy italic">Masters</span>
          </h1>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-12 gap-24 items-start">
          {/* Left Column: Podium & Stats */}
          <div className="lg:col-span-8 space-y-24">
            {/* 1. The Podium Section */}
            <section className="flex items-end justify-center gap-4 md:gap-12 pb-12 border-b-2 border-slate-50">
              {TOP_THREE.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col items-center flex-1 max-w-[180px]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: user.rank * 0.1 }}
                    className={`w-24 h-24 rounded-[2.5rem] ${user.avatar} mb-6 border-4 border-white shadow-2xl flex items-center justify-center relative`}
                  >
                    {user.rank === 1 && (
                      <Crown className="absolute -top-10 text-power-orange w-12 h-12 drop-shadow-lg" />
                    )}
                    <span className="text-white font-black text-3xl">
                      {user.name[0]}
                    </span>
                  </motion.div>

                  <div
                    className={`w-full ${user.height} ${user.rank === 1 ? "bg-navy" : "bg-slate-100/80"} rounded-t-[2.5rem] flex flex-col items-center justify-center p-6 shadow-xl border-b-[10px] border-black/10`}
                  >
                    <span
                      className={`text-4xl font-black ${user.rank === 1 ? "text-white" : "text-slate-400"}`}
                    >
                      #{user.rank}
                    </span>
                    <p
                      className={`text-xs font-bold uppercase mt-2 tracking-widest ${user.rank === 1 ? "text-white/60" : "text-slate-400"}`}
                    >
                      {user.xp} XP
                    </p>
                  </div>
                  <p className="mt-6 font-black text-slate-900 text-base truncate w-full text-center">
                    {user.name}
                  </p>
                </div>
              ))}
            </section>

            {/* 2. Refined Performance Lab (User Stats) */}
            <section className="space-y-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                Your Performance Lab
              </h3>
              <div className="bg-navy rounded-[3rem] p-12 text-white shadow-3xl shadow-navy/40 border-b-[12px] border-navy-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-power-purple/10 rounded-full -mr-20 -mt-20 blur-3xl" />

                <div className="relative z-10 grid md:grid-cols-3 gap-12 items-center">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
                      Global Rank
                    </p>
                    <p className="text-6xl font-black italic tracking-tighter">
                      #142
                    </p>
                    <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-power-teal/20 text-power-teal rounded-full text-[10px] font-black">
                      <ArrowUp size={12} strokeWidth={3} /> TOP 15%
                    </div>
                  </div>

                  <div className="space-y-6 border-x border-white/10 px-8">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase text-white/50">
                        Nodes Mastered
                      </p>
                      <p className="text-2xl font-black text-power-teal">
                        12/40
                      </p>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "30%" }}
                        className="h-full bg-power-teal"
                      />
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase text-white/50">
                        Avg. Accuracy
                      </p>
                      <p className="text-2xl font-black text-power-purple">
                        88%
                      </p>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "88%" }}
                        className="h-full bg-power-purple"
                      />
                    </div>
                  </div>

                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
                      Time in Lab
                    </p>
                    <p className="text-5xl font-black italic tracking-tighter text-power-orange">
                      24.5h
                    </p>
                    <p className="text-[10px] font-bold text-white/40 mt-2 uppercase tracking-widest">
                      Mastery Level
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Quests & Streaks */}
          <div className="lg:col-span-4 space-y-16">
            <section className="bg-slate-50/50 rounded-[3.5rem] p-12 border-2 border-slate-100 shadow-sm relative">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-slate-900">
                  Daily Quests
                </h3>
                <Target className="text-power-orange w-8 h-8" />
              </div>

              <div className="space-y-12">
                {QUESTS.map((quest) => (
                  <div key={quest.id} className="group cursor-pointer">
                    <div className="flex justify-between mb-4">
                      <span className="font-black text-slate-900 text-lg group-hover:text-navy transition-colors">
                        {quest.title}
                      </span>
                      <span className="text-sm font-black text-power-teal">
                        +{quest.reward}
                      </span>
                    </div>
                    <div className="h-5 w-full bg-slate-200 rounded-full overflow-hidden border-[3px] border-white shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${quest.progress}%` }}
                        className="h-full bg-power-teal rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-14 py-5 bg-white border-2 border-b-8 border-slate-200 rounded-[2rem] font-black text-navy hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                View Full Library <ChevronRight size={20} />
              </button>
            </section>

            <section className="bg-power-orange rounded-[3.5rem] p-12 text-white shadow-2xl shadow-power-orange/30 relative overflow-hidden group">
              <Star
                className="absolute -top-12 -right-12 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-45 transition-all duration-1000"
                fill="white"
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Zap className="fill-white" />
                  <span className="font-black uppercase tracking-[0.2em] text-[10px] opacity-80">
                    Current Streak
                  </span>
                </div>
                <p className="text-8xl font-black italic tracking-tighter">
                  12
                </p>
                <p className="text-2xl font-bold mt-2">Days Burning</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
