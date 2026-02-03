"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings2, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * EfficiencyTunerSim - Managing the Chaos
 * User runs a factory. Initial variance is high (Chaos).
 * User "Analyzes Variance" and tunes a parameter to tighten the distribution (Statistics).
 */
export default function EfficiencyTunerSim() {
    const [variance, setVariance] = useState(0.5); // 0.0 to 1.0 (Low to High Chaos)
    const [isOptimized, setIsOptimized] = useState(false);
    const [outputs, setOutputs] = useState<number[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    // Simulate continuously
    useEffect(() => {
        const interval = setInterval(() => {
            // Target output is 95%.
            // With high variance, range is 50-100%
            // With low variance, range is 92-98%

            const noise = (Math.random() - 0.5) * 2; // -1 to 1

            // Current stability factor based on variance setting
            // if variance is 0.5 (initial), stability is low.
            // if variance is 0.05 (optimized), stability is high.
            const spread = isOptimized ? 5 : 40; // Spread in percentage points

            const val = Math.min(100, Math.max(0, 95 + (noise * spread)));

            setOutputs(prev => [val, ...prev].slice(0, 30)); // Keep last 30
        }, 100);

        return () => clearInterval(interval);
    }, [isOptimized]);

    const handleOptimize = () => {
        setIsRunning(true);
        // Simulate "Analysis" time
        setTimeout(() => {
            setIsOptimized(true);
            setVariance(0.05);
            setIsRunning(false);
        }, 1500);
    };

    // Calculate metrics
    const currentVal = outputs[0] || 0;
    const avg = outputs.reduce((a, b) => a + b, 0) / (outputs.length || 1);

    // Bar graph logic
    const getBarHeight = (val: number) => {
        return (val / 100) * 100; // % height
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                        <Settings2 size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Efficiency Tuner
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", isOptimized ? "bg-green-500" : "bg-red-500")} />
                    <span className="text-xs font-bold text-ink-400">
                        {isOptimized ? "OPTIMIZED" : "UNSTABLE"}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-8">

                {/* Graph View */}
                <div className="flex-1">
                    <div className="h-48 bg-slate-900 rounded-2xl border-4 border-slate-800 p-4 relative flex items-end justify-between overflow-hidden gap-1">
                        {/* Output Bars */}
                        {outputs.slice().reverse().map((val, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex-1 rounded-t-sm transition-all duration-75",
                                    val < 80 ? "bg-red-500" : val < 90 ? "bg-yellow-400" : "bg-green-400"
                                )}
                                style={{ height: `${val}%` }}
                            />
                        ))}

                        {/* Target Line */}
                        <div className="absolute top-[5%] left-0 w-full h-[1px] bg-green-500/50 border-t border-dashed border-green-400" />
                        <div className="absolute top-[5%] right-2 text-[10px] text-green-400 font-bold">TARGET (95%)</div>
                    </div>

                    {/* Live Metrics */}
                    <div className="flex justify-between mt-4">
                        <div className="text-center">
                            <div className="text-xs text-ink-400 font-bold uppercase">Current Output</div>
                            <div className={cn("text-xl font-black font-mono", currentVal < 80 ? "text-red-500" : "text-green-600")}>
                                {currentVal.toFixed(1)}%
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-ink-400 font-bold uppercase">Average</div>
                            <div className="text-xl font-black font-mono text-slate-700">
                                {avg.toFixed(1)}%
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-ink-400 font-bold uppercase">Stability</div>
                            <div className={cn("text-xl font-black font-mono", isOptimized ? "text-green-600" : "text-red-500")}>
                                {isOptimized ? "HIGH" : "LOW"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full md:w-64 flex flex-col justify-center">
                    {!isOptimized ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-800 font-bold flex items-start gap-2">
                                <AlertTriangle className="shrink-0" size={16} />
                                <p>Warning: Production variance is too high. Predicting inventory is impossible.</p>
                            </div>

                            <button
                                onClick={handleOptimize}
                                disabled={isRunning}
                                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isRunning ? "Analyzing..." : <><TrendingUp size={18} /> Analyze & Tune</>}
                            </button>
                            <p className="text-center text-xs text-ink-400">
                                Applies statistical process control to minimize variance.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-xs text-green-800 font-bold flex items-start gap-2">
                                <CheckCircle className="shrink-0" size={16} />
                                <p>System Optimized. Output is now predictable within 92-98% range.</p>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                                <div className="text-xs text-ink-400 font-bold uppercase mb-2">Process Control</div>
                                <input
                                    type="range"
                                    disabled
                                    value={95}
                                    className="w-full accent-green-500"
                                />
                                <div className="text-[10px] text-ink-400 mt-1">Locked to optimal variance</div>
                            </div>

                            <button
                                onClick={() => setIsOptimized(false)}
                                className="w-full py-2 text-slate-400 text-xs font-bold hover:text-slate-600"
                            >
                                Reset Simulation
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
