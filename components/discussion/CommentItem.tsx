"use client";

import { Comment } from "@/types";
import { User, CheckCircle2, HelpCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
    comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
    const isQuestion = comment.type === "question";
    const isSolution = comment.type === "solution";

    return (
        <div className="flex gap-4 group">
            <div className="flex-shrink-0">
                <Avatar
                    name={comment.user?.full_name || "Anonymous"}
                    src={comment.user?.avatar_url}
                    size="md"
                />
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-ink-900 text-sm">
                        {comment.user?.full_name || "Unknown User"}
                    </span>
                    <span className="text-xs text-ink-400 font-medium">
                        {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : "just now"}
                    </span>
                </div>

                <div className={`p-4 rounded-xl text-sm leading-relaxed relative ${isQuestion ? "bg-amber-50/50 border border-amber-100" :
                        isSolution ? "bg-emerald-50/50 border border-emerald-100" :
                            "bg-surface-raised border border-border"
                    }`}>
                    {/* Badge */}
                    {(isQuestion || isSolution) && (
                        <div className={`absolute -top-3 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1 shadow-sm ${isQuestion ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"
                            }`}>
                            {isQuestion ? <HelpCircle size={10} /> : <CheckCircle2 size={10} />}
                            {isQuestion ? "Confusion" : "Solution"}
                        </div>
                    )}

                    <p className="text-ink-700 whitespace-pre-wrap pt-1">{comment.content}</p>
                </div>
            </div>
        </div>
    );
}
