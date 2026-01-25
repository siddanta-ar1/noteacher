"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    name?: string | null;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    status?: "online" | "offline" | "away" | "busy" | null;
    className?: string;
}

const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
};

const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
};

const statusColors = {
    online: "bg-success",
    offline: "bg-ink-400",
    away: "bg-warning",
    busy: "bg-error",
};

function getInitials(name: string | null | undefined): string {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Generate consistent color from name
function getAvatarColor(name: string | null | undefined): string {
    if (!name) return "bg-ink-400";

    const colors = [
        "bg-primary",
        "bg-power-teal",
        "bg-power-purple",
        "bg-power-orange",
        "bg-info",
        "bg-success",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
    src,
    alt,
    name,
    size = "md",
    status = null,
    className,
}: AvatarProps) {
    const initials = getInitials(name);
    const bgColor = getAvatarColor(name);

    return (
        <div className={cn("relative inline-flex shrink-0", className)}>
            {src ? (
                <img
                    src={src}
                    alt={alt || name || "Avatar"}
                    className={cn(
                        "rounded-full object-cover",
                        sizes[size]
                    )}
                />
            ) : (
                <div
                    className={cn(
                        "rounded-full flex items-center justify-center font-bold text-white",
                        sizes[size],
                        bgColor
                    )}
                    aria-label={name || "User avatar"}
                >
                    {initials}
                </div>
            )}
            {status && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 rounded-full ring-2 ring-white",
                        statusSizes[size],
                        statusColors[status]
                    )}
                    aria-label={`Status: ${status}`}
                />
            )}
        </div>
    );
}

// Avatar Group for stacking multiple avatars
interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function AvatarGroup({
    children,
    max,
    size = "md",
    className
}: AvatarGroupProps) {
    const childArray = React.Children.toArray(children);
    const displayChildren = max ? childArray.slice(0, max) : childArray;
    const remainingCount = max ? Math.max(0, childArray.length - max) : 0;

    return (
        <div className={cn("flex -space-x-2", className)}>
            {displayChildren.map((child, index) => (
                <div
                    key={index}
                    className="ring-2 ring-white rounded-full"
                    style={{ zIndex: displayChildren.length - index }}
                >
                    {child}
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={cn(
                        "rounded-full bg-surface-sunken flex items-center justify-center font-bold text-ink-500 ring-2 ring-white",
                        sizes[size]
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}
