import React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
}

function Skeleton({
    className,
    variant = "rectangular",
    width,
    height,
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
                "animate-pulse bg-slate-200",
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

export { Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar };
