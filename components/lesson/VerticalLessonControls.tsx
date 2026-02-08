"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Sparkles,
    Gauge,
    MoreVertical,
    X
} from "lucide-react";

type VerticalLessonControlsProps = {
    isReading: boolean;
    onToggleRead: () => void;
    playbackRate: number;
    onRateChange: (rate: number) => void;
    onOpenAI: () => void;
};

export default function VerticalLessonControls({
    isReading,
    onToggleRead,
    playbackRate,
    onRateChange,
    onOpenAI,
}: VerticalLessonControlsProps) {
    const [showSpeed, setShowSpeed] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 10 },
        visible: { opacity: 1, x: 0 }
    };

    const rates = [0.75, 1, 1.25, 1.5, 2];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="fixed top-24 right-4 md:right-8 z-40 flex flex-col gap-4 items-end"
        >
            {/* 1. AI READER CONTROL GROUP */}
            <motion.div
                variants={itemVariants}
                className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-2 flex flex-col items-center gap-3"
            >
                {/* Play/Pause Toggle */}
                <button
                    onClick={onToggleRead}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isReading
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/30"
                        : "bg-surface-raised text-ink-400 hover:bg-surface-sunken"
                        }`}
                    title={isReading ? "Pause Reading" : "Start Reading"}
                >
                    {isReading ? (
                        <Pause size={20} fill="currentColor" />
                    ) : (
                        <Play size={20} fill="currentColor" className="ml-1" />
                    )}
                </button>

                {/* Speed Control */}
                <div className="relative">
                    <button
                        onClick={() => setShowSpeed(!showSpeed)}
                        className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-xs font-black text-ink-600 hover:bg-surface-raised transition-colors"
                        title="Playback Speed"
                    >
                        {playbackRate}x
                    </button>

                    <AnimatePresence>
                        {showSpeed && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-white rounded-xl p-1.5 shadow-xl border border-border flex gap-1"
                            >
                                {rates.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => {
                                            onRateChange(r);
                                            setShowSpeed(false);
                                        }}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center ${playbackRate === r
                                            ? "bg-indigo-600 text-white"
                                            : "text-ink-500 hover:bg-surface-sunken"
                                            }`}
                                    >
                                        {r}x
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* 2. ASK AI BUTTON */}
            <motion.div variants={itemVariants}>
                <button
                    onClick={onOpenAI}
                    className="group relative flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
                    <div className="relative w-14 h-14 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg text-white group-hover:scale-105 transition-transform duration-300">
                        <Sparkles size={24} />
                    </div>
                    <span className="absolute right-full mr-3 bg-navy text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Ask AI
                    </span>
                </button>
            </motion.div>
        </motion.div>
    );
}
