
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupDuplicates() {
    console.log("🔍 Checking for duplicate courses...");

    const { data: courses, error } = await supabase
        .from("courses")
        .select("id, title, created_at, nodes(count)")
        .order("created_at", { ascending: true }); // Oldest first

    if (error) {
        console.error("Error fetching courses:", error);
        return;
    }

    if (!courses || courses.length === 0) {
        console.log("No courses found.");
        return;
    }

    const courseMap = new Map<string, typeof courses>();

    // Group by title
    for (const course of courses) {
        const title = course.title.trim();
        if (!courseMap.has(title)) {
            courseMap.set(title, []);
        }
        courseMap.get(title)?.push(course);
    }

    let deletedCount = 0;

    for (const [title, group] of courseMap.entries()) {
        if (group.length > 1) {
            console.log(`\nFound ${group.length} duplicates for "${title}":`);

            // Strategy: Keep the one with the MOST nodes. If equal, keep the LATEST one.
            // We sorted by created_at ascending (oldest first).

            // Let's sort this group by nodes count (desc) then created_at (desc)
            group.sort((a, b) => {
                const countA = a.nodes?.[0]?.count || 0;
                const countB = b.nodes?.[0]?.count || 0;
                if (countA !== countB) return countB - countA; // More nodes first

                // If nodes equal, keep latest
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            const [keeper, ...duplicates] = group;

            console.log(`   ✅ Keeping: ${keeper.id} (${keeper.nodes?.[0]?.count || 0} nodes, created ${keeper.created_at})`);

            for (const dup of duplicates) {
                console.log(`   ❌ Deleting: ${dup.id} (${dup.nodes?.[0]?.count || 0} nodes, created ${dup.created_at})`);

                // Delete the duplicate
                const { error: deleteError } = await supabase
                    .from("courses")
                    .delete()
                    .eq("id", dup.id);

                if (deleteError) {
                    console.error(`      Failed to delete ${dup.id}:`, deleteError.message);
                } else {
                    deletedCount++;
                }
            }
        }
    }

    console.log(`\n🎉 Cleanup complete! Deleted ${deletedCount} duplicate courses.`);
}

cleanupDuplicates();
