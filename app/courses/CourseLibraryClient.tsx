"use client";

import { motion } from "framer-motion";
import {
  Zap,
  BookOpen,
  Star,
  ChevronRight,
  Search,
  Filter,
  Layers,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

// Strict typing for IconMap
const IconMap: Record<string, ReactNode> = {
  Zap: <Zap size={20} />,
  BookOpen: <BookOpen size={20} />,
  Layers: <Layers size={20} />,
  Star: <Star size={20} />,
  Cpu: <Cpu size={20} />,
};

// Exporting type so it can be reused if needed
export type Course = {
  id: string;
  title: string;
  description?: string;
  xp?: number;
  difficulty?: string;
  iconName?: string;
  startNodeId?: string;
  learners?: string;
  rank?: number;
  color?: string;
  height?: string;
};

export default function CourseLibraryClient({
  courses,
}: {
  courses: Course[];
}) {
  // Logic is now safe because 'courses' comes fully hydrated from the server.

  // Reorder for visual podium (Rank 2 left, Rank 1 center, Rank 3 right)
  const podium = [
    courses.find((c) => c.rank === 2),
    courses.find((c) => c.rank === 1),
    courses.find((c) => c.rank === 3),
  ].filter((c): c is Course => !!c); // Type guard filter to remove undefined

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="py-20 px-6 text-center relative">
        <Link
          href="/home"
          className="absolute top-6 left-6 text-slate-400 hover:text-navy transition-colors flex items-center gap-2 group"
        >
          <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
            <ChevronRight className="rotate-180" size={20} />
          </div>
          <span className="font-bold text-sm">Dashboard</span>
        </Link>
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
          {/* LEFT: Featured Podium */}
          <div className="lg:col-span-8 space-y-24">
            <section>
              <div className="flex justify-between items-end mb-12">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Featured Paths
                </h3>
                <button className="flex items-center gap-2 text-navy font-bold text-sm hover:underline">
                  <Search size={16} /> Search all
                </button>
              </div>

              {/* Podium View */}
              {podium.length > 0 ? (
                <div className="flex items-end justify-center gap-6 md:gap-12 pb-12 border-b-2 border-slate-50 min-h-[300px]">
                  {podium.map((path) => (
                    <Link
                      key={path.id}
                      href={
                        path.startNodeId ? `/lesson/${path.startNodeId}` : "#"
                      }
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
                          <p className="text-white font-black text-lg leading-tight mb-2 line-clamp-2">
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
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 italic">
                  More courses coming soon...
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: List */}
          <div className="lg:col-span-4 space-y-16">
            <section className="bg-slate-50/50 rounded-[3.5rem] p-12 border-2 border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-slate-900">Explore</h3>
                <Filter className="text-power-teal" size={24} />
              </div>
              <div className="space-y-6">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={
                      course.startNodeId ? `/lesson/${course.startNodeId}` : "#"
                    }
                    className="block"
                  >
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="p-6 bg-white border-2 border-slate-100 rounded-3xl cursor-pointer hover:border-navy transition-all flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-navy group-hover:text-white transition-all">
                        {IconMap[course.iconName || "BookOpen"] || (
                          <BookOpen size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-slate-900 text-sm line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {course.difficulty || "Intermediate"} •{" "}
                          {course.xp || 1500} XP
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
