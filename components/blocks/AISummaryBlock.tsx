"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, RefreshCw, X, FileText, ScrollText } from "lucide-react";
import type { AIInsightBlock } from "@/types/content";

interface AISummaryBlockProps {
    block: AIInsightBlock;
    nodeId?: string;
    sectionIndex: number;
}

/**
 * AISummaryBlock - AI-generated summary as a Floating Action Button (FAB)
 * Renders a floating button that opens a modal with the summary.
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
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Mount check for Portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-fetch summary when opened if not present
    useEffect(() => {
        if (isOpen && showSummary && !summary && !isLoading) {
            fetchSummary();
        }
    }, [isOpen, showSummary]);

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
            setSummary(
                "This section covers key concepts that will help you understand the fundamentals better. Take your time to absorb the material."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!showSummary || !mounted) {
        return null;
    }

    // Portal to document.body to ensure it floats on top of everything (z-50)
    // We position it on the LEFT to separate from Chat (Right)
    // Stacking: If multiple summaries exist, we simply stack them. 
    // Ideally user places one per major section.

    return createPortal(
        <>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 left-10 md:left-10 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-xl shadow-violet-500/30 flex items-center justify-center border-4 border-white/20 backdrop-blur-sm"
                title="AI Summary"
            >
                <ScrollText className="w-6 h-6 text-white" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[60]"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="fixed inset-x-4 bottom-4 md:inset-auto md:left-10 md:bottom-28 md:w-[28rem] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl z-[70] overflow-hidden flex flex-col border border-violet-100"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">
                                            AI Summary
                                        </h3>
                                        <p className="text-white/80 text-xs font-medium uppercase tracking-widest">
                                            Key Insights
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-violet-500">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        <p className="text-sm font-medium">Analyzing content...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-8">
                                        <p className="text-red-500 text-sm mb-4">{error}</p>
                                        <button
                                            onClick={fetchSummary}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-full text-sm font-bold hover:bg-violet-100"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Retry
                                        </button>
                                    </div>
                                ) : (
                                    <div className="prose prose-violet prose-sm max-w-none">
                                        <div className="bg-violet-50/50 rounded-2xl p-5 border border-violet-100">
                                            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                                {summary}
                                            </p>
                                        </div>

                                        {showSimulation && (
                                            <div className="mt-6 bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-2xl p-5 border border-fuchsia-100">
                                                <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-600 mb-2">
                                                    Action Item
                                                </p>
                                                <p className="text-slate-700 text-sm">
                                                    Try applying these concepts in the interactive simulation.
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={fetchSummary}
                                            className="mt-6 flex items-center gap-2 text-violet-400 hover:text-violet-600 text-xs font-bold transition-colors mx-auto"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            Regenerate Summary
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>,
        document.body
    );
}
