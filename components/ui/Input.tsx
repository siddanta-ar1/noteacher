"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    icon?: React.ReactNode;
    error?: string;
    label?: string;
    hint?: string;
    size?: "sm" | "md" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, error, label, hint, id, type, size = "md", ...props }, ref) => {
        const inputId = id || props.name;
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword && showPassword ? "text" : type;

        const sizes = {
            sm: "py-2.5 px-3 text-sm",
            md: "py-3.5 px-4 text-base",
            lg: "py-4 px-5 text-lg",
        };

        const iconPadding = {
            sm: "pl-9",
            md: "pl-11",
            lg: "pl-12",
        };

        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-semibold text-ink-700 ml-1"
                    >
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className={cn(
                            "absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 transition-colors",
                            "group-focus-within:text-primary"
                        )}>
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        className={cn(
                            // Base styles
                            "w-full bg-surface-raised border-2 rounded-xl font-medium text-ink-900",
                            sizes[size],
                            // Focus styles with ring animation
                            "outline-none",
                            "transition-all duration-200",
                            "focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10",
                            // Placeholder
                            "placeholder:text-ink-400 placeholder:font-normal",
                            // Icon padding
                            icon && iconPadding[size],
                            // Password toggle padding
                            isPassword && "pr-11",
                            // Error state
                            error && "border-error focus:border-error focus:ring-error/10",
                            className
                        )}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className={cn(
                                "absolute right-3.5 top-1/2 -translate-y-1/2",
                                "p-1 rounded-md text-ink-400 hover:text-ink-700",
                                "transition-colors focus:outline-none focus:text-primary"
                            )}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                    {error && !isPassword && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-error">
                            <AlertCircle size={18} />
                        </div>
                    )}
                </div>
                {hint && !error && (
                    <p className="text-xs text-ink-400 ml-1">{hint}</p>
                )}
                {error && (
                    <p className="text-sm text-error font-medium ml-1 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
