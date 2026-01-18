import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CourseLibraryClient from "./CourseLibraryClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = await createServerSupabaseClient();

  // 1. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch Courses AND their first node (to link the buttons correctly)
  const { data: courses } = await supabase.from("courses").select(`
      id,
      title,
      description,
      nodes (
        id,
        position_index
      )
    `);

  // 3. Transform for UI
  const enhancedCourses = (courses || []).map((c) => {
    // Find the node with lowest position_index (usually 1) to be the entry point
    const startNode = Array.isArray(c.nodes)
      ? c.nodes.sort((a, b) => a.position_index - b.position_index)[0]
      : null;

    return {
      id: c.id,
      title: c.title,
      description: c.description,
      startNodeId: startNode?.id, // <--- CRITICAL: Pass this to the client
      xp: Math.floor(Math.random() * 2000) + 1000, // Mock data for UI flair
      difficulty: ["Beginner", "Intermediate", "Advanced"][
        Math.floor(Math.random() * 3)
      ],
      category: "Hardware",
      iconName: ["Zap", "Layers", "Cpu", "BookOpen"][
        Math.floor(Math.random() * 4)
      ],
    };
  });

  return <CourseLibraryClient courses={enhancedCourses} />;
}
