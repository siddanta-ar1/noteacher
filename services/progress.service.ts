"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import type { UserProgress, ServiceResult } from "@/types";

/**
 * Get all progress for a user
 */
export async function getUserProgress(
    userId: string
): Promise<ServiceResult<UserProgress[]>> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("user_progress")
            .select("user_id, node_id, status")
            .eq("user_id", userId);

        if (error) throw error;
        return { data: data as UserProgress[], error: null };
    } catch (err) {
        // If it's a "User not found" or similar logical error, we might want to return empty progress
        console.error("getUserProgress error:", err);
        // Fallback to empty array to prevent page crash
        return { data: [], error: null };
    }
}

/**
 * Mark a node as completed and unlock the next one
 */
export async function completeNode(
    nodeId: string
): Promise<ServiceResult<{ nextNodeId: string | null }>> {
    try {
        const supabase = await createServerSupabaseClient();

        // Get current user
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: "Unauthorized" };
        }

        // Mark current node as completed
        const { error: completeError } = await supabase.from("user_progress").upsert(
            {
                user_id: user.id,
                node_id: nodeId,
                status: "completed",

            },
            { onConflict: "user_id,node_id" }
        );

        if (completeError) throw completeError;

        // Find and unlock next node
        let nextNodeId: string | null = null;

        const { data: currentNode } = await supabase
            .from("nodes")
            .select("course_id, position_index")
            .eq("id", nodeId)
            .single();

        if (currentNode) {
            const { data: nextNode } = await supabase
                .from("nodes")
                .select("id")
                .eq("course_id", currentNode.course_id)
                .eq("position_index", currentNode.position_index + 1)
                .single();

            if (nextNode) {
                nextNodeId = nextNode.id;

                // Check if already has progress
                const { data: existingProgress } = await supabase
                    .from("user_progress")
                    .select("status")
                    .eq("user_id", user.id)
                    .eq("node_id", nextNode.id)
                    .single();

                // Unlock if no progress yet
                if (!existingProgress) {
                    await supabase.from("user_progress").insert({
                        user_id: user.id,
                        node_id: nextNode.id,
                        status: "unlocked",
                    });
                }
            }
        }

        revalidatePath("/home");
        revalidatePath(`/lesson/${nodeId}`);

        return { data: { nextNodeId }, error: null };
    } catch (err) {
        console.error("completeNode error:", err);
        return { data: null, error: (err as Error).message };
    }
}
