"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ScrollText } from "lucide-react";

interface AISummaryButtonProps {
    summary?: string;
    context?: string;
}

/**
 * AISummaryButton - Floating Action Button for Lesson Summary
 * reads from lesson metadata.
 */
export default function AISummaryButton({
    summary,
    context
}: AISummaryButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!summary || !mounted) {
        return null;
    }

    return createPortal(
        <>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 right-24 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-xl shadow-violet-500/30 flex items-center justify-center border-4 border-white/20 backdrop-blur-sm"
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
                            className="fixed inset-x-4 bottom-4 md:inset-auto md:right-10 md:bottom-28 md:w-[28rem] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl z-[70] overflow-hidden flex flex-col border border-violet-100"
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

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                <div className="prose prose-violet prose-sm max-w-none">
                                    <div className="bg-violet-50/50 rounded-2xl p-5 border border-violet-100">
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                            {summary}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>,
        document.body
    );
}
