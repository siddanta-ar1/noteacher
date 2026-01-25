"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import type { AIInsightBlock } from "@/types/content";

interface AISummaryBlockProps {
    block: AIInsightBlock;
    nodeId?: string;
    sectionIndex: number;
}

/**
 * AISummaryBlock - AI-generated summary with context-aware insights
 * Fetches from API or cache, shows loading states
 */
export default function AISummaryBlock({
    block,
    nodeId,
    sectionIndex,
}: AISummaryBlockProps) {
    const { showSummary = true, showSimulation = false, prompt, context } = block;
    const [summary, setSummary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);

    // Auto-fetch summary on mount
    useEffect(() => {
        if (showSummary && !summary) {
            fetchSummary();
        }
    }, [showSummary]);

    const fetchSummary = async () => {
        if (!nodeId) {
            setSummary("Enable AI summaries by connecting to your content.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nodeId,
                    sectionIndex,
                    customPrompt: prompt,
                    context,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate summary");
            }

            const data = await response.json();
            setSummary(data.summary);
        } catch (err) {
            console.error("AI Summary error:", err);
            setError("Unable to generate summary. Try again later.");
            // Fallback text
            setSummary(
                "This section covers key concepts that will help you understand the fundamentals better. Take your time to absorb the material."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!showSummary) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-[2rem] border border-violet-200 overflow-hidden"
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                            AI Insight
                        </p>
                        <p className="text-sm text-violet-400">
                            Section summary & key points
                        </p>
                    </div>
                </div>
                <div className="text-violet-400">
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </div>
            </button>

            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6">
                            {isLoading ? (
                                <div className="flex items-center gap-3 py-4">
                                    <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                                    <p className="text-violet-600 text-sm">
                                        Generating insights...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-between py-4">
                                    <p className="text-red-500 text-sm">{error}</p>
                                    <button
                                        onClick={fetchSummary}
                                        className="flex items-center gap-2 text-violet-600 hover:text-violet-700 text-sm font-bold"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-violet-800 leading-relaxed">{summary}</p>

                                    {/* Simulation prompt if enabled */}
                                    {showSimulation && (
                                        <div className="bg-white/70 rounded-xl p-4 border border-violet-200">
                                            <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-2">
                                                Practice Exercise
                                            </p>
                                            <p className="text-sm text-violet-700">
                                                Try applying these concepts in the interactive simulation above.
                                            </p>
                                        </div>
                                    )}

                                    {/* Regenerate button */}
                                    <button
                                        onClick={fetchSummary}
                                        className="flex items-center gap-2 text-violet-400 hover:text-violet-600 text-xs font-bold transition-colors"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        Regenerate
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
