'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, MoreHorizontal, BookOpen, Lock } from 'lucide-react';
import { FileTreeItem } from './FileTreeItem';
import type { CourseWithHierarchy, Node, UserProgress } from '@/types';

interface CourseExplorerProps {
    course: CourseWithHierarchy;
    userProgress: UserProgress[];
    currentNodeId?: string; // Active node ID for highlighting
    onNodeSelect?: (node: Node) => void;
    className?: string;
}

export function CourseExplorer({ course, userProgress, currentNodeId, onNodeSelect, className = '' }: CourseExplorerProps) {
    const router = useRouter(); // For navigation

    // Track active (selected) node - Sync with prop
    // We can use the prop directly for rendering, or sync state if we want local selection updates (e.g. optimistic)
    // For simplicity, let's derive from prop if available.

    // Track expanded folders/levels
    const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
        const defaultExpanded = new Set<string>();
        // Expand the level/mission containing the current node if possible?
        // Finding parent hierarchy is expensive here without a map.
        // Fallback to default expansion (first level).
        if (course.levels.length > 0) {
            defaultExpanded.add(course.levels[0].id);
            if (course.levels[0].missions.length > 0) {
                defaultExpanded.add(course.levels[0].missions[0].id);
            }
        }
        return defaultExpanded;
    });

    // Auto-expand hierarchy for current node (Effect)
    useEffect(() => {
        if (currentNodeId) {
            const idsToExpand = new Set<string>();
            // Find path to node
            for (const level of course.levels) {
                let levelMatch = false;
                for (const mission of level.missions) {
                    if (mission.nodes.some(n => n.id === currentNodeId)) {
                        idsToExpand.add(mission.id);
                        levelMatch = true;
                    }
                }
                if (levelMatch) idsToExpand.add(level.id);
            }

            if (idsToExpand.size > 0) {
                setExpandedIds(prev => {
                    const next = new Set(prev);
                    idsToExpand.forEach(id => next.add(id));
                    return next;
                });
            }
        }
    }, [currentNodeId, course]);

    // Use prop or local state? 
    // If currentNodeId is provided, we treat it as source of truth for "active" visual.
    // But we also want to allow clicking to select (which navigates).

    const activeId = currentNodeId; // Simple stateless approach for highlighting

    // Course section expanded state
    const [courseExpanded, setCourseExpanded] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle expand/collapse
    const handleToggle = useCallback((id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    // Calculate Locked Status for Nodes
    const lockedNodeIds = useMemo(() => {
        const locked = new Set<string>();
        const completedIds = new Set(
            userProgress
                .filter(p => p.status === 'completed')
                .map(p => p.node_id)
        );

        // Flatten all nodes in order
        const allNodes: Node[] = [];
        course.levels.forEach(l => {
            l.missions.forEach(m => {
                allNodes.push(...m.nodes);
            });
        });

        // Determine First Locked Node
        // Logic: First node is unlocked.
        // Subsequent nodes are unlocked ONLY IF previous node is completed.

        let previousNodeCompleted = true; // First one is always unlocked (conceptually "previous" is done)

        for (const node of allNodes) {
            if (!previousNodeCompleted) {
                locked.add(node.id);
            }

            // Check if THIS node is completed for the NEXT one
            const isCompleted = completedIds.has(node.id);
            previousNodeCompleted = isCompleted;
        }

        return locked;
    }, [course, userProgress]);

    // Handle node selection
    const handleNodeSelect = useCallback((node: Node) => {
        // if (lockedNodeIds.has(node.id)) return; // Removed lock check

        // setActiveNodeId(node.id); // Removed local state
        router.push(`/lesson/${node.id}`);
        onNodeSelect?.(node);
    }, [onNodeSelect, router, lockedNodeIds]);

    return (
        <div
            className={`
                flex flex-col h-full
                bg-surface
                border-r border-border
                ${className}
            `}
        >
            {/* Explorer Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-raised relative z-20">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-ink-900">Course Explorer</span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1 hover:bg-surface-sunken rounded transition-colors relative z-10"
                    >
                        <MoreHorizontal className="w-4 h-4 text-ink-500" />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-0"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-xl shadow-xl py-1 z-20 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setCourseExpanded(true);
                                        const allIds = new Set<string>();
                                        course.levels.forEach(l => {
                                            allIds.add(l.id);
                                            l.missions.forEach(m => allIds.add(m.id));
                                        });
                                        setExpandedIds(allIds);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-ink-900 hover:bg-surface-sunken transition-colors flex items-center gap-2"
                                >
                                    <ChevronDown className="w-3 h-3" />
                                    Expand All
                                </button>
                                <button
                                    onClick={() => {
                                        setExpandedIds(new Set());
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-ink-900 hover:bg-surface-sunken transition-colors flex items-center gap-2"
                                >
                                    <ChevronRight className="w-3 h-3" />
                                    Collapse All
                                </button>
                                <div className="h-px bg-border my-1" />
                                <button
                                    onClick={() => router.push('/home')}
                                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-surface-sunken transition-colors flex items-center gap-2 font-medium"
                                >
                                    <BookOpen className="w-3 h-3" />
                                    Go to Dashboard
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Course Title Header - Collapsible */}
            <button
                onClick={() => setCourseExpanded(!courseExpanded)}
                className="flex items-center gap-2 px-3 py-2.5 w-full text-left hover:bg-surface-sunken transition-colors border-b border-border"
            >
                {courseExpanded ? (
                    <ChevronDown className="w-4 h-4 text-ink-500 flex-shrink-0" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-ink-500 flex-shrink-0" />
                )}
                <span className="text-sm font-semibold text-ink-900 truncate">
                    {course.title}
                </span>
            </button>

            {/* Tree View */}
            {courseExpanded && (
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {course.levels.map((level) => (
                        <FileTreeItem
                            key={level.id}
                            item={{
                                id: level.id,
                                type: 'level',
                                title: level.title,
                                children: level.missions.map((mission) => ({
                                    id: mission.id,
                                    type: 'mission',
                                    title: mission.title,
                                    children: mission.nodes,
                                })),
                            }}
                            depth={0}
                            activeNodeId={activeId || null}
                            lockedNodeIds={lockedNodeIds}
                            onNodeSelect={handleNodeSelect}
                            expandedIds={expandedIds}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            )}

            {/* Footer with selection info */}
            {activeId && (
                <div className="px-3 py-2 border-t border-border bg-surface-raised text-xs text-ink-500">
                    <span className="truncate block">Selected: {activeId.slice(0, 8)}...</span>
                </div>
            )}
        </div>
    );
}
