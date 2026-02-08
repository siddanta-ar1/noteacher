"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Zap, BookOpen, Clock, Users, ArrowRight, Filter, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { CourseWithNodeCount } from "@/types";
import { ROUTES } from "@/config";
import { Badge, ProgressBar } from "@/components/ui";
import { CourseCard } from "@/components/CourseCard";

interface CourseLibraryClientProps {
  initialCourses: CourseWithNodeCount[];
}

export default function CourseLibraryClient({
  initialCourses,
}: CourseLibraryClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const filtered = initialCourses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    // Add filter logic when difficulty is available
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface-raised pb-20">
      {/* Header */}
      <header className="bg-primary pt-12 pb-32 px-6 rounded-b-[3rem] relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-power-teal/20 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Navigation */}
            <div className="mb-8">
              <Link
                href={ROUTES.HOME}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group font-medium text-sm"
              >
                <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <ArrowLeft size={16} />
                </div>
                Back to Dashboard
              </Link>
            </div>

            <Badge variant="teal" className="mb-6">
              <Zap size={12} className="fill-current" />
              Course Library
            </Badge>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Level Up Your <span className="text-power-teal italic">Skills</span>
            </h1>
            <p className="text-white/70 font-medium max-w-lg mb-8">
              Master complex concepts through interactive scrollytelling. Choose your next adventure.
            </p>

            {/* Search Bar */}
            <div className="bg-surface p-2 rounded-2xl shadow-xl flex items-center max-w-2xl">
              <div className="w-12 h-12 flex items-center justify-center text-ink-400">
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-ink-900 placeholder:text-ink-400 h-12"
              />
              <button className="bg-primary text-white px-6 h-12 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2">
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Course Grid */}
      <main className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        {/* Results count */}
        <div className="flex text-white items-center justify-between mb-6">
          <p className="text-white font-medium">
            Showing <strong className="text-white">{filtered.length}</strong> courses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="h-full"
              >
                <CourseCard
                  course={{
                    ...course,
                    lessonsCount: course.nodes[0]?.count || 0
                  }}
                  showProgress={false}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-surface rounded-3xl border-2 border-dashed border-border">
              <div className="w-16 h-16 bg-surface-sunken rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-ink-400" size={24} />
              </div>
              <p className="font-bold text-ink-500">
                No courses found matching "{search}"
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
