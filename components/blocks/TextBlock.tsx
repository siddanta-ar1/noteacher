"use client";

import { useState } from "react";
import type { TextBlock, Citation } from "@/types/content";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

interface TextBlockProps {
    block: TextBlock;
}

/**
 * TextBlock - Premium typography text blocks with multiple styles
 * Supports Markdown-like bold syntax (**text**) and Citations ([[1]])
 */
export default function TextBlockComponent({ block }: TextBlockProps) {
    const { content, style = "default", citations = [] } = block;
    const [activeCitation, setActiveCitation] = useState<string | null>(null);

    // Parse content with bold and citation markers
    const renderContent = (text: string) => {
        // Defines the splitting pattern:
        // 1. Bold: **text**
        // 2. Citation: [[id]]
        const parts = text.split(/(\*\*.*?\*\*|\[\[.*?\]\])/g);

        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return (
                    <span key={i} className="font-black text-navy/90">
                        {part.slice(2, -2)}
                    </span>
                );
            } else if (part.startsWith("[[") && part.endsWith("]]")) {
                const id = part.slice(2, -2);
                const citation = citations.find((c) => c.id === id);

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
                // If citation not found, just return original text or hidden
                return null;
            }
            return <span key={i}>{part}</span>;
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
