"use client";

import { useState, useRef, useEffect } from "react";
import type { TextBlock, Citation } from "@/types/content";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

interface TextBlockProps {
    block: TextBlock;
}

// TextBlock - Premium typography text blocks with multiple styles
// Supports Markdown-like bold syntax (**text**) and Citations ([[1]])

interface TextBlockProps {
    block: TextBlock;
    highlightCharIndex?: number | null;
}

export default function TextBlockComponent({ block, highlightCharIndex }: TextBlockProps) {
    const { content, style = "default", citations = [] } = block;
    const [activeCitation, setActiveCitation] = useState<string | null>(null);
    const highlightRef = useRef<HTMLSpanElement>(null);

    // Debug logging
    useEffect(() => {
        if (highlightCharIndex !== null && highlightCharIndex !== undefined) {
            console.log("TextBlock received highlight index:", highlightCharIndex);
        }
    }, [highlightCharIndex]);

    // Scroll highlighted word into view - Optimized for smooth reading
    useEffect(() => {
        if (highlightRef.current) {
            highlightRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest", // Changing from 'center' to 'nearest' prevents jumpiness
                inline: "nearest"
            });
        }
    }, [highlightCharIndex]);

    // Parse content with bold and citation markers, AND word-level highlighting
    const renderContent = (text: string) => {
        // Splits by bold/citation markers
        const parts = text.split(/(\*\*.*?\*\*|\[\[.*?\]\])/g);
        let charCursor = 0;

        return parts.map((part, i) => {
            // Bold
            if (part.startsWith("**") && part.endsWith("**")) {
                const innerText = part.slice(2, -2);
                const start = charCursor;
                charCursor += part.length; // Advance by full raw length including **

                // Render inner words for highlighting too? 
                // Creating a complex nested structure might break layout or be overkill.
                // For simplicity, highlight the whole bold chunk if index hits it.
                // Or better: split inner text. 
                // BUT: raw index includes '**'. 
                // Let's treat the bold block as a single unit or split it.
                // Splitting inner text is best for UX.

                // Effective cursor logic:
                // Global index tracks RAW text. 
                // Inner text starts at `start + 2`.

                const words = innerText.split(/(\s+)/);
                let localCursor = start + 2;

                return (
                    <span key={i} className="font-black text-navy/90">
                        {words.map((word, wArgs) => {
                            const isHighlight = highlightCharIndex !== null &&
                                highlightCharIndex !== undefined &&
                                highlightCharIndex >= localCursor &&
                                highlightCharIndex < (localCursor + word.length);

                            const el = (
                                <span
                                    key={wArgs}
                                    ref={isHighlight ? highlightRef : null}
                                    className={isHighlight ? "bg-primary/20 border-b-2 border-primary text-black px-0.5 rounded-t transition-colors duration-75 relative" : ""}
                                >
                                    {isHighlight && (
                                        <motion.span
                                            layoutId="highlight-cursor"
                                            className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-primary"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}
                                    {word}
                                </span>
                            );
                            localCursor += word.length;
                            return el;
                        })}
                    </span>
                );
            }
            // Citation
            else if (part.startsWith("[[") && part.endsWith("]]")) {
                const id = part.slice(2, -2);
                const citation = citations.find((c) => c.id === id);
                charCursor += part.length;

                if (citation) {
                    return (
                        <span key={i} className="relative inline-block align-super text-sm mx-0.5">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCitation(activeCitation === id ? null : id);
                                }}
                                className={`
                                    w-5 h-5 flex items-center justify-center rounded-full 
                                    text-[10px] font-bold border transition-colors
                                    ${activeCitation === id
                                        ? "bg-primary text-white border-primary shadow-md scale-110"
                                        : "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                                    }
                                `}
                            >
                                {id}
                            </button>

                            {/* Citation Tooltip */}
                            <AnimatePresence>
                                {activeCitation === id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 z-50 origin-bottom"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="bg-white p-4 rounded-xl shadow-xl border border-primary/20 relative">
                                            <div className="flex gap-2 items-start mb-1">
                                                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <p className="text-sm text-ink-700 leading-relaxed font-normal">
                                                    {citation.text}
                                                </p>
                                            </div>
                                            {citation.url && (
                                                <a
                                                    href={citation.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs font-bold text-primary hover:text-primary-dark ml-6 block mt-2 hover:underline"
                                                >
                                                    Read Source →
                                                </a>
                                            )}
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-primary/20 transform rotate-45 -translate-y-2"></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </span>
                    );
                }
                return null;
            }

            // Standard Text
            const words = part.split(/(\s+)/); // Keep spaces as tokens
            const fragmentStart = charCursor;
            charCursor += part.length;

            let localCursor = fragmentStart;

            return (
                <span key={i}>
                    {words.map((word, wIdx) => {
                        const isHighlight = highlightCharIndex !== null &&
                            highlightCharIndex !== undefined &&
                            highlightCharIndex >= localCursor &&
                            highlightCharIndex < (localCursor + word.length);

                        const el = (
                            <span
                                key={wIdx}
                                ref={isHighlight ? highlightRef : null}
                                className={isHighlight ? "bg-yellow-200 text-black px-0.5 rounded transition-colors duration-200" : ""}
                            >
                                {word}
                            </span>
                        );
                        localCursor += word.length;
                        return el;
                    })}
                </span>
            );
        });
    };

    // Style variants
    const styleClasses = {
        default: `
      bg-white/80 backdrop-blur-sm 
      p-8 md:p-10 
      rounded-[2rem] 
      border border-slate-100 
      shadow-sm hover:shadow-md 
      transition-all duration-300
    `,
        callout: `
      bg-gradient-to-br from-power-teal/10 to-power-teal/5
      border-l-4 border-power-teal
      p-8 md:p-10 
      rounded-r-[2rem] 
      shadow-lg shadow-power-teal/5
    `,
        quote: `
      relative
      pl-8 md:pl-12
      py-6
      border-l-4 border-slate-200
      italic
    `,
        highlight: `
      bg-gradient-to-r from-power-orange/10 via-power-orange/5 to-transparent
      p-8 md:p-10 
      rounded-[2rem] 
      border border-power-orange/20
    `,
        heading: `
      text-center
      py-8
    `,
    };

    const textClasses = {
        default: "text-xl md:text-2xl text-slate-700 leading-relaxed font-medium",
        callout: "text-lg md:text-xl text-slate-800 leading-relaxed font-medium",
        quote: "text-xl md:text-2xl text-slate-500 leading-relaxed",
        highlight: "text-lg md:text-xl text-slate-800 leading-relaxed font-medium",
        heading: "text-3xl md:text-4xl font-black text-slate-900 leading-tight",
    };

    return (
        <div className={styleClasses[style]} onClick={() => setActiveCitation(null)}>
            {style === "quote" && (
                <div className="absolute left-0 top-4 text-6xl text-slate-200 font-serif leading-none">
                    "
                </div>
            )}
            <p className={textClasses[style]}>{renderContent(content)}</p>
        </div>
    );
}
