"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import type {
    Course,
    CourseWithNodes,
    CourseWithNodeCount,
    ServiceResult,
} from "@/types";

/**
 * Get all courses with basic info
 */
export async function getCourses(): Promise<ServiceResult<Course[]>> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("courses")
            .select("id, title, description, thumbnail_url, created_at")
            .order("created_at", { ascending: true });

        if (error) throw error;
        return { data, error: null };
    } catch (err) {
        console.error("getCourses error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Get all courses with their node counts
 */
export async function getCoursesWithNodeCount(): Promise<
    ServiceResult<CourseWithNodeCount[]>
> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from("courses").select(`
        id,
        title,
        description,
        thumbnail_url,
        created_at,
        nodes ( count )
      `);

        if (error) throw error;
        return { data: data as CourseWithNodeCount[], error: null };
    } catch (err) {
        console.error("getCoursesWithNodeCount error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Get a single course with all its nodes
 */
export async function getCourseWithNodes(
    courseId: string
): Promise<ServiceResult<CourseWithNodes>> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("courses")
            .select(
                `
        id,
        title,
        description,
        thumbnail_url,
        created_at,
        nodes (
          id,
          title,
          type,
          position_index,
          is_mandatory
        )
      `
            )
            .eq("id", courseId)
            .single();

        if (error) throw error;

        // Sort nodes by position
        if (data?.nodes) {
            data.nodes.sort(
                (a: { position_index: number }, b: { position_index: number }) =>
                    a.position_index - b.position_index
            );
        }

        return { data: data as CourseWithNodes, error: null };
    } catch (err) {
        console.error("getCourseWithNodes error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Get courses with nodes for dashboard (includes node data for progress calculation)
 */
export async function getCoursesForDashboard(): Promise<
    ServiceResult<CourseWithNodes[]>
> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from("courses").select(`
        id,
        title,
        description,
        thumbnail_url,
        created_at,
        nodes (
          id,
          title,
          position_index
        )
      `);

        if (error) throw error;
        return { data: data as CourseWithNodes[], error: null };
    } catch (err) {
        console.error("getCoursesForDashboard error:", err);
        return { data: null, error: (err as Error).message };
    }
}
