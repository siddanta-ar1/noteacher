// components/map/PathMap.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Lock, Play } from "lucide-react";
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
const Y_GAP = 120; // Vertical distance between nodes
const LEVEL_HEADER_HEIGHT = 100; // Height of level header space
const X_AMPLITUDE = 100; // Horizontal sway magnitude
const CONTAINER_WIDTH = 400; // Map container width

/**
 * PathMap - Saga Style (Top-to-Bottom Flow) with Levels
 */
export default function PathMap({ levels, onNodeClick }: PathMapProps) {
  // Flatten nodes for global index calculation to maintain path continuity pattern
  const allNodesFlat = levels.flatMap(l => l.nodes);

  // Helper to calculate Y Start position for a given Level based on previous levels
  const getLevelStartY = (levelIndex: number) => {
    let y = 0;
    for (let i = 0; i < levelIndex; i++) {
      // Height of previous level = (nodes * Y_GAP) + Header
      y += (levels[i].nodes.length * Y_GAP) + LEVEL_HEADER_HEIGHT;
    }
    return y; // Start of this level's container
  };

  // Calculate container height synchronously
  const lastLevelIndex = levels.length - 1;
  let containerHeight = 0;
  if (lastLevelIndex >= 0) {
    const lastLevelStartY = getLevelStartY(lastLevelIndex);
    const lastLevelHeight = (levels[lastLevelIndex].nodes.length * Y_GAP) + LEVEL_HEADER_HEIGHT;
    containerHeight = lastLevelStartY + lastLevelHeight + (Y_GAP / 2);
  }

  // Calculate global Y for a node
  // We need to account for headers of current and previous levels
  const getNodeGlobalPosition = (levelIndex: number, nodeIndexInLevel: number) => {
    const levelStartY = getLevelStartY(levelIndex) + LEVEL_HEADER_HEIGHT; // Start after header
    const yInLevel = nodeIndexInLevel * Y_GAP + Y_GAP / 2;

    // We want the X pattern to be continuous across levels??
    // Or reset per level? Let's make it continuous based on global index?
    // No, reset per level is safer for aesthetics, or maybe continuous.
    // Let's use nodeIndexInLevel for X to keep it simple and consistent per level.
    // Actually, if we use a global index for X, it flows better.

    // Let's count how many nodes were before this one globally
    let globalNodeIndex = 0;
    for (let i = 0; i < levelIndex; i++) globalNodeIndex += levels[i].nodes.length;
    globalNodeIndex += nodeIndexInLevel;

    const cycle = globalNodeIndex * (Math.PI / 2);
    const xOffset = Math.sin(cycle) * X_AMPLITUDE;

    return { x: xOffset, y: levelStartY + yInLevel };
  };



  // Find Owl Position
  // We need to find the node that is 'current'
  let owlPos = { x: 0, y: 0 };
  let owlMessage = "Start Here!";

  // Flatten status checking
  let activeFound = false;

  // Find global active node
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
    // If all complete, put at the end? Or if none started, put at start.
    const allComplete = allNodesFlat.every(n => n.status === 'completed');
    if (allComplete) {
      owlMessage = "All Complete! 🎉";
      // Position at last node
      const lastL = levels.length - 1;
      const lastN = levels[lastL].nodes.length - 1;
      owlPos = getNodeGlobalPosition(lastL, lastN);
    } else {
      // Default start
      owlPos = getNodeGlobalPosition(0, 0);
    }
  }


  return (
    <div className="relative w-full max-w-[400px] mx-auto" style={{ height: containerHeight }}>

      {/* 1. Draw SVG Paths (Per Level or Connected?) 
          Let's connect last node of L0 to first of L1? 
          For now, let's keep paths disjoint between levels or connect them?
          Technically there is a "Level Header" gap. Drawing a line through the header might correspond to "advancing".
          Let's draw lines WITHIN levels first.
      */}
      <svg
        className="absolute inset-0 pointer-events-none overflow-visible"
        width="100%"
        height="100%"
      >
        {levels.map((level, lIndex) => (
          level.nodes.map((_, nIndex) => {
            if (nIndex === level.nodes.length - 1) {
              // This is the last node of the level.
              // Should we connect to the next level?
              if (lIndex < levels.length - 1) {
                // Connect to first node of next level
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

      {/* 2. Render Levels */}
      {levels.map((level, lIndex) => {
        const startY = getLevelStartY(lIndex);

        return (
          <div key={lIndex} className="absolute w-full" style={{ top: startY }}>
            {/* Level Header */}
            <div className="h-[100px] flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm border border-border px-6 py-2 rounded-full shadow-sm">
                <span className="text-sm font-black text-ink-500 tracking-widest uppercase">
                  {level.title}
                </span>
              </div>
            </div>

            {/* Nodes */}
            {level.nodes.map((node, nIndex) => {
              // We need to calculate local position relative to this level DIV? 
              // No, we are using absolute positioning globally or we can use relative here.
              // But getNodeGlobalPosition returns global Y.
              // Let's use the global rendering loop below instead of nesting here to avoid offset confusion.
              // Actually, nesting is cleaner for DOM structure but positioning is absolute.
              return null;
            })}
          </div>
        );
      })}

      {/* 3. Render Nodes (Absolute Global Positioning) */}
      {levels.map((level, lIndex) => (
        level.nodes.map((node, nIndex) => {
          const pos = getNodeGlobalPosition(lIndex, nIndex);
          const top = pos.y - NODE_SIZE / 2;
          return (
            <div
              key={node.id}
              className="absolute"
              style={{
                top: `${top}px`,
                left: `calc(50% + ${pos.x}px - ${NODE_SIZE / 2}px)`
              }}
            >
              <SagaNode node={node} index={nIndex} onClick={onNodeClick} />
            </div>
          );
        })
      ))}


      {/* THE OWL AVATAR */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        initial={false}
        animate={{
          top: owlPos.y - NODE_SIZE / 2 - 55,
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

  return (
    <g>
      <path
        d={`M ${startX} ${startY} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endX} ${endY}`}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray="20 10"
      />
      {isCompleted && (
        <motion.path
          d={`M ${startX} ${startY} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endX} ${endY}`}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      )}
    </g>
  );
}

// Reuse existing OwlCharacter and SagaNode (Identical to previous)
function OwlCharacter({ message }: { message: string }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className="w-[50px] h-[50px] drop-shadow-2xl"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600">
        <circle cx="50" cy="50" r="45" fill="currentColor" stroke="white" strokeWidth="4" />
        <ellipse cx="50" cy="65" rx="30" ry="25" fill="#60a5fa" />
        <circle cx="35" cy="40" r="14" fill="white" />
        <circle cx="65" cy="40" r="14" fill="white" />
        <circle cx="35" cy="40" r="6" fill="black">
          <animate attributeName="cy" values="40;42;40" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="65" cy="40" r="6" fill="black">
          <animate attributeName="cy" values="40;42;40" dur="4s" repeatCount="indefinite" />
        </circle>
        <polygon points="50,50 42,60 58,60" fill="#f59e0b" />
        <path d="M5,50 Q-5,20 20,40" fill="#1e40af" />
        <path d="M95,50 Q105,20 80,40" fill="#1e40af" />
        <path d="M35,92 L30,98 M35,92 L35,98 M35,92 L40,98" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <path d="M65,92 L60,98 M65,92 L65,98 M65,92 L70,98" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute -top-10 -right-12 bg-white px-3 py-1.5 rounded-2xl text-[10px] font-black text-ink-900 shadow-xl whitespace-nowrap z-50 border-2 border-primary/10"
      >
        {message}
        <div className="absolute bottom-[-6px] left-0 translate-x-3 w-3 h-3 bg-white rotate-45 border-b-2 border-r-2 border-primary/10 border-t-0 border-l-0" />
      </motion.div>
    </motion.div>
  );
}

function SagaNode({ node, index, onClick }: { node: MapNode; index: number; onClick?: (node: MapNode) => void }) {
  const isCompleted = node.status === "completed";
  const isCurrent = node.status === "current" || node.status === "unlocked";
  const isLocked = node.status === "locked";

  return (
    <div className="relative group">
      <div className={`
          absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 
          bg-white/90 backdrop-blur border border-white/20 shadow-lg rounded-xl
          text-xs font-bold text-ink-700
          transition-all duration-300 transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-1
          z-20 pointer-events-none
        `}>
        {node.title}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-white/90" />
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
        {isCurrent && (
          <div className="absolute inset-[-12px] rounded-full border-2 border-primary/30 animate-[spin_10s_linear_infinite]" />
        )}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={!isLocked ? { scale: 1.1, rotate: 5 } : {}}
          whileTap={!isLocked ? { scale: 0.9 } : {}}
          className={`
             w-20 h-20 rounded-full flex items-center justify-center
             shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)]
             border-[6px] border-white
             relative z-10
             transition-colors duration-300
             ${isCompleted
              ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
              : isCurrent
                ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                : "bg-slate-200"
            }
           `}
        >
          {isCompleted ? (
            <div className="relative">
              <Star className="w-8 h-8 text-white fill-white drop-shadow-md" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/60 blur-[2px] rounded-full" />
            </div>
          ) : isCurrent ? (
            <div className="relative">
              <Play className="w-8 h-8 text-white fill-white ml-1 drop-shadow-md" />
            </div>
          ) : (
            <Lock className="w-6 h-6 text-slate-400 drop-shadow-sm" />
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-transparent to-black/20 pointer-events-none" />
        </motion.div>
      </Link>
    </div>
  );
}
