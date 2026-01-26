"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, TrendingUp } from "lucide-react";

type VisualizerProps = {
  mode: "chaos" | "gambler" | "sample" | "normal" | "trend" | "histogram" | "central-tendency" | "z-score";
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

  // --- MODE 3: NORMAL DISTRIBUTION (Bell Curve) ---
  if (mode === "normal") {
    return (
      <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col items-center justify-center p-6 border-4 border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative z-10 w-full max-w-lg h-64 flex items-end justify-center gap-1">
          {Array.from({ length: 40 }).map((_, i) => {
            // Gaussian function approximation
            const x = (i - 20) / 6;
            const y = Math.exp(-0.5 * x * x);
            const height = y * 200;

            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: trigger ? height : 10 }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
                className="w-3 bg-power-teal/80 rounded-t-sm"
              />
            );
          })}
        </div>

        <div className="mt-8 text-center bg-slate-800/80 p-4 rounded-xl backdrop-blur">
          <p className="text-white font-bold">Standard Deviation (σ)</p>
          <div className="flex gap-4 mt-2 text-xs text-slate-400">
            <span className="text-power-teal">68% within 1σ</span>
            <span className="text-power-blue">95% within 2σ</span>
            <span className="text-power-purple">99.7% within 3σ</span>
          </div>
        </div>
      </div>
    );
  }

  // --- MODE 4: TREND (Regression) ---
  if (mode === "trend") {
    // Generate linear data with some noise
    const points = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: i * 15 + 10,
      y: i * 10 + 20 + (Math.random() * 40 - 20),
    }));

    return (
      <div className="w-full h-96 bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center border-4 border-slate-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Data Points */}
          {points.map((p) => (
            <circle
              key={p.id}
              cx={p.x}
              cy={350 - p.y} // Invert Y for SVG coords
              r="4"
              fill="#94a3b8"
              opacity="0.5"
            />
          ))}

          {/* Regression Line */}
          {trigger && (
            <motion.line
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              x1={10}
              y1={350 - (10 * 10 / 15 + 20)} // Rough fitting
              x2={300}
              y2={350 - (300 * 10 / 15 + 20)}
              stroke="#F472B6" // Power Pink
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
        </svg>

        <div className="absolute bottom-4 right-4 bg-slate-800/90 p-3 rounded-lg backdrop-blur border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-pink-400" />
            <span className="text-white font-bold text-sm">Linear Fit</span>
          </div>
          <p className="text-xs text-slate-400 font-mono">R² = {trigger ? "0.89" : "---"}</p>
        </div>
      </div>
    );
  }

  // --- MODE 5: HISTOGRAM (Binning) ---
  if (mode === "histogram") {
    const [binSize, setBinSize] = useState(10);
    // Generate random data (e.g. grades 0-100)
    const [data] = useState(() => Array.from({ length: 200 }).map(() => Math.floor(Math.random() * 100)));

    // Calculate bins
    const bins = Array.from({ length: Math.ceil(100 / binSize) }).map((_, i) => {
      const start = i * binSize;
      const end = start + binSize;
      const count = data.filter(v => v >= start && v < end).length;
      return { start, end, count };
    });

    const maxCount = Math.max(...bins.map(b => b.count));

    return (
      <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col p-6 border-4 border-slate-800 gap-6">
        <div className="flex-1 flex items-end justify-between px-8 gap-1 relative">
          {bins.map((bin, i) => (
            <motion.div
              key={`${binSize}-${i}`}
              layout
              className="bg-power-blue rounded-t hover:bg-power-teal transition-colors relative group"
              style={{
                height: `${(bin.count / maxCount) * 100}%`,
                width: `${100 / bins.length}%`
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                {bin.start}-{bin.end}: {bin.count}
              </div>
            </motion.div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
            <span>More Bars (Precision)</span>
            <span>Bin Size: {binSize}</span>
            <span>Fewer Bars (General)</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={binSize}
            onChange={(e) => setBinSize(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-power-blue"
          />
        </div>
      </div>
    );
  }

  // --- MODE 6: CENTRAL TENDENCY (Mean vs Median) ---
  if (mode === "central-tendency") {
    const [values, setValues] = useState<number[]>([10, 20, 30, 40, 50]);

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted.length % 2 !== 0 ? sorted[Math.floor(sorted.length / 2)] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;

    const addOutlier = () => {
      setValues(prev => [...prev, 500]); // Huge outlier
    };
    const reset = () => setValues([10, 20, 30, 40, 50]);

    return (
      <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col p-6 border-4 border-slate-800 gap-6">
        <div className="flex gap-4 justify-center">
          <div className="bg-slate-800 p-4 rounded-xl text-center border-b-4 border-power-blue w-32">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Mean</div>
            <div className="text-2xl font-black text-white">{mean.toFixed(1)}</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl text-center border-b-4 border-power-purple w-32">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Median</div>
            <div className="text-2xl font-black text-white">{median.toFixed(1)}</div>
          </div>
        </div>

        <div className="flex-1 relative flex items-center px-8 border-b-2 border-slate-700">
          {/* Scale Line */}
          <div className="absolute left-0 right-0 h-0.5 bg-slate-600" />

          {/* Points */}
          {values.map((v, i) => {
            // Scale 0-600 to 0-100%
            const percent = (v / 600) * 100;
            return (
              <motion.div
                key={i}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1, left: `${percent}%` }}
                className="absolute w-4 h-4 rounded-full bg-slate-400 -ml-2 top-1/2 -translate-y-1/2 border-2 border-slate-900 z-10"
              />
            );
          })}

          {/* Indicators */}
          <motion.div
            layout
            animate={{ left: `${(mean / 600) * 100}%` }}
            className="absolute w-1 h-12 bg-power-blue -ml-0.5 top-1/2 -translate-y-1/2 z-0"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-power-blue text-[10px] font-bold">AVG</div>
          </motion.div>
          <motion.div
            layout
            animate={{ left: `${(median / 600) * 100}%` }}
            className="absolute w-1 h-8 bg-power-purple -ml-0.5 top-1/2 -translate-y-1/2 z-0"
          >
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-power-purple text-[10px] font-bold">MED</div>
          </motion.div>
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={addOutlier} className="px-6 py-2 rounded-lg bg-power-teal text-navy font-bold">Add Outlier (500)</button>
          <button onClick={reset} className="px-6 py-2 rounded-lg bg-slate-700 text-white font-bold">Reset</button>
        </div>
      </div>
    );
  }

  // --- MODE 7: Z-SCORE (Standardizing) ---
  if (mode === "z-score") {
    const [value, setValue] = useState(1500);
    const mean = 1000;
    const sd = 200;
    const z = (value - mean) / sd;

    return (
      <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col p-6 border-4 border-slate-800 gap-8 items-center justify-center">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-white">Compare SAT Scores</h3>
          <p className="text-slate-400 text-sm">Mean = {mean}, SD = {sd}</p>
        </div>

        <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <h1 className="text-9xl font-black text-white">Z</h1>
          </div>

          <div className="flex justify-between items-center relative z-10">
            <div className="text-left">
              <div className="text-xs font-bold text-slate-400 uppercase">Your Score</div>
              <div className="text-4xl font-black text-white">{value}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 uppercase">Z-Score</div>
              <div className={`text-4xl font-black ${z > 0 ? 'text-power-teal' : 'text-power-orange'}`}>
                {z > 0 ? '+' : ''}{z.toFixed(2)}
              </div>
            </div>
          </div>

          <input
            type="range"
            min="400"
            max="1600"
            step="10"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="text-center text-xs text-slate-500">
            Slide to change score. <br /> Z = ({value} - {mean}) / {sd}
          </div>
        </div>
      </div>
    );
  }

  return <div className="text-white">Visualizer Mode Not Found</div>;
}
