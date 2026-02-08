"use client";

import { useState } from "react";
import { CourseExplorer } from "@/components/course-explorer";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CourseWithHierarchy, UserProgress } from "@/types";

type Props = {
    children: React.ReactNode;
    course: CourseWithHierarchy;
    userProgress: UserProgress[];
};

export default function CourseLayoutClient({ children, course, userProgress }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-surface-base relative overflow-hidden">
            {/* Sidebar Container */}
            <motion.aside
                initial={{ width: 288 }} // w-72 = 18rem = 288px
                animate={{ width: isSidebarOpen ? 288 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-shrink-0 border-r border-border bg-surface h-full overflow-hidden relative z-20 hidden md:block"
            >
                <div className="w-72 h-full">
                    <CourseExplorer
                        course={course}
                        userProgress={userProgress || []}
                        onCloseSidebar={() => setIsSidebarOpen(false)}
                        className="h-full border-none"
                    />
                </div>
            </motion.aside>

            {/* Toggle Button (Desktop) - Positioned on the edge or floating */}
            <div className="absolute top-4 left-4 z-40 hidden md:block">
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-surface-raised relative flex flex-col min-w-0">
                {/* Top Bar with Toggle if sidebar is closed */}
                <div className="absolute top-4 left-4 z-30 md:hidden">
                    {/* Mobile Toggle Trigger would go here */}
                </div>

                <AnimatePresence>
                    {!isSidebarOpen && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={() => setIsSidebarOpen(true)}
                            className="absolute top-4 left-4 z-50 p-2 bg-surface border border-border rounded-lg shadow-sm hover:bg-surface-raised text-ink-500 hover:text-primary transition-colors hidden md:flex"
                            title="Open Sidebar"
                        >
                            <PanelLeftOpen size={20} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {children}
            </main>
        </div>
    );
}
