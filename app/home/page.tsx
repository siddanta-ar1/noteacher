import { requireOnboarding, getUserProgress } from "@/services";
import { getCoursesForDashboard } from "@/services";
import { getProfileById } from "@/services";
import { calculateXP, calculateStreak, getCompletedNodeIds } from "@/utils";
import { COURSE_ICONS } from "@/config";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Guard & Auth
  const user = await requireOnboarding();

  // 2. Fetch all data in parallel
  const [profileResult, coursesResult, progressResult] = await Promise.all([
    getProfileById(user.id),
    getCoursesForDashboard(),
    getUserProgress(user.id),
  ]);

  const profile = profileResult.data;
  const courses = coursesResult.data || [];
  const userProgress = progressResult.data || [];

  // 3. Calculate metrics
  const calculatedXP = calculateXP(userProgress);
  const streakCount = calculateStreak(userProgress);
  const completedNodeIds = getCompletedNodeIds(userProgress);

  // 4. Process Courses
  const processedCourses = courses.map((course) => {
    const totalNodes = course.nodes?.length || 0;
    const completedForCourse = course.nodes?.filter((n) =>
      completedNodeIds.has(n.id)
    ).length || 0;
    const progressPercent =
      totalNodes === 0
        ? 0
        : Math.round((completedForCourse / totalNodes) * 100);

    // Find start node (first by position)
    const sortedNodes =
      course.nodes?.sort(
        (a, b) => a.position_index - b.position_index
      ) || [];
    const startNodeId = sortedNodes[0]?.id;

    // Get icon based on title
    let iconName = COURSE_ICONS.Default;
    for (const [keyword, icon] of Object.entries(COURSE_ICONS)) {
      if (course.title.includes(keyword)) {
        iconName = icon;
        break;
      }
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      progress: progressPercent,
      lessonsCount: course.levels?.[0]?.count || totalNodes, // Use levels count if available
      color: progressPercent === 100 ? "bg-power-green" : "bg-power-teal",
      iconName,
      startNodeId,
    };
  });

  // 5. Determine Active Mission
  let activeMission = null;

  // Priority 1: Resume in-progress course
  const inProgressCourse = processedCourses.find(
    (c) => c.progress > 0 && c.progress < 100
  );
  const targetCourseId = inProgressCourse?.id || courses[0]?.id;

  if (targetCourseId) {
    const targetCourse = courses.find((c) => c.id === targetCourseId);
    if (targetCourse?.nodes) {
      const sortedNodes = targetCourse.nodes.sort(
        (a, b) => a.position_index - b.position_index
      );
      const nextNode = sortedNodes.find((n) => !completedNodeIds.has(n.id));

      if (nextNode) {
        activeMission = {
          id: nextNode.id,
          title: nextNode.title,
          chapter: targetCourse.title,
          progress:
            processedCourses.find((c) => c.id === targetCourseId)?.progress || 0,
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
        avatar_url: profile?.avatar_url,
      }}
      activeMission={activeMission}
      courses={processedCourses}
    />
  );
}
