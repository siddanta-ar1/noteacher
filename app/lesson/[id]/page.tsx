import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import LessonClient from "./LessonClientV2";

// UPDATED: params is now a Promise
type Props = {
  params: Promise<{ id: string }>;
};

export default async function LessonPage({ params }: Props) {
  const supabase = await createServerSupabaseClient();

  // FIX: Await the params before accessing the ID
  const { id } = await params;

  // 1. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch the requested Node
  const { data: node, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !node) {
    return <div>Lesson not found</div>;
  }

  // 3. Fetch all nodes for this course (for the Sidebar)
  const { data: courseNodes } = await supabase
    .from("nodes")
    .select("id, title, position_index, type")
    .eq("course_id", node.course_id)
    .order("position_index", { ascending: true });

  // 4. Fetch User's Progress
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("node_id, status")
    .eq("user_id", user.id);

  return (
    <LessonClient
      node={{
        id: node.id,
        title: node.title,
        type: node.type,
        content: node.content_json,
        course_id: node.course_id,
      }}
      courseNodes={courseNodes || []}
      userProgress={userProgress || []}
    />
  );
}
