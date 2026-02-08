"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ServiceResult, Comment } from "@/types";

/**
 * Get comments for a specific node
 */
export async function getCommentsByNodeId(nodeId: string): Promise<ServiceResult<Comment[]>> {
    try {
        const supabase = await createServerSupabaseClient();

        // We need to join with profiles to get user info
        // Assuming profiles table matches auth.users.id
        // Since we don't have a direct foreign key defined in the client types sometimes, we rely on Supabase knowing relationships
        // If relationship is not detected, we might need to manually fetch profiles or adjust query

        const { data, error } = await supabase
            .from("comments")
            .select(`
                *,
                user:user_id (
                    id,
                    full_name,
                    avatar_url,
                    role
                )
            `)
            .eq("node_id", nodeId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        // Map the user object to the correct structure if needed or trust Supabase return
        // Ideally the type matches.

        return { data: data as unknown as Comment[], error: null };
    } catch (err: unknown) {
        console.error("getCommentsByNodeId error:", JSON.stringify(err, null, 2));
        const msg = err instanceof Error ? err.message : "Failed to fetch comments";
        return { data: null, error: msg };
    }
}

/**
 * Create a new comment
 */
export async function createComment(data: {
    nodeId: string;
    content: string;
    type: 'question' | 'solution' | 'general';
}): Promise<ServiceResult<Comment>> {
    try {
        const supabase = await createServerSupabaseClient();

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) throw new Error("Unauthorized");

        const userId = userData.user.id;

        const { data: newComment, error } = await supabase
            .from("comments")
            .insert({
                node_id: data.nodeId,
                user_id: userId,
                content: data.content,
                type: data.type,
            })
            .select()
            .single();

        if (error) throw error;

        return { data: newComment as Comment, error: null };
    } catch (err: unknown) {
        console.error("createComment error:", JSON.stringify(err, null, 2));
        const msg = err instanceof Error ? err.message : "Failed to create comment";
        return { data: null, error: msg };
    }
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<ServiceResult<boolean>> {
    try {
        const supabase = await createServerSupabaseClient();

        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);

        if (error) throw error;

        return { data: true, error: null };
    } catch (err: unknown) {
        console.error("deleteComment error:", JSON.stringify(err, null, 2));
        const msg = err instanceof Error ? err.message : "Failed to delete comment";
        return { data: null, error: msg };
    }
}
