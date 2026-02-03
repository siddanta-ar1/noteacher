"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, DollarSign, ArrowRight, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * AnchoringSim - The Price Guess Game
 * Demonstrates Anchoring Bias by exposing user to a high or low number before asking for a price estimate.
 */
export default function AnchoringSim() {
    const [step, setStep] = useState<"anchor" | "guess" | "result">("anchor");
    const [anchorType, setAnchorType] = useState<"low" | "high">("low"); // Randomized in real app, but we can let user unknowingly pick via "Scenario A/B" or just random on mount. 
    // Let's randomize on mount for better effect, or just let user run twice?
    // User requested: "Group A/B". We can simulate this by randomly assigning the user to a group on start.

    // Actually, to make it pedagogical, let's let them experience ONE path vs the OTHER to see the contrast.
    // Or simpler: Just Pick Scenario A or Scenario B.

    const [userEstimate, setUserEstimate] = useState(50);

    // Hardcode: Scenario A = Low Anchor ($5). Scenario B = High Anchor ($500).
    const [currentAnchor, setCurrentAnchor] = useState(5);

    const startScenario = (type: "low" | "high") => {
        setAnchorType(type);
        setCurrentAnchor(type === "low" ? 5 : 500);
        setStep("anchor");
        setUserEstimate(type === "low" ? 20 : 100); // Reset slider to somewhat neutral but influenced range? Or just 50.
    };

    const handleAnchorResponse = () => {
        setStep("guess");
    };

    const submitGuess = () => {
        setStep("result");
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Tag size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Price Guess Game
                    </span>
                </div>
            </div>

            <div className="p-8">
                {step === "anchor" && (
                    <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
                        <div className="w-48 h-48 bg-slate-100 mx-auto rounded-xl flex items-center justify-center text-6xl shadow-inner border border-slate-200">
                            👕
                        </div>
                        <h3 className="text-xl font-bold text-ink-900">
                            Is this designer T-Shirt worth <br />
                            <span className={cn("text-2xl font-black", anchorType === "low" ? "text-blue-600" : "text-purple-600")}>
                                MORE or LESS than ${currentAnchor}?
                            </span>
                        </h3>
                        <div className="flex gap-4 justify-center">
                            <button onClick={handleAnchorResponse} className="px-6 py-2 rounded-xl border border-border hover:bg-slate-50 font-bold text-ink-600">
                                Less
                            </button>
                            <button onClick={handleAnchorResponse} className="px-6 py-2 rounded-xl border border-border hover:bg-slate-50 font-bold text-ink-600">
                                More
                            </button>
                        </div>
                        {/* Hidden buttons to switch scenario for demo purposes if needed, but for now we default to random or select */}
                        <div className="pt-8 border-t border-dashed border-slate-200 mt-8">
                            <p className="text-[10px] text-ink-400 mb-2 uppercase font-bold">Try different mindsets:</p>
                            <div className="flex justify-center gap-2">
                                <button onClick={() => startScenario("low")} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Scenario A ($5)</button>
                                <button onClick={() => startScenario("high")} className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full">Scenario B ($500)</button>
                            </div>
                        </div>
                    </div>
                )}

                {step === "guess" && (
                    <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
                        <div className="w-24 h-24 bg-slate-100 mx-auto rounded-xl flex items-center justify-center text-4xl shadow-sm border border-slate-200">
                            👕
                        </div>
                        <h3 className="text-xl font-bold text-ink-900">
                            Okay, then what is the <span className="underline decoration-indigo-300">exact price</span>?
                        </h3>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <div className="text-4xl font-black text-indigo-600 mb-4 flex justify-center items-start">
                                <span className="text-xl pt-1">$</span>{userEstimate}
                            </div>
                            <input
                                type="range"
                                min="0" max="1000"
                                value={userEstimate}
                                onChange={(e) => setUserEstimate(Number(e.target.value))}
                                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-ink-400 font-bold mt-2">
                                <span>$0</span>
                                <span>$1000</span>
                            </div>
                        </div>

                        <button
                            onClick={submitGuess}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                        >
                            Lock in Price <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {step === "result" && (
                    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">

                            {/* User Result */}
                            <div className="text-center">
                                <span className="text-xs font-bold text-ink-400 uppercase block mb-1">Your Anchored Guess</span>
                                <div className={cn(
                                    "text-5xl font-black transition-all",
                                    anchorType === "low" ? "text-blue-600" : "text-purple-600"
                                )}>
                                    ${userEstimate}
                                </div>
                                <div className="text-xs font-bold bg-slate-100 text-slate-500 py-1 px-3 rounded-full mt-2 inline-block">
                                    Anchor was ${currentAnchor}
                                </div>
                            </div>

                        </div>

                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                            <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                <AlertTriangle size={16} /> The Anchoring Effect
                            </h4>
                            <p className="text-sm text-amber-800 leading-relaxed mb-4">
                                Did you notice?
                                {anchorType === "low"
                                    ? " Asking if it was '$5' dragged your estimate DOWN. You likely guessed closer to $20-$40."
                                    : " Asking if it was '$500' dragged your estimate UP. You likely guessed closer to $100+."
                                }
                            </p>
                            <p className="text-sm text-ink-600">
                                <strong>Rule:</strong> The first number you hear (the Anchor) sets the statistical range for your brain, even if that number is irrelevant.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <button // Reset to try other anchor
                                onClick={() => startScenario(anchorType === "low" ? "high" : "low")}
                                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                                Try the OTHER Anchor
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
