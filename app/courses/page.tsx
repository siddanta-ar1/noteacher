import { createServerSupabaseClient } from "@/lib/supabase-server";
import CourseLibraryClient from "./CourseLibraryClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all courses with their node count
  const { data: courses } = await supabase.from("courses").select(`
    id,
    title,
    description,
    thumbnail_url,
    nodes ( count )
  `);

  return <CourseLibraryClient initialCourses={courses || []} />;
}
