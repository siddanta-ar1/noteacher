"use client";

import React from "react";

import { cn } from "@/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "danger" | "info" | "primary" | "teal" | "purple" | "orange";
    size?: "sm" | "md" | "lg";
    pulse?: boolean;
    outline?: boolean;
}

function Badge({
    className,
    variant = "default",
    size = "md",
    pulse = false,
    outline = false,
    children,
    ...props
}: BadgeProps) {
    const baseStyles = "inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full";

    const solidVariants = {
        default: "bg-surface-sunken text-ink-500",
        success: "bg-success-light text-success-dark border border-success/20",
        warning: "bg-warning-light text-warning-dark border border-warning/20",
        danger: "bg-error-light text-error-dark border border-error/20",
        info: "bg-info-light text-info-dark border border-info/20",
        primary: "bg-primary-light text-primary border border-primary/20",
        teal: "bg-power-teal-light text-power-teal border border-power-teal/20",
        purple: "bg-power-purple-light text-power-purple border border-power-purple/20",
        orange: "bg-power-orange-light text-power-orange border border-power-orange/20",
    };

    const outlineVariants = {
        default: "bg-transparent text-ink-500 border-2 border-border",
        success: "bg-transparent text-success border-2 border-success",
        warning: "bg-transparent text-warning border-2 border-warning",
        danger: "bg-transparent text-error border-2 border-error",
        info: "bg-transparent text-info border-2 border-info",
        primary: "bg-transparent text-primary border-2 border-primary",
        teal: "bg-transparent text-power-teal border-2 border-power-teal",
        purple: "bg-transparent text-power-purple border-2 border-power-purple",
        orange: "bg-transparent text-power-orange border-2 border-power-orange",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-[11px]",
        lg: "px-3 py-1.5 text-xs",
    };

    const variantStyles = outline ? outlineVariants[variant] : solidVariants[variant];

    return (
        <span
            className={cn(baseStyles, variantStyles, sizes[size], className)}
            {...props}
        >
            {pulse && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                </span>
            )}
            {children}
        </span>
    );
}

// Count Badge (for notifications)
interface CountBadgeProps {
    count: number;
    max?: number;
    variant?: "primary" | "danger" | "teal";
    className?: string;
}

function CountBadge({
    count,
    max = 99,
    variant = "primary",
    className
}: CountBadgeProps) {
    const displayCount = count > max ? `${max}+` : count;

    const colors = {
        primary: "bg-primary",
        danger: "bg-error",
        teal: "bg-power-teal",
    };

    if (count <= 0) return null;

    return (
        <span
            className={cn(
                "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1",
                "rounded-full text-[10px] font-black text-white",
                colors[variant],
                className
            )}
        >
            {displayCount}
        </span>
    );
}

export { Badge, CountBadge };
