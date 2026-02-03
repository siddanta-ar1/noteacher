"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

// New modular block system
import { BlockRenderer } from "@/components/blocks";
import { parseContentJSON, extractTextContent } from "@/lib/content-parser";
import { enrichContent } from "@/lib/content-enricher";
import type { ContentBlock } from "@/types/content";

// Existing components
import LessonControlBar from "@/components/lesson/LessonControlBar";
import AIChatModal from "@/components/lesson/AIChatModal";
import AISummaryButton from "@/components/lesson/AISummaryButton";
import { completeNode } from "@/app/lesson/actions";
import { Badge } from "@/components/ui";

type LessonClientProps = {
    node: {
        id: string;
        title: string;
        type: string;
        content: any;
        course_id?: string;
    };
};

export default function LessonClientV2({
    node,
}: LessonClientProps) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Parse content using new JSON engine
    const parsedContent = parseContentJSON(node.content);
    // Enrich content with dynamic simulations
    const blocks = enrichContent(parsedContent.blocks, node.title);

    // Helper to find the next blocking index
    const findNextBlockingIndex = (currentBlocks: ContentBlock[], startIndex: number) => {
        for (let i = startIndex; i < currentBlocks.length; i++) {
            const block = currentBlocks[i];
            const isBlocking =
                (block.type === 'quiz' && (block as any).unlocks) ||
                (block.type === 'assignment' && (block as any).isBlocking);

            if (isBlocking) return i;
        }
        return currentBlocks.length - 1;
    };

    // State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentContext, setCurrentContext] = useState("");

    // Initialize unlockedIndex to the first blocking block or end
    const [unlockedIndex, setUnlockedIndex] = useState(() =>
        findNextBlockingIndex(blocks, 0)
    );

    // Reading Engine State
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(1);
    const [isReading, setIsReading] = useState(false);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
                return;
            }

            if (e.key === "ArrowDown" || e.key === " ") {
                e.preventDefault();
                containerRef.current?.scrollBy({ top: 200, behavior: "smooth" });
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                containerRef.current?.scrollBy({ top: -200, behavior: "smooth" });
            }
            if (e.key === "Escape") {
                setIsChatOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Auto-scroll engine
    useEffect(() => {
        let animationFrameId: number;

        const scroll = () => {
            if (containerRef.current && isScrolling) {
                containerRef.current.scrollTop += 0.5 * scrollSpeed;

                if (
                    containerRef.current.scrollTop + containerRef.current.clientHeight >=
                    containerRef.current.scrollHeight - 10
                ) {
                    setIsScrolling(false);
                } else {
                    animationFrameId = requestAnimationFrame(scroll);
                }
            }
        };

        if (isScrolling) {
            animationFrameId = requestAnimationFrame(scroll);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isScrolling, scrollSpeed]);

    // Text-to-speech engine
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const toggleReader = useCallback(() => {
        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
        } else {
            const fullText = extractTextContent(blocks);
            const utterance = new SpeechSynthesisUtterance(fullText);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.onend = () => setIsReading(false);
            window.speechSynthesis.speak(utterance);
            setIsReading(true);
        }
    }, [isReading, blocks]);

    // Unlock handler for progressive content
    const handleUnlock = useCallback((index: number) => {
        setUnlockedIndex((prev) => {
            // Find next blocking point starting after this block
            const nextBlocking = findNextBlockingIndex(blocks, index + 1);
            return Math.max(prev, nextBlocking);
        });
    }, [blocks]);

    // Completion handler
    const handleComplete = async () => {
        try {
            const result = await completeNode(node.id);
            if (result.success) {
                if (result.nextNodeId) {
                    router.push(`/lesson/${result.nextNodeId}`);
                } else {
                    router.push("/home");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-full flex-col bg-surface-raised overflow-hidden relative">
            {/* PROGRESS BAR (Top Fixed) */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gradient origin-left z-50"
                style={{
                    scaleX,
                    background: "linear-gradient(to right, var(--color-power-teal), var(--color-success))"
                }}
            />

            {/* MAIN CONTENT */}
            <main
                ref={containerRef}
                className="flex-1 relative overflow-y-auto scroll-smooth"
            >
                <article className="max-w-3xl mx-auto py-24 px-6 md:px-12 pb-48">
                    {/* Header */}
                    <header className="mb-16 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <Badge variant="teal">
                                {node.type || "Lesson"}
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-ink-900 mt-2 leading-tight">
                            {node.title}
                        </h1>
                        {parsedContent.metadata?.objectives && (
                            <div className="mt-8 bg-surface-raised border border-border rounded-2xl p-6">
                                <p className="text-xs font-black uppercase tracking-wider text-ink-400 mb-4 flex items-center gap-2">
                                    <Zap size={14} className="text-power-orange" />
                                    Learning Objectives
                                </p>
                                <ul className="space-y-3">
                                    {parsedContent.metadata.objectives.map((obj, i) => (
                                        <li key={i} className="flex items-start gap-3 text-ink-700 font-medium text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </header>

                    {/* Block content */}
                    {blocks.length > 0 ? (
                        <BlockRenderer
                            blocks={blocks}
                            unlockedIndex={unlockedIndex}
                            onUnlock={handleUnlock}
                            onUpdateContext={setCurrentContext}
                            nodeId={node.id}
                        />
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-surface-sunken">
                            <p className="text-ink-500 font-medium">This lesson has no content yet.</p>
                        </div>
                    )}

                    {/* Complete button */}
                    <div className="pt-24 pb-32 flex justify-center">
                        <motion.button
                            onClick={handleComplete}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-10 py-5 bg-gradient-to-r from-primary to-primary-hover text-white rounded-2xl font-black text-xl shadow-xl flex items-center gap-3 group"
                            style={{ boxShadow: "var(--shadow-primary-lg)" }}
                        >
                            Complete Lesson
                            <div className="bg-white/20 p-1 rounded-lg group-hover:translate-x-1 transition-transform">
                                <CheckCircle2 size={24} />
                            </div>
                        </motion.button>
                    </div>
                </article>
            </main>

            {/* FLOATING CONTROL BAR */}
            <LessonControlBar
                isScrolling={isScrolling}
                onToggleScroll={() => setIsScrolling(!isScrolling)}
                scrollSpeed={scrollSpeed}
                onSpeedChange={setScrollSpeed}
                isReading={isReading}
                onToggleRead={toggleReader}
                onOpenAI={() => setIsChatOpen(true)}
            />

            {/* AI CHAT MODAL */}
            <AIChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                context={`Currently viewing: ${currentContext}\n\nLesson: ${node.title}`}
            />

            {/* AI SUMMARY BUTTON */}
            <AISummaryButton
                summary={parsedContent.metadata?.aiSummary}
                context={parsedContent.metadata?.teacherContext}
            />
        </div>
    );
}
