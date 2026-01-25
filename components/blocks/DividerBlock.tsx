"use client";

import type { DividerBlock } from "@/types/content";

interface DividerBlockProps {
    block: DividerBlock;
}

/**
 * DividerBlock - Visual separator between content sections
 */
export default function DividerBlockComponent({ block }: DividerBlockProps) {
    const { style = "line" } = block;

    switch (style) {
        case "space":
            return <div className="h-16" />;

        case "section-break":
            return (
                <div className="py-12 flex items-center justify-center">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                    </div>
                </div>
            );

        case "line":
        default:
            return (
                <div className="py-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
            );
    }
}
