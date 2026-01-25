"use client";

import React from "react";

import { cn } from "@/utils/cn";
import {
    AlertCircle,
    CheckCircle2,
    Info,
    AlertTriangle,
    X
} from "lucide-react";

interface AlertProps {
    variant?: "info" | "success" | "warning" | "error";
    title?: string;
    children: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}

const variants = {
    info: {
        container: "bg-info-light border-info/20 text-info-dark",
        icon: Info,
        iconColor: "text-info",
    },
    success: {
        container: "bg-success-light border-success/20 text-success-dark",
        icon: CheckCircle2,
        iconColor: "text-success",
    },
    warning: {
        container: "bg-warning-light border-warning/20 text-warning-dark",
        icon: AlertTriangle,
        iconColor: "text-warning",
    },
    error: {
        container: "bg-error-light border-error/20 text-error-dark",
        icon: AlertCircle,
        iconColor: "text-error",
    },
};

export function Alert({
    variant = "info",
    title,
    children,
    dismissible = false,
    onDismiss,
    className,
}: AlertProps) {
    const config = variants[variant];
    const Icon = config.icon;

    return (
        <div
            role="alert"
            className={cn(
                "relative flex gap-3 p-4 rounded-xl border",
                config.container,
                className
            )}
        >
            <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", config.iconColor)} />
            <div className="flex-1 min-w-0">
                {title && (
                    <p className="font-bold mb-1">{title}</p>
                )}
                <div className="text-sm font-medium opacity-90">{children}</div>
            </div>
            {dismissible && onDismiss && (
                <button
                    onClick={onDismiss}
                    className={cn(
                        "shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors",
                        config.iconColor
                    )}
                    aria-label="Dismiss"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}

// Simple inline Alert for form feedback
interface AlertInlineProps {
    variant?: "success" | "error";
    children: React.ReactNode;
    className?: string;
}

export function AlertInline({
    variant = "error",
    children,
    className
}: AlertInlineProps) {
    const Icon = variant === "success" ? CheckCircle2 : AlertCircle;
    const colors = variant === "success"
        ? "text-success"
        : "text-error";

    return (
        <p className={cn("flex items-center gap-1.5 text-sm font-medium", colors, className)}>
            <Icon size={14} />
            {children}
        </p>
    );
}
