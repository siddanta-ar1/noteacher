"use client";

import { useState } from "react";
import { Send, HelpCircle, CheckCircle2 } from "lucide-react";

interface CommentFormProps {
    onSubmit: (content: string, type: 'question' | 'solution' | 'general') => void;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
    const [content, setContent] = useState("");
    const [type, setType] = useState("general");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        // Simulate a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        await onSubmit(content, type as 'question' | 'solution' | 'general');

        setContent("");
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="border border-border rounded-xl bg-surface-raised/50 p-4 space-y-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a confusion or a solution..."
                className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[100px] text-ink-900 placeholder:text-ink-400 font-medium"
            />

            <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setType("question")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${type === "question"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-surface hover:bg-surface-raised text-ink-500 border border-border"
                            }`}
                    >
                        <HelpCircle size={14} />
                        Confusion
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("solution")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${type === "solution"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-surface hover:bg-surface-raised text-ink-500 border border-border"
                            }`}
                    >
                        <CheckCircle2 size={14} />
                        Solution
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    {isSubmitting ? "Posting..." : "Post"}
                    <Send size={14} />
                </button>
            </div>
        </form>
    );
}
