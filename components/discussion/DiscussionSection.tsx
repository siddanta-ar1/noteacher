"use client";

import { useState, useEffect } from "react";
import { User, MessageCircle, HelpCircle, CheckCircle2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Comment, ServiceResult } from "@/types";
import { getCommentsByNodeId, createComment } from "@/services";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";

interface DiscussionSectionProps {
    nodeId: string;
}

export function DiscussionSection({ nodeId }: DiscussionSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = async () => {
        setIsLoading(true);
        const result = await getCommentsByNodeId(nodeId);
        if (result.error) {
            setError(result.error);
        } else {
            setComments(result.data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
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
                    // Start fetching new comment immediately to get user join data
                    fetchComments();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [nodeId]);

    const handleCommentSubmit = async (content: string, type: 'question' | 'solution' | 'general') => {
        const result = await createComment({ nodeId, content, type });
        if (result.error) {
            alert("Failed to post comment: " + result.error);
        } else {
            // Optimistic update handled by realtime subscription or re-fetch called above
            // But let's confirm success
            fetchComments();
        }
    };

    return (
        <div className="mt-16 border-t border-border pt-8">
            <div className="flex items-center gap-3 mb-8">
                <MessageCircle className="text-primary" size={24} />
                <h2 className="text-2xl font-black text-ink-900">Discussion</h2>
                <span className="bg-surface-raised px-2 py-1 rounded-md text-xs font-bold text-ink-500 border border-border">
                    {comments.length}
                </span>
            </div>

            <div className="space-y-8">
                {/* Comment List */}
                <div className="space-y-6">
                    {isLoading && comments.length === 0 ? (
                        <div className="text-center py-8 text-ink-400">Loading discussion...</div>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-surface-raised rounded-2xl border border-dashed border-border">
                            <div className="w-12 h-12 bg-surface-sunken rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageCircle className="text-ink-400" size={24} />
                            </div>
                            <p className="text-ink-500 font-medium">No comments yet. Be the first to start the conversation!</p>
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <CommentForm onSubmit={handleCommentSubmit} />
            </div>
        </div>
    );
}
