"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

// New modular block system
import { BlockRenderer } from "@/components/blocks";
import { parseContentJSON } from "@/lib/content-parser";
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
    const parsedContent = useMemo(() => parseContentJSON(node.content), [node.content]);
    // Enrich content with dynamic simulations
    const blocks = useMemo(() => enrichContent(parsedContent.blocks, node.title), [parsedContent.blocks, node.title]);

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
                // Increased base multiplier for more noticeable speed
                containerRef.current.scrollTop += 1.0 * scrollSpeed;

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

    // Unified TTS Controller (Sequential Reading)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Current reading state
    const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(-1);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [activeBlockCharIndex, setActiveBlockCharIndex] = useState<number | null>(null);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // Effect to trigger next block reading
    useEffect(() => {
        if (isReading && currentBlockIndex >= 0 && currentBlockIndex < blocks.length) {
            const block = blocks[currentBlockIndex];

            // Skip non-text blocks (or give them brief pauses/descriptions)
            let textToRead = "";
            if (block.type === "text") {
                textToRead = (block as any).content;
            }

            if (!textToRead) {
                // Smart Skip: Find the next readable block to avoid render loops
                let nextIndex = currentBlockIndex + 1;
                while (nextIndex < blocks.length) {
                    if (blocks[nextIndex].type === "text") {
                        break;
                    }
                    nextIndex++;
                }
                setCurrentBlockIndex(nextIndex);
                return;
            }

            // Speak this block
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utteranceRef.current = utterance;
            utterance.rate = 1;
            utterance.pitch = 1;

            // Update Active Block ID for highlighting
            setActiveBlockId(block.id);
            setActiveBlockCharIndex(0); // Reset char index

            // Detailed Boundary Event for Word Highlighting
            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    // Since we read ONE block at a time, charIndex is RELATIVE to this block!
                    // Perfect alignment with TextBlock component.
                    setActiveBlockCharIndex(event.charIndex);
                }
            };

            utterance.onend = () => {
                // Move to next block
                setActiveBlockCharIndex(null);
                setCurrentBlockIndex(prev => prev + 1);
            };

            utterance.onerror = (e) => {
                console.error("TTS Error:", e);
                setIsReading(false);
                setActiveBlockId(null);
            };

            window.speechSynthesis.speak(utterance);
        } else if (isReading && currentBlockIndex >= blocks.length) {
            // Finished all blocks
            setIsReading(false);
            setActiveBlockId(null);
            setActiveBlockCharIndex(null);
            setCurrentBlockIndex(-1);
        }
    }, [isReading, currentBlockIndex, blocks]);

    const toggleReader = useCallback(() => {
        if (isReading) {
            // STOP
            window.speechSynthesis.cancel();
            setIsReading(false);
            setActiveBlockId(null);
            setActiveBlockCharIndex(null);
            setCurrentBlockIndex(-1);
        } else {
            // START
            // Start from 0 (or unlockedIndex if preferred, for now 0)
            setCurrentBlockIndex(0);
            setIsReading(true);
            setIsScrolling(false); // Disable auto-scroll to prevent conflict
        }
    }, [isReading]);

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
                    <div className="mb-8">
                        <button
                            onClick={() => router.push(node.course_id ? `/course/${node.course_id}` : '/home')}
                            className="inline-flex items-center gap-2 text-sm font-bold text-ink-400 hover:text-primary transition-colors mb-4 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                            </div>
                            Back to Course
                        </button>
                    </div>

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
                            activeBlockId={activeBlockId}
                            activeBlockCharIndex={activeBlockCharIndex}
                        />
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-surface-sunken">
                            <p className="text-ink-500 font-medium">This lesson has no content yet.</p>
                        </div>
                    )}

                    {/* References Section */}
                    {parsedContent.metadata?.references && parsedContent.metadata.references.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-border">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-ink-400 mb-4">
                                References & Further Reading
                            </h3>
                            <ul className="space-y-3">
                                {parsedContent.metadata.references.map((ref, i) => {
                                    const isUrl = ref.startsWith("http");
                                    const href = isUrl ? ref : `https://scholar.google.com/scholar?q=${encodeURIComponent(ref)}`;

                                    return (
                                        <li key={i} className="text-sm text-ink-600 flex gap-3 items-start group">
                                            <span className="text-ink-300 font-mono text-xs mt-0.5 select-none">[{i + 1}]</span>
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="italic hover:text-primary transition-colors border-b border-transparent hover:border-primary/30 pb-0.5"
                                            >
                                                {ref}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
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
