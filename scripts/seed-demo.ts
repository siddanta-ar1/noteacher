import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Deterministic UUIDs for demo coherence
const COURSE_ID = "00000000-0000-0000-0000-000000000001";

const LEVELS = [
    { id: 0, title: "Foundations" },
    { id: 1, title: "Core Concepts" },
    { id: 2, title: "Advanced Techniques" },
    { id: 3, title: "Expert Mastery" },
    { id: 4, title: "Real World Application" }
];

const TOPICS_PER_LEVEL = 3;

async function seedDemo() {
    console.log("🌱 Seeding Demo Course...");

    // 1. Cleanup Old Data
    console.log("🧹 Cleaning up old demo data...");
    // Delete nodes first to satisfy FK
    await supabase.from("nodes").delete().eq("course_id", COURSE_ID);
    await supabase.from("courses").delete().eq("id", COURSE_ID);

    // 2. Create Course
    const { error: courseError } = await supabase.from("courses").insert({
        id: COURSE_ID,
        title: "Full Stack Mastery: The Complete Path",
        description: "A comprehensive demo course spanning 5 levels of mastery. Explore topics effectively organized by hierarchy.",
        thumbnail_url: null, // Optional
    });

    if (courseError) {
        console.error("Error creating course:", courseError);
        return;
    }
    console.log("✅ Course Created");

    // 3. Create Nodes (Levels -> Topics)
    const nodes = [];
    let positionCounter = 0;

    for (const level of LEVELS) {
        for (let t = 1; t <= TOPICS_PER_LEVEL; t++) {
            const nodeId = uuidv4();
            const title = `${level.title} - Topic ${t}`;

            // Generate Subtopics for Content
            const content = {
                version: "1.0",
                metadata: {
                    level: level.id,
                    estimatedMinutes: 10 * t,
                    difficulty: "Intermediate",
                    objectives: ["Understand the core concept", "Apply logic", "Master the subtopic"]
                },
                blocks: [
                    {
                        type: "text",
                        content: `# ${title}\n\nWelcome to this lesson in Level ${level.id}.`
                    },
                    { type: "divider" },
                    {
                        type: "text",
                        content: `### Introduction to ${title}\nThis is the first subtopic. It introduces the main concept.`
                    },
                    {
                        type: "text",
                        content: `### Deep Dive: Mechanism\nHere we explore the underlying mechanics of ${title}. This is a distinct subtopic.`
                    },
                    {
                        type: "simulation",
                        content: "ScopeSlider" // Just a placeholder sim
                    },
                    {
                        type: "text",
                        content: `### Practical Examples\nReal world usage of ${title}.`
                    },
                    {
                        type: "quiz",
                        content: {
                            question: `What level is this topic in?`,
                            options: ["Level 0", `Level ${level.id}`, "Level 99"],
                            correctIndex: 1
                        }
                    }
                ]
            };

            nodes.push({
                id: nodeId,
                course_id: COURSE_ID,
                title: title,
                type: "lesson",
                position_index: positionCounter++,
                content: content,
                is_mandatory: true
            });
        }
    }

    const { error: nodesError } = await supabase.from("nodes").insert(nodes);

    if (nodesError) {
        console.error("Error inserting nodes:", nodesError);
    } else {
        console.log(`✅ Inserted ${nodes.length} nodes across 5 levels.`);
    }

    console.log("✨ Seeding Complete!");
}

seedDemo().catch(console.error);
