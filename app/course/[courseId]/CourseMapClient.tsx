"use client";

import { motion } from "framer-motion";
import PathMap, { MapNode } from "@/components/map/PathMap";
import { ChevronLeft, Map as MapIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  courseTitle: string;
  courseDesc: string;
  nodes: MapNode[];
};

export default function CourseMapClient({
  courseTitle,
  courseDesc,
  nodes,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Sticky Header */}
      <header className="bg-navy sticky top-0 z-50 shadow-xl shadow-navy/20">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/home"
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="text-center">
            <h1 className="text-white font-black text-lg md:text-xl tracking-tight">
              {courseTitle}
            </h1>
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">
              {nodes.length} Missions
            </p>
          </div>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* 2. Hero Section */}
      <div className="bg-navy pb-32 pt-12 px-6 rounded-b-[3rem] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full bg-white/5 blur-3xl rounded-full" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-power-teal/20 text-power-teal px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-power-teal/20 mb-6">
            <MapIcon size={14} /> Official Roadmap
          </div>
          <p className="text-slate-300 text-lg leading-relaxed font-medium">
            {courseDesc || "Navigate the path to mastery."}
          </p>
        </div>
      </div>

      {/* 3. The Map (Pulled up nicely) */}
      <div className="-mt-24 px-6 relative z-20">
        <PathMap nodes={nodes} />
      </div>
    </div>
  );
}
