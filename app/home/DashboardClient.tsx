"use client";

import { motion } from "framer-motion";
import {
  Play,
  BookOpen,
  Trophy,
  Star,
  ChevronRight,
  Zap,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

type DashboardProps = {
  profile: { xp: number; name: string; streak: number };
  activeMission: {
    title: string;
    chapter: string;
    progress: number;
    id: string;
  } | null;
  courses: Array<{
    id: string;
    title: string;
    progress: number;
    color: string;
    iconName: string;
    startNodeId?: string; // New Prop
  }>;
};

const IconMap: any = { Zap, BookOpen, Trophy, Star };

export default function DashboardClient({
  profile,
  activeMission,
  courses,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER (Kept same as before, focusing on the fix) */}
      <header className="bg-navy p-6 pb-24 rounded-b-[3rem] shadow-2xl shadow-navy/20 relative z-0">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-black italic">Dashboard</h1>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">
              Welcome back, {profile.name.split(" ")[0]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/20">
              <Zap className="w-4 h-4 text-power-orange fill-power-orange" />
              <span className="text-white font-bold text-sm">
                {profile.streak}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/20">
              <Star className="w-4 h-4 text-power-teal fill-power-teal" />
              <span className="text-white font-bold text-sm">
                {profile.xp} XP
              </span>
            </div>
          </div>
        </div>

        {/* ACTIVE MISSION CARD */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-5xl mx-auto mt-10"
        >
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            {activeMission ? (
              <>
                <div className="w-24 h-24 bg-power-teal rounded-[2rem] flex items-center justify-center shadow-lg shadow-power-teal/30 shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <Zap className="w-12 h-12 text-white fill-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-power-teal font-black text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-power-teal animate-pulse" />
                    Current Objective: {activeMission.chapter}
                  </p>
                  <h2 className="text-2xl font-black text-slate-900 mt-2 leading-tight">
                    {activeMission.title}
                  </h2>
                  <div className="mt-4 flex items-center gap-4 justify-center md:justify-start">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden max-w-[200px]">
                      <div
                        className="h-full bg-power-teal transition-all duration-1000 ease-out"
                        style={{ width: `${activeMission.progress || 5}%` }}
                      />
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {activeMission.progress}%
                    </span>
                  </div>
                </div>
                <Link href={`/lesson/${activeMission.id}`}>
                  <button className="px-10 py-4 bg-navy text-white rounded-2xl font-black border-b-4 border-navy-dark active:translate-y-1 active:border-b-0 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group/btn">
                    Resume{" "}
                    <Play className="w-5 h-5 fill-white group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="text-power-orange w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  All Systems Go!
                </h2>
                <p className="text-slate-400 font-medium">
                  Select a new course below to start.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </header>

      {/* COURSE GRID */}
      <main className="max-w-5xl mx-auto px-6 -mt-12 pb-20 relative z-10">
        <h3 className="text-2xl font-black text-slate-900 mb-8 pl-2">
          Your Neural Paths
        </h3>
        {courses.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => {
              const Icon = IconMap[course.iconName] || BookOpen;
              return (
                // THE FIX: Link to /lesson/[id] instead of /courses
                <Link
                  href={
                    course.startNodeId
                      ? `/lesson/${course.startNodeId}`
                      : "/courses"
                  }
                  key={course.id}
                >
                  <div className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] hover:shadow-xl transition-all cursor-pointer group h-full flex flex-col hover:border-navy">
                    <div
                      className={`w-12 h-12 ${course.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-inherit text-white`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-navy line-clamp-1">
                      {course.title}
                    </h4>
                    <div className="flex-1" />
                    <div className="flex items-center justify-between mt-4">
                      {course.progress >= 100 ? (
                        <span className="text-xs font-bold text-power-teal flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          {course.progress}% Completed
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-navy group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
            <p>No courses found. Run the seed script!</p>
          </div>
        )}
      </main>
    </div>
  );
}
