import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load env vars
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedStatisticalThinking() {
    console.log("🌱 Seeding 'Statistics: From Basics to Real-World Mastery'...");

    // 0. Cleanup Duplicates (The old "Statistics 101" from seed-data.ts)
    // We identify it by title partial match if needed, or we just trust our new Course ID.
    // However, to be safe, let's look for courses with 'Statistics' in title that are NOT our ID.
    const COURSE_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    const { data: duplicateCourses } = await supabase
        .from("courses")
        .select("id, title")
        .ilike("title", "%Statistics%")
        .neq("id", COURSE_ID);

    if (duplicateCourses && duplicateCourses.length > 0) {
        console.log(`🧹 Found ${duplicateCourses.length} duplicate/old Statistics courses. cleaning up...`);
        const idsToDelete = duplicateCourses.map(c => c.id);

        // Delete related assignments/nodes first if cascade isn't set up (usually Supabase handles cascade on course delete, but being safe)
        // Actually, let's just delete the courses and assume cascade or handle errors.
        const { error: deleteError } = await supabase
            .from("courses")
            .delete()
            .in("id", idsToDelete);

        if (deleteError) {
            console.error("Error deleting duplicates:", deleteError);
        } else {
            console.log("🧹 Duplicates deleted.");
        }
    }

    // Load JSONs
    const topic1Path = "./scripts/statistical_thinking_data.json";
    const topic2Path = "./scripts/statistical_thinking_topic2.json";
    const topic3Path = "./scripts/statistical_thinking_topic3.json";
    const topic4Path = "./scripts/statistical_thinking_topic4.json";
    const topic5Path = "./scripts/statistical_thinking_topic5.json";

    const rawData1 = fs.readFileSync(topic1Path, "utf-8");
    const rawData2 = fs.readFileSync(topic2Path, "utf-8");
    const rawData3 = fs.readFileSync(topic3Path, "utf-8");
    const rawData4 = fs.readFileSync(topic4Path, "utf-8");
    const rawData5 = fs.readFileSync(topic5Path, "utf-8");

    const topic1 = JSON.parse(rawData1);
    const topic2Nodes = JSON.parse(rawData2);
    const topic3Nodes = JSON.parse(rawData3);
    const topic4Nodes = JSON.parse(rawData4);
    const topic5Nodes = JSON.parse(rawData5);

    // Merge nodes
    const courseData = {
        ...topic1,
        nodes: [...topic1.nodes, ...topic2Nodes, ...topic3Nodes, ...topic4Nodes, ...topic5Nodes]
    };

    // Deterministic UUID generation (simple hash for demo, or hardcoded map)
    const NODE_UUIDS: Record<string, string> = {
        "node_stats_0_1": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b11",
        "node_stats_0_1_assignment": "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c11",
        "node_stats_0_2": "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d11",
        "node_stats_0_2_assignment": "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e11",
        "node_stats_0_3": "f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f11",
        "node_stats_0_3_assignment": "06eebc99-9c0b-4ef8-bb6d-6bb9bd380011",
        "node_stats_0_4": "17eebc99-9c0b-4ef8-bb6d-6bb9bd380111",
        // node_stats_0_4_assignment was removed in refactor
        "node_stats_0_5": "28eebc99-9c0b-4ef8-bb6d-6bb9bd380211",
        "node_stats_0_5_assignment": "39eebc99-9c0b-4ef8-bb6d-6bb9bd380311"
    };

    // 1. Create Course
    const { data: course, error: courseError } = await supabase
        .from("courses")
        .upsert({
            id: COURSE_ID,
            title: courseData.title,
            description: courseData.description,
            thumbnail_url: courseData.thumbnail_url,
        }, { onConflict: "id" })
        .select()
        .single();

    if (courseError) {
        console.error("Error creating course:", courseError);
        return;
    }
    console.log(`✅ Course created/updated: ${course.title}`);

    // 2. Create Nodes & Content Blocks
    for (let i = 0; i < courseData.nodes.length; i++) {
        const node = courseData.nodes[i];
        const nodeUUID = NODE_UUIDS[node.id] || crypto.randomUUID(); // Fallback if not mapped

        // Create Node with Content
        const { data: nodeData, error: nodeError } = await supabase
            .from("nodes")
            .upsert({
                id: nodeUUID,
                course_id: course.id,
                title: node.title,
                type: node.type,
                position_index: i,
                content: { // Storing blocks in JSON column
                    version: "1.0",
                    metadata: { level: 0, estimatedMinutes: 15 },
                    blocks: node.blocks
                }
            }, { onConflict: "id" })
            .select()
            .single();

        if (nodeError) {
            console.error(`Error creating node ${node.title}:`, nodeError);
            continue;
        }
        console.log(`  📍 Node created: ${node.title}`);
    }

    console.log("✨ Seeding complete!");
}

seedStatisticalThinking();
