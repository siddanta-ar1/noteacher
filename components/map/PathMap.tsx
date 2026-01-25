// components/map/PathMap.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { Flag, Trophy } from "lucide-react";
import PathNode from "@/components/PathNode";

// --- Types ---
export type MapNode = {
  id: string;
  title: string;
  status: "locked" | "current" | "completed";
};

type PathMapProps = {
  nodes: MapNode[];
};

// --- Animations ---
const revealVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98], // smooth spring-like ease
    },
  }),
};

const markerVariant: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "backOut" },
  },
};

// --- Sub-components ---

function PathLine() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 flex justify-center"
      aria-hidden="true"
    >
      <svg className="h-full w-6 overflow-visible">
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          className="text-slate-200 stroke-current"
          strokeWidth="4"
          strokeDasharray="12 12"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function StartMarker() {
  return (
    <motion.div
      variants={markerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex justify-center relative z-10"
    >
      <div className="bg-slate-100 p-4 rounded-full text-slate-400 shadow-sm border border-slate-200/50">
        <Flag size={24} strokeWidth={2.5} />
      </div>
    </motion.div>
  );
}

function FinishMarker() {
  return (
    <motion.div
      variants={markerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex justify-center pb-20 relative z-10"
    >
      <div className="relative group">
        {/* Subtle glow effect behind trophy */}
        <div className="absolute inset-0 bg-power-teal/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-power-teal/10 p-6 rounded-full text-power-teal ring-8 ring-power-teal/5 transition-transform duration-300 group-hover:scale-105">
          <Trophy size={48} strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Component ---

export default function PathMap({ nodes }: PathMapProps) {
  return (
    <section
      className="max-w-xl mx-auto py-24 relative min-h-screen"
      role="region"
      aria-label="Course Roadmap"
    >
      {/* Background Line */}
      <PathLine />

      <div className="relative z-10 space-y-20">
        <StartMarker />

        {/* Node List */}
        <ol className="list-none space-y-24 p-0 m-0">
          {nodes.map((node, i) => (
            <motion.li
              key={node.id}
              custom={0} // Index 0 for individual triggers, or 'i' if staggering parent
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              variants={revealVariant}
              className="flex justify-center" // Centers the PathNode wrapper logic
            >
              {/* Note: PathNode likely handles its own 'left/right' alignment styles internally based on props */}
              <PathNode
                id={node.id}
                title={node.title}
                status={node.status}
                index={i + 1}
                position={i % 2 === 0 ? "left" : "right"}
              />
            </motion.li>
          ))}
        </ol>

        <FinishMarker />
      </div>
    </section>
  );
}
