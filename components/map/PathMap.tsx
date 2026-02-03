// components/map/PathMap.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Lock, Play, Zap } from "lucide-react";
import type { ProgressStatus } from "@/types/database";

// --- Types ---
export type MapNode = {
  id: string;
  title: string;
  status: ProgressStatus;
};

export type MapLevel = {
  level: number;
  title: string;
  nodes: MapNode[];
};

type PathMapProps = {
  levels: MapLevel[];
  onNodeClick?: (node: MapNode) => void;
};

// --- Config ---
const NODE_SIZE = 80; // Size of the node circle
const Y_GAP = 140; // Vertical distance between nodes (Increased for 3D feel)
const LEVEL_HEADER_HEIGHT = 120; // Height of level header space
const X_AMPLITUDE = 120; // Horizontal sway magnitude
const CONTAINER_WIDTH = 400; // Map container width

/**
 * PathMap - 3D World Style
 */
export default function PathMap({ levels, onNodeClick }: PathMapProps) {
  // Flatten nodes for global index calculation
  const allNodesFlat = levels.flatMap(l => l.nodes);

  // Helper to calculate Y Start position for a given Level
  const getLevelStartY = (levelIndex: number) => {
    let y = 0;
    for (let i = 0; i < levelIndex; i++) {
      y += (levels[i].nodes.length * Y_GAP) + LEVEL_HEADER_HEIGHT;
    }
    return y;
  };

  // Calculate container height
  const lastLevelIndex = levels.length - 1;
  let containerHeight = 0;
  if (lastLevelIndex >= 0) {
    const lastLevelStartY = getLevelStartY(lastLevelIndex);
    const lastLevelHeight = (levels[lastLevelIndex].nodes.length * Y_GAP) + LEVEL_HEADER_HEIGHT;
    containerHeight = lastLevelStartY + lastLevelHeight + (Y_GAP / 2);
  }

  // Calculate global Y for a node
  const getNodeGlobalPosition = (levelIndex: number, nodeIndexInLevel: number) => {
    const levelStartY = getLevelStartY(levelIndex) + LEVEL_HEADER_HEIGHT;
    const yInLevel = nodeIndexInLevel * Y_GAP + Y_GAP / 2;

    // Continuous X pattern
    let globalNodeIndex = 0;
    for (let i = 0; i < levelIndex; i++) globalNodeIndex += levels[i].nodes.length;
    globalNodeIndex += nodeIndexInLevel;

    const cycle = globalNodeIndex * (Math.PI / 2);
    const xOffset = Math.sin(cycle) * X_AMPLITUDE;

    return { x: xOffset, y: levelStartY + yInLevel };
  };

  // Find Owl Position
  let owlPos = { x: 0, y: 0 };
  let owlMessage = "Start Here!";
  let activeFound = false;

  for (let l = 0; l < levels.length; l++) {
    for (let n = 0; n < levels[l].nodes.length; n++) {
      const node = levels[l].nodes[n];
      if (node.status === 'current' || node.status === 'unlocked') {
        owlPos = getNodeGlobalPosition(l, n);
        activeFound = true;
        break;
      }
    }
    if (activeFound) break;
  }

  if (!activeFound && allNodesFlat.length > 0) {
    const allComplete = allNodesFlat.every(n => n.status === 'completed');
    if (allComplete) {
      owlMessage = "All Complete! 🎉";
      const lastL = levels.length - 1;
      const lastN = levels[lastL].nodes.length - 1;
      owlPos = getNodeGlobalPosition(lastL, lastN);
    } else {
      owlPos = getNodeGlobalPosition(0, 0);
    }
  }

  return (
    <div className="relative w-full max-w-[500px] mx-auto perspective-[1000px]" style={{ height: containerHeight }}>

      {/* 0. Background Layers (The "World") */}
      {levels.map((level, lIndex) => {
        const startY = getLevelStartY(lIndex);
        const height = (level.nodes.length * Y_GAP) + LEVEL_HEADER_HEIGHT;

        // Dynamic Environment based on Level
        const isAdvanced = level.level > 0;

        return (
          <div
            key={`bg-${lIndex}`}
            className={`absolute inset-x-[-50vw] -z-20 border-b border-border/50 ${isAdvanced ? 'bg-slate-900' : 'bg-surface'}`}
            style={{ top: startY, height: height, paddingTop: LEVEL_HEADER_HEIGHT }}
          >
            {/* Environment Decorations */}
            {isAdvanced ? (
              <div className="absolute inset-0 overflow-hidden opacity-20">
                {/* Floating Math Symbols for Advanced Levels */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-white font-serif italic text-4xl animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${10 + Math.random() * 20}s`,
                      animationDelay: `-${Math.random() * 20}s`
                    }}
                  >
                    {['∑', '∫', 'µ', 'σ', 'π', '∆'][Math.floor(Math.random() * 6)]}
                  </div>
                ))}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface/50" />
              </div>
            )}
          </div>
        )
      })}


      {/* 1. Draw SVG Paths (Electricity) */}
      <svg
        className="absolute inset-0 pointer-events-none overflow-visible z-0"
        width="100%"
        height="100%"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {levels.map((level, lIndex) => (
          level.nodes.map((_, nIndex) => {
            if (nIndex === level.nodes.length - 1) {
              if (lIndex < levels.length - 1) {
                const start = getNodeGlobalPosition(lIndex, nIndex);
                const end = getNodeGlobalPosition(lIndex + 1, 0);
                return <PathSegment key={`conn-${lIndex}`} start={start} end={end} isCompleted={levels[lIndex].nodes[nIndex].status === 'completed'} />
              }
              return null;
            }

            const start = getNodeGlobalPosition(lIndex, nIndex);
            const end = getNodeGlobalPosition(lIndex, nIndex + 1);

            return (
              <PathSegment
                key={`${lIndex}-${nIndex}`}
                start={start}
                end={end}
                isCompleted={level.nodes[nIndex].status === 'completed'}
              />
            );
          })
        ))}
      </svg>

      {/* 2. Render Levels Headers */}
      {levels.map((level, lIndex) => {
        const startY = getLevelStartY(lIndex);
        const isAdvanced = level.level > 0;

        return (
          <div key={lIndex} className="absolute w-full z-10" style={{ top: startY }}>
            {/* Level Header */}
            <div className="h-[120px] flex items-center justify-center pointer-events-none sticky top-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`
                    backdrop-blur-md px-8 py-3 rounded-2xl shadow-xl border
                    ${isAdvanced
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-surface/90 border-primary/20 text-primary'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black uppercase tracking-widest opacity-70`}>Level {level.level}</span>
                  <div className={`w-1 h-4 ${isAdvanced ? 'bg-white/30' : 'bg-primary/30'} rounded-full`} />
                  <span className="text-lg font-black tracking-tight uppercase">
                    {level.title}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}

      {/* 3. Render Nodes (3D Floating Buttons) */}
      {levels.map((level, lIndex) => (
        level.nodes.map((node, nIndex) => {
          const pos = getNodeGlobalPosition(lIndex, nIndex);
          const top = pos.y - NODE_SIZE / 2;
          return (
            <div
              key={node.id}
              className="absolute z-20"
              style={{
                top: `${top}px`,
                left: `calc(50% + ${pos.x}px - ${NODE_SIZE / 2}px)`
              }}
            >
              <SagaNode node={node} index={nIndex} onClick={onNodeClick} isAdvanced={level.level > 0} />
            </div>
          );
        })
      ))}


      {/* THE OWL AVATAR */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        initial={false}
        animate={{
          top: owlPos.y - NODE_SIZE / 2 - 60,
          left: `calc(50% + ${owlPos.x}px - 25px)`,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <OwlCharacter message={owlMessage} />
      </motion.div>
    </div>
  );
}

// --- Subcomponents ---

function PathSegment({ start, end, isCompleted }: { start: { x: number, y: number }, end: { x: number, y: number }, isCompleted: boolean }) {
  const startX = CONTAINER_WIDTH / 2 + start.x;
  const endX = CONTAINER_WIDTH / 2 + end.x;
  const startY = start.y;
  const endY = end.y;

  const midY = (startY + endY) / 2;
  const cp1 = { x: startX, y: midY };
  const cp2 = { x: endX, y: midY };

  // Path definition
  const d = `M ${startX} ${startY} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endX} ${endY}`;

  return (
    <g>
      {/* Base Path (Track) */}
      <path
        d={d}
        fill="none"
        stroke={isCompleted ? "#0f766e" : "#cbd5e1"}
        strokeWidth="16"
        strokeLinecap="round"
        className="opacity-20"
      />

      {/* Dashed Guide */}
      <path
        d={d}
        fill="none"
        stroke={isCompleted ? "#14b8a6" : "#94a3b8"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="10 20"
        className="opacity-50"
      />

      {/* Electricity Effect (When Completed) */}
      {isCompleted && (
        <motion.path
          d={d}
          fill="none"
          stroke="#5eead4" // Bright Electric Teal
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10 40"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -500 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          filter="url(#glow)"
          className="opacity-80"
        />
      )}
    </g>
  );
}

function OwlCharacter({ message }: { message: string }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      className="w-[60px] h-[60px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]"
    >
      <div className="relative w-full h-full">
        {/* Simple CSS Owl Placeholder for visual clarity without huge SVG */}
        <div className="w-full h-full bg-white rounded-2xl rotate-45 border-4 border-primary shadow-inner flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-primary/10 -rotate-45 flex items-center justify-center">
            <span className="text-2xl">🦉</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute -top-12 -right-16 bg-white px-4 py-2 rounded-2xl text-[12px] font-black text-ink-900 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] whitespace-nowrap z-50 border-2 border-primary/10"
      >
        {message}
        <div className="absolute bottom-[-6px] left-0 translate-x-4 w-4 h-4 bg-white rotate-45 border-b-2 border-r-2 border-primary/10 border-t-0 border-l-0" />
      </motion.div>
    </motion.div>
  );
}

function SagaNode({ node, index, onClick, isAdvanced }: { node: MapNode; index: number; onClick?: (node: MapNode) => void; isAdvanced: boolean }) {
  const isCompleted = node.status === "completed";
  const isCurrent = node.status === "current" || node.status === "unlocked";
  const isLocked = node.status === "locked";

  return (
    <div className="relative group perspective-[500px]">
      {/* Tooltip */}
      <div className={`
          absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2
          bg-white/95 backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-2xl
          text-sm font-bold text-ink-800
          transition-all duration-300 transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-2
          z-30 pointer-events-none
        `}>
        {node.title}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white/95" />
      </div>

      <Link
        href={isLocked ? "#" : `/lesson/${node.id}`}
        className={`block relative ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
        onClick={isLocked ? (e) => e.preventDefault() : (e) => {
          if (onClick) {
            e.preventDefault();
            onClick(node);
          }
        }}
      >
        {/* Active Ring */}
        {isCurrent && (
          <div className="absolute inset-[-16px] rounded-full border-[3px] border-primary/40 animate-[spin_8s_linear_infinite]"
            style={{ borderRadius: '40%' }} // Squircle for interest
          />
        )}

        {/* Main Button */}
        <motion.div
          initial={{ scale: 0, rotateX: 20 }}
          whileInView={{ scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          whileHover={!isLocked ? {
            y: -10,
            rotateX: 10,
            boxShadow: "0 25px 35px -10px rgba(0,0,0,0.4)"
          } : {}}
          whileTap={!isLocked ? { scale: 0.95, y: 0 } : {}}
          className={`
                w-20 h-20 rounded-[2rem] flex items-center justify-center
                relative z-20
                transition-all duration-300
                border-b-[6px] active:border-b-0 active:translate-y-[6px]
                ${isCompleted
              ? "bg-emerald-500 border-emerald-700 shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)]"
              : isCurrent
                ? "bg-primary border-primary-hover shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)]"
                : isAdvanced
                  ? "bg-slate-700 border-slate-900 shadow-[0_15px_20px_-5px_rgba(0,0,0,0.5)]"
                  : "bg-slate-200 border-slate-300 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]"
            }
            `}
        >
          {/* Inner Content */}
          <div className="relative z-10">
            {isCompleted ? (
              <Star className="w-8 h-8 text-white fill-white drop-shadow-md animate-pulse" />
            ) : isCurrent ? (
              <Play className="w-8 h-8 text-white fill-white ml-1 drop-shadow-md" />
            ) : (
              <Lock className={`w-6 h-6 ${isAdvanced ? 'text-slate-500' : 'text-slate-400'} drop-shadow-sm`} />
            )}
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
        </motion.div>

        {/* Floor Shadow */}
        <div className={`
            absolute -bottom-6 inset-x-2 h-4 bg-black/20 blur-md rounded-[100%]
            transition-all duration-300 group-hover:scale-75 group-hover:opacity-60
            ${isAdvanced ? 'bg-black/50' : 'bg-black/10'}
        `} />

      </Link>
    </div>
  );
}
