// components/map/PathMap.tsx
"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

// --- Types ---
export type MapNode = {
  id: string;
  title: string;
  status: "locked" | "current" | "completed";
};

export type LevelGroup = {
  level: number;
  title: string;
  nodes: MapNode[];
};

type PathMapProps = {
  nodes: MapNode[];
};

// --- Animations ---
const nodeVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "backOut",
    },
  }),
};

// --- Premium 3D Node Component ---
function PremiumNode({
  node,
  index
}: {
  node: MapNode;
  index: number;
}) {
  const isCompleted = node.status === "completed";
  const isCurrent = node.status === "current";
  const isLocked = node.status === "locked";

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={nodeVariant}
      className="flex items-center gap-5"
    >
      {/* 3D Glossy Node Button */}
      <Link
        href={isLocked ? "#" : `/lesson/${node.id}`}
        className={`relative group ${isLocked ? "cursor-not-allowed" : ""}`}
        onClick={isLocked ? (e) => e.preventDefault() : undefined}
      >
        {/* Outer glow for current */}
        {isCurrent && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full bg-power-purple/30 blur-md"
          />
        )}

        {/* Main 3D button */}
        <div
          className={`
                        relative w-16 h-16 rounded-full
                        transition-all duration-300
                        ${isCompleted
              ? "bg-gradient-to-b from-power-teal via-power-teal to-teal-600 shadow-lg shadow-power-teal/30"
              : isCurrent
                ? "bg-gradient-to-b from-power-purple via-power-purple to-indigo-600 shadow-lg shadow-power-purple/30 group-hover:scale-110"
                : "bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 shadow-inner"
            }
                    `}
        >
          {/* Top highlight (3D effect) */}
          <div
            className={`
                            absolute top-1 left-1 right-1 h-8 
                            rounded-full 
                            ${isCompleted || isCurrent
                ? "bg-gradient-to-b from-white/40 to-transparent"
                : "bg-gradient-to-b from-white/80 to-transparent"
              }
                        `}
          />

          {/* Inner circle for depth */}
          <div
            className={`
                            absolute inset-3 rounded-full
                            ${isCompleted || isCurrent
                ? "bg-gradient-to-b from-transparent to-black/20"
                : "bg-gradient-to-b from-transparent to-slate-400/30 shadow-inner"
              }
                        `}
          />

          {/* Center icon/number */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isCompleted ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : isCurrent ? (
              <motion.div
                animate={{ scale: [1, 0.9, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-4 h-4 bg-white rounded-full shadow-lg"
              />
            ) : (
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
        </div>
      </Link>

      {/* Node title */}
      <div className="flex-1">
        <p
          className={`
                        font-bold text-base leading-tight transition-colors
                        ${isCompleted
              ? "text-ink-900"
              : isCurrent
                ? "text-ink-900"
                : "text-ink-400"
            }
                    `}
        >
          {node.title}
        </p>
        {isCurrent && (
          <span className="text-xs font-bold text-power-purple">Continue →</span>
        )}
      </div>
    </motion.div>
  );
}

// --- Connecting Line ---
function ConnectingLine({ completed = false }: { completed?: boolean }) {
  return (
    <div className="w-16 flex justify-center py-2">
      <div
        className={`
                    w-0.5 h-8 rounded-full
                    ${completed
            ? "bg-gradient-to-b from-power-teal to-power-teal/50"
            : "bg-gradient-to-b from-slate-200 to-slate-100"
          }
                `}
      />
    </div>
  );
}

// --- Main Component ---
export default function PathMap({ nodes }: PathMapProps) {
  // Group nodes into levels (every 3-4 nodes = 1 level for visual grouping)
  const nodesPerLevel = 4;
  const levels: LevelGroup[] = [];

  for (let i = 0; i < nodes.length; i += nodesPerLevel) {
    levels.push({
      level: Math.floor(i / nodesPerLevel) + 1,
      title: `Level ${Math.floor(i / nodesPerLevel) + 1}`,
      nodes: nodes.slice(i, i + nodesPerLevel),
    });
  }

  return (
    <section className="py-8">
      {levels.map((level, levelIndex) => (
        <div key={level.level} className="mb-12">
          {/* Level Header Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <div className="bg-power-purple text-white px-6 py-2.5 rounded-full shadow-lg border-2 border-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-0.5">
                Level {level.level}
              </p>
              <p className="font-bold text-sm text-center">
                {levelIndex === 0 ? "Taking the First Steps" :
                  levelIndex === 1 ? "Building Foundations" :
                    levelIndex === 2 ? "Advanced Concepts" : "Mastery"}
              </p>
            </div>
          </motion.div>

          {/* Nodes in this level */}
          <div className="space-y-2 max-w-sm mx-auto">
            {level.nodes.map((node, nodeIndex) => {
              const globalIndex = levelIndex * nodesPerLevel + nodeIndex;
              const prevNode = globalIndex > 0 ? nodes[globalIndex - 1] : null;
              const prevCompleted = prevNode?.status === "completed";

              return (
                <div key={node.id}>
                  {nodeIndex > 0 && (
                    <ConnectingLine completed={prevCompleted} />
                  )}
                  <PremiumNode node={node} index={globalIndex} />
                </div>
              );
            })}
          </div>

          {/* Level connector line */}
          {levelIndex < levels.length - 1 && (
            <div className="flex justify-center py-6">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                className="w-0.5 h-16 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 rounded-full origin-top"
              />
            </div>
          )}
        </div>
      ))}

      {/* Completion Trophy */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        className="flex justify-center pt-8"
      >
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 bg-power-orange/20 blur-2xl rounded-full scale-150" />

          {/* Trophy */}
          <div className="relative w-20 h-20 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 rotate-3 hover:rotate-0 transition-transform">
            {/* Highlight */}
            <div className="absolute top-1 left-1 right-1 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-xl" />
            <span className="text-3xl">🏆</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
