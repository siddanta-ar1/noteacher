"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Zap, BookOpen, Filter } from "lucide-react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description: string | null;
  nodes: { count: number }[];
};

export default function CourseLibraryClient({
  initialCourses,
}: {
  initialCourses: any[];
}) {
  const [search, setSearch] = useState("");

  const filtered = initialCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-navy pt-20 pb-32 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="bg-power-teal/20 text-power-teal px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-power-teal/20">
              Library v1.0
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-6 mb-8 tracking-tight">
              Neural <span className="text-power-teal italic">Upgrades</span>
            </h1>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-xl flex items-center max-w-xl">
              <div className="w-12 h-12 flex items-center justify-center text-slate-400">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder="Search for a skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-navy placeholder:text-slate-300 h-12"
              />
              <button className="bg-navy text-white px-6 h-12 rounded-xl font-bold hover:bg-navy-dark transition-colors">
                Find
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/home`} className="block group h-full">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-slate-100 hover:border-navy hover:shadow-2xl transition-all h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="text-navy w-8 h-8" />
                      </div>
                      <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
                        {course.nodes[0]?.count || 0} Modules
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-navy transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                      {course.description || "No description provided."}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center text-power-teal font-black text-sm uppercase tracking-wide gap-2">
                      <Zap size={16} className="fill-current" />
                      Start Course
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold">
              No courses found matching "{search}"
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
