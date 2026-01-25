"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Node, LessonContent, ServiceResult } from "@/types";

/**
 * Get a single node/lesson by ID
 */
export async function getNodeById(
    nodeId: string
): Promise<ServiceResult<Node>> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("nodes")
            .select("*")
            .eq("id", nodeId)
            .single();

        if (error) throw error;
        return { data: data as Node, error: null };
    } catch (err) {
        console.error("getNodeById error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Get all nodes for a course
 */
export async function getNodesByCourseId(
    courseId: string
): Promise<ServiceResult<Node[]>> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("nodes")
            .select("*")
            .eq("course_id", courseId)
            .order("position_index", { ascending: true });

        if (error) throw error;
        return { data: data as Node[], error: null };
    } catch (err) {
        console.error("getNodesByCourseId error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Get course nodes for sidebar (lightweight)
 */
export async function getCourseNodesForSidebar(
    courseId: string
): Promise<ServiceResult<Pick<Node, "id" | "title" | "position_index" | "type">[]>> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("nodes")
            .select("id, title, position_index, type")
            .eq("course_id", courseId)
            .order("position_index", { ascending: true });

        if (error) throw error;
        return { data, error: null };
    } catch (err) {
        console.error("getCourseNodesForSidebar error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Get the first node of a course
 */
export async function getFirstNode(
    courseId: string
): Promise<ServiceResult<Node>> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("nodes")
            .select("*")
            .eq("course_id", courseId)
            .order("position_index", { ascending: true })
            .limit(1)
            .single();

        if (error) throw error;
        return { data: data as Node, error: null };
    } catch (err) {
        console.error("getFirstNode error:", err);
        return { data: null, error: (err as Error).message };
    }
}
