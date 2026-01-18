import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireOnboarding } from "@/lib/guards";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Guard & Auth
  const user = await requireOnboarding();
  const supabase = await createServerSupabaseClient();

  // 2. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, interests")
    .eq("id", user.id)
    .single();

  const userInterests = profile?.interests || [];

  // 3. Fetch Courses & Nodes (Need nodes to find Lesson 1)
  const { data: courses } = await supabase.from("courses").select(`
      id,
      title,
      nodes (
        id,
        title,
        position_index
      )
    `);

  // 4. Fetch User Progress
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("node_id, status, updated_at")
    .eq("user_id", user.id);

  // --- LOGIC ENGINE ---

  // A. Calculate XP
  const completedNodeIds = new Set(
    userProgress?.filter((p) => p.status === "completed").map((p) => p.node_id),
  );
  const calculatedXP = completedNodeIds.size * 150;

  // B. Calculate Streak
  const uniqueDays = new Set(
    userProgress?.map((p) => {
      const d = p.updated_at || new Date().toISOString();
      return new Date(d).toDateString();
    }),
  );
  const streakCount =
    userProgress && userProgress.length > 0 ? Math.max(1, uniqueDays.size) : 0;

  // C. Process Courses
  const processedCourses = (courses || []).map((course) => {
    // 1. Calculate Progress
    const totalNodes = course.nodes.length;
    const completedForCourse = course.nodes.filter((n: any) =>
      completedNodeIds.has(n.id),
    ).length;
    const progressPercent =
      totalNodes === 0
        ? 0
        : Math.round((completedForCourse / totalNodes) * 100);

    // 2. Find Start Node (Lesson 1) -- THE FIX
    const sortedNodes =
      course.nodes?.sort(
        (a: any, b: any) => a.position_index - b.position_index,
      ) || [];
    const startNodeId = sortedNodes[0]?.id;

    // 3. Icon Mapping
    let iconName = "BookOpen";
    if (course.title.includes("Logic")) iconName = "Zap";
    if (course.title.includes("Architecture")) iconName = "Trophy";
    if (course.title.includes("RISC-V")) iconName = "Star";

    return {
      id: course.id,
      title: course.title,
      progress: progressPercent,
      color: progressPercent === 100 ? "bg-power-green" : "bg-power-teal",
      iconName: iconName as any,
      startNodeId: startNodeId, // Passing this to client
    };
  });

  // D. Determine Active Mission
  let activeMission = null;
  let targetCourseId = null;

  // Priority 1: Resume
  const startedCourseIds = processedCourses
    .filter((c) => c.progress > 0 && c.progress < 100)
    .map((c) => c.id);

  if (startedCourseIds.length > 0) {
    targetCourseId = startedCourseIds[0];
  } else {
    // Priority 2: Interest Match
    const interest = userInterests[0] || "";
    let keyword = "Logic";
    if (interest.includes("Computer Science")) keyword = "RISC-V";
    else if (interest.includes("Electrical")) keyword = "Logic";

    const recommended =
      courses?.find((c) => c.title.includes(keyword)) || courses?.[0];
    targetCourseId = recommended?.id;
  }

  // Find the exact node to resume
  if (targetCourseId) {
    const targetCourse = courses?.find((c) => c.id === targetCourseId);
    if (targetCourse && targetCourse.nodes) {
      const sortedNodes = targetCourse.nodes.sort(
        (a: any, b: any) => a.position_index - b.position_index,
      );
      const nextNode = sortedNodes.find(
        (n: any) => !completedNodeIds.has(n.id),
      );

      if (nextNode) {
        activeMission = {
          id: nextNode.id,
          title: nextNode.title,
          chapter: targetCourse.title,
          progress:
            processedCourses.find((c) => c.id === targetCourseId)?.progress ||
            0,
        };
      }
    }
  }

  return (
    <DashboardClient
      profile={{
        name: profile?.full_name || "Cadet",
        xp: calculatedXP,
        streak: streakCount,
      }}
      activeMission={activeMission}
      courses={processedCourses}
    />
  );
}
