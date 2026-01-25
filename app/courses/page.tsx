import { getCoursesWithNodeCount } from "@/services";
import CourseLibraryClient from "./CourseLibraryClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const { data: courses, error } = await getCoursesWithNodeCount();

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-bold">Failed to load courses</p>
      </div>
    );
  }

  return <CourseLibraryClient initialCourses={courses || []} />;
}
