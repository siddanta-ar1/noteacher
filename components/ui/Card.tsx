import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "outline";
    padding?: "none" | "sm" | "md" | "lg";
    rounded?: "md" | "lg" | "xl" | "2xl" | "3xl";
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = "default",
            padding = "md",
            rounded = "2xl",
            hover = false,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = "bg-white";

        const variants = {
            default: "border-2 border-slate-100",
            elevated: "shadow-xl border border-slate-100",
            outline: "border-2 border-slate-200",
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
        };

        const hoverStyles = hover
            ? "hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
            : "";

        return (
            <div
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    paddings[padding],
                    roundings[rounded],
                    hoverStyles,
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
            className={cn("text-xl font-black text-slate-900", className)}
            {...props}
        />
    )
);

CardTitle.displayName = "CardTitle";

// Card Content
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("", className)} {...props} />
    )
);

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
