"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * LongRunGraph - Probability vs Luck
 * Visualizes the Law of Large Numbers.
 * Red Line (Guesswork): High noise, high failure rate.
 * Green Line (Statistics): Low noise, consistent positive drift.
 */
export default function LongRunGraph() {
    const [years, setYears] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Data points
    const [statsData, setStatsData] = useState([50]); // Starts at mid
    const [luckData, setLuckData] = useState([50]);

    const runSimulation = async () => {
        setIsRunning(true);
        // Fast forward 100 years
        // We'll add 100 points

        // Use batch updates for animation frame compatibility or just rapid intervals
        let sData = [...statsData];
        let lData = [...luckData];
        let currentS = sData[sData.length - 1];
        let currentL = lData[lData.length - 1];

        // Reset if we are restarting
        if (years >= 100) {
            setYears(0);
            sData = [50];
            lData = [50];
            currentS = 50;
            currentL = 50;
        }

        const interval = setInterval(() => {
            // Statistics: Small positive drift, low variance
            const statChange = (Math.random() - 0.45) * 2; // Slight positive bias (0.45 threshold)
            currentS = Math.max(0, Math.min(100, currentS + statChange));

            // Luck: Zero drift, HUGE variance
            const luckChange = (Math.random() - 0.5) * 15; // No bias, massive swings
            currentL = Math.max(0, Math.min(100, currentL + luckChange));

            sData.push(currentS);
            lData.push(currentL);

            setStatsData([...sData]);
            setLuckData([...lData]);
            setYears(y => y + 1);

            if (sData.length > 100) {
                clearInterval(interval);
                setIsRunning(false);
            }
        }, 30); // 30ms per year = ~3s total duration
    };

    // SVG Path Generation
    const getPath = (data: number[]) => {
        if (data.length < 2) return "";
        const width = 100;
        const step = width / 100; // Fixed 100 year view width

        return data.map((val, i) => {
            const x = i * step;
            const y = 100 - val; // Invert for SVG (0 is top)
            return `${x},${y}`;
        }).join(" ");
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Clock size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Long Run
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="relative h-64 w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 border border-slate-700 shadow-inner">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Midline */}
                        <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />

                        {/* Paths */}
                        <motion.path
                            d={`M 0,${100 - 50} L ${getPath(luckData)}`}
                            fill="none"
                            stroke="#F43F5E" // Rose-500
                            strokeWidth="1.5"
                            className="drop-shadow-lg"
                        />
                        <motion.path
                            d={`M 0,${100 - 50} L ${getPath(statsData)}`}
                            fill="none"
                            stroke="#10B981" // Emerald-500
                            strokeWidth="2.5"
                            className="drop-shadow-lg"
                        />
                    </svg>

                    {/* Labels */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold bg-slate-800/80 px-2 py-1 rounded">
                            <Activity size={12} /> Luck (Guesswork)
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-slate-800/80 px-2 py-1 rounded">
                            <TrendingUpIcon /> Statistics (Probability)
                        </div>
                    </div>

                    {/* Outcome Badges */}
                    {years >= 100 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 text-right">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-rose-400 font-bold bg-slate-900/90 px-3 py-1 rounded border border-rose-500/30"
                            >
                                Ended at {luckData[luckData.length - 1].toFixed(0)}
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-emerald-400 font-bold bg-slate-900/90 px-3 py-1 rounded border border-emerald-500/30"
                            >
                                Ended at {statsData[statsData.length - 1].toFixed(0)}
                            </motion.div>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <button
                        onClick={runSimulation}
                        disabled={isRunning}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                    >
                        {years === 0 ? "Fast Forward 100 Years" : years >= 100 ? "Run Simulation Again" : `Simulating Year ${years}...`}
                    </button>
                    <p className="mt-4 text-sm text-ink-500 max-w-lg mx-auto">
                        In the short run, luck looks like skill. In the long run, probability always dominates chaos.
                    </p>
                </div>
            </div>
        </div>
    );
}

function TrendingUpIcon() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    );
}
