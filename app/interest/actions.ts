"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function saveInterests(selectedInterests: string[]) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ROBUST FIX: Use upsert instead of update.
  // This handles both "Profile Exists" (Email Login) and "New Profile" (OAuth Login) cases.
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      interests: selectedInterests,
      // If profile doesn't exist, we might want to set a default name or just use email prefix
      // But for now, just ensuring the ID and interests are saved is enough.
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("Save Interest Error:", error.message);
    throw new Error(error.message);
  }

  // THE ALGORITHM (MVP Version)
  let recommendedCourseId = "";

  if (selectedInterests.includes("Computer Science")) {
    recommendedCourseId = "riscv";
  } else if (selectedInterests.includes("Electrical Engineering")) {
    recommendedCourseId = "digital";
  } else {
    recommendedCourseId = "arch";
  }

  // Redirect to dashboard
  revalidatePath("/home");
  redirect("/home");
}
