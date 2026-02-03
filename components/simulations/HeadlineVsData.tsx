"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Palmtree, UserX } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * HeadlineVsData - The Availability Heuristic
 * User chooses between "Shark Attack" (Scary/Available) vs "Falling Coconut" (Boring).
 * Reveals that the "boring" option is statistically deadlier.
 */
export default function HeadlineVsData() {
    const [choice, setChoice] = useState<"shark" | "coconut" | null>(null);
    const [showResults, setShowResults] = useState(false);

    const handleChoice = (c: "shark" | "coconut") => {
        setChoice(c);
        setTimeout(() => setShowResults(true), 500);
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                        <AlertTriangle size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        Headline vs. Data
                    </span>
                </div>
            </div>

            <div className="p-8">

                {!showResults ? (
                    <div className="text-center space-y-8">
                        <h3 className="text-2xl font-black text-ink-900">
                            Which kills more people per year?
                        </h3>

                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <button
                                onClick={() => handleChoice("shark")}
                                className="group relative w-full md:w-64 h-64 bg-blue-900 rounded-3xl overflow-hidden hover:scale-105 transition-transform shadow-xl"
                            >
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560275619-4662e36bfed4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-6 left-0 w-full text-center">
                                    <span className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-lg">Shark</span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleChoice("coconut")}
                                className="group relative w-full md:w-64 h-64 bg-amber-100 rounded-3xl overflow-hidden hover:scale-105 transition-transform shadow-xl"
                            >
                                <div className="absolute inset-0 flex items-center justify-center text-[80px]">
                                    🥥
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent" />
                                <div className="absolute bottom-6 left-0 w-full text-center">
                                    <span className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-lg">Coconut</span>
                                </div>
                            </button>
                        </div>
                        <p className="text-sm text-ink-500 font-bold uppercase tracking-widest">
                            Trust your gut. Click one.
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">

                            {/* Shark Stats */}
                            <div className={cn(
                                "flex flex-col items-center p-6 rounded-2xl border-2 w-full md:w-64 transition-all",
                                choice === "shark" ? "border-red-500 bg-red-50 opacity-100" : "border-slate-100 opacity-50 grayscale"
                            )}>
                                <span className="text-4xl mb-2">🦈</span>
                                <div className="text-3xl font-black text-ink-900 mb-1">~10</div>
                                <div className="text-xs font-bold text-ink-400 uppercase">Deaths / Year</div>
                            </div>

                            <div className="text-2xl font-black text-slate-300">VS</div>

                            {/* Coconut Stats */}
                            <div className={cn(
                                "flex flex-col items-center p-6 rounded-2xl border-2 w-full md:w-64 transition-all",
                                choice === "coconut" ? "border-green-500 bg-green-50" : (choice === "shark" ? "border-green-500 bg-green-50 scale-110 shadow-xl" : "")
                            )}>
                                <span className="text-4xl mb-2">🥥</span>
                                <div className="text-3xl font-black text-emerald-600 mb-1">~150</div>
                                <div className="text-xs font-bold text-emerald-700 uppercase">Deaths / Year</div>
                            </div>
                        </div>

                        <div className="bg-slate-100 p-6 rounded-2xl max-w-2xl mx-auto text-center border-l-4 border-blue-500">
                            <h4 className="font-bold text-ink-900 mb-2">
                                {choice === "shark" ? "Your brain lied to you." : "You are a rare statistician!"}
                            </h4>
                            <p className="text-sm text-ink-600 leading-relaxed">
                                {choice === "shark"
                                    ? "You chose Sharks because they are scary and easy to remember (availability). You ignored Coconuts because they are boring. But statistically, gravity kills more people than jaws."
                                    : "You ignored the 'scary' option and chose the statistically higher risk. Most people fail this because their brains prioritize dramatic memories (like Jaws) over boring facts."
                                }
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => { setShowResults(false); setChoice(null); }}
                                className="text-sm font-bold text-ink-400 hover:text-ink-600 underline"
                            >
                                Try Again
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
