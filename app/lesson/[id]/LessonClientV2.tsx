"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronLeft, Keyboard, BookOpen, Menu, X, CheckCircle2, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// New modular block system
import { BlockRenderer } from "@/components/blocks";
import { parseContentJSON, extractTextContent } from "@/lib/content-parser";
import type { ContentBlock } from "@/types/content";

// Existing components
import LessonControlBar from "@/components/lesson/LessonControlBar";
import AIChatModal from "@/components/lesson/AIChatModal";
import { completeNode } from "@/app/lesson/actions";
import { Badge, ProgressBar, Avatar } from "@/components/ui";

type LessonClientProps = {
    node: {
        id: string;
        title: string;
        type: string;
        content: any;
        course_id?: string;
    };
    courseNodes: any[];
    userProgress: any[];
};

export default function LessonClientV2({
    node,
    courseNodes,
    userProgress,
}: LessonClientProps) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Parse content using new JSON engine
    const parsedContent = parseContentJSON(node.content);
    const blocks = parsedContent.blocks;

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

    // Calculate progress
    const currentNodeIndex = courseNodes.findIndex((n) => n.id === node.id);
    const totalNodes = courseNodes.length;

    return (
        <div className="flex h-screen bg-surface-raised overflow-hidden">
            {/* PROGRESS BAR (Top Fixed) */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-brand-gradient origin-left z-50"
                style={{
                    scaleX,
                    background: "linear-gradient(to right, var(--color-power-teal), var(--color-success))"
                }}
            />

            {/* SIDEBAR TOGGLE (Mobile/Collapsed) */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-40 p-2 bg-white rounded-xl shadow-lg border border-border lg:hidden"
            >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-80 bg-white border-r border-border flex flex-col transition-transform duration-300 transform
                    lg:relative lg:translate-x-0
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="p-6 border-b border-border">
                    <Link
                        href={node.course_id ? `/course/${node.course_id}` : "/home"}
                        className="flex items-center gap-2 text-ink-500 hover:text-primary text-sm font-bold transition-colors mb-4"
                    >
                        <ChevronLeft size={16} />
                        Back to Map
                    </Link>
                    <Badge variant="teal" className="mb-3">
                        {node.type || "Lesson"}
                    </Badge>
                    <h2 className="text-xl font-black text-ink-900 leading-tight">
                        {node.title}
                    </h2>

                    {/* Metadata */}
                    {parsedContent.metadata && (
                        <div className="flex items-center gap-3 mt-4">
                            {parsedContent.metadata.estimatedMinutes && (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-ink-500 bg-surface-raised px-2.5 py-1 rounded-md">
                                    <BookOpen size={14} className="text-primary" />
                                    {parsedContent.metadata.estimatedMinutes} min
                                </div>
                            )}
                            {parsedContent.metadata.difficulty && (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-ink-500 bg-surface-raised px-2.5 py-1 rounded-md capitalize">
                                    <Zap size={14} className="text-power-orange" />
                                    {parsedContent.metadata.difficulty}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Node navigation */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {courseNodes.map((n, index) => {
                        const progress = userProgress.find((p) => p.node_id === n.id);
                        const isDone = progress?.status === "completed";
                        const isCurrent = n.id === node.id;
                        const isUnlocked = progress?.status === "unlocked" || isCurrent || isDone;

                        return (
                            <Link
                                key={n.id}
                                href={isUnlocked ? `/lesson/${n.id}` : "#"}
                                className={`
                                    relative p-4 rounded-xl text-sm font-bold transition-all border-2
                                    ${isCurrent
                                        ? "bg-primary-light border-primary text-primary shadow-sm"
                                        : isDone
                                            ? "bg-surface-sunken border-transparent text-ink-500 hover:bg-surface-raised"
                                            : isUnlocked
                                                ? "bg-white border-transparent text-ink-900 hover:border-border hover:shadow-sm"
                                                : "bg-surface-sunken border-transparent text-ink-300 opacity-60 cursor-not-allowed"
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between z-10 relative">
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-6 h-6 rounded-full flex items-center justify-center text-[10px]
                                            ${isCurrent ? "bg-primary text-white" : isDone ? "bg-power-teal text-white" : "bg-ink-200 text-ink-500"}
                                        `}>
                                            {isDone ? <CheckCircle2 size={12} /> : index + 1}
                                        </div>
                                        <span className="line-clamp-1">{n.title}</span>
                                    </div>
                                    {!isUnlocked && <Lock size={12} />}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Keyboard hint */}
                <div className="p-4 border-t border-border bg-surface-raised/50">
                    <div className="flex items-center justify-between text-xs font-bold text-ink-400">
                        <div className="flex items-center gap-1.5">
                            <Keyboard size={14} />
                            <span>Navigate</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="px-1.5 py-0.5 rounded border border-border bg-white">↑</span>
                            <span className="px-1.5 py-0.5 rounded border border-border bg-white">↓</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main
                ref={containerRef}
                className="flex-1 relative overflow-y-auto scroll-smooth"
            >
                <article className="max-w-3xl mx-auto py-24 px-6 md:px-12 pb-48">
                    {/* Header */}
                    <header className="mb-16 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-power-teal animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest text-power-teal">
                                Unit {currentNodeIndex + 1} of {totalNodes}
                            </span>
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
                    <BlockRenderer
                        blocks={blocks}
                        unlockedIndex={unlockedIndex}
                        onUnlock={handleUnlock}
                        onUpdateContext={setCurrentContext}
                        nodeId={node.id}
                    />

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
        </div>
    );
}
