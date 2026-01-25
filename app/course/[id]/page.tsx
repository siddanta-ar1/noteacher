import { getCourseWithNodes, getUserProgress } from "@/services";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CourseMapClient from "./CourseMapClient";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function CoursePage({ params }: Props) {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // 1. Auth Check
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. Fetch Data Parallel
    const [courseResult, progressResult] = await Promise.all([
        getCourseWithNodes(id),
        getUserProgress(user.id),
    ]);

    const course = courseResult.data;
    const userProgress = progressResult.data || [];

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 font-bold">Course not found</p>
            </div>
        );
    }

    return <CourseMapClient course={course} userProgress={userProgress} />;
}
