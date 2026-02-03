"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ZoomIn, Calculator, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * CrowdEstimator - Room vs Stadium
 * Demonstrates how intuition works for N=5 but fails for N=10,000
 */
export default function CrowdEstimator() {
    const [level, setLevel] = useState<1 | 2>(1);
    const [guess, setGuess] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [sampledMean, setSampledMean] = useState<number | null>(null);

    // Dataset for level 2
    const DATA_COUNT = 5000;
    const [heights, setHeights] = useState<number[]>([]);
    const [trueMean, setTrueMean] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize dataset
    useEffect(() => {
        // Generate heights: Normal distribution centered at 170cm, SD=10
        const data = Array.from({ length: DATA_COUNT }, () => {
            const u = 1 - Math.random();
            const v = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            return 170 + z * 10;
        });
        setHeights(data);
        setTrueMean(data.reduce((a, b) => a + b, 0) / data.length);
    }, []);

    // Draw Level 2 (Stadium)
    useEffect(() => {
        if (level === 2 && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return;

            const width = canvasRef.current.width = canvasRef.current.offsetParent?.clientWidth || 300;
            const height = canvasRef.current.height = 300;

            ctx.clearRect(0, 0, width, height);

            // Draw thousands of tiny dots
            heights.forEach((h, i) => {
                const x = Math.random() * width;
                const y = Math.random() * height;

                // Color varies slightly by height to visual hint
                const opacity = 0.3 + (Math.random() * 0.4);
                ctx.fillStyle = `rgba(30, 41, 59, ${opacity})`;
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }, [level, heights]);

    const handleSample = () => {
        // Sample random 100 people
        const sample = [];
        for (let i = 0; i < 100; i++) {
            sample.push(heights[Math.floor(Math.random() * heights.length)]);
        }
        const mean = sample.reduce((a, b) => a + b, 0) / sample.length;
        setSampledMean(mean);
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            {/* Header */}
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Users size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        Crowd Estimator
                    </span>
                </div>
                <div className="flex gap-2 text-xs font-bold">
                    <button
                        onClick={() => { setLevel(1); setShowResult(false); setGuess(""); setSampledMean(null); }}
                        className={cn("px-3 py-1 rounded-full transition-colors", level === 1 ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600")}
                    >
                        Level 1: The Room
                    </button>
                    <button
                        onClick={() => { setLevel(2); setShowResult(false); setGuess(""); setSampledMean(null); }}
                        className={cn("px-3 py-1 rounded-full transition-colors", level === 2 ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600")}
                    >
                        Level 2: The Stadium
                    </button>
                </div>
            </div>

            <div className="p-8 min-h-[400px] flex flex-col items-center">

                {level === 1 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-lg text-center"
                    >
                        <h3 className="font-bold text-ink-900 mb-8 text-xl">Guess the average height</h3>

                        {/* 5 People Visualization */}
                        <div className="flex items-end justify-center gap-8 h-40 border-b border-slate-200 mb-8 pb-2">
                            {[170, 165, 180, 172, 168].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="bg-slate-900 w-8 rounded-t-lg relative group" style={{ height: `${(h - 100) * 2}px` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h}cm
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center gap-4">
                            <input
                                type="number"
                                placeholder="? cm"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                className="w-24 p-3 rounded-xl border-2 border-border text-center font-bold text-lg focus:border-emerald-500 outline-none"
                            />
                            <button
                                onClick={() => setShowResult(true)}
                                className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-600 transition-colors"
                            >
                                Check
                            </button>
                        </div>

                        {showResult && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 text-emerald-700 font-medium"
                            >
                                Correct! The average is 171cm. <br />
                                <span className="text-sm opacity-70">Your brain easily calculated N=5.</span>
                            </motion.p>
                        )}

                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full relative"
                    >
                        <h3 className="font-bold text-ink-900 mb-4 text-center text-xl">
                            Now... Guess the average height of 5,000 people.
                        </h3>

                        {/* Stadium Canvas */}
                        <div className="relative h-[300px] w-full bg-slate-50 rounded-2xl overflow-hidden mb-6 border border-slate-200 shadow-inner">
                            <canvas ref={canvasRef} className="w-full h-full opacity-60" />

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest border border-white">
                                    N = 5,000 Data Points
                                </p>
                            </div>

                            {sampledMean && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]"
                                >
                                    <div className="bg-white p-6 rounded-2xl shadow-2xl text-center border-2 border-emerald-400">
                                        <div className="text-3xl font-black text-emerald-600 mb-1">
                                            {sampledMean.toFixed(1)} cm
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 uppercase">
                                            Calculated from Sample (N=100)
                                        </div>
                                        <div className="mt-4 text-xs text-slate-500">
                                            True Population Mean: {trueMean.toFixed(1)} cm
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex justify-center flex-col items-center gap-4">
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="? cm"
                                    className="w-32 p-3 rounded-xl border-2 border-border text-center font-bold text-lg disabled:opacity-50"
                                    disabled
                                />
                                <div className="text-sm text-red-400 flex items-center font-bold">
                                    Impossible to guess by eye!
                                </div>
                            </div>

                            <button
                                onClick={handleSample}
                                className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                            >
                                <Calculator size={20} />
                                Use Statistics Tool
                                <ArrowRight size={16} />
                            </button>
                            <p className="text-xs text-slate-400 font-medium">
                                Takes a random sample (N=100) and computes the mean instantly.
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
