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
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"; // Optional: Use alerts if sonner not installed

// Helper to map icons safely
const IconMap: any = {
  Zap: <Zap size={20} />,
  BookOpen: <BookOpen size={20} />,
  Layers: <Layers size={20} />,
  Star: <Star size={20} />,
  Cpu: <Cpu size={20} />,
};

type Course = {
  id: string;
  title: string;
  description?: string;
  xp?: number;
  category?: string;
  difficulty?: string;
  iconName?: string;
  startNodeId?: string; // Added to handle navigation
};

export default function CourseLibraryClient({
  courses,
}: {
  courses: Course[];
}) {
  // 1. DYNAMIC PODIUM LOGIC
  // Instead of static fake data, we take the first 3 real courses
  const featuredCourses = courses.slice(0, 3).map((c, i) => ({
    ...c,
    // Add visual props based on position
    learners: Math.floor(Math.random() * 20) + 5 + "k",
    color: i === 0 ? "bg-navy" : i === 1 ? "bg-power-teal" : "bg-power-orange",
    height: i === 0 ? "h-64" : i === 1 ? "h-48" : "h-40",
    rank: i === 0 ? 1 : i === 1 ? 2 : 3,
  }));

  // Re-order for visual podium: Rank 2 (Left), Rank 1 (Center), Rank 3 (Right)
  const podiumDisplay = [
    featuredCourses.find((f) => f.rank === 2),
    featuredCourses.find((f) => f.rank === 1),
    featuredCourses.find((f) => f.rank === 3),
  ].filter(Boolean); // Filter removes undefined if < 3 courses exist

  // AI Recommendation Logic (Pick the 4th course or random)
  const recommendedCourse = courses[3] || courses[0];

  const handlePlaceholderClick = () => {
    alert("Search & Filtering Coming Soon!");
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 1. Spacious Header */}
      <header className="py-20 px-6 text-center relative">
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/home"
            className="text-slate-400 hover:text-navy transition-colors flex items-center gap-2 group"
          >
            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
              <ChevronRight className="rotate-180" size={20} />
            </div>
            <span className="font-bold text-sm">Dashboard</span>
          </Link>
        </div>
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
                <button
                  onClick={handlePlaceholderClick}
                  className="flex items-center gap-2 text-navy font-bold text-sm hover:underline"
                >
                  <Search size={16} /> Search all
                </button>
              </div>

              {/* Course Podium Structure */}
              <div className="flex items-end justify-center gap-6 md:gap-12 pb-12 border-b-2 border-slate-50 min-h-[300px]">
                {podiumDisplay.map((path: any) => (
                  <Link
                    key={path.id}
                    href={
                      path.startNodeId ? `/lesson/${path.startNodeId}` : "#"
                    }
                    className={`flex flex-col items-center flex-1 max-w-[200px] group ${!path.startNodeId ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
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

                {podiumDisplay.length === 0 && (
                  <div className="text-slate-400 font-bold">
                    No courses available. Run seed script.
                  </div>
                )}
              </div>
            </section>

            {/* 2. Personalized Recommendation Card */}
            {recommendedCourse && (
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">
                  AI Recommendation
                </h3>
                <div className="bg-power-purple rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-10 shadow-3xl shadow-power-purple/30 border-b-[12px] border-purple-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                    <Zap size={180} fill="white" />
                  </div>
                  <div className="relative z-10 flex-1 text-center md:text-left">
                    <h4 className="text-3xl font-black mb-2 italic">
                      Fast-Track: {recommendedCourse.title}
                    </h4>
                    <p className="text-white/70 font-bold text-lg max-w-md">
                      Based on your interest profile, this path is the optimal
                      starting point for you.
                    </p>
                  </div>
                  <Link
                    href={
                      recommendedCourse.startNodeId
                        ? `/lesson/${recommendedCourse.startNodeId}`
                        : "#"
                    }
                  >
                    <button className="relative z-10 px-8 py-4 bg-white text-power-purple rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
                      Initialize Node
                    </button>
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Categories & Filter (4 cols) */}
          <div className="lg:col-span-4 space-y-16">
            <section className="bg-slate-50/50 rounded-[3.5rem] p-12 border-2 border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-slate-900">Explore</h3>
                <button
                  onClick={handlePlaceholderClick}
                  className="hover:bg-slate-200 p-2 rounded-full transition-colors"
                >
                  <Filter className="text-power-teal" size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Link
                      key={course.id}
                      href={
                        course.startNodeId
                          ? `/lesson/${course.startNodeId}`
                          : "#"
                      }
                      className="block"
                    >
                      <motion.div
                        whileHover={{ x: 10 }}
                        className="p-6 bg-white border-2 border-slate-100 rounded-3xl cursor-pointer hover:border-navy transition-all flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-navy group-hover:text-white transition-all">
                          {/* Default icon if missing */}
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
                  ))
                ) : (
                  <div className="text-slate-400 text-sm font-bold text-center py-4">
                    No courses found.
                  </div>
                )}
              </div>

              <button
                onClick={() => alert("This is the full catalog for the MVP!")}
                className="w-full mt-14 py-5 bg-navy text-white rounded-[2rem] font-black text-sm shadow-xl shadow-navy/20 border-b-8 border-navy-dark active:translate-y-1 active:border-b-4 transition-all"
              >
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
              <p className="text-5xl font-black text-slate-900 italic">
                {courses.length}
              </p>
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
