"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, CheckCircle2, Eye, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui";

export default function FiveSecondCount() {
    const [phase, setPhase] = useState<"intro" | "counting" | "guessing" | "result">("intro");
    const [timeLeft, setTimeLeft] = useState(5);
    const [userGuess, setUserGuess] = useState("");

    // Dot configuration
    const TOTAL_DOTS = 30;
    const BLUE_DOTS = 18;
    const RED_DOTS = 12;

    // Generate random positions (stable)
    const [dots, setDots] = useState<{ id: number, x: number, y: number, color: 'blue' | 'red' }[]>([]);

    useEffect(() => {
        // Generate random positions on mount
        const newDots = Array.from({ length: TOTAL_DOTS }).map((_, i) => ({
            id: i,
            x: Math.random() * 90 + 5, // 5% to 95%
            y: Math.random() * 80 + 10, // 10% to 90%
            color: i < BLUE_DOTS ? 'blue' : 'red' as 'blue' | 'red'
        })).sort(() => Math.random() - 0.5); // Shuffle
        setDots(newDots);
    }, []);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (phase === "counting" && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (phase === "counting" && timeLeft === 0) {
            setPhase("guessing");
        }
        return () => clearInterval(interval);
    }, [phase, timeLeft]);

    const handleStart = () => {
        setTimeLeft(5);
        setUserGuess("");
        setPhase("counting");
    };

    const handleGuess = () => {
        setPhase("result");
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl font-sans text-slate-100 relative min-h-[500px] flex flex-col">

            {/* Header */}
            <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Badge variant="info" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        Simulation
                    </Badge>
                    <span className="font-bold tracking-wide text-sm md:text-base">The 5-Second Count</span>
                </div>
                {phase === "counting" && (
                    <div className="flex items-center gap-2 text-power-orange font-mono font-bold text-xl animate-pulse">
                        <span>0:0{timeLeft}</span>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative p-6 flex flex-col items-center justify-center">

                <AnimatePresence mode="wait">

                    {/* INTRO PHASE */}
                    {phase === "intro" && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center max-w-md space-y-6"
                        >
                            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                <Eye className="w-10 h-10 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Can you trust your eyes?</h2>
                            <p className="text-slate-400 text-lg">
                                You will have exactly <strong className="text-white">5 seconds</strong> to count the <span className="text-blue-400 font-bold">BLUE dots</span>.
                            </p>
                            <button
                                onClick={handleStart}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center gap-2 mx-auto"
                            >
                                <Play size={20} fill="currentColor" />
                                Start Challenge
                            </button>
                        </motion.div>
                    )}

                    {/* COUNTING PHASE - CHAOS */}
                    {phase === "counting" && (
                        <motion.div
                            key="counting"
                            className="absolute inset-0 bg-slate-900"
                        >
                            {dots.map((dot) => (
                                <motion.div
                                    key={dot.id}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`absolute w-4 h-4 rounded-full shadow-lg ${dot.color === 'blue'
                                        ? 'bg-blue-500 shadow-blue-500/50'
                                        : 'bg-red-500 shadow-red-500/50'
                                        }`}
                                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* GUESSING PHASE */}
                    {phase === "guessing" && (
                        <motion.div
                            key="guessing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-6"
                        >
                            <h3 className="text-xl font-bold">Time's up!</h3>
                            <p className="text-slate-300">How many blue dots did you see?</p>

                            <div className="flex gap-4 justify-center">
                                <input
                                    type="number"
                                    value={userGuess}
                                    onChange={(e) => setUserGuess(e.target.value)}
                                    placeholder="?"
                                    className="w-24 bg-slate-800 border-2 border-slate-600 text-center text-2xl font-bold rounded-xl p-2 focus:border-blue-500 focus:outline-none text-white appearance-none"
                                    autoFocus
                                />
                            </div>

                            <button
                                onClick={handleGuess}
                                disabled={!userGuess}
                                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all"
                            >
                                Reveal Answer
                            </button>
                        </motion.div>
                    )}

                    {/* RESULT PHASE - STRUCTURE */}
                    {phase === "result" && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full h-full flex flex-col md:flex-row gap-8"
                        >
                            {/* Visualizer Side */}
                            <div className="flex-1 bg-slate-800/50 rounded-2xl p-4 border border-white/5 relative min-h-[300px]">
                                <div className="absolute top-2 left-2 text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                                    <LayoutGrid size={12} />
                                    Sorted View
                                </div>
                                <div className="h-full flex flex-col justify-center gap-4 pt-6">
                                    {/* Blue Group */}
                                    <div className="flex flex-wrap gap-2 content-start justify-center">
                                        {dots.filter(d => d.color === 'blue').map(dot => (
                                            <motion.div
                                                key={`blue-${dot.id}`}
                                                layoutId={`dot-${dot.id}`}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", bounce: 0.5 }}
                                                className="w-4 h-4 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"
                                            />
                                        ))}
                                    </div>
                                    <div className="w-full h-px bg-white/10" />
                                    {/* Red Group */}
                                    <div className="flex flex-wrap gap-2 content-start justify-center opacity-50">
                                        {dots.filter(d => d.color === 'red').map(dot => (
                                            <div
                                                key={`red-${dot.id}`}
                                                className="w-4 h-4 rounded-full bg-red-500"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Side */}
                            <div className="flex-1 flex flex-col justify-center space-y-6">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Actual Count</p>
                                    <div className="text-5xl font-black text-blue-400">{BLUE_DOTS} <span className="text-2xl text-slate-500 font-normal">Blue Dots</span></div>
                                </div>

                                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-slate-400">Your Guess</span>
                                        <span className={`font-bold ${Math.abs(Number(userGuess) - BLUE_DOTS) <= 2 ? 'text-emerald-400' : 'text-power-orange'}`}>
                                            {userGuess}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500"
                                            style={{ width: `${Math.min((Number(userGuess) / BLUE_DOTS) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-bold flex items-center gap-2 text-emerald-400">
                                        <CheckCircle2 size={20} />
                                        The Lesson
                                    </h4>
                                    <p className="text-slate-300 leading-relaxed text-sm">
                                        Without structure, data is just noise.
                                        Statistics organizes chaos (random positions) into order (sorted groups),
                                        making the impossible count easy.
                                    </p>
                                </div>

                                <button
                                    onClick={handleStart}
                                    className="self-start px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                                >
                                    <RotateCcw size={14} />
                                    Try Again
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
