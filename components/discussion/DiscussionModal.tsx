"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, MessageCircle, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Comment } from "@/types";
import { getCommentsByNodeId, createComment } from "@/services";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";

interface DiscussionModalProps {
    isOpen: boolean;
    onClose: () => void;
    nodeId: string;
    title?: string;
}

export function DiscussionModal({
    isOpen,
    onClose,
    nodeId,
    title = "Class Discussion"
}: DiscussionModalProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const fetchComments = async () => {
        setIsLoading(true);
        const result = await getCommentsByNodeId(nodeId);
        if (result.error) {
            setError(result.error);
        } else {
            setComments(result.data || []);
            // Scroll to bottom on initial load? Maybe not for discussions, usually top-down. 
            // But if it's chat-like, bottom is newest. 
            // comments.service returns ascending order (oldest first). 
            // So rendering in order means newest at bottom.
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchComments();
            // Setup realtime subscription
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const channel = supabase
                .channel(`comments:${nodeId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'comments',
                        filter: `node_id=eq.${nodeId}`
                    },
                    (payload) => {
                        fetchComments();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [isOpen, nodeId]);

    // Scroll to bottom when comments change
    useEffect(() => {
        if (isOpen && !isLoading) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [comments.length, isOpen, isLoading]);

    const handleCommentSubmit = async (content: string, type: 'question' | 'solution' | 'general') => {
        const result = await createComment({ nodeId, content, type });
        if (result.error) {
            alert("Failed to post comment: " + result.error);
        } else {
            fetchComments();
        }
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
                        className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal/Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[32rem] bg-surface-raised shadow-2xl z-[70] flex flex-col border-l border-border"
                    >
                        {/* Header */}
                        <div className="bg-white border-b border-border p-6 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-amber-200 shadow-sm text-amber-600">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="font-ex-bold text-ink-900 text-lg tracking-tight">
                                        {title}
                                    </h3>
                                    <p className="text-ink-500 text-xs font-medium uppercase tracking-wider">
                                        {comments.length} Messages
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-sunken flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 p-4 border-b border-red-100 flex gap-2 items-start text-red-600 text-sm">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Discussions List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface scroll-smooth">
                            {isLoading && comments.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-ink-400 gap-2">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm font-medium">Loading conversation...</p>
                                </div>
                            ) : comments.length > 0 ? (
                                <>
                                    {comments.map((comment) => (
                                        <CommentItem key={comment.id} comment={comment} />
                                    ))}
                                    <div ref={bottomRef} />
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-ink-400 gap-4 opacity-70">
                                    <div className="w-16 h-16 bg-surface-raised rounded-2xl flex items-center justify-center">
                                        <MessageCircle size={32} />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-ink-600 mb-1">No comments yet</p>
                                        <p className="text-xs">Be the first to share a confusion or solution!</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                            <CommentForm onSubmit={handleCommentSubmit} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
