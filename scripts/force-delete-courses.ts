
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

const COURSE_IDS_TO_DELETE = [
    "1f43aa44-abe5-4476-be95-99c23f3c603b",
    "e8864bf8-9033-40d0-a55f-444a02ea621d"
];

async function main() {
    console.log("🔥 Starting Custom Force Delete Script...");

    for (const courseId of COURSE_IDS_TO_DELETE) {
        console.log(`\nProcessing Course ID: ${courseId}`);

        // 1. Check if course exists
        const { data: course, error: fetchError } = await supabase
            .from("courses")
            .select("title")
            .eq("id", courseId)
            .single();

        if (fetchError || !course) {
            console.log(`Course not found or access error: ${fetchError?.message || "Unknown error"}`);
            continue;
        }

        console.log(`Found Course: "${course.title}"`);

        // 2. Delete from 'nodes' table (The Constraint Blocker)
        // We delete by course_id directly if possible
        console.log(`Step 1: Deleting dependent nodes...`);
        const { error: nodesError, count: nodesCount } = await supabase
            .from("nodes")
            .delete({ count: "exact" })
            .eq("course_id", courseId);

        if (nodesError) {
            console.error(`❌ Failed to delete nodes: ${nodesError.message}`);
            continue;
        }

        console.log(`✅ Deleted ${nodesCount ?? "unknown"} nodes.`);

        // 3. Delete from 'levels' (Cascade should handle missions, but good to be safe/explicit if needed)
        // Note: The schema says ON DELETE CASCADE for levels, so deleting course should theoretically work now.
        // But if there are rogue constraints, we might want to be thorough.
        // For now, let's try deleting the course directly since 'nodes' was the reported error.

        console.log(`Step 2: Deleting course...`);
        const { error: courseError } = await supabase
            .from("courses")
            .delete()
            .eq("id", courseId);

        if (courseError) {
            console.error(`❌ Failed to delete course: ${courseError.message}`);
        } else {
            console.log(`✅ Successfully deleted course: ${courseId}`);
        }
    }

    console.log("\n✨ Operation Completed.");
}

main().catch((err) => {
    console.error("Unexpected Error:", err);
    process.exit(1);
});
