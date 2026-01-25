"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Play, Clock, BookOpen, CheckCircle2, Lock } from "lucide-react";
import PathMap, { MapNode } from "@/components/map/PathMap";
import type { CourseWithNodes, UserProgress } from "@/types";
import { Badge } from "@/components/ui";

type CourseMapClientProps = {
    course: CourseWithNodes;
    userProgress: UserProgress[];
};

export default function CourseMapClient({
    course,
    userProgress,
}: CourseMapClientProps) {
    // Transform nodes data for the PathMap
    const mapNodes: MapNode[] = course.nodes.map((node, index) => {
        const progress = userProgress.find((p) => p.node_id === node.id);
        let status: "locked" | "current" | "completed" = "locked";

        if (progress?.status === "completed") {
            status = "completed";
        } else if (progress?.status === "unlocked") {
            status = "current";
        } else if (index === 0 && !progress) {
            status = "current";
        }

        return {
            id: node.id,
            title: node.title,
            status,
        };
    });

    // Calculate progress stats
    const totalNodes = course.nodes.length;
    const completedNodes = userProgress.filter(p => p.status === "completed").length;
    const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

    // Find current node to resume
    const firstIncompleteNode = course.nodes.find(n => {
        const p = userProgress.find(up => up.node_id === n.id);
        return !p || p.status !== "completed";
    }) || course.nodes[0];

    // Estimate time (5 min per node)
    const estimatedMinutes = (totalNodes - completedNodes) * 5;

    return (
        <div className="min-h-screen bg-surface-raised relative">
            {/* Sticky Header - Premium Style */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
            >
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
                    <Link
                        href="/home"
                        className="flex items-center gap-2 text-ink-500 hover:text-primary transition-colors font-bold text-sm shrink-0"
                    >
                        <div className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center hover:bg-primary-light hover:text-primary transition-colors">
                            <ChevronLeft size={18} />
                        </div>
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>

                    {/* Centered Progress Section */}
                    <div className="flex-1 max-w-lg flex flex-col items-center justify-center">
                        <div className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-widest text-ink-400 mb-1.5">
                            <span>Level Progress</span>
                            <span>{completedNodes} / {totalNodes} Completed</span>
                        </div>

                        {/* Segmented Progress Bar */}
                        <div className="flex w-full gap-1 h-2 rounded-full overflow-hidden bg-surface-raised">
                            {course.nodes.map((node, i) => {
                                const isCompleted = i < completedNodes;
                                const isCurrent = i === completedNodes;
                                return (
                                    <motion.div
                                        key={node.id}
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`flex-1 transition-all duration-500 ${isCompleted
                                                ? "bg-power-teal"
                                                : isCurrent
                                                    ? "bg-power-teal/30 animate-pulse"
                                                    : "bg-surface-sunken"
                                            }`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="shrink-0">
                        <Badge variant={progressPercent >= 100 ? "success" : "default"} className="shadow-sm">
                            {progressPercent >= 100 ? (
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 size={12} />
                                    Complete
                                </span>
                            ) : (
                                <span>{progressPercent}%</span>
                            )}
                        </Badge>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <div className="relative pt-32 pb-16 px-6 bg-white overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-power-teal/5 rounded-full blur-3xl -mr-32 -mt-32" />

                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Badge variant="primary" className="mb-4">
                            <BookOpen size={12} />
                            Course Roadmap
                        </Badge>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-ink-900 mb-4 leading-tight"
                    >
                        {course.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-ink-500 max-w-xl mx-auto leading-relaxed mb-6"
                    >
                        {course.description || "Master the concepts through interactive lessons and practical assignments."}
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-6 text-sm"
                    >
                        <div className="flex items-center gap-2 text-ink-500 bg-surface-raised px-4 py-2 rounded-full">
                            <BookOpen size={16} className="text-primary" />
                            <span><strong className="text-ink-900">{totalNodes}</strong> lessons</span>
                        </div>
                        <div className="flex items-center gap-2 text-ink-500 bg-surface-raised px-4 py-2 rounded-full">
                            <Clock size={16} className="text-power-orange" />
                            <span><strong className="text-ink-900">~{estimatedMinutes}</strong> min left</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Map Section */}
            <main className="max-w-xl mx-auto px-6 pb-40">
                <PathMap nodes={mapNodes} />
            </main>

            {/* Floating Action Button */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none px-6"
            >
                <Link href={`/lesson/${firstIncompleteNode.id}`} className="pointer-events-auto">
                    <motion.button
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="group flex items-center gap-4 bg-primary text-white pl-5 pr-8 py-4 rounded-full shadow-2xl transition-all"
                        style={{ boxShadow: "var(--shadow-primary-lg)" }}
                    >
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-white/70 font-bold uppercase tracking-wider">
                                {completedNodes > 0 ? "Continue" : "Start"} Learning
                            </p>
                            <p className="font-bold text-lg leading-tight">
                                {firstIncompleteNode.title}
                            </p>
                        </div>
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
