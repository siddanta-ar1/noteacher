import { useState } from "react";
import { Comment } from "@/types";
import { User, CheckCircle2, HelpCircle, MessageSquare, Pencil, Trash2, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
    comment: Comment;
    onReply: (parentId: string, content: string, type: 'question' | 'solution' | 'general') => void;
    currentUserId?: string;
    onDelete?: (commentId: string) => void;
    onEdit?: (commentId: string, content: string, type?: 'question' | 'solution' | 'general') => void;
}

export function CommentItem({ comment, onReply, currentUserId, onDelete, onEdit }: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const isOwner = currentUserId === comment.user_id;
    const isQuestion = comment.type === "question";
    const isSolution = comment.type === "solution";

    const handleReplySubmit = (content: string, type: 'question' | 'solution' | 'general') => {
        onReply(comment.id, content, type);
        setIsReplying(false);
    };

    const handleEditSubmit = (content: string, type: 'question' | 'solution' | 'general') => {
        if (onEdit) {
            onEdit(comment.id, content, type);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="flex gap-4 group w-full">
                <div className="flex-shrink-0">
                    <Avatar
                        name={comment.user?.full_name || "Anonymous"}
                        src={comment.user?.avatar_url}
                        size="md"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-ink-900 text-sm">Editing Comment...</span>
                        <button onClick={() => setIsEditing(false)} className="text-ink-400 hover:text-ink-600">
                            <X size={16} />
                        </button>
                    </div>
                    <CommentForm
                        initialContent={comment.content}
                        initialType={comment.type as any}
                        autoFocus
                        onSubmit={handleEditSubmit}
                    />
                </div>
            </div>
        )
    }

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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-ink-900 text-sm">
                            {comment.user?.full_name || "Unknown User"}
                        </span>
                        <span className="text-xs text-ink-400 font-medium">
                            {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : "just now"}
                        </span>
                    </div>

                    {/* Owner Actions */}
                    {isOwner && (
                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1 text-ink-400 hover:text-primary hover:bg-surface-raised rounded-md transition-all"
                                title="Edit"
                            >
                                <Pencil size={14} />
                            </button>
                            <button
                                onClick={() => onDelete && onDelete(comment.id)}
                                className="p-1 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
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

                {/* Actions */}
                <div className="flex items-center gap-4 pl-1">
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-xs font-bold text-ink-400 hover:text-primary transition-colors flex items-center gap-1"
                    >
                        <MessageSquare size={12} />
                        Reply
                    </button>
                </div>

                {/* Reply Form */}
                {isReplying && (
                    <div className="mt-2 pl-4 border-l-2 border-border/50">
                        <CommentForm onSubmit={handleReplySubmit} autoFocus />
                    </div>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-border/50">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                currentUserId={currentUserId}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
