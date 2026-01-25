"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, ZoomIn, X } from "lucide-react";
import type { ImageBlock } from "@/types/content";

interface ImageBlockProps {
    block: ImageBlock;
}

/**
 * ImageBlock - Responsive image component with loading states and lightbox
 */
export default function ImageBlockComponent({ block }: ImageBlockProps) {
    const { url, alt, caption, size = "large" } = block;
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const sizeClasses = {
        small: "max-w-sm mx-auto",
        medium: "max-w-lg mx-auto",
        large: "max-w-2xl mx-auto",
        full: "w-full",
    };

    if (!url) {
        return (
            <div className="relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-white bg-slate-100 aspect-video flex items-center justify-center">
                <div className="flex flex-col items-center text-slate-300">
                    <ImageIcon size={48} />
                    <span className="font-bold text-xs uppercase mt-2">
                        Image Placeholder
                    </span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={sizeClasses[size]}>
                <motion.div
                    className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white bg-slate-100 group cursor-zoom-in"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsZoomed(true)}
                >
                    {/* Loading skeleton */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                            <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
                        </div>
                    )}

                    {/* Error state */}
                    {hasError && (
                        <div className="aspect-video flex items-center justify-center bg-slate-100">
                            <div className="flex flex-col items-center text-slate-300">
                                <ImageIcon size={48} />
                                <span className="font-bold text-xs uppercase mt-2">
                                    Failed to load image
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Image */}
                    {!hasError && (
                        <img
                            src={url}
                            alt={alt || "Visual content"}
                            className={`w-full h-auto transition-all duration-300 ${isLoading ? "opacity-0" : "opacity-100"
                                }`}
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setIsLoading(false);
                                setHasError(true);
                            }}
                        />
                    )}

                    {/* Zoom overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                            <ZoomIn className="w-5 h-5 text-slate-600" />
                        </div>
                    </div>
                </motion.div>

                {/* Caption */}
                {caption && (
                    <p className="text-center text-sm text-slate-400 mt-4 font-medium">
                        {caption}
                    </p>
                )}
            </div>

            {/* Lightbox */}
            {isZoomed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsZoomed(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
                        onClick={() => setIsZoomed(false)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={url}
                        alt={alt || "Visual content"}
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </motion.div>
            )}
        </>
    );
}
