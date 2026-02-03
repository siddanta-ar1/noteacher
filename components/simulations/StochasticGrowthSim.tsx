"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Sun, Droplets, HelpCircle } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * StochasticGrowthSim - The Uncertain Garden
 * 10 Seeds. Same Input. Random Results.
 * Demonstrates hidden variables in biological/complex systems.
 */
export default function StochasticGrowthSim() {
    const [seeds, setSeeds] = useState<PlantState[]>([]);
    const [status, setStatus] = useState<"idle" | "growing" | "done">("idle");

    type PlantState = {
        id: number;
        finalHeight: number; // 0 (dead) to 100 (tall)
        health: "dead" | "stunted" | "healthy" | "thriving";
        delay: number;
    };

    const plantSeeds = () => {
        setStatus("growing");
        const newSeeds: PlantState[] = Array.from({ length: 10 }).map((_, i) => {
            // Random outcomes simulating hidden variables
            const rand = Math.random();
            let health: PlantState["health"];
            let height: number;

            if (rand < 0.2) { // 20% death rate (bad genetics/bacteria)
                health = "dead";
                height = 10;
            } else if (rand < 0.5) { // 30% stunted
                health = "stunted";
                height = 30 + Math.random() * 20;
            } else if (rand < 0.9) { // 40% healthy
                health = "healthy";
                height = 60 + Math.random() * 20;
            } else { // 10% super thriving
                health = "thriving";
                height = 90 + Math.random() * 10;
            }

            return {
                id: i,
                finalHeight: height,
                health,
                delay: i * 0.1
            };
        });
        setSeeds(newSeeds);

        setTimeout(() => {
            setStatus("done");
        }, 2000);
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <Sprout size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Uncertain Garden
                    </span>
                </div>
            </div>

            <div className="p-8">
                {/* Visualization Area */}
                <div className="relative h-48 border-b-4 border-[#8B5E3C] flex items-end justify-between px-4 mb-8 bg-sky-50 rounded-t-3xl overflow-hidden">
                    {/* Background Sun */}
                    <div className="absolute top-4 right-8 w-16 h-16 bg-yellow-300 rounded-full blur-lg opacity-50 animate-pulse" />

                    {/* Clouds */}
                    <motion.div
                        animate={{ x: [0, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 20 }}
                        className="absolute top-8 left-10 text-white/40"
                    >
                        ☁️
                    </motion.div>

                    {seeds.length > 0 ? seeds.map((seed) => (
                        <Plant key={seed.id} seed={seed} isGrowing={status === "growing"} />
                    )) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold opacity-50">
                            No seeds planted yet
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center">
                    <div className="flex gap-4 mb-6">
                        <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-xs font-bold border border-yellow-100 flex items-center gap-2">
                            <Sun size={14} /> 100% Sunlight (Fixed)
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-2">
                            <Droplets size={14} /> 100ml Water (Fixed)
                        </div>
                    </div>

                    <button
                        onClick={plantSeeds}
                        disabled={status === "growing"}
                        className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-50"
                    >
                        {status === "idle" ? "Plant 10 Seeds" : status === "growing" ? "Growing..." : "Plant New Batch"}
                    </button>

                    <AnimatePresence>
                        {status === "done" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center max-w-lg"
                            >
                                <div className="flex justify-center mb-2 text-slate-400"><HelpCircle /></div>
                                <h4 className="font-bold text-ink-900 mb-2">Wait, why did some die?</h4>
                                <p className="text-sm text-ink-600 leading-relaxed">
                                    You gave them the same light and water. <br />
                                    <strong>Hidden variables</strong> (genetics, soil bacteria, root depth) caused the uncertainty. In global systems, inputs do not guarantee outputs.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function Plant({ seed, isGrowing }: { seed: any, isGrowing: boolean }) {
    return (
        <div className="relative w-8 h-full flex items-end justify-center">
            {/* Plant Stalk */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${seed.finalHeight}%` }}
                transition={{ duration: 1.5, delay: seed.delay, ease: "easeOut" }}
                className={cn(
                    "w-2 rounded-t-full origin-bottom relative",
                    seed.health === "dead" ? "bg-amber-800" :
                        seed.health === "stunted" ? "bg-green-700" :
                            "bg-green-500"
                )}
            >
                {/* Leaves based on health */}
                {seed.health !== "dead" && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: seed.delay + 1 }}
                        className="absolute -top-3 -left-3 text-2xl"
                    >
                        {seed.health === "thriving" ? "🌿" : "🌱"}
                    </motion.div>
                )}
                {seed.health === "dead" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: seed.delay + 1 }}
                        className="absolute -top-4 -left-1 text-xs"
                    >
                        💀
                    </motion.div>
                )}
            </motion.div>

            {/* Soil mound */}
            <div className="absolute bottom-0 w-6 h-2 bg-[#6b4226] rounded-t-full" />
        </div>
    );
}
