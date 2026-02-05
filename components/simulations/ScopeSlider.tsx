"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Users, Globe2, ScanFace, Activity } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * ScopeSlider Simulation
 * Demonstrates "The Frog in the Well" effect
 * 0: Individual (You)
 * 50: Community (100 people)
 * 100: Nation (10,000 people heatmap)
 */
export default function ScopeSlider() {
    const [sliderValue, setSliderValue] = useState(0);
    const [virusActive, setVirusActive] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Derived view state
    const view = sliderValue < 33 ? "individual" : sliderValue < 66 ? "community" : "nation";

    // Handle Virus toggle
    const toggleVirus = () => setVirusActive(!virusActive);

    // Canvas rendering for Nation view (Performance critical)
    useEffect(() => {
        if (view !== "nation" || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set high DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Clear
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw 10,000 points (100x100 grid generally fits well)
        const cols = 100;
        const rows = 100;
        const cellW = rect.width / cols;
        const cellH = rect.height / rows;

        for (let i = 0; i < 10000; i++) {
            const x = (i % cols) * cellW;
            const y = Math.floor(i / cols) * cellH;

            // Virus logic: clustered spread if active
            const isInfected = virusActive && (
                // Create a cluster around center-ish
                (Math.abs((i % cols) - 50) < 15 && Math.abs(Math.floor(i / cols) - 50) < 15) ||
                // And random scattered cases
                Math.random() > 0.995
            );

            ctx.fillStyle = isInfected ? "#EF4444" : "#E2E8F0"; // Red or Slate-200

            // Draw slightly smaller than cell for gap
            if (isInfected) {
                // Draw infected dots larger
                ctx.beginPath();
                ctx.arc(x + cellW / 2, y + cellH / 2, 1.5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Background population as noise
                ctx.fillRect(x, y, cellW - 0.5, cellH - 0.5);
            }
        }

    }, [view, virusActive]); // Re-render when view or virus state changes

    return (
        <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            {/* Header */}
            <div className="bg-surface-raised border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                        <Globe2 size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Scope Slider
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink-400">Simulation Control:</span>
                    <button
                        onClick={toggleVirus}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-black uppercase transition-all flex items-center gap-1",
                            virusActive
                                ? "bg-red-500 text-white shadow-md hover:bg-red-600"
                                : "bg-surface-raised text-ink-500 hover:bg-surface-raised/80 border border-border"
                        )}
                    >
                        <Activity size={12} />
                        {virusActive ? "Virus Spreading" : "Start Virus"}
                    </button>
                </div>
            </div>

            {/* Main Viewport */}
            <div className="relative h-[400px] bg-surface-sunken flex flex-col items-center justify-center overflow-hidden">

                {/* View: Individual */}
                {view === "individual" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <div className={cn(
                            "w-32 h-32 rounded-full flex items-center justify-center shadow-xl mb-4 transition-colors duration-500",
                            virusActive ? "bg-slate-100" : "bg-white" // You stay healthy initially in the example
                        )}>
                            <User size={64} className="text-primary" />
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-border inline-block">
                            <span className="font-bold text-ink-900">Status: </span>
                            <span className="text-emerald-500 font-bold">Healthy</span>
                        </div>
                        <p className="mt-4 text-ink-400 text-sm max-w-xs">
                            "I feel fine. My neighbors are fine. There is no problem."
                        </p>
                    </motion.div>
                )}

                {/* View: Community */}
                {view === "community" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-8 w-full max-w-md"
                    >
                        <div className="grid grid-cols-10 gap-2 mb-6">
                            {Array.from({ length: 100 }).map((_, i) => {
                                // 2 sick people in community view
                                const isSick = virusActive && (i === 42 || i === 87);
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.002 }}
                                        className={cn(
                                            "w-full pt-[100%] rounded-md relative",
                                            isSick ? "bg-red-500" : "bg-white border border-slate-100"
                                        )}
                                    />
                                );
                            })}
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
                                <Users size={16} className="text-ink-400" />
                                <span className="font-bold text-ink-900">Community (100)</span>
                            </div>
                            <p className="mt-2 text-ink-400 text-sm">
                                {virusActive
                                    ? "Wait... Mrs. Johnson is sick? That's weird."
                                    : "Everyone looks mostly normal."}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* View: Nation */}
                <div className={cn(
                    "absolute inset-0 w-full h-full",
                    view === "nation" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}>
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-border text-center">
                        <div className="font-black text-lg text-ink-900">National Scale</div>
                        <div className="text-xs font-bold text-ink-500">10,000 Data Points</div>
                        {virusActive && (
                            <div className="mt-2 text-red-600 font-bold bg-red-50 px-2 py-1 rounded-lg text-xs animate-pulse">
                                ⚠ OUTBREAK DETECTED
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Slider Controls */}
            <div className="bg-surface p-6 border-t border-border">
                <div className="relative h-12 flex items-center">
                    {/* Track */}
                    <div className="absolute inset-x-0 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-indigo-400 transition-all duration-300"
                            style={{ width: `${sliderValue}%` }}
                        />
                    </div>

                    {/* Input */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                    />

                    {/* Thumb visual */}
                    <div
                        className="absolute w-8 h-8 bg-white border-4 border-primary rounded-full shadow-lg pointer-events-none transition-all duration-75 flex items-center justify-center transform -translate-x-1/2"
                        style={{ left: `${sliderValue}%` }}
                    >
                        <ScanFace size={14} className="text-primary" />
                    </div>
                </div>

                <div className="flex justify-between text-xs font-bold text-ink-300 mt-2 uppercase tracking-tight">
                    <span className={sliderValue < 33 ? "text-primary" : ""}>Me</span>
                    <span className={sliderValue >= 33 && sliderValue < 66 ? "text-primary" : ""}>Community</span>
                    <span className={sliderValue >= 66 ? "text-primary" : ""}>Nation</span>
                </div>
            </div>
        </div>
    );
}
