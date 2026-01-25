"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Sparkles, ArrowRight } from "lucide-react";
import type { QuizBlock } from "@/types/content";

interface QuizBlockProps {
    block: QuizBlock;
    onComplete: () => void;
}

/**
 * QuizBlock - Interactive quiz with beautiful animations and feedback
 */
export default function QuizBlockComponent({
    block,
    onComplete,
}: QuizBlockProps) {
    const { question, options, correctIndex, explanation, unlocks = true } = block;
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSelect = (index: number) => {
        if (isAnswered) return;

        setSelectedIndex(index);
        setIsAnswered(true);
        setIsCorrect(index === correctIndex);

        // Unlock next section if correct and unlocks is true
        if (index === correctIndex && unlocks) {
            setTimeout(() => {
                onComplete();
            }, 1500);
        }
    };

    const handleRetry = () => {
        setSelectedIndex(null);
        setIsAnswered(false);
        setIsCorrect(false);
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-[2rem] border-2 border-slate-100 p-8 md:p-10 shadow-lg">
            {/* Question header */}
            <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-power-teal/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-power-teal" />
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-power-teal mb-2">
                        Knowledge Check
                    </p>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                        {question}
                    </h3>
                </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {options.map((option, index) => {
                    const isSelected = selectedIndex === index;
                    const isCorrectOption = index === correctIndex;
                    const showCorrect = isAnswered && isCorrectOption;
                    const showWrong = isAnswered && isSelected && !isCorrectOption;

                    return (
                        <motion.button
                            key={index}
                            onClick={() => handleSelect(index)}
                            disabled={isAnswered}
                            whileHover={!isAnswered ? { scale: 1.02, x: 8 } : {}}
                            whileTap={!isAnswered ? { scale: 0.98 } : {}}
                            className={`
                w-full text-left p-5 rounded-2xl 
                border-2 transition-all duration-300
                flex items-center gap-4
                ${!isAnswered
                                    ? "border-slate-200 hover:border-navy hover:bg-navy/5 cursor-pointer"
                                    : ""
                                }
                ${showCorrect ? "border-green-500 bg-green-50" : ""}
                ${showWrong ? "border-red-400 bg-red-50" : ""}
                ${isAnswered && !isSelected && !isCorrectOption ? "opacity-50" : ""}
              `}
                        >
                            {/* Option letter */}
                            <span
                                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center 
                  font-black text-sm shrink-0 transition-colors
                  ${!isAnswered
                                        ? "bg-slate-100 text-slate-400"
                                        : showCorrect
                                            ? "bg-green-500 text-white"
                                            : showWrong
                                                ? "bg-red-400 text-white"
                                                : "bg-slate-100 text-slate-300"
                                    }
                `}
                            >
                                {String.fromCharCode(65 + index)}
                            </span>

                            {/* Option text */}
                            <span
                                className={`
                  flex-1 font-bold text-base md:text-lg
                  ${!isAnswered
                                        ? "text-slate-700"
                                        : showCorrect
                                            ? "text-green-700"
                                            : showWrong
                                                ? "text-red-600"
                                                : "text-slate-400"
                                    }
                `}
                            >
                                {option}
                            </span>

                            {/* Result icon */}
                            {isAnswered && (
                                <AnimatePresence>
                                    {showCorrect && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="shrink-0"
                                        >
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        </motion.div>
                                    )}
                                    {showWrong && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="shrink-0"
                                        >
                                            <XCircle className="w-6 h-6 text-red-400" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Feedback section */}
            <AnimatePresence>
                {isAnswered && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8"
                    >
                        {isCorrect ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <p className="font-black text-green-700">Excellent!</p>
                                </div>
                                {explanation && (
                                    <p className="text-green-600 text-sm">{explanation}</p>
                                )}
                                {unlocks && (
                                    <div className="flex items-center gap-2 mt-4 text-green-600 text-sm font-bold">
                                        <ArrowRight className="w-4 h-4" />
                                        <span>Scrolling to continue...</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <XCircle className="w-5 h-5 text-red-400" />
                                        <p className="font-black text-red-600">Not quite right</p>
                                    </div>
                                    <button
                                        onClick={handleRetry}
                                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl text-sm font-bold transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                                <p className="text-red-500 text-sm">
                                    Review the material and give it another shot!
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
