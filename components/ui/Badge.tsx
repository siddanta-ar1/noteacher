"use client";

import { cn } from "@/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "danger" | "info";
    size?: "sm" | "md";
    pulse?: boolean;
}

function Badge({
    className,
    variant = "default",
    size = "md",
    pulse = false,
    children,
    ...props
}: BadgeProps) {
    const baseStyles = "inline-flex items-center gap-2 font-black uppercase tracking-widest rounded-full";

    const variants = {
        default: "bg-slate-100 text-slate-600",
        success: "bg-power-teal/10 text-power-teal border border-power-teal/20",
        warning: "bg-power-orange/10 text-power-orange border border-power-orange/20",
        danger: "bg-red-50 text-red-600 border border-red-200",
        info: "bg-navy/10 text-navy border border-navy/20",
    };

    const sizes = {
        sm: "px-2 py-1 text-[10px]",
        md: "px-3 py-1.5 text-xs",
    };

    return (
        <span
            className={cn(baseStyles, variants[variant], sizes[size], className)}
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

export { Badge };
