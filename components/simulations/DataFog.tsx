"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, ArrowRight, BrainCircuit } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * DataFog Simulation
 * Demonstrates cognitive overload vs statistical clarity
 * Phase 1: 1000 scrolling numbers (chaos)
 * Phase 2: Morph into bar graph (order)
 */
export default function DataFog() {
    const [phase, setPhase] = useState<"chaos" | "order">("chaos");
    const [numbers, setNumbers] = useState<number[]>([]);
    const [userDecision, setUserDecision] = useState<"high" | "low" | null>(null);

    // Generate 1000 random scores on mount
    useEffect(() => {
        const nums = Array.from({ length: 1000 }, () =>
            Math.floor(Math.random() * 40) + 60 // Skewed towards 60-100 range
        );
        setNumbers(nums);
    }, []);

    const meanScore = numbers.length
        ? Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length)
        : 0;

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            {/* Simulation Header */}
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BrainCircuit size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Principal's Nightmare
                    </span>
                </div>
                <div className="text-xs font-bold text-ink-400 bg-white px-3 py-1 rounded-full border border-border">
                    {phase === "chaos" ? "Phase 1: Raw Data" : "Phase 2: Statistics"}
                </div>
            </div>

            {/* Main Stage */}
            <div className="relative min-h-[400px] flex flex-col">

                <AnimatePresence mode="wait">
                    {phase === "chaos" ? (
                        <motion.div
                            key="chaos"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 relative p-6 overflow-hidden"
                        >
                            {/* Chaos: Scrolling Matrix */}
                            <div className="absolute inset-0 p-4 opacity-40 font-mono text-[10px] leading-tight text-ink-400 select-none overflow-hidden flex flex-wrap content-start gap-1">
                                {numbers.map((n, i) => (
                                    <span
                                        key={i}
                                        className={cn(
                                            "transition-colors duration-300",
                                            n < 50 ? "text-red-300" : "text-slate-300"
                                        )}
                                    >
                                        {n}
                                    </span>
                                ))}
                                {/* Overlay Gradient for "Fog" effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />
                            </div>

                            {/* Interaction Layer */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 backdrop-blur-[2px]">
                                <h3 className="text-2xl font-black text-ink-900 mb-2 text-center">
                                    Did the school perform well?
                                </h3>
                                <p className="text-ink-500 mb-8 max-w-sm text-center">
                                    Can you process these 1,000 exam papers with just your eyes?
                                </p>

                                <div className="flex gap-4 mb-8">
                                    <button
                                        onClick={() => setUserDecision("high")}
                                        className={cn(
                                            "px-6 py-3 rounded-xl font-bold border-2 transition-all",
                                            userDecision === "high"
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white text-ink-700 border-border hover:border-primary/50"
                                        )}
                                    >
                                        Usually High
                                    </button>
                                    <button
                                        onClick={() => setUserDecision("low")}
                                        className={cn(
                                            "px-6 py-3 rounded-xl font-bold border-2 transition-all",
                                            userDecision === "low"
                                                ? "bg-red-500 text-white border-red-500"
                                                : "bg-white text-ink-700 border-border hover:border-red-300"
                                        )}
                                    >
                                        Usually Low
                                    </button>
                                </div>

                                {userDecision && (
                                    <motion.button
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPhase("order")}
                                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-2xl shadow-xl font-black text-lg group"
                                    >
                                        <BarChart size={24} />
                                        Apply Statistics Tool
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="order"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50"
                        >
                            {/* Order: The Graph */}
                            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-border p-6 text-center">
                                <div className="text-sm font-bold text-ink-400 mb-1 uppercase tracking-wider">
                                    Compressed Reality
                                </div>
                                <div className="text-5xl font-black text-primary mb-2">
                                    {meanScore}%
                                </div>
                                <div className="text-ink-600 font-bold mb-6">Mean Score</div>

                                {/* Simple Bar Chart Visual */}
                                <div className="h-40 flex items-end justify-center gap-4 border-b border-border pb-2 px-4">
                                    <div className="w-16 bg-slate-200 rounded-t-lg h-[30%] relative group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Fail</div>
                                    </div>
                                    <div className="w-16 bg-primary rounded-t-lg h-[68%] relative group ring-4 ring-primary/20">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-primary">68%</div>
                                    </div>
                                    <div className="w-16 bg-slate-200 rounded-t-lg h-[15%] relative group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Top</div>
                                    </div>
                                </div>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 text-center text-ink-600 max-w-sm leading-relaxed"
                            >
                                <span className="font-bold text-ink-900">Cognitive Overload Solved.</span><br />
                                Statistics allowed you to observe the whole by compressing the parts.
                            </motion.p>

                            <button
                                onClick={() => {
                                    setPhase("chaos");
                                    setUserDecision(null);
                                }}
                                className="mt-6 text-sm font-bold text-ink-400 hover:text-primary transition-colors underline"
                            >
                                Reset Simulation
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
