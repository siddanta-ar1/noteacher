"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { motion } from "framer-motion";
import type { AnimationBlock } from "@/types/content";

interface AnimationBlockProps {
    block: AnimationBlock;
}

export default function AnimationBlockComponent({ block }: AnimationBlockProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(block.autoplay || false);
    const [isMuted, setIsMuted] = useState(true);
    const [isHovering, setIsHovering] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Simple supports for Lottie via Lottie-Player web component if needed in future
    // For now, handling 'video' format primarily.
    if (block.format === "lottie") {
        return (
            <div className="rounded-3xl overflow-hidden bg-surface-raised border border-border">
                <div className="p-8 text-center text-ink-500">
                    <p>Lottie Animation: {block.url}</p>
                    <p className="text-xs mt-2">(Lottie player not yet configured)</p>
                </div>
            </div>
        );
    }

    return (
        <figure className="w-full my-8 group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black/5 aspect-video border border-border/50">
                <video
                    ref={videoRef}
                    src={block.url}
                    className="w-full h-full object-cover"
                    loop={block.loop}
                    muted={isMuted} // Default to muted for autoplay to work
                    autoPlay={block.autoplay}
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />

                {/* Custom Controls Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering || !isPlaying ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center transition-opacity"
                >
                    <button
                        onClick={togglePlay}
                        className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105"
                    >
                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>

                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                            onClick={toggleMute}
                            className="p-2 bg-black/40 hover:bg-black/60 rounded-xl text-white backdrop-blur-md transition-colors"
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>
                </motion.div>
            </div>

            {block.caption && (
                <figcaption className="mt-3 text-center text-sm font-medium text-ink-500">
                    {block.caption}
                </figcaption>
            )}
        </figure>
    );
}
