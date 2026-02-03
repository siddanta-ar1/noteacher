"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white group-[.toaster]:text-ink-900 group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toaster]:text-ink-500",
                    actionButton:
                        "group-[.toaster]:bg-primary group-[.toaster]:text-white",
                    cancelButton:
                        "group-[.toaster]:bg-surface-raised group-[.toaster]:text-ink-500",
                },
            }}
            {...props}
        />
    );
}
