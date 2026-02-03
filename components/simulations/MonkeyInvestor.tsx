"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, RefreshCcw, Skull, Trophy } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * MonkeyInvestor - Luck vs Strategy
 * User picks a stock (High variance). Computer picks Index (Low variance).
 * Comparison over 5 simulated years.
 */
export default function MonkeyInvestor() {
    const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
    const [year, setYear] = useState(0);

    // Portfolio Values
    const [userValue, setUserValue] = useState(100); // Starts at $100
    const [indexValue, setIndexValue] = useState(100);

    // History for graphing
    const [history, setHistory] = useState<{ user: number, index: number }[]>([{ user: 100, index: 100 }]);

    const runSimulation = async () => {
        if (status === "running") return;
        setStatus("running");

        let uVal = 100;
        let iVal = 100;
        let hist = [{ user: 100, index: 100 }];
        setUserValue(100);
        setIndexValue(100);

        // Simulate 60 months (5 years)
        for (let m = 1; m <= 60; m++) {
            await new Promise(r => setTimeout(r, 50)); // Fast forward speed

            // User Stock: High Volatility (Random Walk)
            // Can go -10% to +12% per month
            const userChange = (Math.random() * 0.22) - 0.10;
            uVal = uVal * (1 + userChange);

            // Index Fund: Low Volatility (Steady Growth)
            // Can go -2% to +3% per month (Assumes general market uptrend)
            const indexChange = (Math.random() * 0.05) - 0.02 + 0.005; // Slight bias up
            iVal = iVal * (1 + indexChange);

            setYear(Math.floor(m / 12));
            setUserValue(uVal);
            setIndexValue(iVal);

            // Record points for every 6 months for smoother/less chaotic graph rendering
            if (m % 2 === 0) {
                hist.push({ user: uVal, index: iVal });
                setHistory([...hist]);
            }
        }
        setStatus("done");
    };

    const reset = () => {
        setStatus("idle");
        setYear(0);
        setUserValue(100);
        setIndexValue(100);
        setHistory([{ user: 100, index: 100 }]);
    };

    // Graph plotting logic
    const maxVal = Math.max(Math.max(...history.map(h => h.user)), Math.max(...history.map(h => h.index)), 200);

    const getPath = (type: "user" | "index") => {
        if (history.length < 2) return "";
        const width = 100;
        const step = width / (history.length - 1);

        return history.map((pt, i) => {
            const val = type === "user" ? pt.user : pt.index;
            const x = i * step;
            const y = 100 - ((val / maxVal) * 80) - 10; // Padding
            return `${x},${y}`;
        }).join(" ");
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                        <TrendingUp size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Monkey Investor
                    </span>
                </div>
                <div className="font-mono font-bold text-ink-500">
                    Year {year} of 5
                </div>
            </div>

            <div className="p-6">

                {/* Result Cards */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-white border-2 border-primary/20 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                        <div className="text-xs font-bold text-ink-400 uppercase mb-1">Your Pick (Guesswork)</div>
                        <div className={cn("text-2xl font-black transition-colors duration-300", userValue < 50 ? "text-red-500" : "text-primary")}>
                            ${userValue.toFixed(2)}
                        </div>
                        {history.length > 2 && (
                            <div className={cn("text-xs font-bold", userValue > 100 ? "text-emerald-500" : "text-red-500")}>
                                {((userValue - 100)).toFixed(1)}% Return
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <div className="text-xs font-bold text-ink-400 uppercase mb-1">Index Fund (Statistics)</div>
                        <div className="text-2xl font-black text-slate-700">
                            ${indexValue.toFixed(2)}
                        </div>
                        {history.length > 2 && (
                            <div className={cn("text-xs font-bold", indexValue > 100 ? "text-emerald-500" : "text-red-500")}>
                                {((indexValue - 100)).toFixed(1)}% Return
                            </div>
                        )}
                    </div>
                </div>

                {/* Graph View */}
                <div className="h-48 w-full bg-slate-50 rounded-2xl border border-border relative overflow-hidden mb-6">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Baseline 100 */}
                        <line x1="0" y1={100 - (100 / maxVal) * 80 - 10} x2="100" y2={100 - (100 / maxVal) * 80 - 10} stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2" />

                        {history.length > 1 && (
                            <>
                                {/* User Path */}
                                <motion.path
                                    d={`M 0,${100 - (100 / maxVal) * 80 - 10} L ${getPath("user")}`}
                                    fill="none"
                                    stroke="#8B5CF6"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                />
                                {/* Index Path */}
                                <motion.path
                                    d={`M 0,${100 - (100 / maxVal) * 80 - 10} L ${getPath("index")}`}
                                    fill="none"
                                    stroke="#64748B"
                                    strokeWidth="2"
                                    strokeDasharray="2 1"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                />
                            </>
                        )}
                    </svg>

                    {/* Legend */}
                    <div className="absolute top-2 right-2 text-[10px] font-bold bg-white/50 backdrop-blur p-2 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 text-primary">
                            <div className="w-2 h-2 rounded-full bg-primary" /> You
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                            <div className="w-2 h-0.5 bg-slate-500" /> Index
                        </div>
                    </div>
                </div>

                {/* Controls & Takeaway */}
                <div className="text-center">
                    {status === "idle" && (
                        <button
                            onClick={runSimulation}
                            className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-all"
                        >
                            Start 5-Year Simulation
                        </button>
                    )}

                    {status === "running" && (
                        <div className="text-sm font-bold text-ink-500 animate-pulse">
                            Simulating Market Conditions...
                        </div>
                    )}

                    {status === "done" && (
                        <div className="animate-fade-in-up">
                            <p className="font-medium text-ink-700 mb-4">
                                {userValue > indexValue
                                    ? "Wow! You got lucky and beat the market. Can you do it twice?"
                                    : "You crashed? That's normal. Volatility kills growth."}
                            </p>
                            <button
                                onClick={reset}
                                className="px-6 py-2 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-2 mx-auto"
                            >
                                <RefreshCcw size={16} /> Try Again
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
