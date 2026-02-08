"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Clock,
    Users,
    ArrowRight,
    CheckCircle,
    BookOpen,
    Play
} from "lucide-react";
import { Badge, ProgressBar } from "@/components/ui";
import { getCourseImage } from "@/config/course-images";
import { cn } from "@/lib/utils";

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description?: string | null;
        progress?: number;
        lessonsCount?: number;
        color?: string; // e.g. "bg-power-teal"
    };
    className?: string;
    showProgress?: boolean;
}

export function CourseCard({ course, className, showProgress = true }: CourseCardProps) {
    const isCompleted = (course.progress || 0) >= 100;
    const isStarted = (course.progress || 0) > 0;
    const imageUrl = getCourseImage(course.id);

    // Extract color base if possible to use for accents
    // Default to primary if not provided
    // We won't parse the color string complexly, just rely on standard UI colors for the card elements

    return (
        <Link href={`/course/${course.id}`} className="block h-full">
            <motion.div
                whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.12)" }}
                initial={{ border: "1px solid transparent" }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "group h-full flex flex-col bg-surface rounded-[1.5rem] overflow-hidden border border-border transition-all duration-300 relative",
                    className
                )}
            >
                {/* Image / Thumbnail Section */}
                <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

                    {/* Media */}
                    {imageUrl.endsWith(".mp4") ? (
                        <video
                            src={imageUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <motion.img
                            src={imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    )}

                    {/* Badges Overlay */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <Badge variant="default" size="sm" className="backdrop-blur-md bg-white/90 text-ink-900 border-none shadow-sm font-bold">
                            {course.lessonsCount ? `${course.lessonsCount} Levels` : "Course"}
                        </Badge>
                    </div>

                    {/* Status Badge Overlay */}
                    {isCompleted && (
                        <div className="absolute top-4 right-4 z-20">
                            <span className="bg-success text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                <CheckCircle size={12} className="fill-current" />
                                Completed
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-black text-ink-900 mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                    </h3>

                    <p className="text-sm text-ink-500 font-medium leading-relaxed line-clamp-2 mb-6">
                        {course.description || "Master this topic through interactive simulations and real-world challenges."}
                    </p>

                    <div className="mt-auto space-y-5">
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs font-bold text-ink-400">
                            <div className="flex items-center gap-1.5 bg-surface-raised px-2.5 py-1.5 rounded-lg">
                                <Clock size={14} className="text-ink-300" />
                                <span>~2h</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-surface-raised px-2.5 py-1.5 rounded-lg">
                                <Users size={14} className="text-ink-300" />
                                <span>1.2k</span>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="flex items-center justify-between pt-5 border-t border-border/50 group-hover:border-border transition-colors">
                            {showProgress && isStarted && !isCompleted ? (
                                <div className="flex-1 mr-4">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-bold text-primary">
                                            {course.progress}% Complete
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={course.progress || 0}
                                        color="primary"
                                        size="sm"
                                        className="bg-surface-sunken"
                                    />
                                </div>
                            ) : (
                                <span className="text-sm font-bold text-ink-400 group-hover:text-primary transition-colors">
                                    {isCompleted ? "Review Course" : "Start Learning"}
                                </span>
                            )}

                            <motion.button
                                whileHover={{ x: 4 }}
                                className="w-10 h-10 rounded-full bg-surface-raised group-hover:bg-primary flex items-center justify-center transition-colors shadow-sm"
                            >
                                {isStarted ? (
                                    <Play size={18} className="text-ink-900 group-hover:text-white fill-current ml-0.5" />
                                ) : (
                                    <ArrowRight size={20} className="text-ink-900 group-hover:text-white" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
