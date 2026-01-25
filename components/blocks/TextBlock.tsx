"use client";

import type { TextBlock } from "@/types/content";

interface TextBlockProps {
    block: TextBlock;
}

/**
 * TextBlock - Premium typography text blocks with multiple styles
 * Supports Markdown-like bold syntax (**text**)
 */
export default function TextBlockComponent({ block }: TextBlockProps) {
    const { content, style = "default" } = block;

    // Parse simple markdown (bold text)
    const renderContent = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
                <span key={i} className="font-black text-navy">
                    {part.slice(2, -2)}
                </span>
            ) : (
                <span key={i}>{part}</span>
            )
        );
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
        <div className={styleClasses[style]}>
            {style === "quote" && (
                <div className="absolute left-0 top-4 text-6xl text-slate-200 font-serif leading-none">
                    "
                </div>
            )}
            <p className={textClasses[style]}>{renderContent(content)}</p>
        </div>
    );
}
