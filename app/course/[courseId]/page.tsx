// app/course/[courseId]/page.tsx
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CourseMapClient from "./CourseMapClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseMapPage({ params }: Props) {
  const supabase = await createServerSupabaseClient();
  const { courseId } = await params;

  // 1. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch Course Details
  const { data: course } = await supabase
    .from("courses")
    .select("title, description")
    .eq("id", courseId)
    .single();

  if (!course) return <div>Course not found</div>;

  // 3. Fetch Nodes
  const { data: nodes } = await supabase
    .from("nodes")
    .select("id, title, position_index")
    .eq("course_id", courseId)
    .order("position_index", { ascending: true });

  // 4. Fetch User Progress (to determine locked/unlocked)
  const { data: progress } = await supabase
    .from("user_progress")
    .select("node_id, status")
    .eq("user_id", user.id);

  // 5. Logic: Merge Nodes with Status
  const mapNodes = (nodes || []).map((node, index) => {
    const userState = progress?.find((p) => p.node_id === node.id);

    // Default Status Logic:
    // - If completed in DB -> 'completed'
    // - If it's the first node and no progress -> 'current'
    // - If the previous node is completed -> 'current'
    // - Else -> 'locked'

    let status: "locked" | "current" | "completed" = "locked";

    if (userState?.status === "completed") {
      status = "completed";
    } else if (userState?.status === "unlocked") {
      status = "current";
    } else if (index === 0 && (!progress || progress.length === 0)) {
      // First node is always unlocked if course is new
      status = "current";
    } else {
      // Check if previous node was completed
      const prevNodeId = nodes?.[index - 1]?.id;
      const prevProgress = progress?.find((p) => p.node_id === prevNodeId);
      if (prevProgress?.status === "completed") {
        status = "current";
      }
    }

    return {
      id: node.id,
      title: node.title,
      status,
    };
  });

  return (
    <CourseMapClient
      courseTitle={course.title}
      courseDesc={course.description}
      nodes={mapNodes}
    />
  );
}
