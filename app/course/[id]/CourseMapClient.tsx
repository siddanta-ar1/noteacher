"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Play, Clock, BookOpen, CheckCircle2 } from "lucide-react";
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

    // Calculate progress stats based on mapNodes to ensure sync with visual bars
    const totalNodes = course.nodes.length;
    const completedNodes = mapNodes.filter(n => n.status === "completed").length;
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
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
                    <Link
                        href="/home"
                        className="flex items-center gap-2 text-ink-500 hover:text-primary transition-colors font-bold text-sm shrink-0 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center group-hover:bg-primary-light group-hover:text-primary transition-colors">
                            <ChevronLeft size={18} />
                        </div>
                        <span className="hidden sm:inline group-hover:text-primary">Dashboard</span>
                    </Link>

                    {/* Premium Segmented Progress Bar */}
                    <div className="flex-1 max-w-xl">
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-ink-400">
                                    Course Progress
                                </span>
                                <span className="text-sm font-bold text-ink-900">
                                    {completedNodes} of {totalNodes} lessons
                                </span>
                            </div>
                            <span className="text-sm font-black text-primary">
                                {progressPercent}%
                            </span>
                        </div>

                        {/* Interactive Segments container */}
                        <div className="flex w-full gap-1.5 h-3">
                            {course.nodes.map((node, i) => {
                                // Use the calculated status from mapNodes to ensure sync with the map below
                                const nodeStatus = mapNodes[i].status;
                                const isCompleted = nodeStatus === "completed";
                                const isCurrent = nodeStatus === "current";
                                const isLocked = nodeStatus === "locked";

                                return (
                                    <div key={node.id} className="relative flex-1 group">
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-ink-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl transform translate-y-1 group-hover:translate-y-0 duration-200">
                                            {node.title}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-ink-900" />
                                        </div>

                                        {/* The Bar Segment */}
                                        <motion.div
                                            initial={{ scaleY: 0 }}
                                            animate={{ scaleY: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className={`
                                                w-full h-full rounded-full transition-all duration-300
                                                ${isCompleted
                                                    ? "bg-gradient-to-r from-power-teal to-emerald-400 shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                                                    : isCurrent
                                                        ? "bg-primary animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-2 ring-primary/20 ring-offset-1"
                                                        : "bg-surface-sunken hover:bg-ink-200"
                                                }
                                            `}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="shrink-0 hidden md:block">
                        <Badge variant={progressPercent >= 100 ? "success" : "default"} className="shadow-sm">
                            {progressPercent >= 100 ? (
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 size={12} />
                                    Certificate Ready
                                </span>
                            ) : (
                                <span>Keep Going!</span>
                            )}
                        </Badge>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <div className="relative pt-36 pb-20 px-6 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-6 relative"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-power-purple rounded-3xl flex items-center justify-center text-white shadow-2xl relative rotate-3 hover:rotate-0 transition-transform duration-500">
                            <BookOpen size={32} />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-ink-900 mb-4 text-center leading-[0.9]"
                    >
                        {course.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-ink-500 max-w-2xl text-center leading-relaxed mb-8 font-medium"
                    >
                        {course.description || "Master the concepts through interactive lessons and practical assignments."}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4"
                    >
                        {/* Quick Resume Button */}
                        <Link href={`/lesson/${firstIncompleteNode.id}`}>
                            <button className="px-8 py-4 bg-ink-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-xl">
                                <Play size={20} className="fill-white" />
                                {completedNodes > 0 ? "Resume Learning" : "Start Course"}
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Map Section */}
            <main className="max-w-xl mx-auto px-6 pb-40">
                <PathMap nodes={mapNodes} />
            </main>
        </div>
    );
}
