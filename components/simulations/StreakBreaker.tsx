"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, ArrowRight, RotateCcw, Brain } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * StreakBreaker Simulation
 * Demonstrates the Gambler's Fallacy
 * Forces 5 heads in a row, then asks user to predict the next flip.
 * Reveals that probability is always 50/50.
 */
export default function StreakBreaker() {
    const [phase, setPhase] = useState<"flipping" | "guess" | "reveal">("flipping");
    const [flipCount, setFlipCount] = useState(0);
    const [userGuess, setUserGuess] = useState<"heads" | "tails" | null>(null);
    const [actualResult, setActualResult] = useState<"heads" | "tails" | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);

    // Force 5 heads, then truly random
    const flipCoin = async () => {
        if (isFlipping) return;
        setIsFlipping(true);

        // Animation time
        await new Promise(r => setTimeout(r, 800));

        if (flipCount < 5) {
            // Forced heads
            setFlipCount(c => c + 1);
        }

        setIsFlipping(false);

        if (flipCount >= 4) {
            // After 5 flips, move to guess phase
            setPhase("guess");
        }
    };

    const makeGuess = (guess: "heads" | "tails") => {
        setUserGuess(guess);
        // Actually random result
        const result = Math.random() > 0.5 ? "heads" : "tails";
        setActualResult(result);
        setPhase("reveal");
    };

    const reset = () => {
        setPhase("flipping");
        setFlipCount(0);
        setUserGuess(null);
        setActualResult(null);
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            {/* Header */}
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                        <Coins size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Streak Breaker
                    </span>
                </div>
                <div className="text-xs font-bold text-ink-400 bg-white px-3 py-1 rounded-full border border-border">
                    Flips: {flipCount}/5
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8 min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white">

                <AnimatePresence mode="wait">
                    {phase === "flipping" && (
                        <motion.div
                            key="flipping"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            {/* History Dots */}
                            <div className="flex gap-2 justify-center mb-8">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all",
                                            i < flipCount
                                                ? "bg-amber-400 text-white border-amber-500 shadow-lg"
                                                : "bg-slate-100 text-slate-300 border-slate-200"
                                        )}
                                    >
                                        {i < flipCount ? "H" : "?"}
                                    </div>
                                ))}
                            </div>

                            {/* Coin */}
                            <motion.div
                                animate={isFlipping ? { rotateY: [0, 180, 360, 540, 720] } : {}}
                                transition={{ duration: 0.8 }}
                                className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 mx-auto mb-8 flex items-center justify-center shadow-xl border-4 border-amber-200"
                            >
                                <span className="text-4xl font-black text-white drop-shadow-md">
                                    {flipCount > 0 ? "H" : "?"}
                                </span>
                            </motion.div>

                            <button
                                onClick={flipCoin}
                                disabled={isFlipping}
                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isFlipping ? "Flipping..." : flipCount === 0 ? "Flip the Coin" : "Flip Again"}
                            </button>

                            <p className="mt-6 text-sm text-ink-400 max-w-xs">
                                Keep flipping and watch the pattern...
                            </p>
                        </motion.div>
                    )}

                    {phase === "guess" && (
                        <motion.div
                            key="guess"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            {/* Streak Display */}
                            <div className="flex gap-2 justify-center mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold border-2 border-amber-500 shadow-md"
                                    >
                                        H
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black border-2 border-slate-300 animate-pulse">
                                    ?
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-ink-900 mb-2">
                                5 Heads in a row!
                            </h3>
                            <p className="text-ink-500 mb-8 max-w-sm">
                                What will the 6th flip be? Trust your gut.
                            </p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => makeGuess("heads")}
                                    className="px-8 py-4 bg-amber-400 text-white rounded-2xl font-bold text-lg hover:bg-amber-500 transition-colors shadow-lg shadow-amber-200"
                                >
                                    Heads 🪙
                                </button>
                                <button
                                    onClick={() => makeGuess("tails")}
                                    className="px-8 py-4 bg-slate-700 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg"
                                >
                                    Tails 🔄
                                </button>
                            </div>

                            <p className="mt-6 text-xs text-ink-300 italic">
                                (Most people click Tails. "It's due!" they think.)
                            </p>
                        </motion.div>
                    )}

                    {phase === "reveal" && (
                        <motion.div
                            key="reveal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center max-w-lg"
                        >
                            {/* Result Display */}
                            <div className="mb-8">
                                <div className={cn(
                                    "w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center font-black text-3xl shadow-xl border-4",
                                    actualResult === "heads"
                                        ? "bg-amber-400 text-white border-amber-300"
                                        : "bg-slate-600 text-white border-slate-400"
                                )}>
                                    {actualResult === "heads" ? "H" : "T"}
                                </div>
                                <p className="text-lg font-bold text-ink-700">
                                    The coin landed: <span className="uppercase">{actualResult}</span>
                                </p>
                                <p className="text-sm text-ink-400">
                                    You guessed: <span className="uppercase">{userGuess}</span>
                                </p>
                            </div>

                            {/* The Lesson */}
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-6">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <Brain className="text-indigo-600" size={24} />
                                    <h4 className="font-bold text-indigo-900">The Gambler's Fallacy</h4>
                                </div>
                                <p className="text-sm text-indigo-800 leading-relaxed">
                                    {userGuess === "tails" ? (
                                        <>
                                            You thought "It's <strong>DUE</strong> for tails!" But the coin has no memory.
                                            Each flip is independent. The probability was <strong>exactly 50/50</strong>.
                                        </>
                                    ) : (
                                        <>
                                            You correctly understood that each flip is independent!
                                            The probability was <strong>exactly 50/50</strong>, regardless of the streak.
                                        </>
                                    )}
                                </p>
                            </div>

                            <div className="bg-slate-900 text-white p-4 rounded-xl text-center mb-6">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    Mathematical Truth
                                </div>
                                <div className="text-2xl font-mono font-bold">
                                    P(Heads | 5 Heads) = 50%
                                </div>
                            </div>

                            <button
                                onClick={reset}
                                className="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl text-ink-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 mx-auto"
                            >
                                <RotateCcw size={16} />
                                Try Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
