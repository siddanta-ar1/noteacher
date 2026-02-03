"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, Sun, IceCream, Info, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui";

export default function TheBanButton() {
    const [isBanned, setIsBanned] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const [month, setMonth] = useState(0);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Data Model: Both peak in Summer (Index 5,6,7)
    // Shark Attacks: 5, 5, 10, 20, 45, 80, 90, 85, 50, 20, 10, 5
    // Ice Cream: 10, 15, 20, 40, 60, 95, 100, 90, 60, 30, 20, 15
    const getValues = (m: number) => {
        // Simple bell curve peak at June/July
        const peak = 6;
        const dist = Math.abs(m - peak);
        const shark = Math.max(5, 100 - (dist * 15 * 1.5));

        // Ice cream drops to 0 if banned
        const iceCream = isBanned ? 0 : Math.max(10, 100 - (dist * 15));

        return { shark, iceCream };
    };

    const currentValues = getValues(month);

    const handleNextMonth = () => {
        setMonth((prev) => (prev + 1) % 12);
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-border shadow-xl overflow-hidden font-sans">

            {/* Header */}
            <div className="bg-slate-50 p-4 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Badge variant="danger" className="bg-red-100 text-red-700 border-red-200">
                        Simulation
                    </Badge>
                    <span className="font-bold text-ink-900 tracking-wide text-sm">The Ban Button</span>
                </div>
                <div className="font-mono font-bold text-slate-400">
                    {months[month]}
                </div>
            </div>

            {/* Main Area */}
            <div className="p-8 flex flex-col items-center gap-8 relative overflow-hidden">

                {/* Visualization */}
                <div className="flex items-end justify-center gap-12 h-64 w-full relative z-10">

                    {/* Ice Cream Bar */}
                    <div className="flex flex-col items-center gap-2 w-24 group">
                        <span className="font-bold text-pink-500">{Math.round(currentValues.iceCream)}%</span>
                        <div className="w-full bg-pink-100 rounded-t-2xl relative overflow-hidden h-48 border-b-0 border-2 border-pink-200">
                            <motion.div
                                animate={{ height: `${currentValues.iceCream}%` }}
                                className="absolute bottom-0 w-full bg-pink-400 rounded-t-lg transition-all"
                            />
                            {isBanned && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10">
                                    <Ban className="text-red-600 w-12 h-12 opacity-80" />
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <IceCream size={14} /> Ice Cream
                        </span>
                    </div>

                    {/* Shark Bar */}
                    <div className="flex flex-col items-center gap-2 w-24">
                        <span className="font-bold text-blue-600">{Math.round(currentValues.shark)}%</span>
                        <div className="w-full bg-blue-100 rounded-t-2xl relative overflow-hidden h-48 border-b-0 border-2 border-blue-200">
                            <motion.div
                                animate={{ height: `${currentValues.shark}%` }}
                                className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg"
                            />
                        </div>
                        <span className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            🦈 Attacks
                        </span>
                    </div>

                </div>

                {/* Summer Heat Reveal */}
                <AnimatePresence>
                    {revealed && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: -50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none"
                        >
                            <div className="bg-orange-400 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                                <Sun className="animate-spin-slow" />
                                The Hidden Variable: Summer Heat
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <div className="flex flex-col items-center gap-4 w-full z-20">
                    <p className="text-center text-sm text-slate-600 max-w-sm">
                        Shark attacks are rising! Data shows Ice Cream sales are also rising.
                        Maybe Ice Cream attracts sharks?
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsBanned(!isBanned)}
                            className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${isBanned
                                    ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                    : "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30"
                                }`}
                        >
                            <Ban size={18} />
                            {isBanned ? "Lift Ban" : "Ban Ice Cream"}
                        </button>

                        <button
                            onClick={handleNextMonth}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Next Month
                        </button>
                    </div>

                    {!revealed && (
                        <button
                            onClick={() => setRevealed(true)}
                            className="text-xs text-slate-400 underline decoration-dashed hover:text-slate-600 mt-2"
                        >
                            Show me the truth
                        </button>
                    )}
                </div>

                {/* Info Box */}
                {isBanned && currentValues.shark > 50 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex gap-3 text-yellow-800 text-sm max-w-md"
                    >
                        <Info className="shrink-0 mt-0.5" size={18} />
                        <div>
                            <strong>Wait a minute...</strong>
                            <p>You banned Ice Cream (Sales = 0%), but Shark Attacks are still happening! This proves Ice Cream does not cause Shark Attacks.</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
