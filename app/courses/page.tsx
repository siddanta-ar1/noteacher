import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CourseLibraryClient from "./CourseLibraryClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Courses with Nodes
  const { data: courses } = await supabase.from("courses").select(`
      id, title, description,
      nodes ( id, position_index )
    `);

  // Transform for UI - MOVING ALL MOCK/FLAIR LOGIC HERE
  // This ensures the data is consistent between Server and Client (No Hydration Errors)
  const enhancedCourses = (courses || []).map((c, index) => {
    // Find Lesson 1
    const sortedNodes =
      c.nodes?.sort((a: any, b: any) => a.position_index - b.position_index) ||
      [];
    const startNodeId = sortedNodes[0]?.id;

    return {
      id: c.id,
      title: c.title,
      description: c.description,
      startNodeId: startNodeId,
      // Mock data generated on Server Side
      xp: Math.floor(Math.random() * 2000) + 1000,
      difficulty: ["Beginner", "Intermediate", "Advanced"][
        Math.floor(Math.random() * 3)
      ],
      iconName: ["Zap", "Layers", "Cpu", "BookOpen"][
        Math.floor(Math.random() * 4)
      ],
      learners: Math.floor(Math.random() * 20) + 5 + "k",
      // Podium Logic Pre-calculation
      rank: index < 3 ? (index === 0 ? 1 : index === 1 ? 2 : 3) : undefined,
      color:
        index === 0
          ? "bg-navy"
          : index === 1
            ? "bg-power-teal"
            : "bg-power-orange",
      height: index === 0 ? "h-64" : index === 1 ? "h-48" : "h-40",
    };
  });

  return <CourseLibraryClient courses={enhancedCourses} />;
}
