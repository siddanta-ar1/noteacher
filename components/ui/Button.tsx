import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "subtle";
    size?: "sm" | "md" | "lg" | "icon";
    loading?: boolean;
    icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            loading = false,
            icon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
            inline-flex items-center justify-center gap-2 
            font-bold rounded-2xl 
            transition-all duration-200 ease-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
            active:scale-[0.98]
        `;

        const variants = {
            primary: `
                bg-primary text-white 
                shadow-lg hover:shadow-xl
                hover:bg-primary-hover hover:scale-[1.02]
                border-b-4 border-primary-hover 
                active:border-b-0 active:translate-y-1
            `,
            secondary: `
                bg-white text-primary 
                border-2 border-border 
                hover:border-primary hover:bg-primary-light
                shadow-sm hover:shadow-md
            `,
            ghost: `
                bg-transparent text-ink-500 
                hover:text-primary hover:bg-surface-raised
            `,
            danger: `
                bg-error text-white 
                shadow-lg hover:shadow-xl
                hover:bg-error-hover
            `,
            outline: `
                bg-transparent text-primary
                border-2 border-primary
                hover:bg-primary hover:text-white
            `,
            subtle: `
                bg-surface-raised text-ink-700
                hover:bg-surface-sunken hover:text-primary
            `,
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-10 py-4 text-lg",
            icon: "w-10 h-10 p-0",
        };

        // Add brand shadow for primary variant
        const shadowStyle = variant === "primary"
            ? { boxShadow: "var(--shadow-primary)" }
            : variant === "danger"
                ? { boxShadow: "0 10px 40px -10px rgba(239, 68, 68, 0.25)" }
                : {};

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                style={shadowStyle}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        {icon}
                        {children}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
