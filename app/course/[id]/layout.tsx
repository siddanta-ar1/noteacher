import { getCourseWithHierarchy } from "@/services";
import { CourseExplorer } from "@/components/course-explorer";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

type Props = {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
};

export default async function CourseLayout({ children, params }: Props) {
    const { id } = await params;

    // Auth Check
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Fetch Course Hierarchy
    const { data: course, error } = await getCourseWithHierarchy(id);

    if (error || !course) {
        // If course not found, just render children (which manages 404) or handle here
        return <>{children}</>;
    }

    // Fetch User Progress
    const { getUserProgress } = await import("@/services");
    const { data: userProgress } = await getUserProgress(user.id);

    return (
        <div className="flex h-screen bg-surface-base">
            {/* Sidebar */}
            <aside className="w-72 flex-shrink-0 border-r border-border bg-surface hidden md:block">
                <CourseExplorer
                    course={course}
                    userProgress={userProgress || []}
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
