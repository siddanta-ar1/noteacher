"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type {
    ContentBlock,
    TextBlock as TextBlockType,
    ImageBlock as ImageBlockType,
    QuizBlock as QuizBlockType,
    SimulationBlock as SimulationType,
    AssignmentBlock as AssignmentBlockType,
    DividerBlock as DividerBlockType,
    AIInsightBlock as AIInsightBlockType,
    AnimationBlock as AnimationBlockType,
} from "@/types/content";

// Block Components
import TextBlockComponent from "./TextBlock";
import ImageBlockComponent from "./ImageBlock";
import QuizBlockComponent from "./QuizBlock";
import SimulationBlockComponent from "./SimulationBlock";
import AssignmentBlockComponent from "./AssignmentBlock";
import DividerBlockComponent from "./DividerBlock";
import AISummaryBlock from "./AISummaryBlock";
import AnimationBlockComponent from "./AnimationBlock";

interface BlockRendererProps {
    blocks: ContentBlock[];
    unlockedIndex: number;
    onUnlock: (index: number) => void;
    onUpdateContext?: (text: string) => void;
    nodeId?: string;
}

/**
 * BlockRenderer - Factory component for rendering content blocks
 * Handles progressive unlocking, animations, and AI context updates
 */
export default function BlockRenderer({
    blocks,
    unlockedIndex,
    onUnlock,
    onUpdateContext,
    nodeId,
}: BlockRendererProps) {
    return (
        <div className="space-y-12 max-w-3xl mx-auto pb-24">
            {blocks.map((block, index) => {
                // Progressive unlocking - hide blocks beyond unlocked index
                const isLocked = index > unlockedIndex;
                if (isLocked) return null;

                return (
                    <BlockWrapper
                        key={block.id || index}
                        block={block}
                        index={index}
                        onUpdateContext={onUpdateContext}
                    >
                        {renderBlock(block, index, onUnlock, nodeId)}
                    </BlockWrapper>
                );
            })}

            {/* Locked indicator */}
            {unlockedIndex < blocks.length - 1 && (
                <LockedIndicator />
            )}
        </div>
    );
}

/**
 * BlockWrapper - Handles animations and viewport tracking
 */
function BlockWrapper({
    block,
    index,
    children,
    onUpdateContext,
}: {
    block: ContentBlock;
    index: number;
    children: React.ReactNode;
    onUpdateContext?: (text: string) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    // Update AI context when block comes into view
    const handleViewportEnter = () => {
        if (block.type === "text" && onUpdateContext) {
            onUpdateContext((block as TextBlockType).content);
        }
    };

    // Animation variants based on block config
    const getAnimationVariants = () => {
        const anim = block.animation;
        const customEase = [0.21, 0.47, 0.32, 0.98] as const;
        const defaultVariants = {
            hidden: { opacity: 0, y: 30 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: anim?.duration || 0.6,
                    delay: anim?.delay || 0,
                    ease: customEase,
                },
            },
        };

        if (!anim) return defaultVariants;

        switch (anim.type) {
            case "slide":
                const slideDistance = 50;
                const slideOffset = {
                    up: { y: slideDistance },
                    down: { y: -slideDistance },
                    left: { x: slideDistance },
                    right: { x: -slideDistance },
                };
                return {
                    hidden: { opacity: 0, ...slideOffset[anim.direction || "up"] },
                    visible: {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        transition: {
                            duration: anim.duration || 0.6,
                            delay: anim.delay || 0,
                            ease: customEase,
                        },
                    },
                };

            case "scale":
                return {
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            duration: anim.duration || 0.5,
                            delay: anim.delay || 0,
                            ease: "backOut" as const,
                        },
                    },
                };

            case "parallax":
                return {
                    hidden: { opacity: 0, y: 60 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: anim.duration || 0.8,
                            delay: anim.delay || 0,
                            ease: "easeOut" as const,
                        },
                    },
                };

            default:
                return defaultVariants;
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={getAnimationVariants()}
            onViewportEnter={handleViewportEnter}
            className="relative"
        >
            {children}
        </motion.div>
    );
}

/**
 * Render individual block based on type
 */
function renderBlock(
    block: ContentBlock,
    index: number,
    onUnlock: (index: number) => void,
    nodeId?: string
): React.ReactNode {
    switch (block.type) {
        case "text":
            return <TextBlockComponent block={block as TextBlockType} />;

        case "image":
            return <ImageBlockComponent block={block as ImageBlockType} />;

        case "quiz":
            return (
                <QuizBlockComponent
                    block={block as QuizBlockType}
                    onComplete={() => onUnlock(index)}
                />
            );

        case "simulation":
            return <SimulationBlockComponent block={block as SimulationType} />;

        case "assignment":
            return (
                <AssignmentBlockComponent
                    block={block as AssignmentBlockType}
                    onComplete={() => onUnlock(index)}
                />
            );

        case "divider":
            return <DividerBlockComponent block={block as DividerBlockType} />;

        case "ai-insight":
            return (
                <AISummaryBlock
                    block={block as AIInsightBlockType}
                    nodeId={nodeId}
                    sectionIndex={index}
                />
            );

        case "animation":
            return <AnimationBlockComponent block={block as AnimationBlockType} />;

        default:
            console.warn(`Unknown block type: ${(block as any).type}`);
            return null;
    }
}

/**
 * Locked indicator shown when content is gated
 */
function LockedIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="py-16 flex flex-col items-center justify-center text-slate-300"
        >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">
                Complete the task above to continue
            </p>
        </motion.div>
    );
}
