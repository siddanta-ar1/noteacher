"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Play, Target, Repeat } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * DeterministicSystemSim - The Perfect Machine
 * Same Input = Same Output. Always.
 * User launches a projectile with fixed physics.
 */
export default function DeterministicSystemSim() {
    const [force, setForce] = useState(10);
    const [angle, setAngle] = useState(45);
    const [history, setHistory] = useState<{ x: number, y: number }[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [launchCount, setLaunchCount] = useState(0);

    // Physics constants
    const g = 9.8;

    // Calculate path points
    const calculatePath = (f: number, a: number) => {
        const rad = (a * Math.PI) / 180;
        const v0 = f * 1.5; // Scale for visual
        const vx = v0 * Math.cos(rad);
        const vy = v0 * Math.sin(rad);

        const flightTime = (2 * vy) / g;
        const points = [];

        for (let t = 0; t <= flightTime; t += 0.1) {
            const x = vx * t;
            const y = (vy * t) - (0.5 * g * t * t);
            points.push({ x: x * 5, y: y * 5 }); // Scale pixels
        }
        // Add final point at y=0
        const range = vx * flightTime;
        points.push({ x: range * 5, y: 0 });

        return points;
    };

    const handleLaunch = async () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setLaunchCount(c => c + 1);

        const path = calculatePath(force, angle);

        // Animate simply by setting path and letting CSS/Framer handle it or step through
        // For a trace effect, we'll just show the final path in history

        await new Promise(r => setTimeout(r, 1000)); // Fake animation time

        setHistory(prev => [...prev, path[path.length - 1]]); // Store landing spot
        setIsAnimating(false);
    };

    const reset = () => {
        setHistory([]);
        setLaunchCount(0);
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Settings size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Perfect Machine
                    </span>
                </div>
                <div className="text-xs font-bold text-ink-400">
                    Launches: {launchCount}
                </div>
            </div>

            <div className="p-6">

                {/* Visual Area */}
                <div className="relative h-64 w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 border-4 border-slate-700 shadow-inner">
                    <div className="absolute bottom-0 left-0 w-full h-8 bg-emerald-500/20 border-t border-emerald-500/30" />

                    {/* Cannon */}
                    <div className="absolute bottom-8 left-4 w-8 h-8 flex items-center justify-center">
                        <div
                            className="w-16 h-4 bg-slate-400 rounded-full origin-left absolute left-2"
                            style={{ transform: `rotate(-${angle}deg)` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-6 bg-slate-300 rounded-r-sm border-l-2 border-slate-500" />
                        </div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full relative z-10 border-2 border-white" />
                    </div>

                    {/* Historical Landing Spots */}
                    {history.map((pt, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute bottom-8 w-3 h-3 bg-yellow-400 rounded-full border border-white shadow-lg z-10"
                            style={{ left: `calc(1rem + ${pt.x}px)` }} // Offset from cannon start
                        />
                    ))}

                    {/* Active Projectile */}
                    {isAnimating && (
                        <Projectile
                            path={calculatePath(force, angle)}
                        />
                    )}

                    {/* Target Marker (50m) */}
                    {/* For this specific scenario where user expects 50m result, we hardcode visuals or relying on math */}
                </div>

                {/* Controls */}
                <div className="flex gap-6 items-end">
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-ink-500 mb-1">
                                <span>Force</span>
                                <span>{force}N</span>
                            </div>
                            <input
                                type="range" min="5" max="20" step="1"
                                value={force} onChange={(e) => setForce(Number(e.target.value))}
                                disabled={isAnimating}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold text-ink-500 mb-1">
                                <span>Angle</span>
                                <span>{angle}°</span>
                            </div>
                            <input
                                type="range" min="0" max="90" step="1"
                                value={angle} onChange={(e) => setAngle(Number(e.target.value))}
                                disabled={isAnimating}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleLaunch}
                            disabled={isAnimating}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center gap-2"
                        >
                            {isAnimating ? "Launching..." : <><Play size={16} fill="currentColor" /> Launch Ball</>}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {history.length > 2 && history.every(h => h.x === history[0].x) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center"
                        >
                            <p className="font-bold text-emerald-800 text-sm">
                                Notice the pattern?
                            </p>
                            <p className="text-emerald-700 text-xs mt-1">
                                Every launch lands on the EXACT same pixel. In a deterministic world, identical inputs guarantee identical outputs.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function Projectile({ path }: { path: { x: number, y: number }[] }) {
    // Animate along path
    // Simplified: Just use framer motion animation along keyframes
    const x = path.map(p => `calc(1rem + ${p.x}px)`);
    const y = path.map(p => `${-p.y}px`); // Negative because HTML coords

    return (
        <motion.div
            className="absolute bottom-8 w-4 h-4 bg-white rounded-full border-2 border-blue-500 z-20"
            initial={{ left: x[0], y: y[0] }}
            animate={{
                left: x,
                y: y,
            }}
            transition={{ duration: 1, ease: "linear" }}
        />
    );
}
