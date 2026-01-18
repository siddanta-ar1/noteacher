import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

// Force dynamic rendering so dashboard is always fresh
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  // 1. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch User Profile (for wallet/name if needed)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 3. Fetch Courses & Nodes to calculate progress
  // We fetch everything to calculate percentages on the fly
  const { data: courses } = await supabase.from("courses").select(`
    id,
    title,
    nodes ( id )
  `);

  // 4. Fetch User Progress
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("node_id, status")
    .eq("user_id", user.id);

  // ----------------------------------------------------
  // LOGIC ENGINE
  // ----------------------------------------------------

  const completedNodeIds = new Set(
    userProgress?.filter((p) => p.status === "completed").map((p) => p.node_id),
  );

  // Calculate XP (Example: 150 XP per completed node)
  const calculatedXP = completedNodeIds.size * 150;

  // Process Courses for the UI
  const processedCourses = (courses || []).map((course) => {
    const totalNodes = course.nodes.length;
    const completedForCourse = course.nodes.filter((n: any) =>
      completedNodeIds.has(n.id),
    ).length;

    const progressPercent =
      totalNodes === 0
        ? 0
        : Math.round((completedForCourse / totalNodes) * 100);

    // Assign consistent colors/icons based on ID or Title hashes for now
    // In a real app, these would be columns in the DB
    return {
      id: course.id,
      title: course.title,
      progress: progressPercent,
      color: "bg-power-teal", // You can vary this based on index
      iconName: "Zap" as const,
    };
  });

  // Find Active Mission
  // Logic: Find the first 'unlocked' node in user_progress, OR the first node of the first course if nothing is started.
  let activeMission = null;

  // For MVP: Let's find the first node that IS NOT completed
  // We need the full node details for this
  const { data: allNodes } = await supabase
    .from("nodes")
    .select("id, title, course_id, position_index")
    .order("position_index", { ascending: true });

  const nextNode = allNodes?.find((node) => !completedNodeIds.has(node.id));

  if (nextNode) {
    // Find which course this node belongs to for the "Chapter" label
    const parentCourse = courses?.find((c) => c.id === nextNode.course_id);

    // Calculate precise progress for this specific node context if needed
    // For now, we use the course progress
    const courseProgress =
      processedCourses.find((c) => c.id === parentCourse?.id)?.progress || 0;

    activeMission = {
      id: nextNode.id,
      title: nextNode.title,
      chapter: parentCourse?.title || "Mission",
      progress: courseProgress,
    };
  }

  return (
    <DashboardClient
      profile={{
        name: profile?.full_name || "Cadet",
        xp: calculatedXP,
      }}
      activeMission={activeMission}
      courses={processedCourses}
    />
  );
}
