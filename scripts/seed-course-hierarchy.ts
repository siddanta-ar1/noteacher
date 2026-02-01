
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { CourseHierarchy } from "../types/course-hierarchy";

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

async function main() {
    console.log("🌱 Starting Course Hierarchy Seed...");

    // 1. Read JSON Data
    const jsonPath = path.resolve(__dirname, "statistics_course_data.json");
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const courseData: CourseHierarchy = JSON.parse(rawData);

    console.log(`Processing Course: ${courseData.courseTitle}`);

    // 2. Create or Get Course
    // We check if it exists to avoid duplicates, or we can choose to update.
    // For this script, we'll try to find it, or create it.

    let courseId: string;

    const { data: existingCourses } = await supabase
        .from("courses")
        .select("id")
        .eq("title", courseData.courseTitle)
        .single();

    if (existingCourses) {
        console.log(`Course found (ID: ${existingCourses.id}), updating content...`);
        courseId = existingCourses.id;

        // Option: Delete existing nodes to do a fresh insert for this course
        // This is destructive but cleaner for structure updates
        console.log("Cleaning up existing nodes for this course...");
        await supabase.from("nodes").delete().eq("course_id", courseId);
    } else {
        console.log("Creating new course...");
        const { data: newCourse, error } = await supabase
            .from("courses")
            .insert({
                title: courseData.courseTitle,
                description: courseData.courseDescription,
                thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000", // Default or use JSON if added
            })
            .select()
            .single();

        if (error || !newCourse) {
            throw new Error(`Failed to create course: ${error?.message}`);
        }
        courseId = newCourse.id;
    }

    // 3. Flatten Hierarchy into Nodes
    // DB Structure is flat: Course -> Nodes. 
    // We will map Level/Topic/Subtopic into a linear sequence of Nodes.
    // Naming convention: "L0 T1: Subtopic Title" to preserve context in the flat list.

    const nodesToInsert: any[] = [];
    let positionIndex = 0;
    const uuid = () => crypto.randomUUID();

    for (const level of courseData.levels) {
        // We could insert a "Divider" node or similar if we wanted, but not supported yet.
        // We just track the hierarchy in the title/metadata.

        for (const topic of level.topics) {

            // Insert Subtopics as "Lessons"
            for (const subtopic of topic.subtopics) {
                // Ensure every block has an ID
                const blocksWithIds = subtopic.blocks.map(b => ({ ...b, id: b.id || uuid() }));

                const node = {
                    course_id: courseId,
                    title: `${topic.title}: ${subtopic.title}`, // e.g. "Topic 1: The Principal's Dilemma"
                    type: "lesson",
                    position_index: positionIndex++,
                    content_json: {
                        version: "1.0",
                        metadata: {
                            // Store hierarchy info in metadata for potential future UI use
                            levelId: level.id,
                            topicId: topic.id,
                            subtopicId: subtopic.id,
                            aiSummary: subtopic.aiSummary,
                            teacherContext: subtopic.teacherContext
                        },
                        blocks: blocksWithIds
                    }
                };
                nodesToInsert.push(node);
            }

            // Insert Topic Assignment if exists
            if (topic.topicAssignment) {
                const assignmentNode = {
                    course_id: courseId,
                    title: `Assignment: ${topic.topicAssignment.title}`,
                    type: "assignment",
                    position_index: positionIndex++,
                    content_json: {
                        version: "1.0",
                        metadata: {
                            levelId: level.id,
                            topicId: topic.id,
                            isTopicAssignment: true
                        },
                        blocks: [
                            {
                                id: uuid(),
                                type: "assignment",
                                title: topic.topicAssignment.title,
                                instructions: topic.topicAssignment.instructions,
                                submissionTypes: ["text", "photo"], // Default
                                isBlocking: true
                            }
                        ]
                    }
                };
                nodesToInsert.push(assignmentNode);
            }
        }
    }

    console.log(`Inserting ${nodesToInsert.length} nodes...`);
    const { data: createdNodes, error: nodesError } = await supabase
        .from("nodes")
        .insert(nodesToInsert)
        .select();

    if (nodesError) {
        throw new Error(`Error inserting nodes: ${nodesError.message}`);
    }

    // 4. Populate Assignments Table
    // The 'nodes' table holds the structure, but 'assignments' table needs entries for logic.
    console.log("Populating assignments table...");

    for (const node of createdNodes) {
        const content = node.content_json;
        if (!content || !content.blocks) continue;

        const assignmentBlocks = content.blocks.filter((b: any) => b.type === 'assignment');
        for (const block of assignmentBlocks) {
            await supabase.from("assignments").insert({
                node_id: node.id,
                title: block.title,
                instructions: block.description || block.instructions,
                submission_types: block.submissionTypes || ['text'],
                is_required: block.isBlocking || false
            });
        }
    }

    console.log("✅ Seed completed successfully!");
}

main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
