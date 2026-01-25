"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: "sm" | "md" | "lg";
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    size = "md",
    showCloseButton = true,
}: ModalProps) {
    // Handle escape key
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className={cn(
                                "bg-white rounded-3xl shadow-2xl w-full pointer-events-auto",
                                sizes[size]
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            {(title || showCloseButton) && (
                                <div className="flex items-center justify-between p-6 pb-0">
                                    {title && (
                                        <h2 className="text-xl font-black text-ink-900">{title}</h2>
                                    )}
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="ml-auto p-2 rounded-xl text-ink-400 hover:text-ink-900 hover:bg-surface-raised transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">{children}</div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Coming Soon Modal - pre-built variant
interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature?: string;
}

export function ComingSoonModal({ isOpen, onClose, feature = "This feature" }: ComingSoonModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
            <div className="text-center py-4">
                {/* Animated rocket/sparkle */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, rotate: { repeat: Infinity, duration: 2 } }}
                    className="text-6xl mb-4"
                >
                    🚀
                </motion.div>

                <h3 className="text-2xl font-black text-ink-900 mb-2">
                    Coming Soon!
                </h3>
                <p className="text-ink-500 mb-6">
                    {feature} is under development. We'll notify you when it's ready!
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
                    style={{ boxShadow: "var(--shadow-primary)" }}
                >
                    Got it!
                </button>
            </div>
        </Modal>
    );
}
