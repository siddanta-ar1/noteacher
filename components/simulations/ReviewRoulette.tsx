"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Search, ThumbsDown, User, CheckCircle, Quote } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * ReviewRoulette Simulation
 * Demonstrates the "Small Sample Trap" (Anecdote vs Data)
 * Phase 1: User sees 1 vivid bad review for a 4.8 star product
 * Phase 2: User makes decision (likely influenced by anecdote)
 * Phase 3: Zoom out to see the 5000 good reviews
 */
export default function ReviewRoulette() {
    const [phase, setPhase] = useState<"browsing" | "decision" | "reveal">("browsing");
    const [decision, setDecision] = useState<"buy" | "pass" | null>(null);

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            {/* Simulation Header */}
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <ShoppingCart size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Review Roulette
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8 min-h-[450px] flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">

                <AnimatePresence mode="wait">
                    {phase === "browsing" && (
                        <motion.div
                            key="browsing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            {/* Product Card */}
                            <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <div className="text-6xl">🎧</div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-black text-ink-900">UltraBase 5000</h3>
                                        <p className="text-ink-500 text-sm">Noise Cancelling Headphones</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex text-yellow-400 gap-0.5">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                        </div>
                                        <span className="text-xs font-bold text-ink-400">4.8 (5,240 Reviews)</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        onClick={() => setPhase("decision")}
                                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                                    >
                                        <Search size={18} />
                                        Read Reviews
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {phase === "decision" && (
                        <motion.div
                            key="decision"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="w-full max-w-sm"
                        >
                            {/* The Bad Review (Anecdote) */}
                            <div className="bg-white rounded-2xl border-2 border-red-100 shadow-xl p-6 mb-8 relative">
                                <div className="absolute -top-3 -left-3 bg-red-500 text-white p-2 rounded-full shadow-lg">
                                    <ThumbsDown size={20} />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-ink-900">AngryDave82</div>
                                        <div className="flex text-slate-200 gap-0.5 text-xs">
                                            <Star size={12} className="text-red-400 fill-red-400" />
                                            <Star size={12} />
                                            <Star size={12} />
                                            <Star size={12} />
                                            <Star size={12} />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-ink-700 font-medium italic">
                                    "GARBAGE! I bought these and they broke after ONE day! The plastic snapped when I put them on. Do not buy! Worst purchase ever!!"
                                </p>
                            </div>

                            <div className="text-center">
                                <h4 className="text-lg font-black text-ink-900 mb-4">Would you buy these?</h4>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setDecision("pass"); setPhase("reveal"); }}
                                        className="flex-1 py-4 bg-red-50 text-red-600 border-2 border-red-100 rounded-2xl font-bold hover:bg-red-100 transition-colors"
                                    >
                                        Pass 🚫
                                    </button>
                                    <button
                                        onClick={() => { setDecision("buy"); setPhase("reveal"); }}
                                        className="flex-1 py-4 bg-emerald-50 text-emerald-600 border-2 border-emerald-100 rounded-2xl font-bold hover:bg-emerald-100 transition-colors"
                                    >
                                        Buy ✅
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {phase === "reveal" && (
                        <motion.div
                            key="reveal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            {/* The Data Reality */}
                            <div className="absolute inset-0 bg-emerald-50 opacity-20" />

                            {/* Background Dots */}
                            <div className="absolute inset-x-0 top-10 bottom-32 flex flex-wrap justify-center overflow-hidden gap-1 opacity-20 pointer-events-none p-4">
                                {Array.from({ length: 400 }).map((_, i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-emerald-500" />
                                ))}
                                {/* The one red dot */}
                                <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-red-500 shadow-lg z-10 animate-pulse" />
                            </div>

                            <div className="relative z-20 text-center max-w-md p-6">
                                <div className="inline-block bg-white p-4 rounded-full shadow-xl mb-6">
                                    {decision === "pass" ? (
                                        <span className="text-4xl">😱</span>
                                    ) : (
                                        <span className="text-4xl">🧠</span>
                                    )}
                                </div>

                                <h3 className="text-3xl font-black text-ink-900 mb-2">
                                    {decision === "pass" ? "The Burger Fallacy!" : "Smart Choice!"}
                                </h3>

                                <p className="text-ink-600 text-lg mb-8 leading-relaxed">
                                    {decision === "pass"
                                        ? "You let ONE angry person (Dave) outweigh 5,240 happy customers. That's the Small Sample Trap."
                                        : "You ignored the anecdote and trusted the data. Dave was just unlucky (or rough)."}
                                </p>

                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-border text-left flex items-start gap-4">
                                    <Quote className="text-primary shrink-0" size={32} />
                                    <div>
                                        <p className="font-bold text-ink-900 italic mb-2">
                                            "The plural of anecdote is not data."
                                        </p>
                                        <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                                            — Frank Kotsonis (attrib.)
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setPhase("browsing"); setDecision(null); }}
                                    className="mt-8 text-sm font-bold text-ink-400 hover:text-primary transition-colors hover:underline"
                                >
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
