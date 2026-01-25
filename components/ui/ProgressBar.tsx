"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface ProgressBarProps {
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    color?: "primary" | "teal" | "purple" | "orange" | "success";
    showLabel?: boolean;
    labelPosition?: "inside" | "outside";
    animated?: boolean;
    className?: string;
}

const colors = {
    primary: "bg-gradient-to-r from-primary to-primary-hover",
    teal: "bg-gradient-to-r from-power-teal to-emerald-400",
    purple: "bg-gradient-to-r from-power-purple to-indigo-500",
    orange: "bg-gradient-to-r from-power-orange to-amber-400",
    success: "bg-gradient-to-r from-success to-emerald-400",
};

const trackColors = {
    primary: "bg-primary-light",
    teal: "bg-power-teal-light",
    purple: "bg-power-purple-light",
    orange: "bg-power-orange-light",
    success: "bg-success-light",
};

const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
};

export function ProgressBar({
    value,
    max = 100,
    size = "md",
    color = "teal",
    showLabel = false,
    labelPosition = "outside",
    animated = true,
    className,
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn("w-full", className)}>
            {showLabel && labelPosition === "outside" && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-ink-500">Progress</span>
                    <span className="text-xs font-black text-ink-900">{Math.round(percentage)}%</span>
                </div>
            )}
            <div
                className={cn(
                    "w-full rounded-full overflow-hidden",
                    trackColors[color],
                    sizes[size]
                )}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
            >
                {animated ? (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn(
                            "h-full rounded-full",
                            colors[color]
                        )}
                    />
                ) : (
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-300",
                            colors[color]
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                )}
            </div>
            {showLabel && labelPosition === "inside" && size === "lg" && (
                <div className="relative -mt-4 h-4 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white drop-shadow-sm">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}
        </div>
    );
}
