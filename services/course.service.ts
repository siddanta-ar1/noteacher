"use server";

import { cache } from "react";
import { createServerSupabaseClient, createSupabaseAdmin } from "@/lib/supabase-server";
import type {
    Course,
    CourseWithNodes,
    CourseWithNodeCount,
    CourseWithHierarchy,
    Level,
    Mission,
    Node,
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
    } catch (err: unknown) {
        console.error("getCourses error:", JSON.stringify(err, null, 2));
        const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Failed to fetch courses";
        return { data: null, error: msg };
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
    } catch (err: unknown) {
        console.error("getCoursesWithNodeCount error:", JSON.stringify(err, null, 2));
        const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Failed to fetch courses";
        return { data: null, error: msg };
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
            .maybeSingle();

        if (error) throw error;
        if (!data) return { data: null, error: "Course not found" };

        // Sort nodes by position
        if (data?.nodes) {
            data.nodes.sort(
                (a: { position_index: number }, b: { position_index: number }) =>
                    a.position_index - b.position_index
            );
        }

        return { data: data as CourseWithNodes, error: null };
    } catch (err: unknown) {
        console.error("getCourseWithNodes error:", JSON.stringify(err, null, 2));
        const errorMessage = err instanceof Error ? err.message : (err as { message?: string })?.message || "An unexpected error occurred while fetching the course";
        return { data: null, error: errorMessage };
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
    } catch (err: unknown) {
        console.error("getCoursesForDashboard error:", JSON.stringify(err, null, 2));
        const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Failed to fetch dashboard";
        return { data: null, error: msg };
    }
}

/**
 * Get a course with its full hierarchy: Levels → Missions → Nodes
 * This is the primary method for the course explorer sidebar
 */
export async function getCourseWithHierarchy(
    courseId: string
): Promise<ServiceResult<CourseWithHierarchy>> {
    try {
        const supabase = await createServerSupabaseClient();

        // First, get the course
        const { data: course, error: courseError } = await supabase
            .from("courses")
            .select("id, title, description, thumbnail_url, created_at")
            .eq("id", courseId)
            .maybeSingle();

        if (courseError) throw courseError;
        if (!course) return { data: null, error: "Course not found" };

        // Get levels for this course
        const { data: levels, error: levelsError } = await supabase
            .from("levels")
            .select("id, course_id, title, description, position_index")
            .eq("course_id", courseId)
            .order("position_index", { ascending: true });

        if (levelsError) throw levelsError;

        // Get all missions for these levels
        let missions: Mission[] = [];
        const levelIds = (levels || []).map((l: Level) => l.id);

        if (levelIds.length > 0) {
            const { data: missionsData, error: missionsError } = await supabase
                .from("missions")
                .select("id, level_id, title, description, position_index")
                .in("level_id", levelIds)
                .order("position_index", { ascending: true });

            if (missionsError) throw missionsError;
            missions = missionsData as Mission[] || [];
        }

        // Get all nodes for these missions
        let nodes: Node[] = [];
        const missionIds = missions.map((m: Mission) => m.id);

        if (missionIds.length > 0) {
            const { data: nodesData, error: nodesError } = await supabase
                .from("nodes")
                .select("id, course_id, mission_id, title, type, position_index, is_mandatory, content_json, content")
                .in("mission_id", missionIds)
                .order("position_index", { ascending: true });

            if (nodesError) throw nodesError;
            nodes = nodesData as Node[] || [];
        }

        // Build the hierarchy
        const hierarchy: CourseWithHierarchy = {
            ...course,
            levels: (levels || []).map((level: Level) => ({
                ...level,
                missions: (missions || [])
                    .filter((m: Mission) => m.level_id === level.id)
                    .map((mission: Mission) => ({
                        ...mission,
                        nodes: (nodes || []).filter((n: Node) => n.mission_id === mission.id),
                    })),
            })),
        };

        return { data: hierarchy, error: null };
    } catch (err: unknown) {
        console.error("getCourseWithHierarchy error:", JSON.stringify(err, null, 2));
        const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Failed to fetch course hierarchy";
        return { data: null, error: msg };
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
    } catch (err: unknown) {
        console.error("createCourseFromJSON error:", JSON.stringify(err, null, 2));
        const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Failed to create course";
        return { data: null, error: msg };
    }
}

/**
 * Update an existing course from JSON
 */
export async function updateCourseFromJSON(courseId: string, courseData: {
    title: string;
    description: string;
    nodes: Array<{
        id?: string;
        title: string;
        type: "lesson" | "assignment" | "simulator";
        content: any;
    }>;
}): Promise<ServiceResult<string>> {
    try {
        const supabase = createSupabaseAdmin();

        // 1. Update Course
        const { error: courseError } = await supabase
            .from("courses")
            .update({
                title: courseData.title,
                description: courseData.description,
            })
            .eq("id", courseId);

        if (courseError) throw courseError;

        // 2. Upsert Nodes
        // We map the nodes to include course_id and proper fields
        const nodesToUpsert = courseData.nodes.map((node, index) => ({
            id: node.id, // If present, will update. If undefined, might fail upsert unless handled?
            // Supabase upsert requires the primary key to match.
            // If ID is missing, we should probably INSERT.
            // But upsert takes an array. Mixed content?
            // Actually, separate Insert and Update is safer or let Postgres handle it if we generate IDs?
            // For now, let's assume if ID is present, we update.
            course_id: courseId,
            title: node.title,
            type: node.type,
            content: node.content,
            content_json: node.content,
            position_index: index,
            is_mandatory: true,
        }));

        // If node has no ID, we remove 'id' key so Supabase generates it?
        // But upsert needs the key to conflict on.
        // Strategy:
        // 1. Nodes with IDs -> Update
        // 2. Nodes without IDs -> Insert

        const existingNodes = nodesToUpsert.filter(n => n.id);
        const newNodes = nodesToUpsert.filter(n => !n.id);

        if (existingNodes.length > 0) {
            const { error: updateError } = await supabase
                .from("nodes")
                .upsert(existingNodes);
            if (updateError) throw updateError;
        }

        if (newNodes.length > 0) {
            const { error: insertError } = await supabase
                .from("nodes")
                .insert(newNodes);
            if (insertError) throw insertError;
        }

        return { data: courseId, error: null };
    } catch (err: unknown) {
        console.error("updateCourseFromJSON error:", JSON.stringify(err, null, 2));
        const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Failed to update course";
        return { data: null, error: msg };
    }
}
