import React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
    shimmer?: boolean;
}

/**
 * Enhanced Skeleton component with shimmer animation effect
 */
function Skeleton({
    className,
    variant = "rectangular",
    width,
    height,
    shimmer = true,
    ...props
}: SkeletonProps) {
    const variants = {
        text: "rounded-full h-4",
        circular: "rounded-full",
        rectangular: "rounded-2xl",
    };

    return (
        <div
            className={cn(
                "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]",
                shimmer && "animate-shimmer",
                variants[variant],
                className
            )}
            style={{
                width: width,
                height: height,
            }}
            {...props}
        />
    );
}

// Pre-built skeleton components for common patterns

function SkeletonCard() {
    return (
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 space-y-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
        </div>
    );
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    className={i === lines - 1 ? "w-2/3" : "w-full"}
                    style={{ animationDelay: `${i * 100}ms` }}
                />
            ))}
        </div>
    );
}

function SkeletonAvatar({ size = 40 }: { size?: number }) {
    return (
        <Skeleton
            variant="circular"
            width={size}
            height={size}
        />
    );
}

// Dashboard skeleton for home page
function SkeletonDashboard() {
    return (
        <div className="p-6 lg:p-10 min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <Skeleton className="h-10 w-56 mb-3" />
                <Skeleton className="h-5 w-72" />
            </div>

            {/* Active Mission Card */}
            <div className="bg-gradient-to-r from-primary/5 to-power-purple/5 rounded-3xl border border-primary/10 p-6 mb-8">
                <div className="flex items-center gap-5">
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-3 w-64 rounded-full" />
                    </div>
                    <Skeleton className="h-14 w-36 rounded-2xl hidden md:block" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl border border-border p-5"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <Skeleton className="h-4 w-16 mb-3" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                ))}
            </div>

            {/* Course Section */}
            <div className="mb-6">
                <Skeleton className="h-7 w-36 mb-6" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl border border-border p-6 space-y-4"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-14 h-14 rounded-2xl" />
                                <div className="flex-1">
                                    <Skeleton className="h-5 w-full mb-2" />
                                    <Skeleton className="h-3 w-2/3" />
                                </div>
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Lesson skeleton
function SkeletonLesson() {
    return (
        <div className="min-h-screen bg-surface-raised">
            {/* Header */}
            <div className="h-16 bg-white border-b border-border px-6 flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-6 w-48" />
                <div className="ml-auto">
                    <Skeleton className="h-3 w-32 rounded-full" />
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto p-6 lg:p-10">
                {/* Title Section */}
                <div className="mb-10">
                    <Skeleton className="h-4 w-28 mb-4" />
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6 mt-2" />
                </div>

                {/* Content Blocks */}
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl border border-border p-8"
                            style={{ animationDelay: `${i * 150}ms` }}
                        >
                            <Skeleton className="h-6 w-56 mb-5" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-11/12" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <div className="mt-10 flex justify-center">
                    <Skeleton className="h-14 w-48 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

// Course map skeleton
function SkeletonCourseMap() {
    return (
        <div className="min-h-screen bg-surface-raised">
            {/* Sticky Header Skeleton */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-border/50 h-24 flex items-center justify-center relative px-6">
                <Skeleton className="absolute left-6 w-10 h-10 rounded-xl" />
                <div className="w-full max-w-lg flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <Skeleton className="flex-1 h-4 rounded-full" />
                    <Skeleton className="w-8 h-4" />
                </div>
            </div>

            <div className=" max-w-xl mx-auto p-6 lg:p-10 text-center">
                {/* Title */}
                <div className="mb-12 flex flex-col items-center">
                    <Skeleton className="h-10 w-64 mb-4" />
                    <Skeleton className="h-5 w-96" />
                </div>

                {/* Map Nodes - Centered Column */}
                <div className="relative space-y-24 py-10">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-200" />

                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="relative flex justify-center"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <Skeleton className="w-20 h-20 rounded-[2rem] z-10 border-[6px] border-white shadow-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Courses library skeleton
function SkeletonCourseLibrary() {
    return (
        <div className="p-6 lg:p-10 min-h-screen bg-surface-raised">
            {/* Header */}
            <div className="mb-10">
                <Skeleton className="h-10 w-48 mb-3" />
                <Skeleton className="h-5 w-80" />
            </div>

            {/* Course Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-3xl border border-border overflow-hidden"
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        {/* Thumbnail */}
                        <Skeleton className="h-40 w-full rounded-none" />
                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <div className="flex items-center gap-3 pt-2">
                                <Skeleton className="h-8 w-24 rounded-full" />
                                <Skeleton className="h-8 w-20 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Leaderboard skeleton
function SkeletonLeaderboard() {
    return (
        <div className="p-6 lg:p-10 min-h-screen">
            {/* Header */}
            <div className="text-center mb-10">
                <Skeleton className="h-10 w-56 mx-auto mb-3" />
                <Skeleton className="h-5 w-72 mx-auto" />
            </div>

            {/* Top 3 Podium */}
            <div className="flex justify-center items-end gap-4 mb-10">
                {/* 2nd Place */}
                <div className="text-center">
                    <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
                    <Skeleton className="h-4 w-20 mx-auto mb-2" />
                    <Skeleton className="h-6 w-16 mx-auto" />
                </div>
                {/* 1st Place */}
                <div className="text-center -mt-4">
                    <Skeleton className="w-24 h-24 rounded-full mx-auto mb-3" />
                    <Skeleton className="h-5 w-24 mx-auto mb-2" />
                    <Skeleton className="h-7 w-20 mx-auto" />
                </div>
                {/* 3rd Place */}
                <div className="text-center">
                    <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
                    <Skeleton className="h-4 w-20 mx-auto mb-2" />
                    <Skeleton className="h-6 w-16 mx-auto" />
                </div>
            </div>

            {/* Rankings List */}
            <div className="max-w-2xl mx-auto space-y-3">
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export {
    Skeleton,
    SkeletonCard,
    SkeletonText,
    SkeletonAvatar,
    SkeletonDashboard,
    SkeletonLesson,
    SkeletonCourseMap,
    SkeletonCourseLibrary,
    SkeletonLeaderboard
};
