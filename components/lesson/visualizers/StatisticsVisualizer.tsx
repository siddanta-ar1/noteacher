"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, TrendingUp } from "lucide-react";

type VisualizerProps = {
  mode: "chaos" | "gambler" | "sample";
  trigger: boolean; // Toggles the animation state
};

export default function StatisticsVisualizer({
  mode,
  trigger,
}: VisualizerProps) {
  // --- MODE 1: CHAOS TO ORDER (Data Cluster) ---
  if (mode === "chaos") {
    // Generate 50 random data points
    const [data] = useState(() =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        value: Math.floor(Math.random() * 100),
        // Random positions for "Chaos" state
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
      })),
    );

    return (
      <div className="w-full h-96 bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center border-4 border-slate-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* The "Lens" Effect */}
        <AnimatePresence>
          {trigger && (
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 200, opacity: 0 }} // Sweeps across then vanishes
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute w-20 h-full bg-white/10 blur-xl z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="relative w-64 h-64 flex items-end justify-between px-4">
          {data.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{
                x: item.x,
                y: item.y,
                height: 10,
                width: 10,
                borderRadius: 50,
                backgroundColor: "#94a3b8",
              }}
              animate={
                trigger
                  ? {
                      x: 0,
                      y: 0,
                      height: item.value * 2, // Scale to height
                      width: 4,
                      borderRadius: 2,
                      backgroundColor: item.value > 80 ? "#4ade80" : "#38bdf8", // Color coding
                      opacity: 1,
                    }
                  : {
                      x: item.x,
                      y: item.y,
                      height: 8,
                      width: 8,
                      backgroundColor: "#64748b",
                      opacity: 0.5,
                    }
              }
              transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
            />
          ))}
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span
            className={`text-xs font-black uppercase tracking-widest transition-colors duration-500 ${trigger ? "text-power-teal" : "text-slate-500"}`}
          >
            {trigger ? "PATTERN IDENTIFIED" : "RAW DATA CLUSTER"}
          </span>
        </div>
      </div>
    );
  }

  // --- MODE 2: GAMBLER'S FALLACY (Coin Flip) ---
  if (mode === "gambler") {
    const [history, setHistory] = useState<string[]>([]);
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState<"HEADS" | "TAILS" | null>(null);

    const flipCoin = () => {
      if (flipping) return;
      setFlipping(true);
      setResult(null);

      // Force logic: If previously 3 Heads, make it Head again to prove the point?
      // Or just random to show probability. Let's do random.
      const outcome = Math.random() > 0.5 ? "HEADS" : "TAILS";

      setTimeout(() => {
        setResult(outcome);
        setHistory((prev) => [...prev.slice(-4), outcome]); // Keep last 5
        setFlipping(false);
      }, 1000);
    };

    return (
      <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col items-center justify-center p-6 border-4 border-slate-800 gap-8">
        {/* Coin Animation */}
        <div className="relative perspective-1000">
          <motion.div
            animate={flipping ? { rotateY: [0, 1800] } : { rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`w-32 h-32 rounded-full border-4 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]
                ${result === "HEADS" ? "bg-power-orange border-orange-300" : "bg-power-purple border-purple-300"}
                ${!result && "bg-slate-700 border-slate-500"}
              `}
          >
            <span className="text-2xl font-black text-white">
              {flipping ? "?" : result ? result[0] : "$"}
            </span>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-2">
          {history.map((h, i) => (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                   ${h === "HEADS" ? "bg-power-orange" : "bg-power-purple"}
                 `}
            >
              {h[0]}
            </motion.div>
          ))}
        </div>

        <button
          onClick={flipCoin}
          disabled={flipping}
          className="px-8 py-3 bg-white text-navy rounded-xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCcw size={18} className={flipping ? "animate-spin" : ""} />
          FLIP COIN
        </button>
      </div>
    );
  }

  return <div className="text-white">Visualizer Mode Not Found</div>;
}
