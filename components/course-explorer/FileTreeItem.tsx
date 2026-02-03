'use client';

import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Hash, Box } from 'lucide-react';
import type { Node } from '@/types';

// Tree item types for the explorer
export interface TreeItem {
    id: string;
    type: 'level' | 'mission' | 'node';
    title: string;
    children?: TreeItem[] | Node[];
}

interface FileTreeItemProps {
    item: TreeItem | Node;
    depth: number;
    activeNodeId: string | null;
    lockedNodeIds?: Set<string>; // Optional to support recursive passing
    onNodeSelect: (node: Node) => void;
    expandedIds: Set<string>;
    onToggle: (id: string) => void;
}

// Type guard to check if item is a Node (file)
function isNode(item: TreeItem | Node): item is Node {
    return 'content_json' in item || 'content' in item;
}

export function FileTreeItem({
    item,
    depth,
    activeNodeId,
    lockedNodeIds,
    onNodeSelect,
    expandedIds,
    onToggle,
}: FileTreeItemProps) {
    const isExpanded = expandedIds.has(item.id);
    const isFile = isNode(item) || (item as TreeItem).type === 'node';
    const isLevel = !isFile && (item as TreeItem).type === 'level';
    const hasChildren = !isFile && 'children' in item && (item as TreeItem).children && (item as TreeItem).children!.length > 0;

    // Check Lock Status
    // For simplicity, we only explicitly lock NODES (files). 
    // Folders could be locked if all children are locked, but let's stick to nodes first.
    const isLocked = isFile && lockedNodeIds?.has(item.id);

    const isActive = isFile && activeNodeId === item.id;

    const handleClick = () => {
        if (isLocked) return; // Prevent interaction

        if (isFile) {
            // If it's a Node from database
            if (isNode(item)) {
                onNodeSelect(item);
            }
        } else {
            onToggle(item.id);
        }
    };

    // Calculate padding based on depth
    // Base: 12px, each level adds 16px
    const paddingLeft = depth * 16 + 12;

    // Get appropriate icon for file type
    const getFileIcon = () => {
        if (isNode(item)) {
            const node = item as Node;
            const content = node.content_json || node.content;
            const hasSimulation = content && 'simulation' in content;
            const hasMcq = content && 'mcq' in content;
            const hasAssignment = content && 'assignment' in content;

            if (hasSimulation) {
                return <Box className={`w-4 h-4 ${isActive ? 'text-white' : 'text-success'}`} />;
            }
            if (hasMcq || hasAssignment) {
                return <Hash className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-500'}`} />;
            }
        }
        return <FileText className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary'}`} />;
    };

    return (
        <div className="select-none">
            {/* Tree Item Row */}
            <div
                onClick={handleClick}
                className={`
                    group flex items-center gap-1.5 py-1.5 pr-2 cursor-pointer
                    transition-colors duration-100 relative
                    ${isActive
                        ? 'bg-primary text-white'
                        : 'hover:bg-surface-sunken text-ink-900'
                    }
                `}
                style={{ paddingLeft: `${paddingLeft}px` }}
            >
                {/* Indent Guide Lines */}
                {depth > 0 && (
                    <div className="absolute left-0 top-0 bottom-0 pointer-events-none">
                        {Array.from({ length: depth }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-0 bottom-0 w-px bg-border"
                                style={{ left: `${(i + 1) * 16 + 4}px` }}
                            />
                        ))}
                    </div>
                )}

                {/* Chevron (for folders) */}
                {!isFile ? (
                    <span
                        className={`
                            flex-shrink-0 w-4 h-4 flex items-center justify-center
                            transition-transform duration-100
                        `}
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-ink-500" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-ink-500" />
                        )}
                    </span>
                ) : (
                    // File spacer for alignment
                    <span className="w-4 flex-shrink-0" />
                )}

                {/* Icon */}
                <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                    {isFile ? (
                        getFileIcon()
                    ) : isLevel ? (
                        // Level icon - amber/orange color
                        isExpanded ? (
                            <FolderOpen className={`w-4 h-4 ${isActive ? 'text-white' : 'text-power-orange'}`} />
                        ) : (
                            <Folder className={`w-4 h-4 ${isActive ? 'text-white' : 'text-power-orange'}`} />
                        )
                    ) : (
                        // Mission folder icon - muted color
                        isExpanded ? (
                            <FolderOpen className={`w-4 h-4 ${isActive ? 'text-white' : 'text-ink-500'}`} />
                        ) : (
                            <Folder className={`w-4 h-4 ${isActive ? 'text-white' : 'text-ink-500'}`} />
                        )
                    )}
                </span>

                {/* Title */}
                <span
                    className={`
                        text-sm truncate leading-tight
                        ${isFile ? 'font-normal' : 'font-medium'}
                        ${isActive ? 'text-white' : ''}
                    `}
                >
                    {item.title}
                </span>

                {/* Empty folder indicator */}
                {!isFile && hasChildren === false && (
                    <span className="ml-auto text-xs text-ink-400 italic">
                        empty
                    </span>
                )}
            </div>

            {/* Children (recursive) */}
            {!isFile && isExpanded && hasChildren && (
                <div className="relative">
                    {((item as TreeItem).children || []).map((child) => (
                        <FileTreeItem
                            key={child.id}
                            item={child}
                            depth={depth + 1}
                            activeNodeId={activeNodeId}
                            lockedNodeIds={lockedNodeIds}
                            onNodeSelect={onNodeSelect}
                            expandedIds={expandedIds}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
