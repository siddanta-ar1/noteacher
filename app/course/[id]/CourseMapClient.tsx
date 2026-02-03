"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, BookOpen, BadgePercent } from "lucide-react";
import PathMap, { MapNode, MapLevel } from "@/components/map/PathMap";
import type { CourseWithHierarchy, UserProgress } from "@/types";
import { Badge } from "@/components/ui";

type CourseMapClientProps = {
    course: CourseWithHierarchy;
    userProgress: UserProgress[];
};

export default function CourseMapClient({
    course,
    userProgress,
}: CourseMapClientProps) {


    // --- 1. Compute Level Status & Progress ---

    // Dynamic Levels from Hierarchy
    const levels = course.levels || [];

    // Helper: Determine status of the LEVEL
    const getLevelStatus = (levelIndex: number): "completed" | "current" | "locked" => {
        const level = levels[levelIndex];
        if (!level) return "locked";

        const levelNodes = level.missions.flatMap(m => m.nodes);

        if (levelNodes.length === 0) {
            // If level is empty, check previous level
            if (levelIndex === 0) return "current";
            const prevLevelNodes = levels[levelIndex - 1].missions.flatMap(m => m.nodes);
            if (prevLevelNodes.length === 0) return "locked"; // recursive? simplistically locked.

            // Check if previous level is complete
            const prevComplete = prevLevelNodes.every(n =>
                userProgress.find(p => p.node_id === n.id)?.status === 'completed'
            );
            return prevComplete ? "current" : "locked";
        }

        // Check completion of THIS level
        const allComplete = levelNodes.every(n =>
            userProgress.find(p => p.node_id === n.id)?.status === "completed"
        );
        if (allComplete) return "completed";

        // Check if unlocked (previous level complete)
        if (levelIndex === 0) return "current";

        const prevLevelNodes = levels[levelIndex - 1].missions.flatMap(m => m.nodes);
        const prevLevelComplete = prevLevelNodes.length === 0 /* empty prev level? treat as complete/skippable? */
            ? true // If prev level is empty, we assume it's "done" or doesn't block (or we check level before that... complication. Let's assume empty levels don't block). 
            // Actually, if prev level is empty and thus has no nodes to complete, is it "complete"? Yes.
            : prevLevelNodes.every(n => userProgress.find(p => p.node_id === n.id)?.status === "completed");

        return prevLevelComplete ? "current" : "locked";
    };

    // Construct Map Nodes (The "Worlds")
    const mapLevels: MapLevel[] = [
        {
            level: 0,
            title: "Course Map",
            nodes: levels.map((l, i) => ({
                id: `level-${i}`, // internal ID for the map click handler
                title: l.title,
                status: getLevelStatus(i) === "current" ? "unlocked" : getLevelStatus(i)
            }))
        }
    ];



    // --- 2. Render ---

    // Flatten all nodes from hierarchy for count
    const allHierarchyNodes = course.levels.flatMap(l => l.missions.flatMap(m => m.nodes));

    const totalNodes = allHierarchyNodes.length;
    const completedNodes = allHierarchyNodes.filter(n =>
        userProgress.find(p => p.node_id === n.id)?.status === "completed"
    ).length;
    const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

    const router = useRouter();

    const handleLevelClick = (levelIndex: number) => {
        const level = course.levels[levelIndex];
        if (!level) return;

        const levelNodes = level.missions.flatMap(m => m.nodes);
        if (levelNodes.length > 0) {
            // Find the first unlocked or Resume point?
            // Actually, we should probably toggle expansion or navigate. 
            // User said: "while clicking level 0 then the content show" -> Suggests navigating to content.
            // Let's go to the FIRST node of the level.
            router.push(`/lesson/${levelNodes[0].id}`);
        }
    };

    return (
        <div className="min-h-screen bg-surface-raised relative">
            {/* Sticky Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            >
                <div className="max-w-5xl mx-auto px-6 h-24 flex items-center justify-center relative">
                    {/* Back Button (Absolute Left) */}
                    <Link
                        href="/home"
                        className="absolute left-6 w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center text-ink-500 hover:bg-primary-light hover:text-primary transition-colors z-10"
                    >
                        <ChevronLeft size={20} />
                    </Link>

                    {/* Gamified Progress Bar (Centered) */}
                    <div className="w-full max-w-lg">
                        <div className="flex items-center gap-4 mb-1">
                            {/* Icon Box */}
                            <div className="w-10 h-10 rounded-xl bg-power-purple/10 flex items-center justify-center text-power-purple shrink-0">
                                <BadgePercent size={20} />
                            </div>

                            {/* Bar */}
                            <div className="flex-1 relative h-4 bg-surface-sunken rounded-full">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-power-purple rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                >
                                    {/* Glow/Indicator at the tip */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 flex items-center justify-center">
                                        <div className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                                            <div className="w-2 h-2 bg-power-purple rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Label */}
                            <span className="text-sm font-bold text-ink-500 whitespace-nowrap min-w-[3ch] text-right">
                                {progressPercent}%
                            </span>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Content Container - Expanded for 3D World */}
            <div className="relative w-full">
                {/* Header Info - Clean & Minimal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xl mx-auto px-6 pt-12 pb-6 text-center"
                >
                    <h1 className="text-4xl font-black text-ink-900 mb-2">{course.title}</h1>
                    <p className="text-lg text-ink-500 font-medium">{course.description}</p>
                </motion.div>

                {/* THE MAP (Showing Levels) */}
                {allHierarchyNodes.length === 0 ? (
                    <div className="py-12 px-6 border-2 border-dashed border-border rounded-3xl bg-surface-raised mx-auto max-w-md">
                        <div className="w-16 h-16 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-ink-400">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-ink-900 mb-2">No Content Yet</h3>
                        <p className="text-ink-500 mb-6">This course is currently being developed. Check back later!</p>
                        <Link href="/home" className="inline-block px-6 py-3 bg-surface border border-border rounded-xl font-bold text-ink-700 hover:bg-surface-sunken transition-colors">
                            Return Home
                        </Link>
                    </div>
                ) : (
                    <div className="relative min-h-[500px]">
                        <PathMap
                            levels={mapLevels}
                            onNodeClick={(node) => {
                                // Extract index from "level-X"
                                const index = parseInt(node.id.split('-')[1]);
                                if (!isNaN(index)) handleLevelClick(index);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
