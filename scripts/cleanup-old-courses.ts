
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const KEEP_COURSE_ID = "cc4d3395-f4a9-46aa-b015-27dc59890408";

async function cleanupOldCourses() {
    console.log(`🧹 Cleaning up courses (keeping ONLY: ${KEEP_COURSE_ID})...`);

    // 1. Fetch courses to delete
    const { data: courses } = await supabase
        .from("courses")
        .select("id")
        .neq("id", KEEP_COURSE_ID);

    if (!courses || courses.length === 0) {
        console.log("✅ No old courses found to delete.");
        return;
    }

    const idsToDelete = courses.map(c => c.id);
    console.log(`Deleting data for ${courses.length} deprecated courses...`);

    // Helper for batch deletes
    const deleteBatch = async (table: string, column: string, values: string[]) => {
        if (values.length === 0) return;
        const { error } = await supabase.from(table).delete().in(column, values);
        if (error) console.error(`Failed to delete from ${table}:`, error.message);
        else console.log(`✓ Deleted from '${table}'`);
    };

    // 2. Cascading Delete Order:
    // Child tables must be cleared before parent tables.

    // Step A: Delete User Progress (references nodes)
    // We need node IDs first to delete progress... but let's try direct delete if possible.
    // Actually, progress usually links to user_id/node_id. 
    // It's safer to delete nodes first, which might cascade progress? 
    // Or delete progress where node_id IN (nodes of deleted courses).

    // Fetch nodes to delete
    const { data: nodes } = await supabase.from("nodes").select("id").in("course_id", idsToDelete);
    const nodeIds = nodes?.map(n => n.id) || [];

    if (nodeIds.length > 0) {
        console.log(`Found ${nodeIds.length} nodes to delete.`);
        // Delete Assignments (references nodes)
        await deleteBatch("assignments", "node_id", nodeIds);
        // Delete User Progress (references nodes)
        await deleteBatch("user_progress", "node_id", nodeIds);
        // Delete Nodes
        await deleteBatch("nodes", "course_id", idsToDelete);
    }

    // Step B: Delete Missions (references levels)
    // Need level IDs.
    const { data: levels } = await supabase.from("levels").select("id").in("course_id", idsToDelete);
    const levelIds = levels?.map(l => l.id) || [];

    if (levelIds.length > 0) {
        // Delete Missions
        await deleteBatch("missions", "level_id", levelIds);
        // Delete Levels
        await deleteBatch("levels", "course_id", idsToDelete);
    }

    // Step C: Delete Courses
    await deleteBatch("courses", "id", idsToDelete);

    console.log("✅ Cleanup complete.");
}

cleanupOldCourses();
