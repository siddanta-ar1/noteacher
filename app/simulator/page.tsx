"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Save, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

// 1. Separate the logic that needs search params into its own component
function SimulatorContent() {
  const params = useSearchParams();
  const task = params.get("task") || "Free Play";
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="h-screen bg-slate-900 flex flex-col text-white overflow-hidden">
      {/* Toolbar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/home"
            className="text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft />
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <h1 className="font-bold tracking-wide">
            SIMULATOR <span className="text-power-teal mx-2">//</span> {task}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all
              ${
                isRunning
                  ? "bg-red-500/20 text-red-400 border border-red-500/50"
                  : "bg-power-teal text-slate-900 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]"
              }
            `}
          >
            {isRunning ? <RotateCcw size={16} /> : <Play size={16} />}
            {isRunning ? "Stop Simulation" : "Run Circuit"}
          </button>
          <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/70">
            <Save size={18} />
          </button>
        </div>
      </header>

      {/* Main Workbench Area */}
      <div className="flex-1 flex relative">
        {/* Left: Component Palette */}
        <div className="w-64 bg-slate-800/50 border-r border-white/5 p-4 flex flex-col gap-4">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
            Logic Gates
          </p>
          {["NAND", "AND", "OR", "NOT", "XOR"].map((gate) => (
            <motion.div
              key={gate}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-700/50 p-4 rounded-xl border border-white/5 cursor-grab active:cursor-grabbing hover:border-power-teal/50 transition-colors group"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold font-mono">{gate}</span>
                <div className="w-2 h-2 rounded-full bg-slate-500 group-hover:bg-power-teal transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center: Canvas (Grid) */}
        <div className="flex-1 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
              <p className="text-6xl font-black text-white/10 mb-4">CANVAS</p>
              <p className="text-sm font-mono text-power-teal">
                Drag components here to build
              </p>
            </div>
          </div>

          {/* Example Placed Component */}
          <motion.div
            drag
            dragMomentum={false}
            className="absolute top-1/2 left-1/3 bg-power-purple px-6 py-4 rounded-lg shadow-2xl cursor-grab active:cursor-grabbing border-2 border-white/20"
          >
            <p className="font-bold text-white">NAND Gate</p>
            {/* Input/Output dots */}
            <div className="absolute -left-2 top-3 w-4 h-4 bg-white rounded-full border-4 border-slate-900" />
            <div className="absolute -left-2 top-9 w-4 h-4 bg-white rounded-full border-4 border-slate-900" />
            <div className="absolute -right-2 top-6 w-4 h-4 bg-power-teal rounded-full border-4 border-slate-900 shadow-[0_0_10px_#2dd4bf]" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// 2. Wrap the content in Suspense in the default export
export default function SimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
          Loading Workbench...
        </div>
      }
    >
      <SimulatorContent />
    </Suspense>
  );
}
