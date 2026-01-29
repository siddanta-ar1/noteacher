// components/map/PathMap.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Lock, Play } from "lucide-react";

// --- Types ---
export type MapNode = {
  id: string;
  title: string;
  status: "locked" | "current" | "completed";
};

type PathMapProps = {
  nodes: MapNode[];
};

// --- Config ---
const NODE_SIZE = 80; // Size of the node circle
const Y_GAP = 120; // Vertical distance between nodes
const X_AMPLITUDE = 100; // Horizontal sway magnitude
const CONTAINER_WIDTH = 400; // Map container width

/**
 * PathMap - Saga Style (Top-to-Bottom Flow)
 * Starts at the TOP (Level 1) and goes DOWN.
 */
export default function PathMap({ nodes }: PathMapProps) {
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate positions for all nodes
  // Index 0 is at the TOP now
  const getPosition = (index: number) => {
    // Zig-zag pattern: Center -> Right -> Center -> Left -> Center
    // Cycle is 4 steps: 0, 1, 2, 3
    // We want the pattern to feel balanced, so we can stick to the sine wave.
    const cycle = index * (Math.PI / 2); // 90 degrees per step
    const xOffset = Math.sin(cycle) * X_AMPLITUDE;

    // Y position (0 is at top)
    const yFromTop = index * Y_GAP + Y_GAP / 2;

    return { x: xOffset, y: yFromTop };
  };

  useEffect(() => {
    // Total height based on nodes
    setContainerHeight(nodes.length * Y_GAP + Y_GAP);
  }, [nodes.length]);

  // Find the index of the current node for the Owl position
  // If no node is 'current', fallback to the last 'completed' or just 0
  const currentNodeIndex = nodes.findIndex(n => n.status === "current");
  // If nothing is current, maybe the user completed everything (last node) or nothing (first node)
  // Let's default to the first node if nothing found, or the specific logic:
  const owlIndex = currentNodeIndex !== -1 ? currentNodeIndex : (nodes.some(n => n.status === "completed") ? nodes.length - 1 : 0);
  const owlPos = getPosition(owlIndex);

  return (
    <div className="relative w-full max-w-[400px] mx-auto" style={{ height: containerHeight }}>
      {/* SVG Path Background */}
      <svg
        className="absolute inset-0 pointer-events-none overflow-visible"
        width="100%"
        height="100%"
      >
        {/* Draw path segments between nodes */}
        {nodes.map((_, i) => {
          if (i === nodes.length - 1) return null; // No path after last node

          const start = getPosition(i);
          const end = getPosition(i + 1);

          // Positions are essentially from top already in this logic
          const startY = start.y;
          const endY = end.y;

          // Center X in the SVG
          const startX = CONTAINER_WIDTH / 2 + start.x;
          const endX = CONTAINER_WIDTH / 2 + end.x;

          // Bezier Control Points for smooth S-curve
          const midY = (startY + endY) / 2;
          const cp1 = { x: startX, y: midY };
          const cp2 = { x: endX, y: midY };

          const isCompleted = nodes[i].status === "completed";

          return (
            <g key={i}>
              {/* Background Path (Gray/Dashed) */}
              <path
                d={`M ${startX} ${startY} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endX} ${endY}`}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="20 10"
              />

              {/* Foreground Path (Colored) - Show if Completed */}
              {isCompleted && (
                <motion.path
                  d={`M ${startX} ${startY} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endX} ${endY}`}
                  fill="none"
                  stroke="#14b8a6" // Power Teal
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const pos = getPosition(i);
        // Top calculation is direct now
        const top = pos.y - NODE_SIZE / 2;
        const left = CONTAINER_WIDTH / 2 + pos.x - NODE_SIZE / 2;

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              top: `${top}px`,
              left: `calc(50% + ${pos.x}px - ${NODE_SIZE / 2}px)`
            }}
          >
            <SagaNode node={node} index={i} />
          </div>
        );
      })}

      {/* THE OWL AVATAR */}
      {/* Positioned absolutely based on the current node index */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        initial={false}
        animate={{
          top: owlPos.y - NODE_SIZE / 2 - 55, // Floating slightly above the node
          left: `calc(50% + ${owlPos.x}px - 25px)`, // Center the 50px owl
        }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <OwlCharacter />
      </motion.div>
    </div>
  );
}

// --- Owl Character Component ---
function OwlCharacter() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className="w-[50px] h-[50px] drop-shadow-2xl"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600">
        {/* Body */}
        <circle cx="50" cy="50" r="45" fill="currentColor" stroke="white" strokeWidth="4" />
        {/* Belly */}
        <ellipse cx="50" cy="65" rx="30" ry="25" fill="#60a5fa" />

        {/* Eyes */}
        <circle cx="35" cy="40" r="14" fill="white" />
        <circle cx="65" cy="40" r="14" fill="white" />
        <circle cx="35" cy="40" r="6" fill="black">
          <animate attributeName="cy" values="40;42;40" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="65" cy="40" r="6" fill="black">
          <animate attributeName="cy" values="40;42;40" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Beak */}
        <polygon points="50,50 42,60 58,60" fill="#f59e0b" />

        {/* Wings */}
        <path d="M5,50 Q-5,20 20,40" fill="#1e40af" />
        <path d="M95,50 Q105,20 80,40" fill="#1e40af" />

        {/* Feet */}
        <path d="M35,92 L30,98 M35,92 L35,98 M35,92 L40,98" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <path d="M65,92 L60,98 M65,92 L65,98 M65,92 L70,98" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      </svg>

      {/* Speech Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute -top-10 -right-12 bg-white px-3 py-1.5 rounded-2xl text-[10px] font-black text-ink-900 shadow-xl whitespace-nowrap z-50 border-2 border-primary/10"
      >
        Start Here!
        <div className="absolute bottom-[-6px] left-0 translate-x-3 w-3 h-3 bg-white rotate-45 border-b-2 border-r-2 border-primary/10 border-t-0 border-l-0" />
      </motion.div>
    </motion.div>
  );
}

// --- Individual Saga Node Component ---
function SagaNode({ node, index }: { node: MapNode; index: number }) {
  const isCompleted = node.status === "completed";
  const isCurrent = node.status === "current";
  const isLocked = node.status === "locked";

  return (
    <div className="relative group">
      {/* Node Label (Tooltip style) */}
      <div
        className={`
          absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 
          bg-white/90 backdrop-blur border border-white/20 shadow-lg rounded-xl
          text-xs font-bold text-ink-700
          transition-all duration-300 transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-1
          z-20 pointer-events-none
        `}
      >
        {node.title}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-white/90" />
      </div>

      <Link
        href={isLocked ? "#" : `/lesson/${node.id}`}
        className={`block relative ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
        onClick={isLocked ? (e) => e.preventDefault() : undefined}
      >

        {/* Pulsing Ring for Current */}
        {isCurrent && (
          <div className="absolute inset-[-12px] rounded-full border-2 border-primary/30 animate-[spin_10s_linear_infinite]" />
        )}

        {/* Main Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: index * 0.1
          }}
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
          {/* Inner Detail / Icon */}
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

          {/* Glossy Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-transparent to-black/20 pointer-events-none" />
        </motion.div>

        {/* Level Number (Subtle) */}
        {!isLocked && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-ink-400">
            {index + 1}
          </div>
        )}
      </Link>
    </div>
  );
}
