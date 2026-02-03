"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ScatterChart, RotateCcw, Plus, Wand2 } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * PatternDetector - Correlation vs Causation
 * Interactive Scatter Plot.
 * User can add points or generate trends.
 * Shows R-value (Correlation) but reminds user that Causation is "Maybe".
 */
export default function PatternDetector() {
    const [points, setPoints] = useState<{ x: number, y: number }[]>([]);
    const [verdict, setVerdict] = useState<"positive" | "negative" | "zero" | "none">("none");

    const addPoint = (x: number, y: number) => {
        setPoints(prev => [...prev, { x, y }]);
    };

    const generateTrend = (type: "positive" | "negative" | "random") => {
        const newPoints = [];
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 100;
            let y = 50;
            const noise = (Math.random() - 0.5) * 30;

            if (type === "positive") y = x + noise;
            if (type === "negative") y = 100 - x + noise;
            if (type === "random") y = Math.random() * 100;

            // clamp
            y = Math.max(0, Math.min(100, y));
            newPoints.push({ x, y });
        }
        setPoints(newPoints);
    };

    // Calculate Correlation (R) and Regression Line
    const calculateStats = () => {
        if (points.length < 2) return { r: 0, slope: 0, intercept: 0 };

        const n = points.length;
        const sumX = points.reduce((a, b) => a + b.x, 0);
        const sumY = points.reduce((a, b) => a + b.y, 0);
        const sumXY = points.reduce((a, b) => a + b.x * b.y, 0);
        const sumX2 = points.reduce((a, b) => a + b.x * b.x, 0);
        const sumY2 = points.reduce((a, b) => a + b.y * b.y, 0);

        const numerator = (n * sumXY) - (sumX * sumY);
        const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

        const r = denominator === 0 ? 0 : numerator / denominator;

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return { r, slope, intercept };
    };

    const stats = calculateStats();

    useEffect(() => {
        if (points.length < 5) {
            setVerdict("none");
            return;
        }
        if (stats.r > 0.6) setVerdict("positive");
        else if (stats.r < -0.6) setVerdict("negative");
        else setVerdict("zero");
    }, [points, stats.r]);

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
                        <ScatterChart size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Pattern Detector
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Plot Area */}
                    <div className="relative w-full aspect-square md:w-80 md:h-80 bg-slate-50 border-2 border-slate-200 rounded-xl cursor-crosshair overflow-hidden group"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = ((e.clientX - rect.left) / rect.width) * 100;
                            const y = 100 - ((e.clientY - rect.top) / rect.height) * 100; // Flip Y
                            addPoint(x, y);
                        }}
                    >
                        {/* Grid Lines */}
                        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
                            {[...Array(16)].map((_, i) => <div key={i} className="border-r border-b border-indigo-200" />)}
                        </div>

                        {/* Trend Line */}
                        {points.length > 2 && (
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <line
                                    x1="0%"
                                    y1={`${100 - stats.intercept}%`}
                                    x2="100%"
                                    y2={`${100 - (stats.slope * 100 + stats.intercept)}%`}
                                    stroke="currentColor" // will use parent color
                                    strokeWidth="3"
                                    className={cn(
                                        "opacity-50 transition-colors",
                                        stats.r > 0.4 ? "text-green-500" : stats.r < -0.4 ? "text-red-500" : "text-slate-400"
                                    )}
                                />
                            </svg>
                        )}

                        {/* Points */}
                        {points.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute w-3 h-3 bg-indigo-600 rounded-full border border-white shadow-sm -ml-1.5 -mt-1.5 pointer-events-none"
                                style={{ left: `${p.x}%`, bottom: `${p.y}%` }}
                            />
                        ))}

                        <div className="absolute top-2 left-2 text-[10px] text-ink-400 font-bold bg-white/80 px-2 rounded-lg pointer-events-none">
                            Click to add point
                        </div>
                    </div>

                    {/* Controls & Verdict */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <button onClick={() => generateTrend("positive")} className="flex-1 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 hover:bg-green-100 transition-colors flex items-center justify-center gap-1">
                                    <Wand2 size={14} /> Positive
                                </button>
                                <button onClick={() => generateTrend("negative")} className="flex-1 py-2 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                                    <Wand2 size={14} /> Negative
                                </button>
                                <button onClick={() => generateTrend("random")} className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1">
                                    <Wand2 size={14} /> Random
                                </button>
                            </div>

                            <button onClick={() => setPoints([])} className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors border-t border-slate-100 pt-4">
                                <RotateCcw size={14} /> Clear Board
                            </button>
                        </div>

                        {/* Analysis Box */}
                        <div className="mt-6 bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                            <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correlation (r)</div>
                                    <div className="text-3xl font-mono font-black">{stats.r.toFixed(2)}</div>
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase",
                                    verdict === "positive" ? "bg-green-500 text-green-950" :
                                        verdict === "negative" ? "bg-yellow-500 text-yellow-950" :
                                            verdict === "zero" ? "bg-slate-700 text-slate-300" :
                                                "bg-slate-800 text-slate-500"
                                )}>
                                    {verdict === "positive" ? "Strong Positive" :
                                        verdict === "negative" ? "Strong Negative" :
                                            verdict === "zero" ? "No Correlation" : "Need Data"}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Does X cause Y?</span>
                                    <div className="flex gap-1">
                                        <div className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs line-through opacity-50">YES</div>
                                        <div className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs line-through opacity-50">NO</div>
                                        <div className="px-2 py-1 bg-green-500 text-green-950 font-bold rounded text-xs shadow-lg shadow-green-500/50">MAYBE</div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 italic">
                                    "Correlation suggests a relationship, but never proves causation. A third variable (Z) might be driving both!"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
