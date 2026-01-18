"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function completeNode(nodeId: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // 1. Mark current node as 'completed'
  const { error } = await supabase.from("user_progress").upsert({
    user_id: user.id,
    node_id: nodeId,
    status: "completed",
  });

  if (error) {
    console.error("Error updating progress:", error);
    return { error: error.message };
  }

  // 2. Logic to unlock the NEXT node
  // Fetch current node to get its position
  const { data: currentNode } = await supabase
    .from("nodes")
    .select("course_id, position_index")
    .eq("id", nodeId)
    .single();

  if (currentNode) {
    // Find the immediate next node
    const { data: nextNode } = await supabase
      .from("nodes")
      .select("id")
      .eq("course_id", currentNode.course_id)
      .eq("position_index", currentNode.position_index + 1)
      .single();

    if (nextNode) {
      // Unlock it (status: 'unlocked') ONLY if it hasn't been touched yet
      // We use 'insert' with 'on conflict do nothing' effectively via upsert with checking
      // But simpler: just try to insert 'unlocked'. If row exists (completed/unlocked), ignore.

      // Check if row exists
      const { data: existingProgress } = await supabase
        .from("user_progress")
        .select("status")
        .eq("user_id", user.id)
        .eq("node_id", nextNode.id)
        .single();

      if (!existingProgress) {
        await supabase.from("user_progress").insert({
          user_id: user.id,
          node_id: nextNode.id,
          status: "unlocked",
        });
      }
    }
  }

  revalidatePath("/home");
  revalidatePath(`/lesson/${nodeId}`);
  return { success: true };
}
