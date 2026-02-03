"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Route, Clock, AlertOctagon, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * IntuitionRun - The Intuition Run
 * Choose a path based on historical data. 
 * Path A: High Variance (10, 10, 90). Path B: Zero Variance (20, 20, 20).
 * Demonstrates calculating risk/variance intuitively.
 */
export default function IntuitionRun() {
    const [selectedPath, setSelectedPath] = useState<1 | 2 | null>(null);

    const path1History = [10, 10, 90]; // Mean ~36, High Variance
    const path2History = [25, 25, 25]; // Mean 25, Zero Variance

    // Wait, let's make the means comparable or interesting.
    // Spec: "Path 1: 10 mins, 10 mins, 90 mins (Accident)." Mean = 36.6
    // Spec: "Path 2: 20 mins, 20 mins, 20 mins." Mean = 20.
    // If Path 2 is clearly faster on average AND safer, it's trivial.
    // Let's make Path 1 tempting: "10, 10, 90". Most days it IS faster. 
    // This is the "Gambler" trap. Lower mode, higher mean.

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                        <Route size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Intuition Run
                    </span>
                </div>
            </div>

            <div className="p-8">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-ink-900 mb-2">How will you get to work?</h3>
                    <p className="text-sm text-ink-500">
                        Look at your past travel times and choose the best route.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {/* Path 1 Card */}
                    <button
                        onClick={() => setSelectedPath(1)}
                        className={cn(
                            "flex-1 p-6 rounded-2xl border-2 transition-all hover:scale-105 text-left group",
                            selectedPath === 1 ? "border-red-500 bg-red-50 ring-2 ring-red-200 ring-offset-2" : "border-slate-200 hover:border-red-300"
                        )}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="font-black text-lg text-ink-900 group-hover:text-red-600 transition-colors">Route A</div>
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-400 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
                                <Clock size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs font-bold text-ink-400 uppercase tracking-wider">History Log</div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg text-sm">10m</div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg text-sm">10m</div>
                                <div className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-lg text-sm flex items-center gap-1">
                                    90m <AlertOctagon size={12} />
                                </div>
                            </div>
                            <p className="text-[10px] text-ink-400 mt-2 italic">
                                "Usually fast, except when it's not..."
                            </p>
                        </div>
                    </button>

                    {/* Path 2 Card */}
                    <button
                        onClick={() => setSelectedPath(2)}
                        className={cn(
                            "flex-1 p-6 rounded-2xl border-2 transition-all hover:scale-105 text-left group",
                            selectedPath === 2 ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 ring-offset-2" : "border-slate-200 hover:border-blue-300"
                        )}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="font-black text-lg text-ink-900 group-hover:text-blue-600 transition-colors">Route B</div>
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                                <Clock size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs font-bold text-ink-400 uppercase tracking-wider">History Log</div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg text-sm">25m</div>
                                <div className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg text-sm">25m</div>
                                <div className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg text-sm">25m</div>
                            </div>
                            <p className="text-[10px] text-ink-400 mt-2 italic">
                                "Boring but reliable."
                            </p>
                        </div>
                    </button>
                </div>

                {selectedPath && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={cn(
                            "rounded-2xl p-6 border-l-4",
                            selectedPath === 1 ? "bg-red-50 border-red-500" : "bg-blue-50 border-blue-500"
                        )}
                    >
                        <h4 className={cn(
                            "font-bold mb-2 flex items-center gap-2",
                            selectedPath === 1 ? "text-red-800" : "text-blue-800"
                        )}>
                            {selectedPath === 1 ? <AlertOctagon size={18} /> : <CheckCircle2 size={18} />}
                            {selectedPath === 1 ? "Risky Choice (High Variance)" : "Safe Choice (Zero Variance)"}
                        </h4>
                        <p className={cn("text-sm leading-relaxed", selectedPath === 1 ? "text-red-700" : "text-blue-700")}>
                            {selectedPath === 1
                                ? "You chose based on the best-case scenario (10 mins). But statisically, the Mean is ~37 mins and the Standard Deviation is huge. You are gambling with your time!"
                                : "You ignored the '10 min' temptation of Route A. Route B has a lower Mean (25 mins) and Zero Variance, making it the statistically superior choice for being on time."}
                        </p>
                        <div className="mt-4 pt-4 border-t border-black/5 flex gap-8">
                            <div>
                                <span className="text-[10px] uppercase font-bold opacity-60 block">Avg Time (Mean)</span>
                                <span className="font-mono font-bold text-lg">
                                    {selectedPath === 1 ? "36.6m" : "25.0m"}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold opacity-60 block">Uncertainty (Std Dev)</span>
                                <span className="font-mono font-bold text-lg">
                                    {selectedPath === 1 ? "±37.7m" : "±0.0m"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
