import React from "react";
import { cn } from "@/utils/cn";

export type IconName = "book" | "sparkle" | "lock" | "check" | "star";

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    className?: string;
    strokeWidth?: number;
}

export function CustomIcon({ name, size = 24, color = "currentColor", className, strokeWidth = 2 }: IconProps) {
    const iconMap: Record<IconName, React.ReactNode> = {
        book: (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                {/* Menu Book / Open Book style */}
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
        ),
        sparkle: (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color === "currentColor" ? "none" : color} // Allow fill if color is specified
                stroke={color === "currentColor" ? "currentColor" : "none"} // Stroke if no fill color basically
                strokeWidth={strokeWidth}
                className={className}
            >
                {/* Auto Awesome / Sparkle style */}
                <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"
                    fill={color === "currentColor" ? undefined : color}
                    stroke="none"
                />
            </svg>
        ),
        lock: (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        ),
        check: (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth + 2} // Thicker check
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
        star: (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color === "currentColor" ? "none" : color}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        )
    };

    return <>{iconMap[name]}</>;
}
