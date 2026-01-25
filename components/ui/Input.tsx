import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    error?: string;
    label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, error, label, id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-4"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full bg-slate-50 border-2 rounded-xl py-4 px-4 font-bold text-slate-900",
                            "focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy focus:bg-white",
                            "transition-all placeholder:text-slate-400 placeholder:font-medium",
                            icon && "pl-12",
                            error && "border-red-300 focus:border-red-500 focus:ring-red-500/10",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-sm text-red-500 font-medium ml-4">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
