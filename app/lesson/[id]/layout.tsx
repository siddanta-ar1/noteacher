import { getCourseWithHierarchy } from "@/services";
import { CourseExplorer } from "@/components/course-explorer";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

type Props = {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
};

export default async function LessonLayout({ children, params }: Props) {
    const { id: nodeId } = await params;

    // Auth Check
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 1. Fetch Node to get Course ID
    const { data: node, error: nodeError } = await supabase
        .from("nodes")
        .select("course_id")
        .eq("id", nodeId)
        .single();

    if (nodeError || !node) {
        // Fallback: Just render children (which handles 404)
        return <>{children}</>;
    }

    // 2. Fetch Course Hierarchy
    const { getUserProgress } = await import("@/services");
    const [courseResult, progressResult] = await Promise.all([
        getCourseWithHierarchy(node.course_id),
        getUserProgress(user.id),
    ]);

    const course = courseResult.data;
    const userProgress = progressResult.data;

    if (courseResult.error || !course) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-surface-base">
            {/* Sidebar */}
            <aside className="w-72 flex-shrink-0 border-r border-border bg-white hidden md:block">
                <CourseExplorer
                    course={course}
                    userProgress={userProgress || []}
                    currentNodeId={nodeId}
                    className="h-full"
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-surface-raised relative">
                {children}
            </main>
        </div>
    );
}
