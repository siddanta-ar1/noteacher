import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "outline" | "glass";
    padding?: "none" | "sm" | "md" | "lg";
    rounded?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    hover?: boolean;
    interactive?: boolean;
    glow?: "none" | "primary" | "teal" | "purple";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = "default",
            padding = "md",
            rounded = "2xl",
            hover = false,
            interactive = false,
            glow = "none",
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = "bg-white transition-all duration-300";

        const variants = {
            default: "border-2 border-border shadow-sm",
            elevated: "shadow-lg border border-border/50",
            outline: "border-2 border-border-hover bg-transparent",
            glass: "bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg",
        };

        const paddings = {
            none: "",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
        };

        const roundings = {
            md: "rounded-md",
            lg: "rounded-lg",
            xl: "rounded-xl",
            "2xl": "rounded-2xl",
            "3xl": "rounded-3xl",
            "4xl": "rounded-[2rem]",
        };

        const hoverStyles = hover || interactive
            ? "hover:shadow-xl hover:-translate-y-1"
            : "";

        const interactiveStyles = interactive
            ? "cursor-pointer active:scale-[0.98]"
            : "";

        const glowStyles = {
            none: "",
            primary: "hover:shadow-[0_20px_60px_-15px_rgba(0,85,255,0.3)]",
            teal: "hover:shadow-[0_20px_60px_-15px_rgba(20,184,166,0.3)]",
            purple: "hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.3)]",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    paddings[padding],
                    roundings[rounded],
                    hoverStyles,
                    interactiveStyles,
                    glowStyles[glow],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("mb-4", className)} {...props} />
    )
);

CardHeader.displayName = "CardHeader";

// Card Title
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn("text-xl font-black text-ink-900", className)}
            {...props}
        />
    )
);

CardTitle.displayName = "CardTitle";

// Card Description
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { }

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-sm text-ink-500 mt-1", className)}
            {...props}
        />
    )
);

CardDescription.displayName = "CardDescription";

// Card Content
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("", className)} {...props} />
    )
);

CardContent.displayName = "CardContent";

// Card Footer
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("mt-6 pt-6 border-t border-border flex items-center", className)}
            {...props}
        />
    )
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
