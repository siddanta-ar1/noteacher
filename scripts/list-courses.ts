
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listCourses() {
    console.log("🔍 Listing all courses...");
    const { data: courses, error } = await supabase.from("courses").select("id, title, created_at");

    if (error) {
        console.error("Error fetching courses:", error);
        return;
    }

    if (!courses || courses.length === 0) {
        console.log("No courses found.");
        return;
    }

    console.table(courses);
    console.log("\nTotal courses:", courses.length);
}

listCourses();
