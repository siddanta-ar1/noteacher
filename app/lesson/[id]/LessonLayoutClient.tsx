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
    nodeId: string;
};

export default function LessonLayoutClient({ children, course, userProgress, nodeId }: Props) {
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
                        currentNodeId={nodeId}
                        onCloseSidebar={() => setIsSidebarOpen(false)}
                        className="h-full border-none"
                    />
                </div>
            </motion.aside>

            {/* Toggle Button (Desktop) - Positioned on the edge or floating */}
            <div className="absolute top-4 left-4 z-40 hidden md:block">
                {/* Only show toggle button here if sidebar is CLOSED. 
                     If sidebar is Open, maybe put the close button INSIDE the sidebar header? 
                     Or just have a floating toggle that moves.
                     Let's make a floating toggle that sits on the boundary.
                 */}
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-surface-raised relative flex flex-col min-w-0">
                {/* Top Bar with Toggle if sidebar is closed */}
                <div className="absolute top-4 left-4 z-30 md:hidden">
                    {/* Mobile Toggle Trigger would go here - usually handled by CourseExplorer itself or a separate mobile menu */}
                </div>

                {/* Desktop Toggle - Floating when closed, or pinned when open 
                     Let's put a toggle button inside the main area top-left if sidebar is closed.
                     And if sidebar is open, we can toggle it from within the sidebar properly? 
                     Actually, a common pattern is a collapse button IN the sidebar header, 
                     and an expand button floating on the content.
                 */}

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

                {/* Floating Close Button - Visible when Open? 
                    Or integrated into sidebar? Let's Integrate into sidebar by passing a prop or just absolute positioning it over the sidebar.
                    Alternatively, put the button in the main layout but moving with the sidebar.
                */}



                {children}
            </main>
        </div>
    );
}
