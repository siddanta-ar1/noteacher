"use server";

import { createServerSupabaseClient, createSupabaseAdmin } from "@/lib/supabase-server";
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

/**
 * Create a new course with nodes from JSON input
 */
export async function createCourseFromJSON(courseData: {
    title: string;
    description: string;
    nodes: Array<{
        title: string;
        type: "lesson" | "assignment" | "simulator";
        content: any; // Using any for flexibility with JSON input
    }>;
}): Promise<ServiceResult<string>> {
    try {
        // Use Admin client to bypass RLS for creation
        const supabase = createSupabaseAdmin();

        // 1. Create Course
        const { data: newCourse, error: courseError } = await supabase
            .from("courses")
            .insert({
                title: courseData.title,
                description: courseData.description,
            })
            .select("id")
            .single();

        if (courseError) throw courseError;
        if (!newCourse) throw new Error("Failed to create course");

        const courseId = newCourse.id;

        // 2. Create Nodes
        const nodesToInsert = courseData.nodes.map((node, index) => ({
            course_id: courseId,
            title: node.title,
            type: node.type,
            content: node.content, // Using the 'content' column (jsonb)
            content_json: node.content, // Keeping legacy support if needed
            position_index: index,
            is_mandatory: true,
        }));

        const { error: nodesError } = await supabase
            .from("nodes")
            .insert(nodesToInsert);

        if (nodesError) throw nodesError;

        return { data: courseId, error: null };
    } catch (err) {
        console.error("createCourseFromJSON error:", err);
        return { data: null, error: (err as Error).message };
    }
}
